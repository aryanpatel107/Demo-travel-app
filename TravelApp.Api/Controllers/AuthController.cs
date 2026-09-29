using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;
using TravelApp.Api.Services;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext db,
        JwtTokenService jwtTokenService,
        IConfiguration configuration)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
    }

    // ============================================================
    // LOCAL REQUEST CHECK
    // ============================================================

    private bool IsLocalRequest()
    {
        return HttpContext.Request.Host.Host.Equals(
            "localhost",
            StringComparison.OrdinalIgnoreCase
        )
        || HttpContext.Request.Host.Host.Equals(
            "127.0.0.1",
            StringComparison.OrdinalIgnoreCase
        );
    }

    // ============================================================
    // COOKIE NAME
    // ============================================================

    private static string GetBrandCookieName(string? brandId)
    {
        var normalized = string.IsNullOrWhiteSpace(brandId)
            ? ""
            : brandId.Trim();

        if (normalized.Equals(
                "wanderly",
                StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_wanderly";
        }

        if (normalized.Equals(
                "travelpro",
                StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_travelpro";
        }

        if (normalized.Equals(
                "mytravel",
                StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_mytravel";
        }

        if (normalized.Equals(
                "techno-b2b",
                StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_techno_b2b";
        }

        return "travelapp_auth";
    }

    // ============================================================
    // LEGACY LOCAL BRAND RESOLUTION
    // ============================================================

    private static string? ResolveLegacyBrand(
        string? rawBrandId,
        string? rawBrand)
    {
        var candidate = string.IsNullOrWhiteSpace(rawBrandId)
            ? rawBrand
            : rawBrandId;

        if (string.IsNullOrWhiteSpace(candidate))
        {
            return null;
        }

        var normalized = candidate.Trim();

        if (normalized.Equals(
                "wanderly",
                StringComparison.OrdinalIgnoreCase))
        {
            return "wanderly";
        }

        if (normalized.Equals(
                "travelpro",
                StringComparison.OrdinalIgnoreCase))
        {
            return "travelpro";
        }

        if (normalized.Equals(
                "mytravel",
                StringComparison.OrdinalIgnoreCase))
        {
            return "mytravel";
        }

        if (normalized.Equals(
                "techno-b2b",
                StringComparison.OrdinalIgnoreCase))
        {
            return "techno-b2b";
        }

        return null;
    }

    // ============================================================
    // DYNAMIC BRAND RESOLUTION
    //
    // X-Brand can contain either:
    //
    //   wanderly
    //   travelpro
    //   mytravel
    //   techno-b2b
    //
    // OR a remote Technoheaven website ID:
    //
    //   2
    //
    // The numeric value is resolved through the database using
    // Brand.ExternalWebsiteId.
    // ============================================================

    private async Task<Brand?> ResolveBrandAsync()
    {
        var rawBrandHeader =
            Request.Headers["X-Brand"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(rawBrandHeader))
        {
            return null;
        }

        var normalized = rawBrandHeader.Trim();

        // --------------------------------------------------------
        // 1. Existing local brand ID
        // --------------------------------------------------------

        var legacyBrand =
            ResolveLegacyBrand(normalized, null);

        if (legacyBrand is not null)
        {
            return await _db.Brands
                .FirstOrDefaultAsync(b =>
                    b.Id == legacyBrand &&
                    b.IsActive);
        }

        // --------------------------------------------------------
        // 2. Dynamic external website ID
        //
        // Example:
        //
        // X-Brand: 2
        //
        // Database:
        //
        // ExternalWebsiteId = 2
        // Id = techno-b2b
        // --------------------------------------------------------

        if (int.TryParse(
                normalized,
                out var externalWebsiteId))
        {
            return await _db.Brands
                .FirstOrDefaultAsync(b =>
                    b.ExternalWebsiteId == externalWebsiteId &&
                    b.IsActive);
        }

        return null;
    }

    // ============================================================
    // COOKIE OPTIONS
    // ============================================================

    private CookieOptions CreateAuthCookieOptions(
        int cookieMinutes)
    {
        return new CookieOptions
        {
            HttpOnly = true,

            Secure = !IsLocalRequest(),

            SameSite = SameSiteMode.Lax,

            Expires = DateTimeOffset.UtcNow
                .AddMinutes(cookieMinutes),

            Path = "/"
        };
    }

    // ============================================================
    // REGISTER
    // ============================================================

    [HttpPost("register")]
    public async Task<ActionResult<AuthUserDto>> Register(
        [FromBody] RegisterRequestDto dto)
    {
        // --------------------------------------------------------
        // Validate name
        // --------------------------------------------------------

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new
            {
                error = "Name is required."
            });
        }

        // --------------------------------------------------------
        // Validate email
        // --------------------------------------------------------

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new
            {
                error = "Email is required."
            });
        }

        // --------------------------------------------------------
        // Validate password
        // --------------------------------------------------------

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new
            {
                error = "Password is required."
            });
        }

        // --------------------------------------------------------
        // Validate password confirmation
        // --------------------------------------------------------

        if (!string.IsNullOrWhiteSpace(dto.ConfirmPassword) &&
            dto.Password != dto.ConfirmPassword)
        {
            return BadRequest(new
            {
                error = "Passwords do not match."
            });
        }

        // --------------------------------------------------------
        // Resolve brand from X-Brand
        //
        // IMPORTANT:
        // The authenticated website/remote configuration decides
        // the brand.
        // --------------------------------------------------------

        var brand = await ResolveBrandAsync();

        if (brand is null)
        {
            return BadRequest(new
            {
                error =
                    "A valid brand is required. " +
                    "The X-Brand header must contain a valid local brand " +
                    "or external website ID."
            });
        }

        // --------------------------------------------------------
        // Normalize email
        // --------------------------------------------------------

        var normalizedEmail = dto.Email.Trim();

        // --------------------------------------------------------
        // Check existing account
        //
        // Same email can exist on different brands.
        // Same email cannot exist twice on one brand.
        // --------------------------------------------------------

        var existingUser = await _db.Users
            .FirstOrDefaultAsync(u =>
                u.Email == normalizedEmail &&
                u.BrandId == brand.Id);

        if (existingUser is not null)
        {
            return Conflict(new
            {
                error =
                    "An account with this email already exists " +
                    "for this brand."
            });
        }

        // --------------------------------------------------------
        // Create user
        // --------------------------------------------------------

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),

            Name = dto.Name.Trim(),

            Email = normalizedEmail,

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),

            // IMPORTANT:
            // Always use the resolved database brand.
            BrandId = brand.Id,

            IsActive = true,

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync();

        // --------------------------------------------------------
        // Create JWT
        // --------------------------------------------------------

        var token = _jwtTokenService.CreateToken(
            user.Id,
            user.Email,
            user.BrandId,
            brand.Name
        );

        // --------------------------------------------------------
        // Brand-specific cookie
        // --------------------------------------------------------

        var cookieName =
            GetBrandCookieName(user.BrandId);

        var cookieLifetime =
            _configuration["Jwt:CookieLifetimeMinutes"]
            ?? "10080";

        var cookieMinutes =
            int.TryParse(
                cookieLifetime,
                out var parsedMinutes)
                ? parsedMinutes
                : 10080;

        Response.Cookies.Append(
            cookieName,
            token,
            CreateAuthCookieOptions(cookieMinutes)
        );

        // --------------------------------------------------------
        // Return authenticated user
        // --------------------------------------------------------

        return Ok(
            new AuthUserDto(
                user.Id,
                user.Name,
                user.Email,
                user.BrandId,
                brand.Name,
                user.IsActive,
                null,
                token
            )
        );
    }

    // ============================================================
    // LOGIN
    // ============================================================

    [HttpPost("login")]
    public async Task<ActionResult<AuthUserDto>> Login(
        [FromBody] LoginRequestDto dto)
    {
        // --------------------------------------------------------
        // Validate email
        // --------------------------------------------------------

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new
            {
                error = "Email is required."
            });
        }

        // --------------------------------------------------------
        // Validate password
        // --------------------------------------------------------

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new
            {
                error = "Password is required."
            });
        }

        // --------------------------------------------------------
        // Resolve brand
        // --------------------------------------------------------

        var brand = await ResolveBrandAsync();

        if (brand is null)
        {
            return BadRequest(new
            {
                error =
                    "A valid brand is required. " +
                    "The X-Brand header must contain a valid local brand " +
                    "or external website ID."
            });
        }

        // --------------------------------------------------------
        // Normalize email
        // --------------------------------------------------------

        var normalizedEmail = dto.Email.Trim();

        // --------------------------------------------------------
        // Find user inside THIS brand
        // --------------------------------------------------------

        var user = await _db.Users
            .Include(u => u.Brand)
            .FirstOrDefaultAsync(u =>
                u.Email == normalizedEmail &&
                u.BrandId == brand.Id);

        // --------------------------------------------------------
        // Validate credentials
        // --------------------------------------------------------

        if (user is null ||
            !user.IsActive ||
            !BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash))
        {
            return Unauthorized(new
            {
                error = "Invalid email or password."
            });
        }

        // --------------------------------------------------------
        // Create JWT
        // --------------------------------------------------------

        var token = _jwtTokenService.CreateToken(
            user.Id,
            user.Email,
            user.BrandId,
            user.Brand?.Name ?? brand.Name
        );

        // --------------------------------------------------------
        // Brand-specific cookie
        // --------------------------------------------------------

        var cookieName =
            GetBrandCookieName(user.BrandId);

        var cookieLifetime =
            _configuration["Jwt:CookieLifetimeMinutes"]
            ?? "10080";

        var cookieMinutes =
            int.TryParse(
                cookieLifetime,
                out var parsedMinutes)
                ? parsedMinutes
                : 10080;

        Response.Cookies.Append(
            cookieName,
            token,
            CreateAuthCookieOptions(cookieMinutes)
        );

        // --------------------------------------------------------
        // Return authenticated user
        // --------------------------------------------------------

        return Ok(
            new AuthUserDto(
                user.Id,
                user.Name,
                user.Email,
                user.BrandId,
                user.Brand?.Name ?? brand.Name,
                user.IsActive,
                null,
                token
            )
        );
    }

    // ============================================================
    // LOGOUT
    // ============================================================

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var brandId =
            User.FindFirst("brand_id")?.Value;

        var cookieName =
            GetBrandCookieName(brandId);

        Response.Cookies.Delete(
            cookieName,
            new CookieOptions
            {
                Secure = !IsLocalRequest(),

                SameSite = SameSiteMode.Lax,

                Path = "/"
            }
        );

        return Ok(new
        {
            message = "Logged out successfully."
        });
    }

    // ============================================================
    // CURRENT USER
    // ============================================================

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserDto>> Me()
    {
        var userId =
            User.FindFirst(
                ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await _db.Users
            .Include(u => u.Brand)
            .FirstOrDefaultAsync(u =>
                u.Id == userId);

        if (user is null || !user.IsActive)
        {
            return Unauthorized();
        }

        var brand = await ResolveBrandAsync();
        if (brand is not null && !string.Equals(user.BrandId, brand.Id, StringComparison.OrdinalIgnoreCase))
        {
            return Unauthorized(new
            {
                error = "User does not belong to the requested brand."
            });
        }

        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        string? token = null;
        if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            token = authHeader.Substring("Bearer ".Length).Trim();
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            var cookieName = GetBrandCookieName(user.BrandId);
            token = Request.Cookies[cookieName];
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            token = _jwtTokenService.CreateToken(
                user.Id,
                user.Email,
                user.BrandId,
                user.Brand?.Name ?? user.BrandId
            );
        }

        return Ok(
            new CurrentUserDto(
                user.Id,
                user.Name,
                user.Email,
                user.BrandId,
                user.Brand?.Name ?? user.BrandId,
                null,
                token
            )
        );
    }
}