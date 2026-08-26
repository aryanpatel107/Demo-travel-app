namespace TravelApp.Api.DTOs;

public record CreateTripDto(
    string DestinationId,
    string DestinationName,
    DateTime StartDate,
    DateTime EndDate,
    int Travelers,
    string? Notes
);

public record TripResponseDto(
    string Id,
    string DestinationId,
    string DestinationName,
    DateTime StartDate,
    DateTime EndDate,
    int Travelers,
    string? Notes,
    string Status,
    DateTime CreatedAt,
    string PaymentStatus
);