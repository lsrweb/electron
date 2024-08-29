$OutputEncoding = [System.Text.Encoding]::UTF8


param (
    [string]$url,
    [string]$data,
    [string]$method = "GET",
    [string]$header
)

# 初始化 headers 哈希表
$headers = @{}
if ($header) {
    $header.Split(";") | ForEach-Object {
        $key, $value = $_.Split(":")
        $headers[$key.Trim()] = $value.Trim()
    }
}

# 设置进度显示为 Continue
$progressPreference = "Continue"

try {
    # 使用 Invoke-RestMethod 调用 REST API
    $response = Invoke-RestMethod -Uri $url -Method $method -Body $data -Headers $headers -ContentType "application/json"
    Write-Output $response
} catch {
    Write-Error "请求失败: $_"
}
