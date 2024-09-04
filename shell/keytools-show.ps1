param (
    [string]$keystore = $null,
    [string]$storepass = $null
)

$requiredParams = @("keystore", "storepass")

foreach ($param in $requiredParams) {
    if (-not $param) {
        Write-Host "$param is required."
        exit 1
    }
}

if (-not $env:JAVA_HOME) {
    Write-Host "JAVA_HOME is not set, please set JAVA_HOME first."
    exit 1
}

$keytool = "$env:JAVA_HOME\bin\keytool.exe"

try {
    $cmd = "$keytool -list -v -keystore $keystore -storepass $storepass"
    Write-Host "Query keystore information: $cmd"
    # 以表格形式显示
    Invoke-Expression $cmd | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Query keystore information success."
        exit 0
    } else {
        Write-Host "Query keystore information failed."
        exit 1
    }
} catch {
    Write-Host $_.Exception.Message
    Write-Host "Failed to query keystore information."
    exit 1
}