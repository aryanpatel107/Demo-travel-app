using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;
using TravelApp.Api.Services;

namespace TravelApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BrandContext _brandContext;

    public TripsController(AppDbContext db, BrandContext brandContext)
    {
        _db = db;
        _brandContext = brandContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponseDto>>> GetAll()
    {
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required." });
        }

        var userId = _brandContext.CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { error = "You are not authenticated." });
        }

        var trips = await _db.Trips
            .Include(t => t.Payment)
            .Where(t => t.BrandId == brandId && t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(trips.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TripResponseDto>> GetById(string id)
    {
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required." });
        }

        var userId = _brandContext.CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { error = "You are not authenticated." });
        }

        var trip = await _db.Trips
            .Include(t => t.Payment)
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.BrandId == brandId &&
                t.UserId == userId);

        if (trip is null)
        {
            return NotFound(new { error = "Trip not found" });
        }

        return Ok(ToDto(trip));
    }

    [HttpPost]
    public async Task<ActionResult<TripResponseDto>> Create(CreateTripDto dto)
    {
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required." });
        }

        if (string.IsNullOrWhiteSpace(dto.DestinationId) ||
            string.IsNullOrWhiteSpace(dto.DestinationName))
        {
            return BadRequest(new
            {
                error = "destinationId and destinationName are required"
            });
        }

        if (dto.StartDate == default || dto.EndDate == default)
        {
            return BadRequest(new
            {
                error = "Start date and end date are required."
            });
        }

        if (dto.StartDate > dto.EndDate)
        {
            return BadRequest(new
            {
                error = "The end date must be after the start date."
            });
        }

        if (dto.Travelers < 1)
        {
            return BadRequest(new
            {
                error = "Travelers must be at least 1."
            });
        }

        var userId = _brandContext.CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                error = "You are not authenticated."
            });
        }

        // ============================================================
        // IMPORTANT:
        // PostgreSQL "timestamp with time zone" requires UTC DateTime.
        //
        // Dates coming from the browser can arrive with
        // DateTimeKind.Unspecified.
        //
        // We explicitly mark the trip dates as UTC before saving.
        // ============================================================

        var startDateUtc = DateTime.SpecifyKind(
            dto.StartDate,
            DateTimeKind.Utc
        );

        var endDateUtc = DateTime.SpecifyKind(
            dto.EndDate,
            DateTimeKind.Utc
        );

        var nowUtc = DateTime.UtcNow;

        var trip = new Trip
        {
            BrandId = brandId,
            UserId = userId,

            DestinationId = dto.DestinationId,
            DestinationName = dto.DestinationName,

            StartDate = startDateUtc,
            EndDate = endDateUtc,

            Travelers = dto.Travelers,
            Notes = dto.Notes,

            Status = "pending",

            // Always UTC for PostgreSQL timestamp with time zone
            CreatedAt = nowUtc,
            UpdatedAt = nowUtc
        };

        _db.Trips.Add(trip);

        await _db.SaveChangesAsync();

        var createdTrip = await _db.Trips
            .Include(t => t.Payment)
            .FirstOrDefaultAsync(t => t.Id == trip.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = trip.Id },
            ToDto(createdTrip!)
        );
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new
            {
                error = "A valid brand is required."
            });
        }

        var userId = _brandContext.CurrentUserId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                error = "You are not authenticated."
            });
        }

        var trip = await _db.Trips
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.BrandId == brandId &&
                t.UserId == userId);

        if (trip is null)
        {
            return NotFound(new
            {
                error = "Trip not found"
            });
        }

        _db.Trips.Remove(trip);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true
        });
    }

    // ================================================================
    // CART ENDPOINTS — these were missing from the file, which is why
    // every /api/trips/{id}/items request was 404ing regardless of
    // which trip you clicked.
    // ================================================================

    [HttpGet("{id}/items")]
    public async Task<ActionResult<IEnumerable<TripItemResponseDto>>> GetItems(string id)
    {
        var brandId = _brandContext.CurrentBrandId;
        if (string.IsNullOrWhiteSpace(brandId)) return BadRequest(new { error = "A valid brand is required." });

        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "You are not authenticated." });

        var trip = await _db.Trips
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == id && t.BrandId == brandId && t.UserId == userId);

        if (trip is null) return NotFound(new { error = "Trip not found" });

        return Ok(trip.Items
            .Where(i => !i.IsCancelled)
            .OrderBy(i => i.CreatedAt)
            .Select(ToItemDto));
    }

    [HttpPost("{id}/items")]
    public async Task<ActionResult<TripItemResponseDto>> AddItem(string id, AddTripItemDto dto)
    {
        var brandId = _brandContext.CurrentBrandId;
        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(brandId) || string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "You are not authenticated." });

        if (!Enum.TryParse<TripItemType>(dto.Type, ignoreCase: true, out var itemType))
            return BadRequest(new { error = "type must be one of: flight, hotel, visa." });

        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Provider))
            return BadRequest(new { error = "Title and provider are required." });

        if (dto.Price < 0)
            return BadRequest(new { error = "Price cannot be negative." });

        var trip = await _db.Trips
            .FirstOrDefaultAsync(t => t.Id == id && t.BrandId == brandId && t.UserId == userId);

        if (trip is null) return NotFound(new { error = "Trip not found" });
        if (trip.Status == "cancelled") return BadRequest(new { error = "This trip has been cancelled." });

        var item = new TripItem
        {
            TripId = trip.Id,
            Type = itemType,
            Title = dto.Title.Trim(),
            Provider = dto.Provider.Trim(),
            Details = dto.Details,
            Price = dto.Price,
            Currency = dto.Currency,
        };

        _db.TripItems.Add(item);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetItems), new { id = trip.Id }, ToItemDto(item));
    }

    [HttpDelete("{id}/items/{itemId}")]
    public async Task<IActionResult> RemoveItem(string id, string itemId)
    {
        var brandId = _brandContext.CurrentBrandId;
        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(brandId) || string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "You are not authenticated." });

        var trip = await _db.Trips
            .FirstOrDefaultAsync(t => t.Id == id && t.BrandId == brandId && t.UserId == userId);

        if (trip is null) return NotFound(new { error = "Trip not found" });

        var item = await _db.TripItems
            .FirstOrDefaultAsync(i => i.Id == itemId && i.TripId == trip.Id);

        if (item is null) return NotFound(new { error = "Item not found in this trip." });

        item.IsCancelled = true;
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<CancelTripResponseDto>> CancelTrip(string id)
    {
        var brandId = _brandContext.CurrentBrandId;
        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(brandId) || string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "You are not authenticated." });

        var trip = await _db.Trips
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == id && t.BrandId == brandId && t.UserId == userId);

        if (trip is null) return NotFound(new { error = "Trip not found" });

        if (trip.Status == "cancelled")
            return BadRequest(new { error = "This trip is already cancelled." });

        trip.Status = "cancelled";
        trip.CancelledAt = DateTime.UtcNow;

        foreach (var item in trip.Items)
        {
            item.IsCancelled = true;
        }

        await _db.SaveChangesAsync();

        return Ok(new CancelTripResponseDto(trip.Id, trip.Status, trip.CancelledAt.Value));
    }

    private static TripItemResponseDto ToItemDto(TripItem item) => new(
        item.Id,
        item.Type.ToString().ToLowerInvariant(),
        item.Title,
        item.Provider,
        item.Details,
        item.Price,
        item.Currency,
        item.IsCancelled,
        item.CreatedAt
    );

    private static TripResponseDto ToDto(Trip trip) => new(
        trip.Id,
        trip.DestinationId,
        trip.DestinationName,
        trip.StartDate,
        trip.EndDate,
        trip.Travelers,
        trip.Notes,
        trip.Status,
        trip.CreatedAt,
        trip.Payment?.Status ?? "pending"
    );
}