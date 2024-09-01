param (
    [string]$keystore = $null,
    [string]$storepass = $null
)

$requiredParams = @("keystore", "storepass")

foreach ($param in $requiredParams) {
    if (-not $param) {
        Write-Host "$param is required."
        exit
    }
}

if (-not $env:JAVA_HOME) {
    Write-Host "JAVA_HOME is not set, please set JAVA_HOME first."
    exit
}

$keytool = "$env:JAVA_HOME\bin\keytool.exe"

try {
    $cmd = "$keytool -list -v -keystore $keystore -storepass $storepass"
    Write-Host $cmd
    Invoke-Expression $cmd
} catch {
    Write-Host $_.Exception.Message
    Write-Host "Failed to query keystore information."
}