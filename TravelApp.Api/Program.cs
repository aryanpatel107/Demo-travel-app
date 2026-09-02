using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TravelApp.Api.Data;
using TravelApp.Api.Services;

var builder = WebApplication.CreateBuilder(args);

static string GetBrandCookieName(string? brandId)
{
    var normalized = string.IsNullOrWhiteSpace(brandId)
        ? ""
        : brandId.Trim();

    if (normalized.Equals("wanderly", StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_wanderly";
    }

    if (normalized.Equals("travelpro", StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_travelpro";
    }

    if (normalized.Equals("mytravel", StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_mytravel";
    }

    return "travelapp_auth";
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<CurrentUserContext>();
builder.Services.AddScoped<BrandContext>();
builder.Services.AddScoped<JwtTokenService>();

var dataDirectory = builder.Configuration["DATA_DIRECTORY"];
var connectionString = builder.Configuration.GetConnectionString("Default");

if (!string.IsNullOrWhiteSpace(dataDirectory))
{
    Directory.CreateDirectory(dataDirectory);
    connectionString = $"Data Source={Path.Combine(dataDirectory, "travelapp.db")}";
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// In production, Jwt:Key MUST come from configuration/environment (e.g. an
// environment variable or a secrets manager) — never rely on this fallback
// outside local development. Consider throwing if it's missing when
// builder.Environment.IsProduction() is true.
var jwtKey = builder.Configuration["Jwt:Key"] ?? "travelapp-development-key-change-me-in-production";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "travel-app-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "travel-app-web";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var brandFromHeader = context.Request.Headers["X-Brand"].FirstOrDefault();
                var cookieNameForBrand = GetBrandCookieName(brandFromHeader);

                // Only ever read the cookie that matches the requesting
                // brand's exact cookie name. NO fallback to a generic
                // "travelapp_auth" cookie — that fallback was the root
                // cause of the cross-brand login leak: any stale/legacy
                // cookie from earlier testing would silently authenticate
                // visitors on the WRONG brand's site.
                var token = context.Request.Cookies[cookieNameForBrand];

                if (!string.IsNullOrWhiteSpace(token))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            },

            // Defense-in-depth: even though OnMessageReceived only ever
            // loads the brand-specific cookie, explicitly re-verify that
            // the validated token's own brand_id claim matches the brand
            // the request claims to be for. This protects against any
            // future code path (a new login flow, an admin tool, a bug)
            // that might otherwise let a token from Brand A authenticate
            // a request on Brand B's site.
            OnTokenValidated = context =>
            {
                var brandFromHeader = context.Request.Headers["X-Brand"].FirstOrDefault();
                var brandFromToken = context.Principal?.FindFirst("brand_id")?.Value;

                if (string.IsNullOrWhiteSpace(brandFromHeader) ||
                    string.IsNullOrWhiteSpace(brandFromToken) ||
                    !string.Equals(brandFromHeader.Trim(), brandFromToken.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    context.Fail("Token brand does not match the requesting site's brand.");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Update these origins to match every environment you actually deploy to.
// For local dev with multiple brands running simultaneously on different
// ports, add each port here. For production, list each brand's real
// domain — do not use a wildcard together with AllowCredentials.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000", "http://127.0.0.1:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowNextJs");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();