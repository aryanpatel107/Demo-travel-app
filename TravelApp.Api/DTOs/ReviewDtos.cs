namespace TravelApp.Api.DTOs;

public record CreateReviewDto(
    string DestinationId,
    int Rating,
    string Comment
);

public record ReviewResponseDto(
    string Id,
    string UserName,
    string DestinationId,
    int Rating,
    string Comment,
    DateTime CreatedAt,
    bool IsOwnReview
);

public record DestinationRatingSummaryDto(
    string DestinationId,
    double AverageRating,
    int ReviewCount
);

public record DestinationReviewsDto(
    DestinationRatingSummaryDto Summary,
    IEnumerable<ReviewResponseDto> Reviews
);