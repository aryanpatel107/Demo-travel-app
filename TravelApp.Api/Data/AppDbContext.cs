using Microsoft.EntityFrameworkCore;
using TravelApp.Api.Models;

namespace TravelApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

            entity.HasIndex(b => b.Slug)
                .IsUnique();

            entity.HasData(
                new Brand { Id = "wanderly", Name = "Wanderly", Slug = "wanderly", IsActive = true, CreatedAt = new DateTime(2026, 9, 1, 10, 48, 23, 433, DateTimeKind.Utc).AddTicks(5572) },
                new Brand { Id = "travelpro", Name = "TravelPro", Slug = "travelpro", IsActive = true, CreatedAt = new DateTime(2026, 9, 1, 10, 48, 23, 433, DateTimeKind.Utc).AddTicks(7450) },
                new Brand { Id = "mytravel", Name = "MyTravel", Slug = "mytravel", IsActive = true, CreatedAt = new DateTime(2026, 9, 1, 10, 48, 23, 433, DateTimeKind.Utc).AddTicks(7456) }
            );
        });

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

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.HasIndex(u => u.BrandId);

            entity.HasOne(u => u.Brand)
                .WithMany(b => b.Users)
                .HasForeignKey(u => u.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        });

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

            entity.HasIndex(t => new { t.BrandId, t.UserId });
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

            entity.HasIndex(p => new { p.BrandId, p.TripId });
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
    }
}