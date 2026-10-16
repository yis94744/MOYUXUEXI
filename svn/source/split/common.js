
(function () {
  'use strict';

  /* ============================================================
     1. 代码块增强：语法高亮 + 复制按钮 + 换行切换
     ============================================================ */

  // 极简高亮器：只处理注释、字符串、SVN 命令、选项
  function escapeHtml(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(code) {
    var lines = code.split('\n');
    var out = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var indented = escapeHtml(line);

      // 整行注释（# 或 rem 或 :: 开头）
      if (/^\s*(#|rem\s|::)/i.test(line) && !/^\s*#!/.test(line)) {
        out.push('<span class="c">' + indented + '</span>');
        continue;
      }

      // 行内注释：找到未被引号包裹的 #
      var result = '';
      var inStr = false;
      var strChar = '';
      var commentStart = -1;

      for (var j = 0; j < line.length; j++) {
        var ch = line[j];
        if (!inStr && (ch === '"' || ch === "'")) {
          inStr = true;
          strChar = ch;
        } else if (inStr && ch === strChar) {
          if (line[j - 1] !== '\\') inStr = false;
        } else if (!inStr && ch === '#' && j > 0 && line[j - 1] === ' ' && /^\s*#/.test(line.slice(j)) === false) {
          commentStart = j;
          break;
        }
      }

      var codePart = commentStart >= 0 ? line.slice(0, commentStart) : line;
      var commentPart = commentStart >= 0 ? line.slice(commentStart) : '';
      var esc = escapeHtml(codePart);

      // 字符串
      esc = esc.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="s">$1</span>');
      // 注释里的 svn 命令名（行首后的第一个词）
      esc = esc.replace(/^(\s*)(svn|svnadmin|svnserve|svnlook|svndumpfilter|svnrdump|svnauthz|svnmucc|sc|find|curl|mail|tar|export|cd|set|echo|if|for|chmod|xargs|grep|awk|sudo)\b/,
        '$1<span class="k">$2</span>');
      // 长选项
      esc = esc.replace(/(\s)(--?[a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="a">$2</span>');
      // 数字（版本号之类）
      esc = esc.replace(/\b(r\d+)\b/g, '<span class="m">$1</span>');

      result = esc;
      if (commentPart) result += '<span class="c">' + escapeHtml(commentPart) + '</span>';
      out.push(result);
    }
    return out.join('\n');
  }

  // 处理所有 codewrap 里的 pre.code
  var wraps = document.querySelectorAll('.codewrap');

  Array.prototype.forEach.call(wraps, function (wrap) {
    var pre = wrap.querySelector('pre.code');
    if (!pre) return;

    // 如果代码块里已经有手工写好的语法着色 span，就原样保留，不再重复处理
    var alreadyStyled = pre.querySelector('span');
    if (!alreadyStyled) {
      var raw = pre.textContent;
      var codeEl = pre.querySelector('code') || pre;
      codeEl.innerHTML = highlight(raw);
    }

    // 加复制按钮（若无）
    var acts = wrap.querySelector('.acts');
    if (acts && !acts.querySelector('[data-copy]')) {
      var b = document.createElement('button');
      b.setAttribute('data-copy', '');
      b.textContent = '复制';
      acts.appendChild(b);
    }
  });

  // 复制功能
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]');
    if (!btn) return;

    var wrap = btn.closest('.codewrap') || btn.closest('.term');
    if (!wrap) return;
    var pre = wrap.querySelector('pre');
    if (!pre) return;

    var text = pre.textContent;

    function done() {
      btn.textContent = '已复制';
      btn.classList.add('ok');
      setTimeout(function () {
        btn.textContent = '复制';
        btn.classList.remove('ok');
      }, 1400);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
    } else {
      fallback(text, done);
    }
  });

  function fallback(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (err) { /* 静默失败 */ }
  }

  /* ============================================================
     2. 进度条 + 回到顶部
     ============================================================ */
  var prog = document.getElementById('prog');
  var topBtn = document.getElementById('top');

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    if (prog) prog.style.width = pct + '%';
    if (topBtn) {
      if ((h.scrollTop || document.body.scrollTop) > 600) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (topBtn) {
    topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  /* ============================================================
     3. 导航高亮：滚动时自动标记当前小节
     ============================================================ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  var sections = navLinks.map(function (a) {
    var id = a.getAttribute('href');
    return { el: id && id.length > 1 ? document.querySelector(id) : null, a: a };
  }).filter(function (s) { return s.el; });

  function highlightNav() {
    var pos = window.scrollY + 140;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= pos) current = sections[i];
    }
    navLinks.forEach(function (a) { a.classList.remove('on'); });
    if (current) {
      current.a.classList.add('on');
      // 让当前项在侧栏可见
      var box = current.a.parentElement;
      if (box && box.scrollHeight > box.clientHeight) {
        var aTop = current.a.offsetTop;
        if (aTop < box.scrollTop || aTop > box.scrollTop + box.clientHeight - 60) {
          box.scrollTop = aTop - box.clientHeight / 2;
        }
      }
    }
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ============================================================
     4. 表格首列若为空白则隐藏（防止空单元格）
     ============================================================ */
  Array.prototype.forEach.call(document.querySelectorAll('table'), function (t) {
    var firstTh = t.querySelector('thead th');
    var firstTd = t.querySelector('tbody td');
    if (firstTh && firstTd && !firstTh.textContent.trim() && !firstTd.textContent.trim()) {
      Array.prototype.forEach.call(t.querySelectorAll('tr'), function (tr) {
        var c = tr.querySelector('th, td');
        if (c) c.style.display = 'none';
      });
    }
  });

})();
