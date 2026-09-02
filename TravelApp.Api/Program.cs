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

var jwtKey = builder.Configuration["Jwt:Key"] ?? "travelapp-development-key-change-me-in-production";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "travel-app-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "travel-app-web";
var cookieName = builder.Configuration["Jwt:CookieName"] ?? "travelapp_auth";
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
                var token = context.Request.Cookies[cookieNameForBrand];

                if (string.IsNullOrWhiteSpace(token) && !string.Equals(cookieNameForBrand, cookieName, StringComparison.OrdinalIgnoreCase))
                {
                    token = context.Request.Cookies[cookieName];
                }

                if (!string.IsNullOrWhiteSpace(token))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
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
