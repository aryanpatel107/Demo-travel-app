using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TravelApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDestinationsAndWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Destinations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Country = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    LongDescription = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ImageUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    DurationDays = table.Column<int>(type: "integer", nullable: false),
                    Duration = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    Tags = table.Column<List<string>>(type: "text[]", nullable: false),
                    Rating = table.Column<double>(type: "double precision", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Brand = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WishlistItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    BrandId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    DestinationId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WishlistItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WishlistItems_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WishlistItems_Destinations_DestinationId",
                        column: x => x.DestinationId,
                        principalTable: "Destinations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WishlistItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Destinations",
                columns: new[] { "Id", "Brand", "Country", "CreatedAt", "Currency", "Description", "Duration", "DurationDays", "ImageUrl", "IsActive", "LongDescription", "Name", "Price", "Rating", "Tags" },
                values: new object[,]
                {
                    { "andaman-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Turquoise waters, coral reef diving, and world-class white sand shores.", "5 Days / 4 Nights", 5, "https://images.unsplash.com/photo-1589308078059-be1415eab4c3", true, "Escape to Havelock and Neil islands, walk along Radhanagar Beach, and snorkel amid vibrant underwater coral gardens in the warm Bay of Bengal.", "Andaman & Nicobar", 650m, 4.9000000000000004, new List<string> { "islands", "snorkeling", "beaches" } },
                    { "bali-indonesia", null, "Indonesia", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Lush rice terraces, sacred temples, and world-class surf breaks.", "7-10 days", 7, "https://images.unsplash.com/photo-1537996194471-e657df975ab4", true, "Bali blends spiritual tradition with tropical escape. Explore the terraced rice paddies of Ubud, surf the swells off Uluwatu, and unwind on white-sand beaches. The island's temples, like Tanah Lot, offer stunning sunset views and a glimpse into centuries-old Balinese Hindu culture.", "Bali", 899m, 4.7999999999999998, new List<string> { "beach", "culture", "nature" } },
                    { "bangkok-thailand", "travelpro", "Thailand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Gilded temples, floating markets, bustling street food, and rooftop bars.", "6 Days / 5 Nights", 6, "https://images.unsplash.com/photo-1508009603885-50cf7c579365", true, "Explore Bangkok's Grand Palace and Wat Pho, cruise along the Chao Phraya River, shop world-class night markets, and savor authentic Thai culinary delights.", "Bangkok", 650m, 4.7999999999999998, new List<string> { "city", "temples", "streetfood" } },
                    { "dubai-uae", "travelpro", "United Arab Emirates", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Burj Khalifa views, desert 4x4 safaris, and luxury palm waterfronts.", "5 Days / 4 Nights", 5, "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", true, "Experience Burj Khalifa observation decks, golden desert dune bashing, opulent shopping promenades, and world-class luxury dining along Dubai Marina.", "Dubai", 850m, 4.9000000000000004, new List<string> { "luxury", "safari", "architecture" } },
                    { "goa-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Sun-kissed beaches, coastal cafes, Portuguese architecture, and nightlife.", "4 Days / 3 Nights", 4, "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", true, "Experience coastal bliss along golden sand shores, historic cathedrals in Old Goa, lively beach shacks, and delicious seafood along the Arabian Sea.", "Goa", 380m, 4.7000000000000002, new List<string> { "beach", "party", "coastal" } },
                    { "himachal-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Snow-capped peaks, alpine pine valleys, and thrilling mountain trails.", "6 Days / 5 Nights", 6, "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2", true, "Discover Manali, Shimla, and Dharamshala nestled within the Himalayas. Enjoy river rafting in Kullu, scenic paragliding, and cozy hillside mountain resorts.", "Himachal Pradesh", 420m, 4.7999999999999998, new List<string> { "mountains", "snow", "adventure" } },
                    { "kashmir-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Paradise on earth with Dal Lake shikara rides and snow-clad meadows.", "6 Days / 5 Nights", 6, "https://images.unsplash.com/photo-1595815771614-ade9d652a65d", true, "Cruise in traditional shikaras along Srinagar's Dal Lake, marvel at the snowy slopes of Gulmarg, and stroll through Pahalgam's pristine pine valleys.", "Kashmir", 520m, 4.9000000000000004, new List<string> { "valleys", "lakes", "paradise" } },
                    { "kerala-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Munnar tea hills, tranquil Alleppey houseboats, and serene backwaters.", "5 Days / 4 Nights", 5, "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", true, "Known as God's Own Country, Kerala captivates travelers with verdant tea gardens, spice plantations, and peaceful backwater cruises on traditional kettuvallam boats.", "Kerala", 450m, 4.9000000000000004, new List<string> { "nature", "backwaters", "relaxing" } },
                    { "kyoto-japan", null, "Japan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Historic temples, bamboo groves, and serene Zen gardens.", "6-8 days", 7, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", true, "Kyoto was once Japan's imperial capital and remains its cultural heart. Walk through the thousands of vermillion torii gates at Fushimi Inari, stroll the Arashiyama bamboo grove, and experience traditional tea ceremonies in a city where the past feels alive.", "Kyoto", 1099m, 4.7000000000000002, new List<string> { "culture", "history", "nature" } },
                    { "london-business", "techno-b2b", "United Kingdom", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Premier corporate business properties, financial district access, and executive apartments.", "Corporate Net Rate", 4, "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad", true, "High-availability wholesale DMC room allocations in central London and Canary Wharf with direct XML booking and corporate concierge facilities.", "London Central Hub", 980m, 4.9000000000000004, new List<string> { "business", "conference", "city" } },
                    { "maldives-islands", "travelpro", "Maldives", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Iconic overwater villas, private sandbanks, and translucent lagoons.", "5 Days / 4 Nights", 5, "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", true, "Indulge in ultimate island luxury with bespoke coral reef snorkeling, private sunset cruises, and world-class oceanfront dining in an Indian Ocean sanctuary.", "Maldives", 1499m, 5.0, new List<string> { "luxury", "overwater", "lagoon" } },
                    { "newyork-corporate", "techno-b2b", "United States", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Midtown executive suites, conference venues, and prime business district connectivity.", "Wholesale Direct", 5, "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9", true, "Real-time B2B hotel inventory with preferential negotiated corporate allotments across Manhattan, Wall Street, and Hudson Yards.", "New York Manhattan Suites", 1150m, 4.9000000000000004, new List<string> { "corporate", "finance", "hospitality" } },
                    { "patagonia-argentina", null, "Argentina", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Dramatic peaks, glaciers, and windswept wilderness trails.", "10-14 days", 12, "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca", true, "Patagonia rewards travelers with some of the most rugged, untouched landscapes on the planet. Trek beneath the granite spires of Fitz Roy, watch the Perito Moreno glacier calve into turquoise lakes, and camp under some of the clearest night skies in the Southern Hemisphere.", "Patagonia", 1599m, 4.9000000000000004, new List<string> { "adventure", "nature", "hiking" } },
                    { "rajasthan-india", "wanderly", "India", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Grand royal palaces, desert dunes, and timeless heritage forts.", "6 Days / 5 Nights", 6, "https://images.unsplash.com/photo-1599661046289-e31897846e41", true, "Immerse in the royal grandeur of Jaipur's palaces, Udaipur's romantic lakes, and the golden sands of the Thar Desert with vibrant folk culture and hospitality.", "Rajasthan", 550m, 4.7999999999999998, new List<string> { "heritage", "palaces", "culture" } },
                    { "santorini-greece", null, "Greece", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Whitewashed villages perched above the deep blue Aegean Sea.", "5-7 days", 6, "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff", true, "Santorini's caldera views, cliffside architecture, and volcanic beaches make it one of the most photographed destinations on earth. Wander Oia's narrow streets at sunset, sample local wines grown in volcanic soil, and sail around the caldera to hidden coves.", "Santorini", 1299m, 4.9000000000000004, new List<string> { "beach", "romance", "island" } },
                    { "singapore-business", "techno-b2b", "Singapore", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Marina Bay business tower hotels, seamless DMC net rates, and airport transfers.", "Verified Partner Rate", 4, "https://images.unsplash.com/photo-1525625293386-3f8f99389edd", true, "Competitive corporate B2B allocations, instant voucher generation, and multi-currency net settlement for corporate delegates and business travel partners.", "Singapore Financial District", 890m, 4.7999999999999998, new List<string> { "corporate", "dmc", "hub" } },
                    { "singapore-city", "travelpro", "Singapore", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Futuristic Gardens by the Bay, Marina Bay Sands skyline, and Sentosa.", "5 Days / 4 Nights", 5, "https://images.unsplash.com/photo-1525625293386-3f8f99389edd", true, "Marvel at the Supertree Grove and Cloud Forest, stroll Sentosa Island's beaches, and explore the Michelin-starred hawker centres across this global metropolis.", "Singapore", 780m, 4.7999999999999998, new List<string> { "modern", "gardens", "shopping" } },
                    { "tokyo-japan", "travelpro", "Japan", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "Electrifying Shibuya Crossing, ancient Asakusa shrines, and gastronomy.", "7 Days / 6 Nights", 7, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", true, "Step from futuristic Akihabara and Shinjuku skyscrapers to the serene gardens of Meiji Jingu. Experience the culinary pinnacle of Tokyo's ramen and sushi.", "Tokyo", 1250m, 4.9000000000000004, new List<string> { "city", "tech", "food" } }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Destinations_Brand",
                table: "Destinations",
                column: "Brand");

            migrationBuilder.CreateIndex(
                name: "IX_Destinations_IsActive",
                table: "Destinations",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_BrandId",
                table: "WishlistItems",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_DestinationId",
                table: "WishlistItems",
                column: "DestinationId");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_UserId_BrandId",
                table: "WishlistItems",
                columns: new[] { "UserId", "BrandId" });

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_UserId_BrandId_DestinationId",
                table: "WishlistItems",
                columns: new[] { "UserId", "BrandId", "DestinationId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WishlistItems");

            migrationBuilder.DropTable(
                name: "Destinations");
        }
    }
}
