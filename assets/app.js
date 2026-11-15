(() => {
  'use strict';
  const M = window.MEDIA;
  const C = window.CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- язык ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } },
  };
  let lang = (() => {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ru' || q === 'en') return q;
    const s = store.get('lang');
    if (s === 'ru' || s === 'en') return s;
    return (navigator.language || 'ru').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  })();
  const t = (k) => C.ui[lang][k] ?? C.ui.ru[k] ?? k;
  const L = (o) => (o ? o[lang] ?? o.ru : '');

  // ---------- все работы подряд (для окна и переходов) ----------
  const works = [];
  const VIDS = Object.fromEntries((M.videos || []).map((v) => [v.id, v]));
  (C.reels || []).forEach((r) => { if (VIDS[r.id]) works.push({ type: 'reel', id: r.id, r, v: VIDS[r.id] }); });
  M.models.forEach((m) => works.push({ type: '3d', id: m.id, m }));
  C.brands.forEach((b) => works.push({ type: 'brand', id: b.id, b, imgs: M.images[b.key] || [] }));
  C.games.forEach((g) => works.push({ type: 'game', id: g.id, g, imgs: M.images[g.key] || [] }));
  const workIndex = (id) => works.findIndex((w) => w.id === id);
  const prettyName = (s) => s.replace(/_/g, ' ');

  function shotsOf(w) {
    if (w.type === 'reel') return [{ kind: 'video', src: w.v.src, poster: w.v.poster, thumb: w.v.poster, sound: true }];
    if (w.type === '3d') {
      const m = w.m;
      return [
        { kind: 'video', src: m.video, poster: m.poster, thumb: m.poster, label: t('shot_anim') },
        ...m.shots.map((s) => ({
          kind: 'img', src: s.src, thumb: s.thumb, w: s.w, h: s.h,
          label: t('shot_' + s.key),
        })),
      ];
    }
    if (!w.imgs.length) return [{ kind: 'html', html: soonArt(w), thumb: '' }];
    return w.imgs.map((i) => ({ kind: 'img', src: i.src, thumb: i.thumb, w: i.w, h: i.h }));
  }

  function workName(w) {
    if (w.type === '3d') return prettyName(w.m.name);
    if (w.type === 'reel') return L(w.r.name);
    const o = w.b || w.g;
    return lang === 'ru' && o.nameRu ? o.nameRu : o.name;
  }

  // ---------- статичные тексты ----------
  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = lang === 'ru' ? 'EKLIRIK — видео, 3D, брендинг, игры' : 'EKLIRIK — video, 3D, branding, games';
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  // ---------- бегущая лента персонажей ----------
  function renderMarquee() {
    const items = M.models.map((m) =>
      `<button class="mq" type="button" data-work="${esc(m.id)}" tabindex="-1" aria-hidden="true"><img src="${m.card}" alt="" decoding="async" width="${m.cardW}" height="${m.cardH}"></button>`).join('');
    $('#marquee').innerHTML = items + items;
  }

  // ---------- видео для девелоперов ----------
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function renderReels() {
    const list = works.filter((w) => w.type === 'reel');
    $('#heroReels').innerHTML = list.map((w) => `
      <button class="hreel" type="button" data-work="${esc(w.id)}" aria-label="${esc(workName(w))}">
        <video src="${w.v.prev}" poster="${w.v.poster}" muted loop playsinline ${reduceMotion ? '' : 'autoplay'} preload="metadata"></video>
        <span class="hreel__name">${esc(workName(w))}</span>
      </button>`).join('');
    $('#reels').innerHTML = list.map((w, i) => `
      <button class="reel reveal" type="button" data-work="${esc(w.id)}" style="transition-delay:${i * 60}ms">
        <div class="reel__media">
          <img src="${w.v.poster}" alt="${esc(workName(w))}" loading="lazy" decoding="async">
          <video muted loop playsinline preload="none" data-src="${w.v.prev}"></video>
          <span class="reel__play" aria-hidden="true">▶</span>
          <span class="reel__dur">${fmtDur(w.v.dur)}</span>
        </div>
        <div class="reel__body">
          <span class="reel__name">${esc(workName(w))}</span>
          <span class="reel__type">${esc(L(w.r.type))}</span>
        </div>
      </button>`).join('');
  }

  // ---------- 3D ----------
  function render3d() {
    $('#grid3d').innerHTML = M.models.map((m, i) => `
      <button class="c3d reveal" type="button" data-work="${esc(m.id)}" style="transition-delay:${(i % 4) * 60}ms">
        <div class="c3d__media">
          <span class="c3d__badge">${esc(t('shot_anim'))}</span>
          <img class="still" src="${m.card}" alt="${esc(prettyName(m.name))}" loading="lazy" decoding="async" width="${m.cardW}" height="${m.cardH}">
          <video muted loop playsinline preload="none" data-src="${m.video}"></video>
        </div>
        <div class="c3d__body">
          <div class="c3d__name">${esc(prettyName(m.name))}</div>
          <div class="c3d__meta">${m.anims.length} ${esc(t('anims'))} · 4 ${esc(t('styles'))}</div>
        </div>
      </button>`).join('');
    bindVideoCards();
  }

  function playCard(card, on) {
    const v = $('video', card);
    if (!v) return;
    if (on) {
      if (!v.src) v.src = v.dataset.src;
      const p = v.play();
      if (p) p.then(() => card.classList.add('playing')).catch(() => {});
    } else {
      v.pause();
      card.classList.remove('playing');
    }
  }

  let cardObserver;
  function bindVideoCards() {
    const cards = $$('.c3d, .reel');
    if (canHover) {
      cards.forEach((c) => {
        c.addEventListener('pointerenter', () => playCard(c, true));
        c.addEventListener('pointerleave', () => playCard(c, false));
        c.addEventListener('focus', () => playCard(c, true));
        c.addEventListener('blur', () => playCard(c, false));
      });
    } else if ('IntersectionObserver' in window) {
      // на телефоне анимация включается, когда карточка почти целиком на экране
      if (cardObserver) cardObserver.disconnect();
      cardObserver = new IntersectionObserver((ents) => {
        ents.forEach((e) => playCard(e.target, e.intersectionRatio >= 0.7));
      }, { threshold: [0, 0.7] });
      cards.forEach((c) => cardObserver.observe(c));
    }
  }

  // ---------- брендинг ----------
  // заглушка для работы, у которой ещё нет картинок (показывается с меткой «Скоро»)
  function soonArt(w) {
    return `<div class="quark"><div class="quark__orbit"></div><div class="quark__orbit quark__orbit--2"></div><span class="quark__word">${esc(workName(w))}</span></div>`;
  }

  function brandCard(w, feature) {
    const b = w.b;
    const img = w.imgs[0];
    const media = img
      ? `<div class="bcard__img"><img src="${img.card}" alt="${esc(workName(w))}" loading="lazy" decoding="async" width="${img.w}" height="${img.h}"></div>`
      : soonArt(w);
    const soon = !img ? ` <span class="soon">${esc(t('soon'))}</span>` : '';
    return `
      <button class="bcard reveal${feature ? ' bcard--feature' : ''}" type="button" data-work="${esc(w.id)}">
        ${media}
        <div class="bcard__body">
          <span class="bcard__name">${esc(workName(w))}${soon}</span>
          <span class="bcard__type">${esc(L(b.type))}</span>
        </div>
      </button>`;
  }

  function renderBrands() {
    const list = works.filter((w) => w.type === 'brand');
    $('#brands').innerHTML = list.map((w) => brandCard(w, false)).join('');
  }

  // ---------- игры ----------
  function renderGames() {
    $('#gamesList').innerHTML = works.filter((w) => w.type === 'game').map((w) => {
      const g = w.g;
      const cover = w.imgs[0];
      const strip = w.imgs.slice(1, 4).map((i) => `<img src="${i.thumb}" alt="" loading="lazy">`).join('');
      return `
        <article class="game reveal">
          <button class="game__media" type="button" data-work="${esc(w.id)}" aria-label="${esc(g.name)}">
            <img src="${cover.card}" alt="${esc(g.name)}" loading="lazy" decoding="async" width="${cover.w}" height="${cover.h}">
            <span class="game__strip">${strip}</span>
          </button>
          <div class="game__body">
            <span class="game__tag">${esc(L(g.tagline))}</span>
            <h3>${esc(g.name)}</h3>
            <p>${esc(L(g.desc))}</p>
            <ul>${L(g.features).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
            <button class="btn btn--accent" type="button" data-work="${esc(w.id)}">${esc(t('more'))} →</button>
          </div>
        </article>`;
    }).join('');
  }

  // ---------- музыкальные YouTube-каналы (ссылки наружу) ----------
  function renderMusic() {
    $('#channels').innerHTML = (C.music || []).map((c) => `
      <a class="chan reveal" href="${esc(c.url)}" target="_blank" rel="noopener">
        <div class="chan__img"><img src="${esc(c.cover)}" alt="${esc(c.name)}" loading="lazy" decoding="async"><span class="chan__yt" aria-hidden="true">▶</span></div>
        <div class="chan__body">
          <span class="chan__type">${esc(L(c.type))}</span>
          <h3>${esc(c.name)}</h3>
          <p>${esc(L(c.desc))}</p>
          <span class="chan__link">${esc(t('yt_open'))} ↗</span>
        </div>
      </a>`).join('');
  }

  // ---------- контакты ----------
  function renderContacts() {
    const c = C.contacts;
    let html = '';
    if (c.telegram) html += `<a class="btn btn--dark" href="https://t.me/${encodeURIComponent(c.telegram)}" target="_blank" rel="noopener">${esc(t('contact_tg'))} →</a>`;
    if (c.email) html += `<a class="btn btn--line" href="mailto:${esc(c.email)}">${esc(t('contact_mail'))}</a>`;
    $('#contactBtns').innerHTML = html;
  }

  // ---------- появление при прокрутке ----------
  let revealObs;
  function watchReveal() {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver((ents) => ents.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      }), { rootMargin: '0px 0px -8% 0px' });
    }
    els.forEach((e) => revealObs.observe(e));
  }

  function renderAll() {
    applyStatic();
    renderReels();
    render3d();
    renderBrands();
    renderGames();
    renderMusic();
    renderContacts();
    watchReveal();
    if (modalState.wi >= 0 && !modal.hidden) openWork(modalState.wi, modalState.si, false);
  }

  // ---------- шапка ----------
  const top = $('#top');
  const darkSections = [$('#hero'), $('#games')];
  const navLinks = $$('.nav a');
  function onScroll() {
    top.classList.toggle('scrolled', scrollY > 24);
    const y = 64;
    const overDark = darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    top.classList.toggle('on-dark', overDark);
    let active = '';
    $$('main > section[id]').forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= innerHeight * 0.4) active = s.id; });
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
  }
  addEventListener('scroll', onScroll, { passive: true });

  // ---------- окно просмотра ----------
  const modal = $('#modal');
  const box = $('.modal__box', modal);
  const stage = $('#stage');
  const inner = $('#stageInner');
  const thumbs = $('#thumbs');
  const info = $('#info');
  const tools = $('.tools', modal);
  const hint = $('#hint');
  const modalState = { wi: -1, si: 0, shots: [] };
  let lastFocus = null;

  function infoHtml(w) {
    const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    const chips = (items) => `<div class="chips">${items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>`;
    let h = '';
    if (w.type === 'reel') {
      const r = w.r;
      h += `<p class="kicker">${esc(t('label_video'))}</p><h2 id="mTitle">${esc(workName(w))}</h2>`;
      h += `<p class="info__sub">${esc(L(r.type))} · ${w.v.dur} ${esc(t('sec'))}</p>`;
      h += `<p class="info__desc">${esc(L(r.desc))}</p>`;
      h += `<h4>${esc(t('m_done'))}</h4>${chips(L(r.deliv))}`;
    } else if (w.type === '3d') {
      const m = w.m;
      const d = m[lang] || m.ru;
      h += `<p class="kicker">${esc(t('label_3d'))}</p><h2 id="mTitle">${esc(prettyName(m.name))}</h2>`;
      h += `<p class="info__sub">${esc(t('styles_list'))}</p>`;
      h += `<div class="facts"><div class="fact"><b>${m.anims.length}</b><span>${esc(t('anims'))}</span></div>`
        + `<div class="fact"><b>4</b><span>${esc(t('styles'))}</span></div>`
        + `<div class="fact"><b>${esc(m.bones)}</b><span>${esc(t('bones'))}</span></div></div>`;
      h += `<p class="info__desc">${esc(d.desc)}</p>`;
      h += `<h4>${esc(t('m_anims'))}</h4>${chips(m.anims)}`;
      h += `<h4>${esc(t('m_included'))}</h4>${list(d.included)}`;
    } else if (w.type === 'brand') {
      const b = w.b;
      h += `<p class="kicker">${esc(t(b.kind === 'logo' ? 'label_logo' : 'label_brand'))}</p><h2 id="mTitle">${esc(workName(w))}</h2>`;
      h += `<p class="info__sub">${esc(L(b.type))}${w.imgs.length ? '' : ` · <span class="soon">${esc(t('soon'))}</span>`}</p>`;
      h += `<p class="info__desc">${esc(L(b.desc))}</p>`;
      h += `<h4>${esc(t('m_deliv'))}</h4>${chips(L(b.deliv))}`;
    } else {
      const g = w.g;
      h += `<p class="kicker">${esc(t('label_game'))}</p><h2 id="mTitle">${esc(g.name)}</h2>`;
      h += `<p class="info__sub">${esc(L(g.tagline))}</p>`;
      h += `<p class="info__desc">${esc(L(g.desc))}</p>`;
      h += `<h4>${esc(t('m_features'))}</h4>${list(L(g.features))}`;
      h += `<h4>${esc(t('m_role'))}</h4>${chips(L(g.role))}`;
    }
    h += `<div class="info__nav"><button type="button" data-step="-1">← ${esc(t('m_prev'))}</button><button type="button" data-step="1">${esc(t('m_next'))} →</button></div>`;
    return h;
  }

  function openWork(wi, si = 0, push = true) {
    const w = works[wi];
    if (!w) return;
    const wasHidden = modal.hidden;
    modalState.wi = wi;
    modalState.shots = shotsOf(w);
    info.innerHTML = infoHtml(w);
    info.scrollTop = 0;
    thumbs.innerHTML = modalState.shots.map((s, i) => `
      <button type="button" data-shot="${i}" aria-label="${i + 1}">
        ${s.thumb ? `<img src="${s.thumb}" alt="" loading="lazy">` : ''}${s.label ? `<span>${esc(s.label)}</span>` : ''}
      </button>`).join('');
    thumbs.hidden = modalState.shots.length < 2;
    $('#shotPrev').hidden = $('#shotNext').hidden = modalState.shots.length < 2;
    showShot(Math.min(si, modalState.shots.length - 1));
    if (wasHidden) {
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('lock');
      $('#mClose').focus({ preventScroll: true });
      hint.style.opacity = 1;
      clearTimeout(hint._t);
      hint._t = setTimeout(() => { hint.style.opacity = 0; }, 4000);
    }
    const hash = '#w=' + encodeURIComponent(w.id);
    if (push && wasHidden) history.pushState({ w: w.id }, '', hash);
    else if (location.hash !== hash) history.replaceState({ w: w.id }, '', hash);
  }

  function hideModal() {
    if (modal.hidden) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    box.classList.remove('full');
    const v = $('video', inner);
    if (v) v.pause();
    modal.hidden = true;
    inner.innerHTML = '';
    modalState.wi = -1;
    document.body.classList.remove('lock');
    if (location.hash.startsWith('#w=')) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function closeModal() {
    if (history.state && history.state.w) history.back();
    else hideModal();
  }

  addEventListener('popstate', (e) => {
    const id = e.state && e.state.w;
    const wi = id ? workIndex(id) : -1;
    if (wi >= 0) openWork(wi, 0, false);
    else hideModal();
  });

  function showShot(i) {
    const n = modalState.shots.length;
    i = (i + n) % n;
    modalState.si = i;
    const s = modalState.shots[i];
    resetZoom(false);
    stage.classList.toggle('is-video', s.kind !== 'img');
    tools.hidden = s.kind !== 'img';
    hint.textContent = s.kind === 'img' ? t(canHover ? 'm_hint' : 'm_hint_touch') : '';
    if (s.kind === 'video') {
      inner.innerHTML = `<video src="${s.src}" poster="${s.poster}" ${s.sound ? '' : 'muted'} loop playsinline controls></video>`;
      // ролик со звуком: если браузер не даёт играть со звуком, запускаем без звука
      const v = $('video', inner);
      const p = v.play();
      if (p) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
    } else if (s.kind === 'html') {
      inner.innerHTML = s.html;
    } else {
      inner.innerHTML = `<img src="${s.src}" alt="" width="${s.w}" height="${s.h}" draggable="false">`;
      const nx = modalState.shots[(i + 1) % n];
      if (nx && nx.kind === 'img') { const p = new Image(); p.src = nx.src; }
    }
    $$('button', thumbs).forEach((b, k) => {
      b.setAttribute('aria-current', String(k === i));
      if (k === i) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }

  // ----- зум и перемещение -----
  const z = { s: 1, x: 0, y: 0 };
  const MAX = 6;
  const media = () => $('img', inner);

  function clampPan() {
    const img = media();
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    if (!img) return;
    const ox = img.offsetLeft; const oy = img.offsetTop;
    const iw = img.offsetWidth; const ih = img.offsetHeight;
    const fit = (pos, o, size, view) => {
      const sz = size * z.s;
      if (sz <= view) return (view - sz) / 2 - o * z.s;
      return Math.min(-o * z.s, Math.max(view - (o + size) * z.s, pos));
    };
    z.x = fit(z.x, ox, iw, W);
    z.y = fit(z.y, oy, ih, H);
  }

  function apply(anim) {
    inner.style.transition = anim ? 'transform .25s ease' : 'none';
    inner.style.transform = `translate(${z.x}px, ${z.y}px) scale(${z.s})`;
    stage.classList.toggle('zoomed', z.s > 1.01);
  }

  function zoomAt(px, py, s, anim) {
    s = Math.min(MAX, Math.max(1, s));
    z.x = px - (px - z.x) * (s / z.s);
    z.y = py - (py - z.y) * (s / z.s);
    z.s = s;
    if (s === 1) { z.x = 0; z.y = 0; }
    clampPan();
    apply(anim);
  }

  function resetZoom(anim) { z.s = 1; z.x = 0; z.y = 0; apply(anim); }

  const local = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const isImg = () => modalState.shots[modalState.si] && modalState.shots[modalState.si].kind === 'img';

  stage.addEventListener('wheel', (e) => {
    if (!isImg()) return;
    e.preventDefault();
    const [px, py] = local(e);
    zoomAt(px, py, z.s * Math.exp(-e.deltaY * 0.0018), false);
  }, { passive: false });

  const pts = new Map();
  let drag = null;
  let pinch = null;
  let lastTap = 0;

  stage.addEventListener('pointerdown', (e) => {
    if (!isImg() || e.button > 0) return;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, local(e));
    if (pts.size === 1) {
      const [px, py] = pts.get(e.pointerId);
      drag = { px, py, x: z.x, y: z.y, moved: 0, t: Date.now() };
    } else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: z.s };
      drag = null;
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, local(e));
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, pinch.s * (d / pinch.d), false);
    } else if (drag) {
      const [px, py] = pts.get(e.pointerId);
      drag.moved = Math.max(drag.moved, Math.hypot(px - drag.px, py - drag.py));
      if (z.s > 1.01) {
        stage.classList.add('dragging');
        z.x = drag.x + (px - drag.px);
        z.y = drag.y + (py - drag.py);
        clampPan();
        apply(false);
      }
    }
  });

  function endPointer(e) {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    stage.classList.remove('dragging');
    if (pinch) { if (pts.size < 2) pinch = null; drag = null; return; }
    if (drag && drag.moved < 6 && Date.now() - drag.t < 400 && e.type === 'pointerup') {
      // клик/касание: увеличить в точке или вернуть к исходному размеру
      const now = Date.now();
      if (e.pointerType !== 'mouse' && now - lastTap > 320) {
        lastTap = now;
        // одиночное касание на телефоне ничего не делает — ждём второе
      } else {
        lastTap = 0;
        if (z.s > 1.01) resetZoom(true);
        else zoomAt(drag.px, drag.py, 2.6, true);
      }
    }
    drag = null;
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  const center = () => [stage.clientWidth / 2, stage.clientHeight / 2];
  $('#zIn').addEventListener('click', () => zoomAt(...center(), z.s * 1.6, true));
  $('#zOut').addEventListener('click', () => zoomAt(...center(), z.s / 1.6, true));
  $('#zFit').addEventListener('click', () => resetZoom(true));
  $('#zFull').addEventListener('click', () => {
    const on = !box.classList.contains('full');
    box.classList.toggle('full', on);
    if (on && box.requestFullscreen) box.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setTimeout(() => resetZoom(false), 60);
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) box.classList.remove('full');
    resetZoom(false);
  });
  addEventListener('resize', () => { if (!modal.hidden) resetZoom(false); });

  $('#shotPrev').addEventListener('click', () => showShot(modalState.si - 1));
  $('#shotNext').addEventListener('click', () => showShot(modalState.si + 1));
  $('#mClose').addEventListener('click', closeModal);
  thumbs.addEventListener('click', (e) => { const b = e.target.closest('[data-shot]'); if (b) showShot(+b.dataset.shot); });
  info.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    const n = works.length;
    openWork((modalState.wi + +b.dataset.step + n) % n, 0, false);
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { if (!document.fullscreenElement) closeModal(); }
    else if (e.key === 'ArrowRight') showShot(modalState.si + 1);
    else if (e.key === 'ArrowLeft') showShot(modalState.si - 1);
    else if ((e.key === '+' || e.key === '=') && isImg()) zoomAt(...center(), z.s * 1.6, true);
    else if (e.key === '-' && isImg()) zoomAt(...center(), z.s / 1.6, true);
    else if (e.key === 'Tab') {
      // фокус остаётся внутри окна
      const f = $$('button:not([hidden]), video[controls]', box).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // открытие по клику на любую карточку
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-work]');
    if (!el || modal.contains(el)) return;
    const wi = workIndex(el.dataset.work);
    if (wi >= 0) openWork(wi, 0, true);
  });

  // ---------- переключение языка ----------
  $$('.lang button').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    store.set('lang', lang);
    const u = new URL(location.href);
    if (u.searchParams.has('lang')) { u.searchParams.set('lang', lang); history.replaceState(history.state, '', u); }
    renderAll();
  }));

  // ---------- статистика посещений (Яндекс Метрика) ----------
  const metrika = C.analytics && C.analytics.metrika;
  if (metrika) {
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(s);
    window.ym(Number(metrika), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackHash: true });
  }

  // ---------- старт ----------
  renderMarquee();
  renderAll();
  onScroll();
  const m = location.hash.match(/^#w=(.+)$/);
  if (m) {
    const wi = workIndex(decodeURIComponent(m[1]));
    if (wi >= 0) { openWork(wi, 0, false); history.replaceState(null, '', location.pathname + location.search); history.pushState({ w: works[wi].id }, '', location.hash || '#w=' + m[1]); }
  }
})();
