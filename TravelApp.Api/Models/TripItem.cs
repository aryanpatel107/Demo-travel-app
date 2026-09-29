using System.ComponentModel.DataAnnotations.Schema;

namespace TravelApp.Api.Models;

public enum TripItemType
{
    Flight,
    Hotel,
    Visa
}

/// <summary>
/// A single line item within a trip's cart — a flight, a hotel stay, or
/// a visa. A trip can have any number of these; removing one only
/// removes that item, not the whole trip. Cancelling the trip itself
/// (see Trip.Status) cancels everything at once.
/// </summary>
public class TripItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string TripId { get; set; } = string.Empty;
    public Trip? Trip { get; set; }

    public TripItemType Type { get; set; }

    /// <summary>Short display name, e.g. "Delhi → Denpasar, Economy".</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Airline / hotel chain / visa service name.</summary>
    public string Provider { get; set; } = string.Empty;

    /// <summary>Free-form summary shown in the cart, e.g. dates, room type, visa type.</summary>
    public string? Details { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public string Currency { get; set; } = "usd";

    public bool IsCancelled { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}