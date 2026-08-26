using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TripsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponseDto>>> GetAll()
    {
        var trips = await _db.Trips
            .Include(t => t.Payment)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(trips.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TripResponseDto>> GetById(string id)
    {
        var trip = await _db.Trips.Include(t => t.Payment).FirstOrDefaultAsync(t => t.Id == id);
        if (trip is null) return NotFound(new { error = "Trip not found" });
        return Ok(ToDto(trip));
    }

    [HttpPost]
    public async Task<ActionResult<TripResponseDto>> Create(CreateTripDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.DestinationId) || string.IsNullOrWhiteSpace(dto.DestinationName))
            return BadRequest(new { error = "destinationId and destinationName are required" });

        var trip = new Trip
        {
            DestinationId = dto.DestinationId,
            DestinationName = dto.DestinationName,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Travelers = dto.Travelers < 1 ? 1 : dto.Travelers,
            Notes = dto.Notes,
        };

        _db.Trips.Add(trip);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = trip.Id }, ToDto(trip));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var trip = await _db.Trips.FindAsync(id);
        if (trip is null) return NotFound(new { error = "Trip not found" });

        _db.Trips.Remove(trip);
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
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
        trip.Payment?.Status ?? "unpaid"
    );
}