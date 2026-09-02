using System.Security.Claims;

namespace TravelApp.Api.Services;

public sealed class CurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public ClaimsPrincipal? Principal => _httpContextAccessor.HttpContext?.User;

    public string? UserId =>
        Principal?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? Principal?.FindFirstValue("sub")
        ?? Principal?.FindFirstValue("user_id");

    public string? Email =>
        Principal?.FindFirstValue(ClaimTypes.Email)
        ?? Principal?.FindFirstValue("email");

    public string? BrandId =>
        Principal?.FindFirstValue("brand_id")
        ?? Principal?.FindFirstValue("BrandId")
        ?? Principal?.FindFirstValue("brandId");

    public string? BrandName =>
        Principal?.FindFirstValue("brand")
        ?? Principal?.FindFirstValue("brand_name");

    public bool IsAuthenticated => !string.IsNullOrWhiteSpace(UserId);
}
