$OutputEncoding = [System.Text.Encoding]::UTF8

# 设置 Gradle 版本
$gradleVersion = "6.5"

# 设置 Gradle 下载目录
$downloadDir = "G:\uni-app-outbuild-sdk"

# 创建下载目录
if (-Not (Test-Path $downloadDir)) {
    New-Item -ItemType Directory -Path $downloadDir
}

# 设置压缩包路径
$gradleZipPath = "$downloadDir\gradle-$gradleVersion-bin.zip"

# 检查环境变量是否已存在且路径有效
$gradleHome = "$downloadDir\gradle-$gradleVersion"
$existingGradleHome = [System.Environment]::GetEnvironmentVariable("GRADLE_HOME", [System.EnvironmentVariableTarget]::User)
if ($existingGradleHome -and (Test-Path $existingGradleHome)) {
    # 输出绿色文字
    Write-Output "Gradle 已安装，路径: $existingGradleHome"
    $gradleBin = Join-Path $existingGradleHome "bin"
    Write-Output "Gradle bin 目录: $gradleBin"
    # 测试 Gradle 是否可用
    $gradleVersionOutput = & "$gradleBin\gradle.bat" --version
    # 原样输出版本信息
    Write-Output $gradleVersionOutput
   
    exit 0
}

# 检查压缩包是否存在
if (-Not (Test-Path $gradleZipPath)) {
    $gradleZipUrl = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"
    try {
        Write-Output "开始下载 Gradle 压缩包..."
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($gradleZipUrl, $gradleZipPath)
        Write-Output "Gradle 压缩包下载完成"
    } catch {
        Write-Output "下载 Gradle 失败，请检查网络连接或目标 URL 是否正确。"
        exit 1
    }
} else {
    Write-Output "Gradle 压缩包已存在，跳过下载"
}

try {
    Write-Output "开始解压 Gradle 压缩包..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    Write-Output "压缩包所在位置: $gradleZipPath"
    $zipFile = [System.IO.Compression.ZipFile]::OpenRead($gradleZipPath)
    $totalFiles = $zipFile.Entries.Count
    $extractedFiles = 0

    # 获取压缩包根目录名称
    $rootDirectoryName = $zipFile.Entries[0].FullName.Split("/")[0]

    foreach ($entry in $zipFile.Entries) {
        # 去掉根目录名称
        $relativePath = $entry.FullName.Substring($rootDirectoryName.Length + 1)
        $destinationPath = Join-Path $gradleHome ($relativePath -Replace "/", "\")
        Write-Output "解压文件: $destinationPath"
        
        if (-Not (Test-Path (Split-Path $destinationPath -Parent))) {
            New-Item -ItemType Directory -Path (Split-Path $destinationPath -Parent) | Out-Null
        }
        if ($entry.Name) {
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destinationPath, $true)
        }
        $extractedFiles++
        Write-Progress -Activity "解压 Gradle 压缩包" -Status "进度: $extractedFiles / $totalFiles" -PercentComplete ($extractedFiles / $totalFiles * 100)
    }
    $zipFile.Dispose()
    Write-Output "Gradle 压缩包解压完成"

    # 尝试删除压缩包文件
    try {
        # 关闭压缩包
        $zipFile.Dispose()
        # 等待5s
        Start-Sleep -s 5
        
        # 删除压缩包文件
    

        Remove-Item $gradleZipPath -Force
        Write-Output "压缩包文件已删除"
    } catch {
        Write-Output "无法删除压缩包文件: $_"
    }
} catch {
    Write-Output $_.Exception.Message
    Write-Output "解压 Gradle 失败，请检查压缩包是否完整。"
    exit 1
}

# 设置环境变量
[System.Environment]::SetEnvironmentVariable("GRADLE_HOME", $gradleHome, [System.EnvironmentVariableTarget]::User)
$path = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
$path += ";$gradleHome\bin"
[System.Environment]::SetEnvironmentVariable("PATH", $path, [System.EnvironmentVariableTarget]::User)

# 环境变量已设置
Write-Output "Gradle 环境变量已设置"

# 使用 setx 刷新环境变量
cmd.exe /c "setx GRADLE_HOME $gradleHome"
cmd.exe /c "setx PATH $path"


$env:GRADLE_HOME = $gradleHome
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User) + ";$env:NVMD_HOME\bin"

# 测试环境变量是否设置成功
$gradleBin = Join-Path $gradleHome "bin"
Write-Output "Gradle bin 目录: $gradleBin"


# 测试 Gradle 是否可用
try {
    $gradleVersionOutput = & "$gradleBin\gradle.bat" --version
    # 原样输出版本信息
    Write-Output $gradleVersionOutput


    Write-Output "Gradle 安装成功" -ForegroundColor Green
} catch {
    Write-Output "Gradle 安装失败，请检查环境变量是否设置正确。"

    # 尝试重启资源管理器
    Write-Output "尝试重启资源管理器..."
    Stop-Process -Name explorer -Force
    Start-Process -FilePath explorer.exe

    Write-Output "资源管理器已重启"

    # 重新测试 Gradle 是否可用
    $gradleVersionOutput = & "$gradleBin\gradle.bat" --version
    # 原样输出版本信息
    Write-Output $gradleVersionOutput


    Write-Output "Gradle 安装成功"
    exit 1
}
