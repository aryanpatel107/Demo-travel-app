using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Data;
using TravelApp.Api.DTOs;
using TravelApp.Api.Models;
using TravelApp.Api.Services;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BrandContext _brandContext;

    public ReviewsController(AppDbContext db, BrandContext brandContext)
    {
        _db = db;
        _brandContext = brandContext;
    }

    /// <summary>
    /// Public — anyone visiting a destination can see its reviews, no
    /// login required. IsOwnReview is only meaningfully true when the
    /// caller is authenticated, so the frontend can show "Edit"/"Delete"
    /// on their own review.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<DestinationReviewsDto>> GetForDestination([FromQuery] string destinationId)
    {
        var brandId = _brandContext.CurrentBrandId;
        if (string.IsNullOrWhiteSpace(brandId)) return BadRequest(new { error = "A valid brand is required." });

        if (string.IsNullOrWhiteSpace(destinationId)) return BadRequest(new { error = "destinationId is required." });

        var reviews = await _db.Reviews
            .Where(r => r.BrandId == brandId && r.DestinationId == destinationId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var currentUserId = _brandContext.CurrentUserId;

        var summary = new DestinationRatingSummaryDto(
            destinationId,
            reviews.Count > 0 ? Math.Round(reviews.Average(r => r.Rating), 1) : 0,
            reviews.Count
        );

        var reviewDtos = reviews.Select(r => new ReviewResponseDto(
            r.Id,
            r.UserName,
            r.DestinationId,
            r.Rating,
            r.Comment,
            r.CreatedAt,
            !string.IsNullOrWhiteSpace(currentUserId) && r.UserId == currentUserId
        ));

        return Ok(new DestinationReviewsDto(summary, reviewDtos));
    }

    /// <summary>
    /// Creates a review, or updates the caller's existing review for the
    /// same destination if one already exists — one review per user per
    /// destination per brand.
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewResponseDto>> CreateOrUpdate(CreateReviewDto dto)
    {
        var brandId = _brandContext.CurrentBrandId;
        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(brandId) || string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "You are not authenticated." });

        if (string.IsNullOrWhiteSpace(dto.DestinationId))
            return BadRequest(new { error = "destinationId is required." });

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { error = "Rating must be between 1 and 5." });

        if (string.IsNullOrWhiteSpace(dto.Comment) || dto.Comment.Trim().Length < 3)
            return BadRequest(new { error = "Please write a short comment (at least 3 characters)." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null) return Unauthorized(new { error = "You are not authenticated." });

        var existing = await _db.Reviews.FirstOrDefaultAsync(r =>
            r.BrandId == brandId && r.DestinationId == dto.DestinationId && r.UserId == userId);

        if (existing is not null)
        {
            existing.Rating = dto.Rating;
            existing.Comment = dto.Comment.Trim();
            existing.CreatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new ReviewResponseDto(existing.Id, existing.UserName, existing.DestinationId, existing.Rating, existing.Comment, existing.CreatedAt, true));
        }

        var review = new Review
        {
            BrandId = brandId,
            UserId = userId,
            UserName = user.Name,
            DestinationId = dto.DestinationId,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return Ok(new ReviewResponseDto(review.Id, review.UserName, review.DestinationId, review.Rating, review.Comment, review.CreatedAt, true));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var brandId = _brandContext.CurrentBrandId;
        var userId = _brandContext.CurrentUserId;
        if (string.IsNullOrWhiteSpace(brandId) || string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "You are not authenticated." });

        var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.BrandId == brandId);
        if (review is null) return NotFound(new { error = "Review not found." });

        if (review.UserId != userId) return Forbid();

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }
}