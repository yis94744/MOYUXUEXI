# Build the GUI-oriented SVN tutorial.
# ASCII-only script. All Chinese text lives in meta.json / ui.json (UTF-8).
$ErrorActionPreference = 'Stop'

$root   = 'C:\Work\svn-gui'
$outDir = 'C:\Work\svn-gui-tutorial'
$enc    = New-Object System.Text.UTF8Encoding($false)

function ReadU8($p) { [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8) }

Remove-Item $outDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# copy assets + images so the folder is self-contained
Copy-Item "$root\assets" "$outDir\assets" -Recurse -Force
Copy-Item "$root\img"    "$outDir\img"    -Recurse -Force

$css = ReadU8 "$root\assets\style.css"
$js  = ReadU8 "$root\assets\app.js"
$ui  = (ReadU8 "$root\ui.json")   | ConvertFrom-Json
$secs= (ReadU8 "$root\meta.json") | ConvertFrom-Json
$secs= $secs | Sort-Object { [int]$_.n }

# ---------- sidebar (grouped by stage) ----------
$stages = @(); foreach ($s in $secs) { if ($stages -notcontains $s.st) { $stages += $s.st } }

$navSb = New-Object System.Text.StringBuilder
foreach ($st in $stages) {
    [void]$navSb.AppendLine("    <div class=`"grp`">$st</div>")
    foreach ($s in ($secs | Where-Object { $_.st -eq $st })) {
        [void]$navSb.AppendLine("    <a href=`"$($s.f).html`">$($s.n). $($s.t)</a>")
    }
}
$navAll = $navSb.ToString()

# ---------- per-section pages ----------
$made = @()
for ($i = 0; $i -lt $secs.Count; $i++) {
    $s = $secs[$i]
    $n = [int]$s.n

    $bodyFile = Join-Path $root "parts\p$('{0:D2}' -f $n).html"
    if (-not (Test-Path $bodyFile)) { continue }
    $body = ReadU8 $bodyFile

    $navHtml = $navAll.Replace("<a href=`"$($s.f).html`">", "<a href=`"$($s.f).html`" class=`"on`">")

    $prev = if ($i -gt 0) { $secs[$i-1] } else { $null }
    $next = if ($i -lt $secs.Count-1) { $secs[$i+1] } else { $null }

    $pg = New-Object System.Text.StringBuilder
    [void]$pg.AppendLine('<div class="pager">')
    if ($prev) {
        [void]$pg.AppendLine("  <a href=`"$($prev.f).html`"><span class=`"lbl`">$($ui.prev)</span><span class=`"ttl`">$($prev.n). $($prev.t)</span></a>")
    } else {
        [void]$pg.AppendLine("  <a class=`"disabled`"><span class=`"lbl`">$($ui.prev)</span><span class=`"ttl`">$($ui.first)</span></a>")
    }
    [void]$pg.AppendLine("  <a class=`"home`" href=`"index.html`"><span class=`"ttl`">$($ui.overview)</span></a>")
    if ($next) {
        [void]$pg.AppendLine("  <a class=`"next`" href=`"$($next.f).html`"><span class=`"lbl`">$($ui.next)</span><span class=`"ttl`">$($next.n). $($next.t)</span></a>")
    } else {
        [void]$pg.AppendLine("  <a class=`"next disabled`"><span class=`"lbl`">$($ui.next)</span><span class=`"ttl`">$($ui.last)</span></a>")
    }
    [void]$pg.AppendLine('</div>')

    $html = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$($n). $($s.t) | $($ui.brand)</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div id="prog"></div>
<div class="wrap">
<aside>
  <div class="brand"><span class="dot"></span><h1>$($ui.brand)</h1></div>
  <div class="brand-sub">$($ui.brandSub)</div>
  <nav id="nav">
$navHtml
  </nav>
</aside>
<main>
<div class="crumb">
  <span class="stage">$($s.st)</span>
  <span class="sep">/</span>
  <a href="index.html">$($ui.overview)</a>
  <span class="sep">/</span>
  <span class="cur">$($ui.sectionLabel) $n $($ui.sectionEnd)</span>
</div>

$body

$($pg.ToString())
</main>
</div>
<button id="top" title="$($ui.top)">&uarr;</button>
<script src="assets/app.js"></script>
</body>
</html>
"@

    $path = Join-Path $outDir "$($s.f).html"
    [System.IO.File]::WriteAllText($path, $html, $enc)
    $made += [PSCustomObject]@{ Sec=$n; File="$($s.f).html"; KB=[math]::Round((Get-Item $path).Length/1KB,1) }
}

"Built $($made.Count) section pages."
$made | Format-Table -AutoSize
