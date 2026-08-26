namespace TravelApp.Api.Models;

public class Trip
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string DestinationId { get; set; } = string.Empty;
    public string DestinationName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Travelers { get; set; } = 1;
    public string? Notes { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Payment? Payment { get; set; }
}