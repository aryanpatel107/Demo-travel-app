using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;
using TravelApp.Api.Services;

namespace TravelApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BrandContext _brandContext;

    public WishlistController(AppDbContext db, BrandContext brandContext)
    {
        _db = db;
        _brandContext = brandContext;
    }

    /// <summary>
    /// GET /api/wishlist
    /// Returns the user's wishlist scoped to the authenticated user AND brand with full destination objects.
    /// Requires Bearer token and X-Brand header.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WishlistItemDto>>> GetWishlist()
    {
        var userId = _brandContext.CurrentUserId;
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { error = "You are not authenticated." });
        }

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required via X-Brand header." });
        }

        var items = await _db.WishlistItems
            .Include(w => w.Destination)
            .Where(w => w.UserId == userId && w.BrandId == brandId && w.Destination.IsActive)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(items.Select(ToDto));
    }

    /// <summary>
    /// POST /api/wishlist/{destinationId}
    /// Adds destination to wishlist for the authenticated user and brand.
    /// Idempotent: adding twice is not an error.
    /// Returns 404 for an unknown destinationId, and 401 when not logged in.
    /// </summary>
    [HttpPost("{destinationId}")]
    public async Task<ActionResult<WishlistItemDto>> AddToWishlist(string destinationId)
    {
        var userId = _brandContext.CurrentUserId;
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { error = "You are not authenticated." });
        }

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required via X-Brand header." });
        }

        var destination = await _db.Destinations
            .FirstOrDefaultAsync(d => d.Id == destinationId && d.IsActive);

        if (destination is null)
        {
            return NotFound(new { error = $"Destination '{destinationId}' not found." });
        }

        // Check if item already exists (idempotency)
        var existing = await _db.WishlistItems
            .Include(w => w.Destination)
            .FirstOrDefaultAsync(w =>
                w.UserId == userId &&
                w.BrandId == brandId &&
                w.DestinationId == destinationId);

        if (existing is not null)
        {
            return Ok(ToDto(existing));
        }

        var item = new WishlistItem
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            BrandId = brandId,
            DestinationId = destinationId,
            CreatedAt = DateTime.UtcNow,
            Destination = destination
        };

        _db.WishlistItems.Add(item);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // Concurrency or duplicate caught by unique index
            var reloaded = await _db.WishlistItems
                .Include(w => w.Destination)
                .FirstOrDefaultAsync(w =>
                    w.UserId == userId &&
                    w.BrandId == brandId &&
                    w.DestinationId == destinationId);

            if (reloaded is not null)
            {
                return Ok(ToDto(reloaded));
            }

            throw;
        }

        return Ok(ToDto(item));
    }

    /// <summary>
    /// DELETE /api/wishlist/{destinationId}
    /// Removes destination from wishlist for the authenticated user and brand.
    /// Idempotent: removing when not present is not an error.
    /// Returns 404 for an unknown destinationId, and 401 when not logged in.
    /// </summary>
    [HttpDelete("{destinationId}")]
    public async Task<IActionResult> RemoveFromWishlist(string destinationId)
    {
        var userId = _brandContext.CurrentUserId;
        var brandId = _brandContext.CurrentBrandId;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { error = "You are not authenticated." });
        }

        if (string.IsNullOrWhiteSpace(brandId))
        {
            return BadRequest(new { error = "A valid brand is required via X-Brand header." });
        }

        var destinationExists = await _db.Destinations
            .AnyAsync(d => d.Id == destinationId);

        if (!destinationExists)
        {
            return NotFound(new { error = $"Destination '{destinationId}' not found." });
        }

        var item = await _db.WishlistItems
            .FirstOrDefaultAsync(w =>
                w.UserId == userId &&
                w.BrandId == brandId &&
                w.DestinationId == destinationId);

        if (item is not null)
        {
            _db.WishlistItems.Remove(item);
            await _db.SaveChangesAsync();
        }

        return Ok(new { success = true, destinationId, message = "Item removed from wishlist." });
    }

    private static WishlistItemDto ToDto(WishlistItem w) => new(
        w.Id,
        w.UserId,
        w.BrandId,
        w.DestinationId,
        w.CreatedAt,
        new DestinationResponseDto(
            w.Destination.Id,
            w.Destination.Name,
            w.Destination.Country,
            w.Destination.Description,
            w.Destination.LongDescription,
            w.Destination.ImageUrl,
            w.Destination.Price,
            w.Destination.Currency,
            w.Destination.DurationDays,
            w.Destination.Duration ?? $"{w.Destination.DurationDays} days",
            w.Destination.Tags,
            w.Destination.Rating,
            w.Destination.IsActive,
            w.Destination.Brand
        )
    );
}
