namespace TravelApp.Api.Services;

public sealed class BrandContext
{
    private static readonly HashSet<string> AllowedBrandIds = new(StringComparer.OrdinalIgnoreCase)
    {
        "wanderly",
        "travelpro",
        "mytravel",
        "techno-b2b"
    };

    private readonly CurrentUserContext _currentUserContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BrandContext(CurrentUserContext currentUserContext, IHttpContextAccessor httpContextAccessor)
    {
        _currentUserContext = currentUserContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public string? CurrentBrandId
    {
        get
        {
            var brandFromUser = ValidateBrand(_currentUserContext.BrandId);
            if (!string.IsNullOrWhiteSpace(brandFromUser))
            {
                return brandFromUser;
            }

            var header = _httpContextAccessor.HttpContext?.Request.Headers["X-Brand"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(header))
            {
                var normalized = header.Trim();
                if (normalized == "2") return "techno-b2b";
                return ValidateBrand(normalized);
            }

            return null;
        }
    }

    public string? CurrentUserId => _currentUserContext.UserId;

    public bool IsBrandKnown(string? brandId)
    {
        if (string.IsNullOrWhiteSpace(brandId))
        {
            return false;
        }

        return AllowedBrandIds.Contains(brandId.Trim());
    }

    public string? ResolveBrandId() => CurrentBrandId;

    public string? ResolveUserId() => CurrentUserId;

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
        if (normalized.Equals("2", StringComparison.OrdinalIgnoreCase))
        {
            return "techno-b2b";
        }

        return AllowedBrandIds.Contains(normalized)
            ? normalized.ToLowerInvariant()
            : null;
    }
}
