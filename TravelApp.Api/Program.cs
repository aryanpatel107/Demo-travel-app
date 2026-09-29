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

    if (normalized.Equals(
            "wanderly",
            StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_wanderly";
    }

    if (normalized.Equals(
            "travelpro",
            StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_travelpro";
    }

    if (normalized.Equals(
            "mytravel",
            StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_mytravel";
    }

    if (normalized.Equals(
            "techno-b2b",
            StringComparison.OrdinalIgnoreCase))
    {
        return "travelapp_auth_techno_b2b";
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

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    ));

var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? "travelapp-development-key-change-me-in-production";

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? "travel-app-api";

var jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? "travel-app-web";

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(keyBytes),

                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,

                ValidateAudience = true,
                ValidAudience = jwtAudience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.FromMinutes(1)
            };

        options.Events = new JwtBearerEvents
        {
            /*
             * --------------------------------------------------
             * Find the correct authentication cookie.
             *
             * The frontend sends:
             *
             * X-Brand: 2
             *
             * The database contains:
             *
             * ExternalWebsiteId = 2
             * Id = techno-b2b
             *
             * Therefore we resolve:
             *
             * 2 -> techno-b2b
             *    -> travelapp_auth_techno_b2b
             * --------------------------------------------------
             */
            OnMessageReceived = async context =>
            {
                if (!string.IsNullOrWhiteSpace(context.Request.Headers.Authorization))
                {
                    return;
                }

                var brandFromHeader =
                    context.Request.Headers["X-Brand"]
                        .FirstOrDefault();

                if (string.IsNullOrWhiteSpace(
                        brandFromHeader))
                {
                    return;
                }

                var normalizedBrand =
                    brandFromHeader.Trim();

                /*
                 * Existing local brand IDs can be used
                 * directly.
                 */
                if (!normalizedBrand.Equals(
                        "wanderly",
                        StringComparison.OrdinalIgnoreCase) &&
                    !normalizedBrand.Equals(
                        "travelpro",
                        StringComparison.OrdinalIgnoreCase) &&
                    !normalizedBrand.Equals(
                        "mytravel",
                        StringComparison.OrdinalIgnoreCase) &&
                    !normalizedBrand.Equals(
                        "techno-b2b",
                        StringComparison.OrdinalIgnoreCase))
                {
                    /*
                     * If it isn't a local brand ID,
                     * try to resolve it as the remote
                     * Technoheaven website ID.
                     */
                    if (!int.TryParse(
                            normalizedBrand,
                            out var externalWebsiteId))
                    {
                        return;
                    }

                    var db =
                        context.HttpContext.RequestServices
                            .GetRequiredService<AppDbContext>();

                    var brand =
                        await db.Brands
                            .AsNoTracking()
                            .FirstOrDefaultAsync(
                                b =>
                                    b.ExternalWebsiteId ==
                                    externalWebsiteId &&
                                    b.IsActive);

                    if (brand == null)
                    {
                        return;
                    }

                    normalizedBrand =
                        brand.Id;
                }

                var cookieName =
                    GetBrandCookieName(
                        normalizedBrand);

                var token =
                    context.Request.Cookies[
                        cookieName];

                if (!string.IsNullOrWhiteSpace(
                        token))
                {
                    context.Token = token;
                }
            },

            /*
             * --------------------------------------------------
             * Validate that the authenticated JWT belongs
             * to the requested brand.
             * --------------------------------------------------
             */
            OnTokenValidated = async context =>
            {
                var brandFromHeader =
                    context.Request.Headers["X-Brand"]
                        .FirstOrDefault();

                var brandFromToken =
                    context.Principal?
                        .FindFirst("brand_id")?
                        .Value;

                if (string.IsNullOrWhiteSpace(brandFromHeader))
                {
                    brandFromHeader = brandFromToken;
                }

                if (string.IsNullOrWhiteSpace(
                        brandFromHeader) ||
                    string.IsNullOrWhiteSpace(
                        brandFromToken))
                {
                    context.Fail(
                        "Brand information is missing."
                    );

                    return;
                }

                var normalizedHeader =
                    brandFromHeader.Trim();

                /*
                 * Resolve numeric remote website IDs
                 * through the database.
                 */
                if (int.TryParse(
                        normalizedHeader,
                        out var externalWebsiteId))
                {
                    var db =
                        context.HttpContext.RequestServices
                            .GetRequiredService<AppDbContext>();

                    var brand =
                        await db.Brands
                            .AsNoTracking()
                            .FirstOrDefaultAsync(
                                b =>
                                    b.ExternalWebsiteId ==
                                    externalWebsiteId &&
                                    b.IsActive);

                    if (brand == null)
                    {
                        context.Fail(
                            "Unknown external website ID."
                        );

                        return;
                    }

                    normalizedHeader =
                        brand.Id;
                }

                /*
                 * Only allow known local brands after
                 * external IDs have been resolved.
                 */
                var validLocalBrand =
                    normalizedHeader.Equals(
                        "wanderly",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    normalizedHeader.Equals(
                        "travelpro",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    normalizedHeader.Equals(
                        "mytravel",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    normalizedHeader.Equals(
                        "techno-b2b",
                        StringComparison.OrdinalIgnoreCase);

                if (!validLocalBrand)
                {
                    context.Fail(
                        "Unknown requesting brand."
                    );

                    return;
                }

                /*
                 * Compare the resolved requesting brand
                 * with the brand stored in the JWT.
                 */
                if (!string.Equals(
                        normalizedHeader,
                        brandFromToken.Trim(),
                        StringComparison.OrdinalIgnoreCase))
                {
                    context.Fail(
                        "Token brand does not match the requesting site's brand."
                    );

                    return;
                }
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpClient();

var allowedOrigins =
    builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
    ?? new[]
    {
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy
                .SetIsOriginAllowed(_ => true)
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
        else
        {
            policy
                .WithOrigins(allowedOrigins)
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
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