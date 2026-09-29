using Microsoft.AspNetCore.Mvc;

namespace TravelApp.Api.Controllers;

[ApiController]
[Route("api/proxy")]
public class ExternalConfigProxyController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ExternalConfigProxyController> _logger;

    public ExternalConfigProxyController(
        IHttpClientFactory httpClientFactory,
        ILogger<ExternalConfigProxyController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("brand-config")]
    public async Task<IActionResult> GetBrandConfig(
        [FromQuery] string? hostname,
        [FromQuery] string? lang = "en")
    {
        hostname = hostname?.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(hostname))
        {
            return BadRequest(new
            {
                isSuccess = false,
                result = (object?)null,
                error = "Hostname is required."
            });
        }

        // =====================================================
        // Website → External API mapping
        // =====================================================
        var siteMappings = new Dictionary<string, (string ApiBaseUrl, string ConfigHostname)>(
            StringComparer.OrdinalIgnoreCase)
        {
            // Local development (change these two values to switch brand)
            ["localhost"] = (
                "https://stagingapi.gujjutours.com",   // ← change API here
                "www.gujjutours.com"                   // ← change hostname here
            ),

            // Technoheaven
            ["stagingb2b.technoheaven.com"] = (
                "https://stagingapi.technoheaven.com",
                "stagingb2b.technoheaven.com"
            ),

            // TripGoAsia / TravelPro
            ["www.tripgoasia.com"] = (
                "https://stagingapi.tripgoasia.com",
                "www.tripgoasia.com"
            ),
            ["tripgoasia.com"] = (
                "https://stagingapi.tripgoasia.com",
                "www.tripgoasia.com"
            ),

            // GujjuTours / Wanderly
            ["www.gujjutours.com"] = (
                "https://stagingapi.gujjutours.com",
                "www.gujjutours.com"
            ),
            ["gujjutours.com"] = (
                "https://stagingapi.gujjutours.com",
                "www.gujjutours.com"
            )
        };

        if (!siteMappings.TryGetValue(hostname, out var mapping))
        {
            _logger.LogWarning("Hostname not configured: {Hostname}", hostname);

            return BadRequest(new
            {
                isSuccess = false,
                result = (object?)null,
                error = $"Hostname '{hostname}' is not configured."
            });
        }

        lang = string.IsNullOrWhiteSpace(lang) ? "en" : lang.Trim();

        var targetUrl =
            $"{mapping.ApiBaseUrl.TrimEnd('/')}/api/core/v1/config/" +
            $"{Uri.EscapeDataString(mapping.ConfigHostname)}" +
            $"?lang={Uri.EscapeDataString(lang)}";

        _logger.LogInformation("Proxying brand-config → {TargetUrl}", targetUrl);

        try
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(15);

            using var response = await httpClient.GetAsync(targetUrl);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "External API returned {StatusCode}: {Body}",
                    (int)response.StatusCode,
                    responseBody);

                return StatusCode((int)response.StatusCode, new
                {
                    isSuccess = false,
                    result = (object?)null,
                    error = $"External API error ({(int)response.StatusCode})"
                });
            }

            // Try to keep the original shape if the external API already returns
            // { isSuccess, result, error }. Otherwise wrap it.
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(responseBody);
                var root = doc.RootElement;

                if (root.TryGetProperty("isSuccess", out _) ||
                    root.TryGetProperty("result", out _))
                {
                    // Already in the expected shape → return as-is
                    return Content(responseBody, "application/json");
                }
            }
            catch
            {
                // ignore parse errors, fall through to wrap
            }

            // Wrap plain result
            return Ok(new
            {
                isSuccess = true,
                result = System.Text.Json.JsonSerializer.Deserialize<object>(responseBody),
                error = (string?)null
            });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Unable to connect to external configuration API");

            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                isSuccess = false,
                result = (object?)null,
                error = "Unable to connect to the external configuration API.",
                details = ex.Message
            });
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "External configuration API timed out");

            return StatusCode(StatusCodes.Status504GatewayTimeout, new
            {
                isSuccess = false,
                result = (object?)null,
                error = "The external configuration API request timed out.",
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while loading website configuration");

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                isSuccess = false,
                result = (object?)null,
                error = "An unexpected error occurred while loading website configuration.",
                details = ex.Message
            });
        }
    }
}