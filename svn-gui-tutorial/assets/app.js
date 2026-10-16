/* ==========================================================================
   SVN 图形化教程 · 交互脚本
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. 图片灯箱：点击放大截图 ---------- */
  var lb = document.getElementById('lb');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lb';
    lb.innerHTML = '<span class="close">&times;</span><img alt="放大查看">';
    document.body.appendChild(lb);

    lb.addEventListener('click', function () { lb.classList.remove('on'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.classList.remove('on');
    });
  }

  document.addEventListener('click', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG') return;
    // 只放大教程截图，不动图标小图
    if (img.closest('.iconrow')) return;
    if (img.closest('#lb')) return;

    var big = img.getAttribute('data-full') || img.getAttribute('src');
    lb.querySelector('img').setAttribute('src', big);
    lb.classList.add('on');
    e.preventDefault();
  });

  /* ---------- 2. 进度条 + 回到顶部 ---------- */
  var prog = document.getElementById('prog');
  var topBtn = document.getElementById('top');

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var top = h.scrollTop || document.body.scrollTop;
    if (prog) prog.style.width = (max > 0 ? top / max * 100 : 0) + '%';
    if (topBtn) topBtn.classList.toggle('show', top > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (topBtn) {
    topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  /* ---------- 3. 侧栏当前项高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav a[href$=".html"]'));
  var entries = navLinks.map(function (a) {
    var href = a.getAttribute('href');
    // 当前页文件名
    var here = location.pathname.split('/').pop() || 'index.html';
    return { a: a, active: href === here };
  });

  var cur = entries.filter(function (x) { return x.active; })[0];
  if (cur) {
    cur.a.classList.add('on');
    // 让它滚进可视区
    var box = cur.a.parentElement;
    if (box && box.scrollHeight > box.clientHeight) {
      var t = cur.a.offsetTop;
      if (t < box.scrollTop || t > box.scrollTop + box.clientHeight - 60) {
        box.scrollTop = t - box.clientHeight / 2;
      }
    }
  }

  /* ---------- 4. 长页面的小节内导航高亮（仅当页内有锚点） ---------- */
  var anchors = Array.prototype.slice.call(document.querySelectorAll('#nav a[href^="#"]'));
  if (anchors.length) {
    var secs = anchors.map(function (a) {
      var id = a.getAttribute('href');
      return { a: a, el: id && id.length > 1 ? document.querySelector(id) : null };
    }).filter(function (s) { return s.el; });

    function hl() {
      var pos = window.scrollY + 140, last = null;
      for (var i = 0; i < secs.length; i++) {
        if (secs[i].el.offsetTop <= pos) last = secs[i];
      }
      anchors.forEach(function (a) { a.classList.remove('on'); });
      if (last) last.a.classList.add('on');
    }
    window.addEventListener('scroll', hl, { passive: true });
    hl();
  }

  /* ---------- 5. 表格空首列隐藏 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('table'), function (t) {
    var th = t.querySelector('thead th'), td = t.querySelector('tbody td');
    if (th && td && !th.textContent.trim() && !td.textContent.trim()) {
      Array.prototype.forEach.call(t.querySelectorAll('tr'), function (tr) {
        var c = tr.querySelector('th, td');
        if (c) c.style.display = 'none';
      });
    }
  });

  /* ---------- 6. 图片加载失败时给出提示（避免空白） ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
    img.addEventListener('error', function () {
      var holder = img.parentElement;
      if (holder && !holder.querySelector('.imgerr')) {
        var d = document.createElement('div');
        d.className = 'imgerr';
        d.style.cssText = 'padding:26px;color:#6e7681;font-size:13px;text-align:center';
        d.textContent = '图片无法加载：' + (img.getAttribute('src') || '');
        holder.appendChild(d);
      }
    });
  });

})();
