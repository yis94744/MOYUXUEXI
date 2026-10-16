# Generate index.html (the overview page).
# ASCII-only script; all Chinese text comes from meta.json / ui.json / idx.json.
$ErrorActionPreference = 'Stop'
$work   = 'C:\Work\_split'
$outDir = 'C:\Work\svn-tutorial'
$enc    = New-Object System.Text.UTF8Encoding($false)

function ReadU8($p) { [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8) }

$css   = (ReadU8 "$work\common.css") + "`n" + (ReadU8 "$work\extra.css") + "`n" + (ReadU8 "$work\index.css")
$defs  = ReadU8 "$work\defs.svg"
$js    = ReadU8 "$work\common.js"
$ui    = (ReadU8 "$work\ui.json")  | ConvertFrom-Json
$ix    = (ReadU8 "$work\idx.json") | ConvertFrom-Json
$secs  = (ReadU8 "$work\meta.json") | ConvertFrom-Json
$secs  = $secs | Sort-Object { [int]$_.n }

# group sections by stage
$stages = @()
$order  = @()
foreach ($s in $secs) {
    if ($order -notcontains $s.st) { $order += $s.st }
}
foreach ($st in $order) {
    $items = $secs | Where-Object { $_.st -eq $st }
    $stages += [PSCustomObject]@{ Name = $st; Items = $items }
}

# ---------- sidebar ----------
$nav = New-Object System.Text.StringBuilder
foreach ($g in $stages) {
    [void]$nav.AppendLine("    <div class=`"grp`">$($g.Name)</div>")
    foreach ($s in $g.Items) {
        [void]$nav.AppendLine("    <a href=`"$($s.f).html`">$($s.n). $($s.t)</a>")
    }
}
$navAll = $nav.ToString()

# ---------- stage cards ----------
$cardSb = New-Object System.Text.StringBuilder
$stageInfo = $ix.stages
for ($k = 0; $k -lt $stages.Count; $k++) {
    $g    = $stages[$k]
    $info = $stageInfo[$k]
    $no   = '{0:D2}' -f ($k + 1)

    [void]$cardSb.AppendLine("  <div class=`"stageblock`">")
    [void]$cardSb.AppendLine("    <div class=`"sh`"><span class=`"sno`">$no</span><div><div class=`"stt`">$($info.title)</div><div class=`"ssd`">$($info.desc)</div></div><span class=`"scount`">$($g.Items.Count) $($ix.sectionsUnit)</span></div>")
    [void]$cardSb.AppendLine('    <div class="slist">')
    foreach ($s in $g.Items) {
        $blurb = $info.blurbs."$($s.n)"
        [void]$cardSb.AppendLine("      <a href=`"$($s.f).html`"><span class=`"sn`">$($s.n)</span><span class=`"st`">$($s.t)</span><span class=`"sbl`">$blurb</span></a>")
    }
    [void]$cardSb.AppendLine('    </div>')
    [void]$cardSb.AppendLine('  </div>')
}

# ---------- stats ----------
$stats = @(
    @{ v = $secs.Count;                                   l = $ix.statSections },
    @{ v = $ix.statFigures;                               l = $ix.statFiguresLabel },
    @{ v = $ix.statOutputs;                               l = $ix.statOutputsLabel },
    @{ v = $ix.statVersion;                               l = $ix.statVersionLabel }
)
$statSb = New-Object System.Text.StringBuilder
foreach ($st in $stats) {
    [void]$statSb.AppendLine("    <div><b>$($st.v)</b>$($st.l)</div>")
}

# ---------- quick start ----------
$qsSb = New-Object System.Text.StringBuilder
$idx = 0
foreach ($q in $ix.quickstart) {
    $idx++
    $cls = if ($idx -eq 1) { 'qa' } else { 'qb' }
    [void]$qsSb.AppendLine("  <div class=`"$cls`"><h6>$($q.title)</h6><p>$($q.body)</p><a class=`"qgo`" href=`"$($q.link)`">$($q.linkText)</a></div>")
}

$html = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$($ix.pageTitle)</title>
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
$navAll
  </nav>
</aside>
<main>
$defs
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

<script>
$js
</script>
</body>
</html>
"@

$path = Join-Path $outDir 'index.html'
[System.IO.File]::WriteAllText($path, $html, $enc)
"index.html generated: $([math]::Round((Get-Item $path).Length / 1KB, 1)) KB"
