namespace TravelApp.Api.DTOs;

public record WishlistItemDto(
    string Id,
    string UserId,
    string BrandId,
    string DestinationId,
    DateTime CreatedAt,
    DestinationResponseDto Destination
);
