using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;
using TravelApp.Api.Services;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BrandContext _brandContext;

    public DestinationsController(AppDbContext db, BrandContext brandContext)
    {
        _db = db;
        _brandContext = brandContext;
    }

    /// <summary>
    /// GET /api/destinations?search=&tag=
    /// Filtered by X-Brand header (brand sees its own places + shared places where Brand is null).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DestinationResponseDto>>> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string? tag = null)
    {
        var brandId = _brandContext.CurrentBrandId;

        IQueryable<Destination> query = _db.Destinations.Where(d => d.IsActive);

        // Filter by X-Brand if present
        if (!string.IsNullOrWhiteSpace(brandId))
        {
            if (brandId.Equals("mytravel", StringComparison.OrdinalIgnoreCase) ||
                brandId.Equals("techno-b2b", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(d => d.Brand == null || d.Brand == "techno-b2b" || d.Brand == "mytravel");
            }
            else
            {
                query = query.Where(d => d.Brand == null || d.Brand == brandId);
            }
        }

        // Optional search query
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(d =>
                d.Name.ToLower().Contains(s) ||
                d.Country.ToLower().Contains(s) ||
                d.Description.ToLower().Contains(s));
        }

        // Optional tag filter
        if (!string.IsNullOrWhiteSpace(tag))
        {
            var t = tag.Trim().ToLower();
            query = query.Where(d => d.Tags.Any(item => item.ToLower() == t));
        }

        var destinations = await query
            .OrderBy(d => d.Id)
            .ToListAsync();

        return Ok(destinations.Select(ToDto));
    }

    /// <summary>
    /// GET /api/destinations/{id}
    /// Filtered by X-Brand header.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DestinationResponseDto>> GetById(string id)
    {
        var brandId = _brandContext.CurrentBrandId;

        var destination = await _db.Destinations
            .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);

        if (destination is null)
        {
            return NotFound(new { error = $"Destination '{id}' not found." });
        }

        // Verify brand visibility if brandId is specified
        if (!string.IsNullOrWhiteSpace(brandId) && destination.Brand != null)
        {
            bool isVisible;
            if (brandId.Equals("mytravel", StringComparison.OrdinalIgnoreCase) ||
                brandId.Equals("techno-b2b", StringComparison.OrdinalIgnoreCase))
            {
                isVisible = destination.Brand.Equals("techno-b2b", StringComparison.OrdinalIgnoreCase) ||
                            destination.Brand.Equals("mytravel", StringComparison.OrdinalIgnoreCase);
            }
            else
            {
                isVisible = destination.Brand.Equals(brandId, StringComparison.OrdinalIgnoreCase);
            }

            if (!isVisible)
            {
                return NotFound(new { error = $"Destination '{id}' not found for the requested brand." });
            }
        }

        return Ok(ToDto(destination));
    }

    private static DestinationResponseDto ToDto(Destination d) => new(
        d.Id,
        d.Name,
        d.Country,
        d.Description,
        d.LongDescription,
        d.ImageUrl,
        d.Price,
        d.Currency,
        d.DurationDays,
        d.Duration ?? $"{d.DurationDays} days",
        d.Tags,
        d.Rating,
        d.IsActive,
        d.Brand
    );
}
