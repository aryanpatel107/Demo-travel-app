namespace TravelApp.Api.Models;

public class Review
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string BrandId { get; set; } = string.Empty;
    public Brand Brand { get; set; } = default!;

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = default!;

    // Denormalized so review cards don't need a join just to show a name.
    public string UserName { get; set; } = string.Empty;

    public string DestinationId { get; set; } = string.Empty;

    /// <summary>1 to 5.</summary>
    public int Rating { get; set; }

    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}