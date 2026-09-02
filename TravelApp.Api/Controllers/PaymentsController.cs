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
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BrandContext _brandContext;

    public PaymentsController(AppDbContext db, BrandContext brandContext)
    {
        _db = db;
        _brandContext = brandContext;
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponseDto>> Checkout(CheckoutRequestDto dto)
    {
        var brandId = _brandContext.CurrentBrandId;
        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required." });
        }

        if (string.IsNullOrWhiteSpace(dto.TripId) || dto.Amount <= 0)
            return BadRequest(new { error = "tripId and amount are required" });

        var trip = await _db.Trips
            .FirstOrDefaultAsync(t => t.Id == dto.TripId && t.BrandId == brandId && t.UserId == _brandContext.CurrentUserId);

        if (trip is null)
        {
            return NotFound(new { error = "Trip not found for the current brand and user." });
        }

        var existing = await _db.Payments.FirstOrDefaultAsync(p => p.TripId == dto.TripId);

        Payment payment;
        if (existing is not null)
        {
            existing.Amount = dto.Amount;
            existing.Currency = dto.Currency;
            existing.Status = "pending";
            existing.Provider = "mock";
            existing.BrandId = brandId;
            existing.UserId = trip.UserId;
            existing.UpdatedAt = DateTime.UtcNow;
            payment = existing;
        }
        else
        {
            payment = new Payment
            {
                TripId = dto.TripId,
                BrandId = brandId,
                UserId = trip.UserId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                Status = "pending",
                Provider = "mock",
                UpdatedAt = DateTime.UtcNow,
            };
            _db.Payments.Add(payment);
        }

        await _db.SaveChangesAsync();

        var checkoutUrl = $"/trips/{dto.TripId}/payment-success?paymentId={payment.Id}&status=success";
        return Ok(new CheckoutResponseDto(checkoutUrl, payment.Id));
    }
}