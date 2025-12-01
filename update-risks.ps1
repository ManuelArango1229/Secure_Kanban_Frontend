$body = @{ status = 'identified' } | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/risks/dc0641b6-efe5-4b4b-bfd9-7f3340823bab' -Method Patch -Headers @{'Content-Type'='application/json'} -Body $body
Invoke-WebRequest -Uri 'http://localhost:3000/api/risks/06d33044-e113-411f-9116-2c3cf5137f6f' -Method Patch -Headers @{'Content-Type'='application/json'} -Body $body
Write-Host "Risks updated"
