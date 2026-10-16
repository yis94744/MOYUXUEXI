# Split SVN tutorial into one HTML per section.
# ASCII-only script; all Chinese text comes from meta.json / ui.json (UTF-8).
$ErrorActionPreference = 'Stop'
$work   = 'C:\Work\_split'
$outDir = 'C:\Work\svn-tutorial'
$enc    = New-Object System.Text.UTF8Encoding($false)

Remove-Item $outDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function ReadU8($p) { [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8) }

$css   = (ReadU8 "$work\common.css") + "`n" + (ReadU8 "$work\extra.css")
$defs  = ReadU8 "$work\defs.svg"
$js    = ReadU8 "$work\common.js"
$ui    = (ReadU8 "$work\ui.json") | ConvertFrom-Json

$secs = (ReadU8 "$work\meta.json") | ConvertFrom-Json
$secs = $secs | Sort-Object { [int]$_.n }

# ---------- sidebar ----------
$nav = New-Object System.Text.StringBuilder
$lastStage = ''
foreach ($s in $secs) {
    if ($s.st -ne $lastStage) {
        [void]$nav.AppendLine("    <div class=`"grp`">$($s.st)</div>")
        $lastStage = $s.st
    }
    [void]$nav.AppendLine("    <a href=`"$($s.f).html`">$($s.n). $($s.t)</a>")
}
[void]$nav.AppendLine("    <div class=`"grp`">$($ui.navGroup)</div>")
[void]$nav.AppendLine("    <a href=`"index.html`">$($ui.overview)</a>")
$navAll = $nav.ToString()

$made = @()
for ($i = 0; $i -lt $secs.Count; $i++) {
    $s = $secs[$i]
    $n = [int]$s.n

    $body = ReadU8 "$work\sec-s$n.html"

    # cross-section anchors -> filenames
    foreach ($x in $secs) {
        $body = $body.Replace("href=`"#s$($x.n)`"", "href=`"$($x.f).html`"")
    }

    $navHtml = $navAll.Replace("<a href=`"$($s.f).html`">", "<a href=`"$($s.f).html`" class=`"on`">")

    $prev = if ($i -gt 0) { $secs[$i - 1] } else { $null }
    $next = if ($i -lt $secs.Count - 1) { $secs[$i + 1] } else { $null }

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
<title>$($n). $($s.t)$($ui.titleSuffix)</title>
<style>
$css
</style>
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
$defs
<div class="crumb">
  <span class="stage">$($s.st)</span>
  <span class="sep">/</span>
  <a href="index.html">$($ui.overview)</a>
  <span class="sep">/</span>
  <span class="cur">$($ui.section) $n $($ui.sectionEnd)</span>
</div>

$body

$($pg.ToString())
</main>
</div>
<button id="top" title="$($ui.top)">&uarr;</button>

<script>
$js
</script>
</body>
</html>
"@

    $path = Join-Path $outDir "$($s.f).html"
    [System.IO.File]::WriteAllText($path, $html, $enc)
    $made += [PSCustomObject]@{
        Sec  = $n
        File = "$($s.f).html"
        KB   = [math]::Round((Get-Item $path).Length / 1KB, 1)
    }
}

"Generated $($made.Count) section files."
$made | Format-Table -AutoSize
