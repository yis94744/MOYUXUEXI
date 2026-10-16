# Build index.html for the GUI tutorial. ASCII-only script.
$ErrorActionPreference = 'Stop'

$root   = 'C:\Work\svn-gui'
$outDir = 'C:\Work\svn-gui-tutorial'
$enc    = New-Object System.Text.UTF8Encoding($false)

function ReadU8($p) { [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8) }

$css = (ReadU8 "$root\assets\style.css") + "`n" + (ReadU8 "$root\assets\index.css")
$js  = ReadU8 "$root\assets\app.js"
$ui  = (ReadU8 "$root\ui.json")  | ConvertFrom-Json
$ix  = (ReadU8 "$root\idx.json") | ConvertFrom-Json
$secs = (ReadU8 "$root\meta.json") | ConvertFrom-Json
$secs = $secs | Sort-Object { [int]$_.n }

$stages = @(); foreach ($s in $secs) { if ($stages -notcontains $s.st) { $stages += $s.st } }

# ---------- sidebar ----------
$navSb = New-Object System.Text.StringBuilder
foreach ($st in $stages) {
    [void]$navSb.AppendLine("    <div class=`"grp`">$st</div>")
    foreach ($s in ($secs | Where-Object { $_.st -eq $st })) {
        [void]$navSb.AppendLine("    <a href=`"$($s.f).html`">$($s.n). $($s.t)</a>")
    }
}

# ---------- stage blocks ----------
$cardSb = New-Object System.Text.StringBuilder
for ($k = 0; $k -lt $stages.Count; $k++) {
    $st   = $stages[$k]
    $info = $ix.stages[$k]
    $items = $secs | Where-Object { $_.st -eq $st }
    $no = '{0:D2}' -f ($k + 1)

    [void]$cardSb.AppendLine("  <div class=`"stageblock`">")
    [void]$cardSb.AppendLine("    <div class=`"sh`"><span class=`"sno`">$no</span><div><div class=`"stt`">$($info.title)</div><div class=`"ssd`">$($info.desc)</div></div><span class=`"scount`">$($items.Count) $($ix.sectionsUnit)</span></div>")
    [void]$cardSb.AppendLine('    <div class="slist">')
    foreach ($s in $items) {
        $blurb = $info.blurbs."$($s.n)"
        [void]$cardSb.AppendLine("      <a href=`"$($s.f).html`"><span class=`"sn`">$($s.n)</span><span class=`"st`">$($s.t)</span><span class=`"sbl`">$blurb</span></a>")
    }
    [void]$cardSb.AppendLine('    </div>')
    [void]$cardSb.AppendLine('  </div>')
}

# ---------- stats ----------
$statSb = New-Object System.Text.StringBuilder
$stats = @(
  @{ v=[string]$secs.Count; l=$ix.statSections },
  @{ v=$ix.statShots;       l=$ix.statShotsLabel },
  @{ v=$ix.statStages;      l=$ix.statStagesLabel },
  @{ v=$ix.statTools;       l=$ix.statToolsLabel }
)
foreach ($s in $stats) {
    [void]$statSb.AppendLine("    <div><b>$($s.v)</b>$($s.l)</div>")
}

# ---------- quickstart ----------
$qsSb = New-Object System.Text.StringBuilder
$i = 0
foreach ($q in $ix.quickstart) {
    $i++
    $cls = if ($i % 2 -eq 1) { 'qa' } else { 'qb' }
    [void]$qsSb.AppendLine("  <div class=`"$cls`"><h6>$($q.title)</h6><p>$($q.body)</p><a class=`"qgo`" href=`"$($q.link)`">$($q.linkText)</a></div>")
}

$html = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$($ix.pageTitle)</title>
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="assets/index.css">
</head>
<body>
<div id="prog"></div>
<div class="wrap">
<aside>
  <div class="brand"><span class="dot"></span><h1>$($ui.brand)</h1></div>
  <div class="brand-sub">$($ui.brandSub)</div>
  <nav id="nav">
$($navSb.ToString())  </nav>
</aside>
<main>
<div class="hero">
  <span class="tag">$($ix.heroTag)</span>
  <h2>$($ix.heroTitle)</h2>
  <p class="lead">$($ix.heroLead)</p>
  <p>$($ix.heroBody)</p>
  <div class="meta">
$($statSb.ToString())  </div>
</div>

<div class="box tip">
  <span class="bt">$($ix.howtoTitle)</span>
  <p>$($ix.howtoBody)</p>
</div>

<h3 class="sec" id="stages"><span class="no">#</span>$($ix.stagesTitle)</h3>
<p>$($ix.stagesIntro)</p>

$($cardSb.ToString())

<h3 class="sec" id="quick"><span class="no">#</span>$($ix.quickTitle)</h3>
<div class="grid2">
$($qsSb.ToString())</div>

<div class="box key" style="margin-top:34px">
  <span class="bt">$($ix.verifiedTitle)</span>
  <p>$($ix.verifiedBody)</p>
</div>

<footer>
  <p><b>$($ix.footerTitle)</b></p>
  <p style="margin-top:8px">$($ix.footerBody)</p>
  <p style="margin-top:8px;color:var(--tx4)">$($ix.footerNote)</p>
</footer>
</main>
</div>
<button id="top" title="$($ui.top)">&uarr;</button>
<script src="assets/app.js"></script>
</body>
</html>
"@

$path = Join-Path $outDir 'index.html'
[System.IO.File]::WriteAllText($path, $html, $enc)
"index.html: $([math]::Round((Get-Item $path).Length/1KB,1)) KB"
