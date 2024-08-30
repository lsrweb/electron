param (
    [string]$name,
    [string]$value,
    [switch]$user,
    [switch]$system
)

$OutputEncoding = [System.Text.Encoding]::UTF8

if (-not $name -or -not $value) {
    Write-Error "You must specify both -name and -value parameters."
    exit 1
}

if ($user -and $system) {
    Write-Error "Cannot set both user and system environment variables."
    exit 1
}

if ($user) {
    [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::User)
    Write-Output "User environment variable $name has been set to $value"
} elseif ($system) {
    if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Error "Administrator permission is required to set system environment variables."
        exit 1
    }
    [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Machine)
    Write-Output "System environment variable $name has been set to $value"
} else {
    Write-Error "You must specify either -user or -system parameter."
    exit 1
}

# 
# $OutputEncoding = [System.Text.Encoding]::UTF8
#
# Set the specified environment variable
# Usage: set-environment.ps1 -name <name> -value <value> [-user | -system]
#
