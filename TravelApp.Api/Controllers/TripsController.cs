
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

