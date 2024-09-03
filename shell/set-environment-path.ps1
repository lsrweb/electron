param (
    [string]$Var,  # 父级变量名
    [string]$Val,  # 父级变量值
    [string]$Sub   # 子级变量路径
)

# 获取当前父级变量值
$currentVal = if ($Var) { [System.Environment]::GetEnvironmentVariable($Var, [System.EnvironmentVariableTarget]::User) }

# 检查父级变量是否存在
if ($currentVal) {
    Write-Output "$Var already exists with value: $currentVal. Not modifying it."
} elseif ($Var -and $Val) {
    Write-Output "$Var does not exist. Setting to: $Val"
    [System.Environment]::SetEnvironmentVariable($Var, $Val, [System.EnvironmentVariableTarget]::User)
} elseif (-not $Var -and $Sub) {
    Write-Output "Only Sub parameter provided. Assuming parent variable already exists."
} else {
    Write-Output "Error: Variable name or value is missing."
    exit 1
}

# 将子级变量路径添加到 PATH 环境变量中
if ($Sub) {
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
    # 如果path是 \\, 则替换为 \
    $Sub = $Sub -replace '\\\\', '\\'
    $newPath = if ($Var) { "%$Var%\$Sub" } else { $Sub }

    if ($currentPath -like "*$newPath*") {
        Write-Output "The path $newPath already exists in PATH. No changes made."
        exit 0
    } else {
        $updatedPath = "$currentPath;$newPath"
        [System.Environment]::SetEnvironmentVariable("PATH", $updatedPath, [System.EnvironmentVariableTarget]::User)
        Write-Output "PATH is set to: $updatedPath"
    }
}

# 输出当前的 PATH 以确认设置
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
Write-Output "Current PATH is: $currentPath"

exit 0

# ex: set-environment.ps1 -Var "GRADLE_HOME" -Val "C:\gradle" -Sub "bin"
# ex: set-environment.ps1 -Sub "C:\gradle\bin"
# ex: set-environment.ps1 -Var "GRADLE_HOME" -Val "C:\gradle"
# ex: set-environment.ps1 -Var "GRADLE_HOME" -Val "C:\gradle" -Sub "bin"