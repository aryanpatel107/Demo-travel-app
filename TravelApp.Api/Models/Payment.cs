namespace TravelApp.Api.Models;

public class Payment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string TripId { get; set; } = string.Empty;
    public Trip? Trip { get; set; }
    public int Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public string Status { get; set; } = "unpaid";
    public string Provider { get; set; } = "mock";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}