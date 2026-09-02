namespace TravelApp.Api.Models;

public class Trip
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string BrandId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string DestinationId { get; set; } = string.Empty;
    public string DestinationName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Travelers { get; set; } = 1;
    public string? Notes { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Brand Brand { get; set; } = default!;
    public User User { get; set; } = default!;
    public Payment? Payment { get; set; }
}