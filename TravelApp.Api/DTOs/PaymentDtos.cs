namespace TravelApp.Api.DTOs;

public record CheckoutRequestDto(string TripId, int Amount, string Currency = "usd");

public record CheckoutResponseDto(string CheckoutUrl, string PaymentId);