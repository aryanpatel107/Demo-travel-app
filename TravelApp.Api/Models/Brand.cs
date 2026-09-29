namespace TravelApp.Api.Models;

public class Brand
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Hostname { get; set; } = string.Empty;

    // External Technoheaven website/config ID.
    // Example: Techno B2B website.id = 2
    public int? ExternalWebsiteId { get; set; }

    public string LogoUrl { get; set; } = string.Empty;

    public string PrimaryColor { get; set; } = "#0284c7";

    public string SecondaryColor { get; set; } = "#f97316";

    public string FontFamily { get; set; } = "Inter";

    public string ContactEmail { get; set; } = string.Empty;

    public string ContactPhone { get; set; } = string.Empty;

    public string CurrencyCode { get; set; } = "USD";

    public string CurrencyName { get; set; } = "US Dollar";

    public string LanguageCode { get; set; } = "en";

    public string LanguageName { get; set; } = "English";

    public string FooterCopyright { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<User> Users { get; set; } = new();

    public List<Trip> Trips { get; set; } = new();
}