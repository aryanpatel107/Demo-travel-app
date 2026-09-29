using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;

namespace TravelApp.Api.Controllers;

/// <summary>
/// Public, unauthenticated brand config lookup by hostname — e.g.
/// GET /api/core/v1/config/wanderly.yourdomain.com?lang=en
///
/// Response is wrapped in a result/error/isSuccess envelope so the shape
/// is consistent whether the lookup succeeds or fails, which is friendlier
/// for a frontend to handle uniformly.
/// </summary>
[ApiController]
[Route("api/core/v1/config")]
public class ConfigController : ControllerBase
{
    private readonly AppDbContext _db;

    public ConfigController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{hostname}")]
    public async Task<ActionResult<BrandConfigResponseDto>> GetByHostname(string hostname, [FromQuery] string lang = "en")
    {
        if (string.IsNullOrWhiteSpace(hostname))
        {
            return Ok(new BrandConfigResponseDto(null, "hostname is required.", false));
        }

        var normalizedHostname = hostname.Trim().ToLowerInvariant();

        var brand = await _db.Brands
            .FirstOrDefaultAsync(b => b.Hostname.ToLower() == normalizedHostname && b.IsActive);

        if (brand is null)
        {
            return Ok(new BrandConfigResponseDto(null, $"No active brand is configured for hostname '{hostname}'.", false));
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        var result = new BrandConfigResultDto(
            new WebsiteInfoDto(brand.Id, brand.Name, brand.Name, brand.Hostname, brand.LogoUrl, brand.FooterCopyright, "B2C"),
            new ColorPaletteDto(brand.PrimaryColor, brand.SecondaryColor, "#737373"),
            new FontDto(brand.FontFamily),
            new WebsiteContactDto(
                new[] { new ContactItemDto(0, "Contact No", brand.ContactPhone) },
                new[] { new ContactItemDto(1, "Email Id", brand.ContactEmail) }
            ),
            new WebsiteConfigurationDto(
                2,
                new CurrencyInfoDto(brand.CurrencyCode, brand.CurrencyName, 1),
                new LanguageInfoDto(brand.LanguageCode, brand.LanguageName, 1)
            ),
            new[] { new LanguageInfoDto(brand.LanguageCode, brand.LanguageName, 1) },
            new[] { new CurrencyInfoDto(brand.CurrencyCode, brand.CurrencyName, 1) },
            new[]
            {
                // Reflects what this app actually has (flight/hotel/visa
                // cart items) rather than a full B2B booking-engine module
                // list — add more here as the app grows real features.
                new WebsiteModuleDto("FLIGHT", "Flights", 1),
                new WebsiteModuleDto("HOTEL", "Hotels", 2),
                new WebsiteModuleDto("VISA", "Visa", 3),
            },
            new GeoDto(null, null, ip)
        );

        return Ok(new BrandConfigResponseDto(result, null, true));
    }
}