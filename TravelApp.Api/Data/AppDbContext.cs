using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Models;

namespace TravelApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.ConfigureWarnings(w =>
            w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<TripItem> TripItems => Set<TripItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

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

        // ============================================================
        // DESTINATION
        // ============================================================

        modelBuilder.Entity<Destination>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Id)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(d => d.Country)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(d => d.Description)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(d => d.LongDescription)
                .HasMaxLength(4000);

            entity.Property(d => d.ImageUrl)
                .IsRequired()
                .HasMaxLength(1024);

            entity.Property(d => d.Currency)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(d => d.Duration)
                .HasMaxLength(64);

            entity.Property(d => d.Brand)
                .HasMaxLength(32);

            entity.Property(d => d.Tags)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
                );

            entity.HasIndex(d => d.Brand);
            entity.HasIndex(d => d.IsActive);

            entity.HasData(
                // Shared across all brands (Brand = null)
                new Destination
                {
                    Id = "bali-indonesia",
                    Name = "Bali",
                    Country = "Indonesia",
                    Description = "Lush rice terraces, sacred temples, and world-class surf breaks.",
                    LongDescription = "Bali blends spiritual tradition with tropical escape. Explore the terraced rice paddies of Ubud, surf the swells off Uluwatu, and unwind on white-sand beaches. The island's temples, like Tanah Lot, offer stunning sunset views and a glimpse into centuries-old Balinese Hindu culture.",
                    ImageUrl = "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                    Price = 899m,
                    Currency = "USD",
                    DurationDays = 7,
                    Duration = "7-10 days",
                    Tags = new List<string> { "beach", "culture", "nature" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = null,
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "santorini-greece",
                    Name = "Santorini",
                    Country = "Greece",
                    Description = "Whitewashed villages perched above the deep blue Aegean Sea.",
                    LongDescription = "Santorini's caldera views, cliffside architecture, and volcanic beaches make it one of the most photographed destinations on earth. Wander Oia's narrow streets at sunset, sample local wines grown in volcanic soil, and sail around the caldera to hidden coves.",
                    ImageUrl = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
                    Price = 1299m,
                    Currency = "USD",
                    DurationDays = 6,
                    Duration = "5-7 days",
                    Tags = new List<string> { "beach", "romance", "island" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = null,
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "kyoto-japan",
                    Name = "Kyoto",
                    Country = "Japan",
                    Description = "Historic temples, bamboo groves, and serene Zen gardens.",
                    LongDescription = "Kyoto was once Japan's imperial capital and remains its cultural heart. Walk through the thousands of vermillion torii gates at Fushimi Inari, stroll the Arashiyama bamboo grove, and experience traditional tea ceremonies in a city where the past feels alive.",
                    ImageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
                    Price = 1099m,
                    Currency = "USD",
                    DurationDays = 7,
                    Duration = "6-8 days",
                    Tags = new List<string> { "culture", "history", "nature" },
                    Rating = 4.7,
                    IsActive = true,
                    Brand = null,
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "patagonia-argentina",
                    Name = "Patagonia",
                    Country = "Argentina",
                    Description = "Dramatic peaks, glaciers, and windswept wilderness trails.",
                    LongDescription = "Patagonia rewards travelers with some of the most rugged, untouched landscapes on the planet. Trek beneath the granite spires of Fitz Roy, watch the Perito Moreno glacier calve into turquoise lakes, and camp under some of the clearest night skies in the Southern Hemisphere.",
                    ImageUrl = "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca",
                    Price = 1599m,
                    Currency = "USD",
                    DurationDays = 12,
                    Duration = "10-14 days",
                    Tags = new List<string> { "adventure", "nature", "hiking" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = null,
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },

                // GujjuTours (wanderly)
                new Destination
                {
                    Id = "kerala-india",
                    Name = "Kerala",
                    Country = "India",
                    Description = "Munnar tea hills, tranquil Alleppey houseboats, and serene backwaters.",
                    LongDescription = "Known as God's Own Country, Kerala captivates travelers with verdant tea gardens, spice plantations, and peaceful backwater cruises on traditional kettuvallam boats.",
                    ImageUrl = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
                    Price = 450m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "5 Days / 4 Nights",
                    Tags = new List<string> { "nature", "backwaters", "relaxing" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "rajasthan-india",
                    Name = "Rajasthan",
                    Country = "India",
                    Description = "Grand royal palaces, desert dunes, and timeless heritage forts.",
                    LongDescription = "Immerse in the royal grandeur of Jaipur's palaces, Udaipur's romantic lakes, and the golden sands of the Thar Desert with vibrant folk culture and hospitality.",
                    ImageUrl = "https://images.unsplash.com/photo-1599661046289-e31897846e41",
                    Price = 550m,
                    Currency = "USD",
                    DurationDays = 6,
                    Duration = "6 Days / 5 Nights",
                    Tags = new List<string> { "heritage", "palaces", "culture" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "goa-india",
                    Name = "Goa",
                    Country = "India",
                    Description = "Sun-kissed beaches, coastal cafes, Portuguese architecture, and nightlife.",
                    LongDescription = "Experience coastal bliss along golden sand shores, historic cathedrals in Old Goa, lively beach shacks, and delicious seafood along the Arabian Sea.",
                    ImageUrl = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
                    Price = 380m,
                    Currency = "USD",
                    DurationDays = 4,
                    Duration = "4 Days / 3 Nights",
                    Tags = new List<string> { "beach", "party", "coastal" },
                    Rating = 4.7,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "himachal-india",
                    Name = "Himachal Pradesh",
                    Country = "India",
                    Description = "Snow-capped peaks, alpine pine valleys, and thrilling mountain trails.",
                    LongDescription = "Discover Manali, Shimla, and Dharamshala nestled within the Himalayas. Enjoy river rafting in Kullu, scenic paragliding, and cozy hillside mountain resorts.",
                    ImageUrl = "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2",
                    Price = 420m,
                    Currency = "USD",
                    DurationDays = 6,
                    Duration = "6 Days / 5 Nights",
                    Tags = new List<string> { "mountains", "snow", "adventure" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "kashmir-india",
                    Name = "Kashmir",
                    Country = "India",
                    Description = "Paradise on earth with Dal Lake shikara rides and snow-clad meadows.",
                    LongDescription = "Cruise in traditional shikaras along Srinagar's Dal Lake, marvel at the snowy slopes of Gulmarg, and stroll through Pahalgam's pristine pine valleys.",
                    ImageUrl = "https://images.unsplash.com/photo-1595815771614-ade9d652a65d",
                    Price = 520m,
                    Currency = "USD",
                    DurationDays = 6,
                    Duration = "6 Days / 5 Nights",
                    Tags = new List<string> { "valleys", "lakes", "paradise" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "andaman-india",
                    Name = "Andaman & Nicobar",
                    Country = "India",
                    Description = "Turquoise waters, coral reef diving, and world-class white sand shores.",
                    LongDescription = "Escape to Havelock and Neil islands, walk along Radhanagar Beach, and snorkel amid vibrant underwater coral gardens in the warm Bay of Bengal.",
                    ImageUrl = "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
                    Price = 650m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "5 Days / 4 Nights",
                    Tags = new List<string> { "islands", "snorkeling", "beaches" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "wanderly",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },

                // TripGoAsia (travelpro)
                new Destination
                {
                    Id = "bangkok-thailand",
                    Name = "Bangkok",
                    Country = "Thailand",
                    Description = "Gilded temples, floating markets, bustling street food, and rooftop bars.",
                    LongDescription = "Explore Bangkok's Grand Palace and Wat Pho, cruise along the Chao Phraya River, shop world-class night markets, and savor authentic Thai culinary delights.",
                    ImageUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
                    Price = 650m,
                    Currency = "USD",
                    DurationDays = 6,
                    Duration = "6 Days / 5 Nights",
                    Tags = new List<string> { "city", "temples", "streetfood" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = "travelpro",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "singapore-city",
                    Name = "Singapore",
                    Country = "Singapore",
                    Description = "Futuristic Gardens by the Bay, Marina Bay Sands skyline, and Sentosa.",
                    LongDescription = "Marvel at the Supertree Grove and Cloud Forest, stroll Sentosa Island's beaches, and explore the Michelin-starred hawker centres across this global metropolis.",
                    ImageUrl = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
                    Price = 780m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "5 Days / 4 Nights",
                    Tags = new List<string> { "modern", "gardens", "shopping" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = "travelpro",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "tokyo-japan",
                    Name = "Tokyo",
                    Country = "Japan",
                    Description = "Electrifying Shibuya Crossing, ancient Asakusa shrines, and gastronomy.",
                    LongDescription = "Step from futuristic Akihabara and Shinjuku skyscrapers to the serene gardens of Meiji Jingu. Experience the culinary pinnacle of Tokyo's ramen and sushi.",
                    ImageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
                    Price = 1250m,
                    Currency = "USD",
                    DurationDays = 7,
                    Duration = "7 Days / 6 Nights",
                    Tags = new List<string> { "city", "tech", "food" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "travelpro",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "maldives-islands",
                    Name = "Maldives",
                    Country = "Maldives",
                    Description = "Iconic overwater villas, private sandbanks, and translucent lagoons.",
                    LongDescription = "Indulge in ultimate island luxury with bespoke coral reef snorkeling, private sunset cruises, and world-class oceanfront dining in an Indian Ocean sanctuary.",
                    ImageUrl = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
                    Price = 1499m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "5 Days / 4 Nights",
                    Tags = new List<string> { "luxury", "overwater", "lagoon" },
                    Rating = 5.0,
                    IsActive = true,
                    Brand = "travelpro",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "dubai-uae",
                    Name = "Dubai",
                    Country = "United Arab Emirates",
                    Description = "Burj Khalifa views, desert 4x4 safaris, and luxury palm waterfronts.",
                    LongDescription = "Experience Burj Khalifa observation decks, golden desert dune bashing, opulent shopping promenades, and world-class luxury dining along Dubai Marina.",
                    ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
                    Price = 850m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "5 Days / 4 Nights",
                    Tags = new List<string> { "luxury", "safari", "architecture" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "travelpro",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },

                // Technoheaven (techno-b2b / mytravel)
                new Destination
                {
                    Id = "london-business",
                    Name = "London Central Hub",
                    Country = "United Kingdom",
                    Description = "Premier corporate business properties, financial district access, and executive apartments.",
                    LongDescription = "High-availability wholesale DMC room allocations in central London and Canary Wharf with direct XML booking and corporate concierge facilities.",
                    ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
                    Price = 980m,
                    Currency = "USD",
                    DurationDays = 4,
                    Duration = "Corporate Net Rate",
                    Tags = new List<string> { "business", "conference", "city" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "techno-b2b",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "newyork-corporate",
                    Name = "New York Manhattan Suites",
                    Country = "United States",
                    Description = "Midtown executive suites, conference venues, and prime business district connectivity.",
                    LongDescription = "Real-time B2B hotel inventory with preferential negotiated corporate allotments across Manhattan, Wall Street, and Hudson Yards.",
                    ImageUrl = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
                    Price = 1150m,
                    Currency = "USD",
                    DurationDays = 5,
                    Duration = "Wholesale Direct",
                    Tags = new List<string> { "corporate", "finance", "hospitality" },
                    Rating = 4.9,
                    IsActive = true,
                    Brand = "techno-b2b",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Destination
                {
                    Id = "singapore-business",
                    Name = "Singapore Financial District",
                    Country = "Singapore",
                    Description = "Marina Bay business tower hotels, seamless DMC net rates, and airport transfers.",
                    LongDescription = "Competitive corporate B2B allocations, instant voucher generation, and multi-currency net settlement for corporate delegates and business travel partners.",
                    ImageUrl = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
                    Price = 890m,
                    Currency = "USD",
                    DurationDays = 4,
                    Duration = "Verified Partner Rate",
                    Tags = new List<string> { "corporate", "dmc", "hub" },
                    Rating = 4.8,
                    IsActive = true,
                    Brand = "techno-b2b",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        });

        // ============================================================
        // WISHLIST ITEM
        // ============================================================

        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.HasKey(w => w.Id);

            entity.Property(w => w.UserId)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(w => w.BrandId)
                .IsRequired()
                .HasMaxLength(32);

            entity.Property(w => w.DestinationId)
                .IsRequired()
                .HasMaxLength(128);

            // UNIQUE constraint on (UserId, BrandId, DestinationId) so duplicates are impossible
            entity.HasIndex(w => new { w.UserId, w.BrandId, w.DestinationId })
                .IsUnique();

            entity.HasIndex(w => new { w.UserId, w.BrandId });

            entity.HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Brand)
                .WithMany()
                .HasForeignKey(w => w.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(w => w.Destination)
                .WithMany(d => d.WishlistItems)
                .HasForeignKey(w => w.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}