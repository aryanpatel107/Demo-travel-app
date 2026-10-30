namespace TravelApp.Api.Models;

public class WishlistItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string BrandId { get; set; } = string.Empty;
    public string DestinationId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;
    public Brand Brand { get; set; } = default!;
    public Destination Destination { get; set; } = default!;
}
