$OutputEncoding = [System.Text.Encoding]::UTF8


param (
    [string]$name,
    [string]$value,
    [switch]$user,
    [switch]$system
)

if (-not $name -or -not $value) {
    Write-Error "必须提供变量名和变量值。"
    exit 1
}

if ($user -and $system) {
    Write-Error "不能同时设置用户和系统环境变量。"
    exit 1
}

if ($user) {
    [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::User)
    Write-Output "用户环境变量 $name 已设置为 $value"
} elseif ($system) {
    if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Error "需要管理员权限来设置系统环境变量。"
        exit 1
    }
    [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Machine)
    Write-Output "系统环境变量 $name 已设置为 $value"
} else {
    Write-Error "必须指定 -user 或 -system 参数。"
    exit 1
}
