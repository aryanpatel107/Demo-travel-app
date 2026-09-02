namespace TravelApp.Api.DTOs;

public record RegisterRequestDto(
    string Name,
    string Email,
    string Password,
    string? BrandId = null,
    string? Brand = null,
    string? ConfirmPassword = null
);

public record LoginRequestDto(
    string Email,
    string Password
);

public record AuthUserDto(
    string Id,
    string Name,
    string Email,
    string BrandId,
    string Brand,
    bool IsActive,
    string? Role = null
);

public record CurrentUserDto(
    string Id,
    string Name,
    string Email,
    string BrandId,
    string Brand,
    string? Role = null
);
