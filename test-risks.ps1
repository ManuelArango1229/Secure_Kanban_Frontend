$result = Invoke-WebRequest -Uri 'http://localhost:3000/api/risks?project_id=52b59d57-ef50-484a-8d83-993bc7b86149'
$risks = $result.Content | ConvertFrom-Json
$risks | ForEach-Object {
    Write-Host "Title: $($_.title), Status: $($_.status)"
}
