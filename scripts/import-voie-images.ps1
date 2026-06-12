# Download generated Higgsfield images and convert to optimized JPEGs
# in public/images/voie/. Usage: pwsh scripts/import-voie-images.ps1
Add-Type -AssemblyName System.Drawing

$outDir = "public/images/voie"
New-Item -ItemType Directory -Force $outDir | Out-Null

function Convert-ToJpeg($srcPath, $dstPath, $maxWidth) {
  $img = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $scale = [Math]::Min(1, $maxWidth / $img.Width)
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82L)
    $bmp.Save($dstPath, $codec, $params)
    $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
}

$jobs = @(
  @{ name = 'enfants';     max = 900 },
  @{ name = 'adultes';     max = 900 },
  @{ name = 'competition'; max = 900 },
  @{ name = 'bjj';         max = 900 },
  @{ name = 'aiki';        max = 900 },
  @{ name = 'dojo';        max = 1920 }
)

foreach ($j in $jobs) {
  $jsonPath = "scripts/gen/$($j.name).json"
  if (-not (Test-Path $jsonPath)) { Write-Output "SKIP $($j.name): no json"; continue }
  $raw = Get-Content $jsonPath -Raw
  if ($raw -notmatch 'result_url') { Write-Output "SKIP $($j.name): not completed"; continue }
  $url = ($raw | ConvertFrom-Json)[0].result_url
  $tmp = Join-Path $env:TEMP "voie-$($j.name).png"
  Invoke-WebRequest -Uri $url -OutFile $tmp
  $dst = Join-Path $outDir "$($j.name).jpg"
  Convert-ToJpeg $tmp $dst $j.max
  Remove-Item $tmp -Force
  $size = [math]::Round((Get-Item $dst).Length / 1KB)
  Write-Output "OK $($j.name).jpg (${size} KB)"
}
