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

    public AuthController(AppDbContext db, JwtTokenService jwtTokenService, IConfiguration configuration)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
    }

    private bool IsLocalRequest()
    {
        var host = HttpContext.Request.Host.Host ?? string.Empty;
        return host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
            || host.StartsWith("127.0.0.1", StringComparison.OrdinalIgnoreCase)
            || host.StartsWith("0.0.0.0", StringComparison.OrdinalIgnoreCase)
            || host.StartsWith("[::1]", StringComparison.OrdinalIgnoreCase);
    }

    private static string GetBrandCookieName(string? brandId)
    {
        var normalized = string.IsNullOrWhiteSpace(brandId)
            ? ""
            : brandId.Trim();

        if (normalized.Equals("wanderly", StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_wanderly";
        }

        if (normalized.Equals("travelpro", StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_travelpro";
        }

        if (normalized.Equals("mytravel", StringComparison.OrdinalIgnoreCase))
        {
            return "travelapp_auth_mytravel";
        }

        return "travelapp_auth";
    }

    // Used by Login/Logout to determine which brand's site made the
    // request. This is the SAME source of truth (X-Brand header) your
    // frontend already sends on every apiFetch call — nothing new needed
    // on the frontend for login/logout.
    private static string? ResolveBrand(string? rawBrandId, string? rawBrand)
    {
        var candidate = string.IsNullOrWhiteSpace(rawBrandId) ? rawBrand : rawBrandId;
        if (string.IsNullOrWhiteSpace(candidate)) return null;

        var normalized = candidate.Trim();
        return normalized.Equals("wanderly", StringComparison.OrdinalIgnoreCase)
            ? "wanderly"
            : normalized.Equals("travelpro", StringComparison.OrdinalIgnoreCase)
                ? "travelpro"
                : normalized.Equals("mytravel", StringComparison.OrdinalIgnoreCase)
                    ? "mytravel"
                    : null;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthUserDto>> Register([FromBody] RegisterRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest(new { error = "Name is required." });
        if (string.IsNullOrWhiteSpace(dto.Email)) return BadRequest(new { error = "Email is required." });
        if (string.IsNullOrWhiteSpace(dto.Password)) return BadRequest(new { error = "Password is required." });
        if (dto.Password.Length < 8) return BadRequest(new { error = "Password must be at least 8 characters long." });
        if (dto.ConfirmPassword is not null && dto.Password != dto.ConfirmPassword) return BadRequest(new { error = "Passwords do not match." });

        var normalizedEmail = dto.Email.Trim();
        if (!normalizedEmail.Contains('@')) return BadRequest(new { error = "A valid email is required." });

        // Prefer the actual requesting site's brand (X-Brand header) over
        // any brand value the client body might send — the client should
        // never be able to register itself onto a brand other than the
        // site it's actually on.
        var brandFromHeader = Request.Headers["X-Brand"].FirstOrDefault();
        var resolvedBrandId = ResolveBrand(brandFromHeader, null) ?? ResolveBrand(dto.BrandId, dto.Brand);
        if (resolvedBrandId is null) return BadRequest(new { error = "A valid brand is required: Wanderly, TravelPro, or MyTravel." });

        var brand = await _db.Brands.FirstOrDefaultAsync(b => b.Id == resolvedBrandId);
        if (brand is null) return BadRequest(new { error = "Selected brand is not supported." });

        // Scoped by BOTH brand and email — the same email can now hold a
        // separate account per brand, matching the composite unique index.
        var existingUser = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail && u.BrandId == resolvedBrandId);
        if (existingUser is not null) return Conflict(new { error = "An account with that email already exists for this site." });

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = normalizedEmail,
            BrandId = brand.Id,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var safeUser = new AuthUserDto(user.Id, user.Name, user.Email, user.BrandId, brand.Name, user.IsActive);

        return Ok(safeUser);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthUserDto>> Login([FromBody] LoginRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { error = "Email and password are required." });
        }

        // Must resolve the requesting brand and scope the lookup by it.
        // Without this, once the same email can exist across multiple
        // brands, this query becomes ambiguous and could authenticate
        // you into the WRONG brand's account — reopening the exact
        // cross-brand leak fixed earlier.
        var brandFromHeader = Request.Headers["X-Brand"].FirstOrDefault();
        var resolvedBrandId = ResolveBrand(brandFromHeader, null);
        if (resolvedBrandId is null)
        {
            return BadRequest(new { error = "A valid brand is required." });
        }

        var normalizedEmail = dto.Email.Trim();
        var user = await _db.Users
            .Include(u => u.Brand)
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail && u.BrandId == resolvedBrandId);

        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { error = "Invalid email or password." });
        }

        var token = _jwtTokenService.CreateToken(user.Id, user.Email, user.BrandId, user.Brand?.Name ?? user.BrandId);
        var cookieName = GetBrandCookieName(user.BrandId);
        var cookieLifetime = _configuration["Jwt:CookieLifetimeMinutes"] ?? "10080";

        Response.Cookies.Append(cookieName, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !IsLocalRequest(),
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(int.Parse(cookieLifetime)),
            IsEssential = true,
            Path = "/"
        });

        return Ok(new AuthUserDto(user.Id, user.Name, user.Email, user.BrandId, user.Brand?.Name ?? user.BrandId, user.IsActive));
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var brandFromClaim = User.FindFirstValue("brand_id");
        var brandFromHeader = Request.Headers["X-Brand"].FirstOrDefault();
        var cookieName = GetBrandCookieName(brandFromClaim ?? brandFromHeader);

        Response.Cookies.Delete(cookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = !IsLocalRequest(),
            SameSite = SameSiteMode.Lax,
            Path = "/"
        });

        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserDto>> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "User is not authenticated." });

        var user = await _db.Users
            .Include(u => u.Brand)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null || !user.IsActive) return Unauthorized(new { error = "User is not active." });

        var brandFromHeader = Request.Headers["X-Brand"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(brandFromHeader) &&
            !string.Equals(brandFromHeader.Trim(), user.BrandId, StringComparison.OrdinalIgnoreCase))
        {
            return Unauthorized(new { error = "User is not authenticated." });
        }

        return Ok(new CurrentUserDto(user.Id, user.Name, user.Email, user.BrandId, user.Brand?.Name ?? user.BrandId));
    }
}