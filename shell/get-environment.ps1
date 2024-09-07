
param (
    [string]$name
)

if (-not $name) {
    Write-Error "Missing argument <name>."
    exit 1
}

$envValue = [System.Environment]::GetEnvironmentVariable($name, [System.EnvironmentVariableTarget]::User)
if (-not $envValue) {
    $envValue = [System.Environment]::GetEnvironmentVariable($name, [System.EnvironmentVariableTarget]::Machine)
    exit 1
}

if ($envValue) {
    Write-Output "$name=$envValue"
    exit 0
} else {
    Write-Error "Environment variable '$name' not found."
    exit 1
}



# 
# $OutputEncoding = [System.Text.Encoding]::UTF8

# 获取指定的环境变量
# Usage: get-environment.ps1 <name>