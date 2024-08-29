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
    Write-Output "Gradle 环境变量已存在且路径有效，中断执行。"
    # 测试环境变量是否生效
    Write-Output "当前环境变量 PATH: $env:PATH"
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
    # 下载 Gradle
    $gradleZipUrl = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"
    try {
        Write-Output "开始下载 Gradle 压缩包..."
        $downloadProgress = 0
        Invoke-WebRequest -Uri $gradleZipUrl -OutFile $gradleZipPath -ErrorAction Stop -PassThru | ForEach-Object {
            $downloadProgress += $_.BytesReceived
            Write-Progress -Activity "下载 Gradle 压缩包" -Status "进度: $($downloadProgress / 1MB) MB" -PercentComplete ($downloadProgress / $_.Length * 100)
        }
        Write-Output "Gradle 压缩包下载完成"
    } catch {
        Write-Output "下载 Gradle 失败，请检查网络连接或目标 URL 是否正确。"
        exit 1
    }
} else {
    Write-Output "Gradle 压缩包已存在，跳过下载"
}

# 解压 Gradle
try {
    Write-Output "开始解压 Gradle 压缩包..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zipFile = [System.IO.Compression.ZipFile]::OpenRead($gradleZipPath)
    $totalFiles = $zipFile.Entries.Count
    $extractedFiles = 0
    foreach ($entry in $zipFile.Entries) {
        $destinationPath = Join-Path $downloadDir $entry.FullName
        if (-Not (Test-Path (Split-Path $destinationPath))) {
            New-Item -ItemType Directory -Path (Split-Path $destinationPath) | Out-Null
        }
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destinationPath, $true)
        $extractedFiles++
        Write-Progress -Activity "解压 Gradle 压缩包" -Status "进度: $extractedFiles / $totalFiles" -PercentComplete ($extractedFiles / $totalFiles * 100)
    }
    $zipFile.Dispose()
    Write-Output "Gradle 压缩包解压完成"
} catch {
    Write-Output "解压 Gradle 失败，请检查压缩包是否完整。"
    exit 1
}

# 删除压缩包
try {
    Remove-Item $gradleZipPath
} catch {
    Write-Output "删除压缩包失败，请手动删除。"
}

# 设置环境变量
[System.Environment]::SetEnvironmentVariable("GRADLE_HOME", $gradleHome, [System.EnvironmentVariableTarget]::User)
$path = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
$path += ";$gradleHome\bin"
[System.Environment]::SetEnvironmentVariable("PATH", $path, [System.EnvironmentVariableTarget]::User)

# 刷新当前会话的环境变量
$env:GRADLE_HOME = $gradleHome
$env:PATH += ";$gradleHome\bin"

Write-Output "Gradle $gradleVersion 安装完成"
