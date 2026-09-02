namespace TravelApp.Api.Models;

public class Payment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string TripId { get; set; } = string.Empty;
    public string BrandId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public Trip? Trip { get; set; }
    public Brand Brand { get; set; } = default!;
    public User User { get; set; } = default!;
    public int Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public string Status { get; set; } = "pending";
    public string Provider { get; set; } = "mock";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}