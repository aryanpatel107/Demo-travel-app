namespace TravelApp.Api.Models;

public class Destination
{
    public string Id { get; set; } = string.Empty; // string slug, e.g. "bali-indonesia"
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LongDescription { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public int DurationDays { get; set; }
    public string? Duration { get; set; } // e.g. "5-7 days"
    public List<string> Tags { get; set; } = new();
    public double Rating { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Brand { get; set; } // nullable, null = shown on all brands
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
