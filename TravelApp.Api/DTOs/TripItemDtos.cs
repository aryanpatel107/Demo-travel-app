namespace TravelApp.Api.DTOs;

public record AddTripItemDto(
    string Type,          // "flight" | "hotel" | "visa"
    string Title,
    string Provider,
    string? Details,
    decimal Price,
    string Currency = "usd"
);

public record TripItemResponseDto(
    string Id,
    string Type,
    string Title,
    string Provider,
    string? Details,
    decimal Price,
    string Currency,
    bool IsCancelled,
    DateTime CreatedAt
);

public record CancelTripResponseDto(
    string TripId,
    string Status,
    DateTime CancelledAt
);