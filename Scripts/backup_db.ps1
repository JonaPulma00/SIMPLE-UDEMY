$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backupDir = Join-Path $projectRoot "Scripts\backups"
$containerName = "myed_mysql"
$dbName = "projectedb"
$dbUser = "root"


$envFile = Join-Path $projectRoot "Scripts\.env.backup"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "DB_ROOT_PASSWORD=(.*)") {
            $dbPassword = $matches[1]
        }
    }
}
else {
    Write-Host "Error: .env.backup file not found. Please create it with DB_ROOT_PASSWORD=your_password" -ForegroundColor Red
    exit 1
}


if (-not $dbPassword) {
    Write-Host "Error: DB_ROOT_PASSWORD not found in .env.backup file" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Yellow
}


try {
    Write-Host "Creating backup of $dbName database..."
    $backupFile = Join-Path $backupDir "${dbName}_${timestamp}.sql"
    
    $command = "docker exec $containerName mysqldump -u root -p'$dbPassword' $dbName"
    
    Invoke-Expression $command | Out-File -FilePath $backupFile -Encoding utf8
    
    if (Test-Path $backupFile) {
        $fileSize = (Get-Item $backupFile).Length
        if ($fileSize -gt 0) {
            Write-Host "Backup completed successfully: $backupFile ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
            
           
            Get-ChildItem -Path $backupDir -Filter "${dbName}_*.sql" | 
                Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | 
                ForEach-Object { 
                    Remove-Item $_.FullName
                    Write-Host "Removed old backup: $($_.Name)" -ForegroundColor Yellow
                }
        }
        else {
            Write-Host "Warning: Backup file is empty. Check database connection." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "Error: Failed to create backup file" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error during backup: $_" -ForegroundColor Red
}
