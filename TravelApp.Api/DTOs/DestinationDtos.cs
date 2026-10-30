namespace TravelApp.Api.DTOs;

public record DestinationResponseDto(
    string Id,
    string Name,
    string Country,
    string Description,
    string? LongDescription,
    string ImageUrl,
    decimal Price,
    string Currency,
    int DurationDays,
    string Duration,
    List<string> Tags,
    double Rating,
    bool IsActive,
    string? Brand
);
