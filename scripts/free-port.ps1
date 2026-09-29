param(
    [int]$Port = 5019
)

Write-Host "Checking for processes listening on port $Port..." -ForegroundColor Cyan

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        if ($procId -gt 0) {
            try {
                $proc = Get-Process -Id $procId -ErrorAction Stop
                Write-Host "Terminating process '$($proc.ProcessName)' (PID: $procId) on port $Port..." -ForegroundColor Yellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "Port $Port freed successfully." -ForegroundColor Green
            } catch {
                Write-Warning "Could not stop process $procId - $($_.Exception.Message)"
            }
        }
    }
} else {
    Write-Host "Port $Port is already free." -ForegroundColor Green
}
