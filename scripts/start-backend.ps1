param(
    [int]$Port = 5019
)

# 1. Automatically free the port if another instance was left running
& "$PSScriptRoot\free-port.ps1" -Port $Port

# 2. Start ASP.NET Core API
Write-Host "Launching TravelApp.Api with http profile (port $Port)..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\TravelApp.Api"
dotnet run --launch-profile http
