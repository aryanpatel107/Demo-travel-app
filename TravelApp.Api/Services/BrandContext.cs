namespace TravelApp.Api.Services;

public sealed class BrandContext
{
    private static readonly HashSet<string> AllowedBrandIds = new(StringComparer.OrdinalIgnoreCase)
    {
        "wanderly",
        "travelpro",
        "mytravel"
    };

    private readonly CurrentUserContext _currentUserContext;

    public BrandContext(CurrentUserContext currentUserContext)
    {
        _currentUserContext = currentUserContext;
    }

    public string? CurrentBrandId => ValidateBrand(_currentUserContext.BrandId);

    public string? CurrentUserId => _currentUserContext.UserId;

    public bool IsBrandKnown(string? brandId)
    {
        if (string.IsNullOrWhiteSpace(brandId))
        {
            return false;
        }

        return AllowedBrandIds.Contains(brandId.Trim());
    }

    public string? ResolveBrandId()
    {
        return CurrentBrandId;
    }

    public string? ResolveUserId()
    {
        return CurrentUserId;
    }

    public string RequireBrandId()
    {
        var brandId = CurrentBrandId;
        if (string.IsNullOrWhiteSpace(brandId))
        {
            throw new InvalidOperationException("A valid authenticated brand is required for this request.");
        }

        return brandId;
    }

    public static string? ValidateBrand(string? brandId)
    {
        if (string.IsNullOrWhiteSpace(brandId))
        {
            return null;
        }

        var normalized = brandId.Trim();
        return AllowedBrandIds.Contains(normalized)
            ? normalized.ToLowerInvariant()
            : null;
    }
}
