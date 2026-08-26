using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PaymentsController(AppDbContext db)
    {
        _db = db;
    }

    // Generic checkout stub — same idea as the Next.js version.
    // To go live: replace the body with a real Stripe/Razorpay session
    // creation call and keep the { checkoutUrl, paymentId } response shape.
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponseDto>> Checkout(CheckoutRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TripId) || dto.Amount <= 0)
            return BadRequest(new { error = "tripId and amount are required" });

        var existing = await _db.Payments.FirstOrDefaultAsync(p => p.TripId == dto.TripId);

        Payment payment;
        if (existing is not null)
        {
            existing.Amount = dto.Amount;
            existing.Currency = dto.Currency;
            existing.Status = "unpaid";
            existing.Provider = "mock";
            payment = existing;
        }
        else
        {
            payment = new Payment
            {
                TripId = dto.TripId,
                Amount = dto.Amount,
                Currency = dto.Currency,
            };
            _db.Payments.Add(payment);
        }

        await _db.SaveChangesAsync();

        var checkoutUrl = $"/trips/{dto.TripId}/payment-success?paymentId={payment.Id}";
        return Ok(new CheckoutResponseDto(checkoutUrl, payment.Id));
    }
}