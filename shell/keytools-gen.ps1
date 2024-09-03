param (
    [string]$keystore = $null,
    [string]$alias = $null,
    [string]$keyalg = $null,
    [string]$keysize = $null,
    [string]$validity = $null,
    [string]$storepass = $null,
    [string]$keypass = $null,
    [string]$dname = $null
)

$requiredParams = @("keystore", "alias", "keyalg", "keysize", "validity", "storepass", "keypass", "dname")

foreach ($param in $requiredParams) {
    if (-not $param) {
        Write-Host "$param is required."
        exit 1
    }
}

if (-not $env:JAVA_HOME) {
    Write-Host "JAVA_HOME is not set, please set JAVA_HOME first."
    exit 2000
}

$keytool = "$env:JAVA_HOME\bin\keytool.exe"
if (-not (Test-Path $keytool)) {
    Write-Host "keytool not found in $env:JAVA_HOME\bin\keytool.exe"
    exit 2001
}

# 捕获命令执行结果
# $cmd = "$keytool -genkeypair -keystore $keystore -alias $alias -keyalg $keyalg -keysize $keysize -validity $validity -storepass $storepass -keypass $keypass -dname $dname"
try {
    # 测试一下 keytool 命令是否可用
    $cmd = "$keytool -help"
    Invoke-Expression $cmd 2>&1 | Write-Host
    $cmd = "$keytool -genkey -v -keystore $keystore -alias $alias -keyalg $keyalg -keysize $keysize -validity $validity -storepass $storepass -keypass $keypass -dname $dname"
    # 输出组装好的
    Write-Host $cmd
    Invoke-Expression $cmd 2>&1 | Write-Host
    # 判断命令执行结果
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Generate key success."
        exit 0
    } else {
        Write-Host "Generate key failed."
        # 原样输出错误信息
        Write-Host $_.Exception.Message
    }
    
} catch {
    Write-Host $_.Exception.Message
    Write-Host "Generate key failed."
}


