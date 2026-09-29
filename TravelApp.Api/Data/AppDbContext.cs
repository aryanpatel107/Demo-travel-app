using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Models;

namespace TravelApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<TripItem> TripItems => Set<TripItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ============================================================
        // BRAND
        // ============================================================

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.Property(b => b.Id)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(b => b.Slug)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(b => b.Hostname)
                .IsRequired()
                .HasMaxLength(256);

            // Remote Technoheaven website ID.
            //
            // Example:
            // Techno B2B website.id = 2
            //
            // Existing local brands can keep this as null.
            entity.Property(b => b.ExternalWebsiteId)
                .IsRequired(false);

            entity.HasIndex(b => b.Slug)
                .IsUnique();

            entity.HasIndex(b => b.Hostname)
                .IsUnique();

            // Allows one local Brand to be associated with one
            // Technoheaven website ID.
            //
            // Multiple NULL values are allowed by PostgreSQL.
            entity.HasIndex(b => b.ExternalWebsiteId)
                .IsUnique();

            entity.HasData(
                // ====================================================
                // WANDERLY
                // ====================================================

                new Brand
                {
                    Id = "wanderly",
                    Name = "Wanderly",
                    Slug = "wanderly",
                    Hostname = "www.gujjutours.com",
                    ExternalWebsiteId = null,
                    LogoUrl = "/logos/wanderly.svg",
                    PrimaryColor = "#d96a3a",
                    SecondaryColor = "#17221d",
                    FontFamily = "Fraunces",
                    ContactEmail = "hello@wanderly.com",
                    ContactPhone = "+1 555 010 0001",
                    CurrencyCode = "USD",
                    CurrencyName = "US Dollar",
                    LanguageCode = "en",
                    LanguageName = "English",
                    FooterCopyright =
                        "© 2026 Wanderly. All Rights Reserved",
                    IsActive = true,
                    CreatedAt = new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(5572)
                },

                // ====================================================
                // TRAVELPRO
                // ====================================================

                new Brand
                {
                    Id = "travelpro",
                    Name = "TravelPro",
                    Slug = "travelpro",
                    Hostname = "www.tripgoasia.com",
                    ExternalWebsiteId = null,
                    LogoUrl = "/logos/travelpro.svg",
                    PrimaryColor = "#0369a1",
                    SecondaryColor = "#0f172a",
                    FontFamily = "Inter",
                    ContactEmail = "support@travelpro.com",
                    ContactPhone = "+1 555 010 0002",
                    CurrencyCode = "USD",
                    CurrencyName = "US Dollar",
                    LanguageCode = "en",
                    LanguageName = "English",
                    FooterCopyright =
                        "© 2026 TravelPro. All Rights Reserved",
                    IsActive = true,
                    CreatedAt = new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(7450)
                },

                // ====================================================
                // MYTRAVEL
                // ====================================================

                new Brand
                {
                    Id = "mytravel",
                    Name = "MyTravel",
                    Slug = "mytravel",
                    Hostname = "mytravel.yourdomain.com",
                    ExternalWebsiteId = null,
                    LogoUrl = "/logos/mytravel.svg",
                    PrimaryColor = "#7c3aed",
                    SecondaryColor = "#1f2937",
                    FontFamily = "Inter",
                    ContactEmail = "hello@mytravel.com",
                    ContactPhone = "+1 555 010 0003",
                    CurrencyCode = "USD",
                    CurrencyName = "US Dollar",
                    LanguageCode = "en",
                    LanguageName = "English",
                    FooterCopyright =
                        "© 2026 MyTravel. All Rights Reserved",
                    IsActive = true,
                    CreatedAt = new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(7456)
                },

                // ====================================================
                // TECHNO B2B
                // ====================================================

                new Brand
                {
                    Id = "techno-b2b",
                    Name = "Techno B2B",
                    Slug = "techno-b2b",
                    Hostname = "stagingb2b.technoheaven.com",

                    // This comes from the REAL Technoheaven
                    // configuration:
                    //
                    // website.id = 2
                    ExternalWebsiteId = 2,

                    // Remote configuration is the source of truth
                    // for the actual website branding.
                    // These values only satisfy the local Brand
                    // database model.
                    LogoUrl = "",
                    PrimaryColor = "#00aacf",
                    SecondaryColor = "#00aacf",
                    FontFamily = "GT Eesti Pro Display",
                    ContactEmail = "",
                    ContactPhone = "",
                    CurrencyCode = "USD",
                    CurrencyName = "American Dollar",
                    LanguageCode = "en",
                    LanguageName = "English",
                    FooterCopyright =
                        "Copyright 2026.\nAll Rights Reserved.",
                    IsActive = true,
                    CreatedAt = new DateTime(
                        2026,
                        9,
                        15,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    )
                }
            );
        });

        // ============================================================
        // USER
        // ============================================================

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.BrandId)
                .IsRequired()
                .HasMaxLength(32);

            // One email can exist on different brands.
            //
            // Example:
            // user@example.com + travelpro
            // user@example.com + techno-b2b
            //
            // But the same email cannot be registered twice
            // on the same brand.
            entity.HasIndex(u => new
            {
                u.BrandId,
                u.Email
            })
            .IsUnique();

            entity.HasOne(u => u.Brand)
                .WithMany(b => b.Users)
                .HasForeignKey(u => u.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ============================================================
        // TRIP
        // ============================================================

        modelBuilder.Entity<Trip>(entity =>
        {
            entity.Property(t => t.BrandId)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(t => t.UserId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(t => t.DestinationId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(t => t.DestinationName)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(t => new
            {
                t.BrandId,
                t.UserId
            });

            entity.HasIndex(t => t.BrandId);

            entity.HasIndex(t => t.UserId);

            entity.HasOne(t => t.Brand)
                .WithMany(b => b.Trips)
                .HasForeignKey(t => t.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(t => t.User)
                .WithMany(u => u.Trips)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(t => t.Payment)
                .WithOne(p => p.Trip)
                .HasForeignKey<Payment>(p => p.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // PAYMENT
        // ============================================================

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(p => p.TripId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(p => p.BrandId)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(p => p.UserId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(p => p.Currency)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(p => p.Provider)
                .IsRequired()
                .HasMaxLength(64);

            entity.HasIndex(p => new
            {
                p.BrandId,
                p.TripId
            });

            entity.HasIndex(p => p.TripId)
                .IsUnique();

            entity.HasOne(p => p.Brand)
                .WithMany()
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // REVIEW
        // ============================================================

        modelBuilder.Entity<Review>(entity =>
        {
            entity.Property(r => r.BrandId)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(r => r.UserId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(r => r.UserName)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(r => r.DestinationId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(r => r.Comment)
                .IsRequired()
                .HasMaxLength(2000);

            // One review per user, per destination, per brand.
            entity.HasIndex(r => new
            {
                r.BrandId,
                r.DestinationId,
                r.UserId
            })
            .IsUnique();

            entity.HasIndex(r => new
            {
                r.BrandId,
                r.DestinationId
            });

            entity.HasOne(r => r.Brand)
                .WithMany()
                .HasForeignKey(r => r.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // TRIP ITEM
        // ============================================================

        modelBuilder.Entity<TripItem>(entity =>
        {
            entity.Property(i => i.Title)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(i => i.Provider)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(i => i.Details)
                .HasMaxLength(1024);

            entity.Property(i => i.Type)
                .HasConversion<string>()
                .HasMaxLength(16);

            entity.HasOne(i => i.Trip)
                .WithMany(t => t.Items)
                .HasForeignKey(i => i.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(i => i.TripId);
        });
    }
}