// Muscle viewer (2026-11-14): anatomy browser (search, groups, layers, isolation), exercises with the computed
// highlight, muscle cards; Russian / English. Libraries are local (lib/), so it works without internet.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('anat.' + k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('anat.' + k, v); } catch (e) { /* private window: not remembered */ } },
};

// ------------------------------------------------------------------ text
const STR = {
  ru: {
    docTitle: 'Анатомия мышц — 3D-просмотрщик', title: 'Мышцы человека',
    hint: 'Наведите курсор на мышцу — название. Щелчок — карточка, Shift+щелчок — добавить к выбору, двойной щелчок — приблизить.',
    tabAnat: 'Анатомия', tabEx: 'Упражнения', tabLayers: 'Слои', tabFace: 'Мимика',
    faceNote: 'Выражения лица по системе FACS. Подсвечены работающие мышцы: ярче — главные, бледнее — помощники. ' +
      'Ползунок — сила выражения.', faceAmount: 'Сила', faceReplay: '▶ Показать ещё раз',
    faceAus: 'Единицы движения (FACS): ', faceJaw: 'рот открыт на {0}°', roleMain: 'главная', roleHelp: 'помощник',
    searchPh: 'Найти мышцу: по-русски, на латыни или по-английски', noFound: 'Ничего не найдено',
    showGroup: 'Показывать группу на модели',
    rest: 'Покой (без движения)', kind_sport: 'Спорт и фитнес', kind_rehab: 'Реабилитация (упражнения)', kg: 'кг',
    kind_gait: 'Ходьба и бег (на беговой дорожке)',
    ph_contact: 'опора — приём веса', ph_mid: 'опора — середина', ph_push: 'опора — толчок', ph_swing: 'перенос',
    phLine: 'Левая нога: {0}. Правая: {1}.', phFlight: 'Фаза полёта: обе ноги в воздухе.',
    gaitInfo: 'Дорожка {0} км/ч · {1} шагов в минуту · длина двойного шага {2} м',
    checksGait: 'Посчитано по нормам биомеханики шага (Winter, Perry; бег — Novacheck): углы суставов, перекат стопы ' +
      'пятка → носок, опора и полёт. Пик силы опоры — {0} веса тела.',
    speed: 'Скорость', fade: 'Приглушить неработающие мышцы',
    colorH: 'Цвет', weak: 'слабо', strong: 'сильно', stretched: 'растягивается, не работает',
    peakH: 'Главные мышцы упражнения',
    checks: 'Проверено в каждом кадре: равновесие держится (наименьший запас {0} см), гантели не задевают тело, ' +
      'нагрузка в пределах силы среднего мужчины.',
    checksBodyweight: 'Проверено в каждом кадре: равновесие держится (наименьший запас {0} см), нагрузка в пределах ' +
      'силы среднего мужчины.',
    overload: 'Нагрузка выше силы среднего мужчины: {0}',
    overloadGait: 'На мгновение у предела силы: {0}. Модель упрощена: стопа и пальцы жёсткие, упругость сухожилий не ' +
      'учтена (у бегуна ахиллово сухожилие отдаёт часть толчка).',
    infoH: 'Информация', workNow: 'Работают сейчас', ligaments: 'почти всё держат связки и равновесие',
    w2: 'сокращается', w1: 'держит', w0: 'тормозит на растяжении',
    balOk: 'Равновесие: держит (запас {0} см)', balBad: 'Равновесие: падает',
    hangOk: 'Вис: центр масс под перекладиной (запас {0} см)',
    checksHang: 'Проверено в каждом кадре: тело висит ровно, центр масс под перекладиной (наименьший запас {0} см), ' +
      'кисти не сдвигаются по ней.',
    layersNote: 'Снимайте слои, чтобы увидеть мышцы под поверхностными: для изучения анатомии и массажа.',
    layersH: 'Слои мышц', L_superficial: 'Поверхностный', L_middle: 'Средний', L_deep: 'Глубокий',
    layAll: 'Все', layNoSup: 'Без верхнего', layDeep: 'Только глубокий',
    ghostLayers: 'Снятые слои — полупрозрачные', bonesH: 'Кости', bones: 'Показывать кости',
    sideH: 'Сторона тела', sideBoth: 'Обе', sideL: 'Левая', sideR: 'Правая',
    cardH: 'Карточка мышцы', cardHint: 'Щёлкните по мышце на модели или выберите её на вкладке «Анатомия».',
    origin: 'Начало', insertion: 'Прикрепление', func: 'Функция', nerve: 'Иннервация',
    actions: 'Движения (по Wikipedia, ExRx, Kenhub)', inEx: 'В упражнениях модели',
    notInEx: 'в упражнениях модели почти не работает', groupMuscles: 'Мышцы группы',
    main: 'главная', helps: 'помогает', weakRole: 'слабо',
    left: 'левая', right: 'правая',
    works: 'работает {0}', lv1: 'слабо', lv2: 'умеренно', lv3: 'сильно', lv4: 'очень сильно', antag: 'растягивается (антагонист)', idle: 'не работает',
    selected: 'Выбрано:', bIso: 'Только выбранные', bIsoOff: 'Показать остальные', bHide: 'Скрыть',
    bFocus: 'Приблизить', bClear: 'Снять выбор',
    vFront: 'Спереди', vBack: 'Сзади', vLeft: 'Слева', vRight: 'Справа', vBelow: 'Снизу', vHome: 'Весь рост', vHead: 'Голова',
    bShot: 'Снимок',
    bHelp: 'Управление', bShowAll: 'Показать скрытые ({0})', min: 'Свернуть / развернуть',
    exStop: '■ Закончить упражнение', pause: 'Пауза', play: 'Продолжить',
    layNone: 'Только скелет',
    boneHintOff: 'Снимите все слои мышц (кнопка «Только скелет») — тогда при наведении на кость появится её название.',
    boneHintOn: 'Наведите курсор на кость — появится её название.',
    sideOfL: 'левая сторона', sideOfR: 'правая сторона',
    langBtn: '🌐 English', langTip: 'Switch to English',
    hTop: 'голова', hBot: 'стопы',
    hbarTip: 'Вверх-вниз по телу: тяните бегунок или крутите колесо над полосой (Shift + колесо, стрелки ↑ ↓)',
    helpH: 'Управление',
    help: ['Вращать модель — левая кнопка мыши или один палец.',
      'Сдвигать — правая кнопка мыши или два пальца.',
      'Приближать — колесо мыши или щипок: приближается то место, на которое указывает курсор (например, лицо).',
      'Вверх-вниз по телу (от стоп до головы) — полоса с бегунком справа, Shift + колесо или стрелки ↑ ↓.',
      'Кнопка «Голова» — лицо крупным планом.',
      'Щелчок по мышце — карточка. Shift или Ctrl + щелчок — добавить к выбору.',
      'Двойной щелчок — приблизить выбранное.',
      'Клавиши: Esc — снять выбор, пробел — пауза, F — приблизить, H — скрыть выбранное.'],
    foot: 'Учебная модель, не диагностика и не лечение. Подсветка в упражнениях — оценка по механике движения ' +
      '(упрощённая обратная динамика).',
    attr: 'Геометрия: {0}.', loadingPct: 'Загрузка модели… {0}%',
    noWebGL: 'Не удалось запустить 3D (WebGL 2). Откройте просмотрщик в свежем Chrome, Edge, Firefox или Safari.',
    loadFail: 'Не удалось загрузить модель. Запустите просмотрщик файлом open_viewer.bat (Windows) или ' +
      'open_viewer.command (Mac).',
    shot: 'anatomy',
    demoBadge: 'ДЕМО', demoTitle: ' — демо-версия',
    demoNote: 'Демо-версия. Анатомия, карточки мышц и слои — полностью; упражнения и мимика — по три на выбор.',
    demoBuy: 'Полная версия →', demoLocked: 'Только в полной версии',
    demoLoadFail: 'Не удалось загрузить модель. Обновите страницу.',
  },
  en: {
    docTitle: 'Muscle anatomy — 3D viewer', title: 'Human muscles',
    hint: 'Hover over a muscle to see its name. Click: card, Shift+click: add to the selection, double-click: zoom in.',
    tabAnat: 'Anatomy', tabEx: 'Exercises', tabLayers: 'Layers', tabFace: 'Expressions',
    faceNote: 'Facial expressions by FACS. The working muscles are lit: brighter - main, paler - helpers. ' +
      'The slider sets the strength.', faceAmount: 'Strength', faceReplay: '▶ Show again',
    faceAus: 'Action units (FACS): ', faceJaw: 'mouth open {0}°', roleMain: 'main', roleHelp: 'helper',
    searchPh: 'Find a muscle (English, Latin or Russian)', noFound: 'Nothing found',
    showGroup: 'Show the group on the model',
    rest: 'Rest (no motion)', kind_sport: 'Sport and fitness', kind_rehab: 'Rehabilitation (exercises)', kg: 'kg',
    kind_gait: 'Walking and running (on a treadmill)',
    ph_contact: 'stance - loading', ph_mid: 'stance - mid-stance', ph_push: 'stance - push-off', ph_swing: 'swing',
    phLine: 'Left leg: {0}. Right: {1}.', phFlight: 'Flight phase: both feet off the ground.',
    gaitInfo: 'Treadmill {0} km/h · {1} steps per minute · stride {2} m',
    checksGait: 'Built from the norms of gait biomechanics (Winter, Perry; running - Novacheck): joint angles, the foot ' +
      'rolling heel -> toe, stance and flight. Peak ground force {0} body weights.',
    speed: 'Speed', fade: 'Fade the muscles that do not work',
    colorH: 'Colour', weak: 'light', strong: 'hard', stretched: 'stretched, not working',
    peakH: 'Main muscles of the exercise',
    checks: 'Checked in every frame: the body keeps its balance (smallest margin {0} cm), the dumbbells do not touch ' +
      'the body, the load stays within the strength of an average man.',
    checksBodyweight: 'Checked in every frame: the body keeps its balance (smallest margin {0} cm), the load stays ' +
      'within the strength of an average man.',
    overload: 'Load above the strength of an average man: {0}',
    overloadGait: 'Briefly at the strength limit: {0}. Simplified model: the foot and toes are rigid, tendon ' +
      'elasticity is not counted (a runner\'s Achilles tendon returns part of the push).',
    infoH: 'Information', workNow: 'Working now', ligaments: 'ligaments and balance carry almost everything',
    w2: 'shortening', w1: 'holding', w0: 'braking while stretched',
    balOk: 'Balance: stable (margin {0} cm)', balBad: 'Balance: falling',
    hangOk: 'Hanging: centre of mass under the bar (margin {0} cm)',
    checksHang: 'Checked in every frame: the body hangs still, its centre of mass under the bar (smallest margin {0} ' +
      'cm), the hands do not slide on it.',
    layersNote: 'Peel the layers to see the muscles under the superficial ones: for anatomy study and massage.',
    layersH: 'Muscle layers', L_superficial: 'Superficial', L_middle: 'Middle', L_deep: 'Deep',
    layAll: 'All', layNoSup: 'Without top', layDeep: 'Deep only',
    ghostLayers: 'Peeled layers stay see-through', bonesH: 'Bones', bones: 'Show the bones',
    sideH: 'Body side', sideBoth: 'Both', sideL: 'Left', sideR: 'Right',
    cardH: 'Muscle card', cardHint: 'Click a muscle on the model or pick it on the Anatomy tab.',
    origin: 'Origin', insertion: 'Insertion', func: 'Function', nerve: 'Innervation',
    actions: 'Actions (per Wikipedia, ExRx, Kenhub)', inEx: 'In the model exercises',
    notInEx: 'almost idle in the model exercises', groupMuscles: 'Muscles of the group',
    main: 'prime mover', helps: 'assists', weakRole: 'minor',
    left: 'left', right: 'right',
    works: 'working {0}', lv1: 'lightly', lv2: 'moderately', lv3: 'hard', lv4: 'very hard', antag: 'stretched (antagonist)', idle: 'not working',
    selected: 'Selected:', bIso: 'Selected only', bIsoOff: 'Show the others', bHide: 'Hide',
    bFocus: 'Zoom in', bClear: 'Clear',
    vFront: 'Front', vBack: 'Back', vLeft: 'Left', vRight: 'Right', vBelow: 'Below', vHome: 'Full body', vHead: 'Head',
    bShot: 'Screenshot',
    bHelp: 'Controls', bShowAll: 'Show hidden ({0})', min: 'Collapse / expand',
    exStop: '■ Stop the exercise', pause: 'Pause', play: 'Play',
    layNone: 'Skeleton only',
    boneHintOff: 'Switch all the muscle layers off (the “Skeleton only” button) to see the name of the bone under ' +
      'the cursor.',
    boneHintOn: 'Hover over a bone to see its name.',
    sideOfL: 'left side', sideOfR: 'right side',
    langBtn: '🌐 Русский', langTip: 'Переключить на русский',
    hTop: 'head', hBot: 'feet',
    hbarTip: 'Up and down the body: drag the handle or turn the wheel over the bar (Shift + wheel, arrow keys)',
    helpH: 'Controls',
    help: ['Rotate: left mouse button or one finger.', 'Pan: right mouse button or two fingers.',
      'Zoom: mouse wheel or pinch - towards the point under the cursor (the face, for example).',
      'Up and down the body (feet to head): the bar with the handle on the right, Shift + wheel or the arrow keys.',
      'The Head button: the face close up.',
      'Click a muscle: card. Shift or Ctrl + click: add to the selection.',
      'Double-click: zoom in on the selection.',
      'Keys: Esc clears the selection, Space pauses, F zooms in, H hides the selection.'],
    foot: 'Educational model, not for diagnosis or treatment. The exercise highlight is an estimate from the ' +
      'mechanics of the motion (simplified inverse dynamics).',
    attr: 'Geometry: {0}.', loadingPct: 'Loading the model… {0}%',
    noWebGL: 'Could not start 3D (WebGL 2). Open the viewer in a recent Chrome, Edge, Firefox or Safari.',
    loadFail: 'Could not load the model. Start the viewer with open_viewer.bat (Windows) or open_viewer.command (Mac).',
    shot: 'anatomy',
    demoBadge: 'DEMO', demoTitle: ' — demo',
    demoNote: 'Demo version. Anatomy, muscle cards and layers in full; three exercises and three facial expressions.',
    demoBuy: 'Full version →', demoLocked: 'Full version only',
    demoLoadFail: 'Could not load the model. Reload the page.',
  },
};
// 2026-11-18: the website demo (tools/make_demo.py) puts data.demo into data.json: a scrambled, split model, a few
// exercises and expressions, the rest listed as locked. Without data.demo (the product) nothing below changes.
let DEMO = null;
const qs = new URLSearchParams(location.search);
let lang = qs.get('lang') || store.get('lang', /^(ru|uk|be|kk)/i.test(navigator.language || '') ? 'ru' : 'en');
if (!STR[lang]) lang = 'ru';
const t = (k, ...a) => String(STR[lang][k] ?? STR.ru[k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[+i]);
const num = (x) => (+x).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 1 });
// the highlight is a colour scale of the estimated effort (full colour at 40 % of the joint strength), not a measured
// percentage, so the viewer names a level instead of printing a number
const level = (a) => t(a < 0.25 ? 'lv1' : a < 0.5 ? 'lv2' : a < 0.75 ? 'lv3' : 'lv4');
function nMus(n) {
  if (lang === 'en') return `${n} muscle${n === 1 ? '' : 's'}`;
  const a = n % 10, b = n % 100;
  return `${n} ${a === 1 && b !== 11 ? 'мышца' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'мышцы' : 'мышц'}`;
}
function applyStatic() {
  document.documentElement.lang = lang;
  document.title = t('docTitle');
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-tp]').forEach((el) => { el.placeholder = t(el.dataset.tp); });
  document.querySelectorAll('[data-tt]').forEach((el) => { el.title = t(el.dataset.tt); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  $('bLang').textContent = t('langBtn');
  $('help').innerHTML = `<div class="head"><h1 class="grow">${t('helpH')}</h1><button class="min" id="helpX">×</button></div>
    <ul>${STR[lang].help.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
  $('helpX').onclick = () => { $('help').hidden = true; };
  if (DEMO) renderDemo();
}
applyStatic();
const fail = (msg) => { $('loadtxt').textContent = msg; $('loadbar').parentElement.hidden = true; };

// ------------------------------------------------------------------ data and scene
let data;
// data.json is revalidated on every load; model.glb carries the export stamp (data.build), so a new export is never
// shown with an old cached model
try { data = await (await fetch('data.json', { cache: 'no-cache' })).json(); } catch (e) { fail(t('loadFail')); throw e; }
if (data.demo) { DEMO = data.demo; applyStatic(); }
const nm = (id) => { const r = data.muscles[id] || {}; return (lang === 'en' ? r.en : r.ru) || id; };
const groupById = Object.fromEntries(data.groups.map((g) => [g.id, g]));
const regionById = Object.fromEntries(data.regions.map((r) => [r.id, r]));
const dofLabel = (d) => (lang === 'en' ? data.dofs_en?.[d] : data.dofs[d]) ?? d;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
} catch (e) { fail(t('noWebGL')); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
$('view').appendChild(renderer.domElement);
// after the computer sleeps the graphics card may drop the 3D context: the page would stay empty, so reload it
renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setTimeout(() => location.reload(), 500); });
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0f13);
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.05, 50);
const HOME = { pos: new THREE.Vector3(0.9, 1.25, 3.6), target: new THREE.Vector3(0, 0.95, 0) };
camera.position.copy(HOME.pos);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(HOME.target);
controls.enableDamping = true;
controls.minDistance = 0.25;
controls.maxDistance = 8;
// 2026-11-15 (author: "zoom brings up the belly, I cannot get to the face"): the wheel zooms towards the point under
// the cursor, not towards the centre of the body
controls.zoomToCursor = true;
const hemi = new THREE.HemisphereLight(0xdfe6ff, 0x2a2420, 0.9);
scene.add(hemi);
// 2026-11-17 (author: through the floor from below the body was almost black, the working belly muscles of the
// superman invisible): a light that rides on the camera; from below it and the hemisphere's ground colour rise
// (updateLights), from the usual angles the look stays as before
const headLight = new THREE.DirectionalLight(0xffffff, 0.25);
headLight.position.set(0.3, 0.35, 0);
headLight.target.position.set(0, 0, -1);
camera.add(headLight, headLight.target);
scene.add(camera);
const GROUND_DARK = new THREE.Color(0x2a2420), GROUND_LIT = new THREE.Color(0xa49c94);
function updateLights() {
  const d = Math.max(1e-6, camera.position.distanceTo(controls.target));
  const up = (controls.target.y - camera.position.y) / d;            // 1 = straight from below
  const t = Math.min(1, Math.max(0, (up + 0.05) / 0.55)), below = t * t * (3 - 2 * t);
  headLight.intensity = 0.25 + 1.9 * below;
  hemi.groundColor.copy(GROUND_DARK).lerp(GROUND_LIT, below);
}
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(2.5, 4, 3);
scene.add(key);
const rim = new THREE.DirectionalLight(0xb8c8ff, 1.2);
rim.position.set(-3, 2.5, -3);
scene.add(rim);
const floor = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64),
  new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.95 }));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
// 2026-11-18: a treadmill under the walking / running (exercise.treadmill = belt speed, m/s): the body stays in place,
// the ribbed belt runs back under it at that speed (the model faces +z, the belt moves towards -z)
const BELT_LEN = 1.9, BELT_RIB = 0.5;                  // m; one canvas = 0.5 m of belt (8 ribs)
const treadmill = (() => {
  const cv = document.createElement('canvas');
  cv.width = 32; cv.height = 256;
  const c = cv.getContext('2d');
  c.fillStyle = '#1b1e25'; c.fillRect(0, 0, 32, 256);
  c.fillStyle = '#2c313b'; for (let y = 0; y < 256; y += 32) c.fillRect(0, y, 32, 7);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, BELT_LEN / BELT_RIB);
  const g = new THREE.Group();
  const belt = new THREE.Mesh(new THREE.PlaneGeometry(0.56, BELT_LEN),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
  belt.rotation.x = -Math.PI / 2;
  belt.position.set(0, 0.0015, -0.08);
  g.add(belt);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4a, roughness: 0.6, metalness: 0.2 });
  for (const sx of [-1, 1]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, BELT_LEN), railMat);
    r.position.set(sx * 0.305, 0.0175, -0.08);
    g.add(r);
  }
  g.visible = false;
  g.userData = { tex, pos: 0 };
  scene.add(g);
  return g;
})();
function stepTreadmill(dt) {
  const v = cur?.treadmill;
  treadmill.visible = !!v;
  if (!v || !action || action.paused) return;
  treadmill.userData.pos += dt * v * mixer.timeScale;
  // texture v runs towards -z on the laid-down plane: moving the pattern back = growing offset
  treadmill.userData.tex.offset.y = (treadmill.userData.pos / BELT_RIB) % 1;
}

// ------------------------------------------------------------------ colours (same ramp as the sheets and videos)
const C_IDLE = new THREE.Color(0.66, 0.60, 0.58);      // muscle not working (exercise mode)
const C_RED = new THREE.Color(0.55, 0.10, 0.08);       // anatomy mode
const C_SEL = new THREE.Color('#ffc04d');               // selected (anatomy mode)
const C_BLUE = new THREE.Color().setRGB(30 / 255, 85 / 255, 240 / 255);
const STOPS = [[0, new THREE.Color().setRGB(1, 214 / 255, 60 / 255)], [0.5, new THREE.Color().setRGB(1, 140 / 255, 20 / 255)],
  [1, new THREE.Color().setRGB(235 / 255, 40 / 255, 20 / 255)]];
function heat(a, out) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [p0, c0] = STOPS[i], [p1, c1] = STOPS[i + 1];
    if (a <= p1) return out.copy(c0).lerp(c1, (a - p0) / (p1 - p0));
  }
  return out.copy(STOPS[2][1]);
}
const cssHeat = (a) => '#' + heat(a, new THREE.Color()).getHexString();

function tendonMaterial(color) {
  // both sides drawn (opaque): where a sheet creases in an extreme pose, its inner side fills the crease instead of the
  // black background showing through a slit (2026-11-17)
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.0, side: THREE.DoubleSide });
  // 2026-11-17 (author: the selected epicranial aponeurosis did not light up): a selected / hovered muscle shows its
  // tendon part tinted too (uTendon < 1), otherwise a tendon-only object (the galea) stays plain white
  m.userData.uTendon = { value: 1.0 };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTendon = m.userData.uTendon;
    sh.vertexShader = 'attribute float _tendon;\nvarying float vTendon;\n' +
      sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvTendon = _tendon;');
    // 2026-11-17 (author: black holes on the back in the plank / superman): where a skinned sheet folds over in an
    // extreme pose, the skinned vertex normal points away from the surface the camera sees and the patch was lit from
    // behind (black). The normal is mirrored into the visible side of the real (screen-derived) surface.
    sh.fragmentShader = 'varying float vTendon;\nuniform float uTendon;\n' + sh.fragmentShader.replace('#include <color_fragment>',
      '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.80, 0.80, 0.78), clamp(vTendon, 0.0, 1.0) * uTendon);')
      .replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n' +
        '{ vec3 gN = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));\n' +
        '  float dd = dot(normal, gN);\n  if (dd < 0.0) normal = normalize(normal - 2.0 * dd * gN); }');
  };
  m.customProgramCacheKey = () => 'tendon';
  return m;
}
function setAlpha(mat, a) {          // switching transparency changes the shader, so only when it changes
  const tr = a < 0.999;
  if (mat.transparent !== tr) {    // see-through (ghost / fade): front faces only, or the far side muddies it
    mat.transparent = tr; mat.depthWrite = !tr; mat.side = tr ? THREE.FrontSide : THREE.DoubleSide; mat.needsUpdate = true;
  }
  mat.opacity = a;
}

// ------------------------------------------------------------------ model
const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('./lib/three/examples/jsm/libs/draco/gltf/');
loader.setDRACOLoader(draco);
let gltf;
const loadProgress = (loaded, total) => {
  if (!total) return;
  $('loadbar').style.width = (100 * loaded / total).toFixed(0) + '%';
  $('loadtxt').textContent = t('loadingPct', Math.round(100 * loaded / total));
};
// demo: the model comes in parts, XOR-scrambled with a fixed key stream (xorshift32), so the files are not a ready .glb
async function loadDemoModel(dm) {
  const buf = new Uint8Array(dm.size);
  let got = 0;
  for (const p of dm.parts) {
    const r = await fetch(p + (data.build ? '?b=' + encodeURIComponent(data.build) : ''));
    if (!r.ok) throw new Error(p + ' ' + r.status);
    const rd = r.body.getReader();
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      buf.set(value, got); got += value.length;
      loadProgress(got, dm.size);
    }
  }
  const key = new Uint32Array(1024);
  let x = dm.seed >>> 0;
  for (let i = 0; i < 1024; i++) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; key[i] = x; }
  const w = new Uint32Array(buf.buffer);
  for (let i = 0; i < w.length; i++) w[i] ^= key[i & 1023];
  return buf.buffer.slice(0, dm.len);
}
try {
  if (DEMO?.model) gltf = await loader.parseAsync(await loadDemoModel(DEMO.model), './');
  else {
    gltf = await loader.loadAsync('model.glb' + (data.build ? '?b=' + encodeURIComponent(data.build) : ''),
      (ev) => loadProgress(ev.loaded, ev.total));
  }
} catch (e) { fail(t(DEMO ? 'demoLoadFail' : 'loadFail')); throw e; }
const root = gltf.scene;
scene.add(root);
$('loading').remove();

const objIndex = new Map(data.objects.map((n, i) => [n, i]));
const muscles = [];      // {mesh, name, id, side, idx, group, layer, pickable}
const byId = new Map();
const bones = [];
const boneItems = [];    // 2026-11-16: named bones {mesh, bone: true, name, info}: hover names in the skeleton-only view
const dumbbells = [];
const covers = [];
root.traverse((o) => {
  if (!o.isMesh) return;
  o.frustumCulled = false;                    // skinned meshes move away from their rest bounds
  const name = o.name;
  if (objIndex.has(name)) {
    let id = name, side = '';
    if (!data.muscles[id] && /_[lr]$/.test(name)) { id = name.slice(0, -2); side = name.slice(-1); }
    const row = data.muscles[id] || {};
    o.material = tendonMaterial(C_RED.clone());
    const m = { mesh: o, name, id, side, idx: objIndex.get(name), group: row.group, layer: row.layer || 'superficial',
      pickable: true };
    muscles.push(m);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(m);
  } else if (/^(eye|iris|pupil|cornea)_/.test(name)) {   // the eyes: stay with the muscles, own colours
    const c = name.startsWith('iris') ? 0x6b3a18 : name.startsWith('pupil') ? 0x050505 : 0xe8e4dc;
    o.material = new THREE.MeshStandardMaterial({ color: c, roughness: name.startsWith('cornea') ? 0.05 : 0.35 });
    if (name.startsWith('cornea')) { o.material.transparent = true; o.material.opacity = 0.12; o.material.depthWrite = false; }
    covers.push(o);
  } else if (name.startsWith('cover_')) {      // soft tissue that closes a gap (perineum): stays with the muscles
    o.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.62, 0.57, 0.53), roughness: 0.6 });
    covers.push(o);
  } else if (name.startsWith('dumbbell')) {
    o.material = new THREE.MeshStandardMaterial({ color: 0x15171a, metalness: 0.85, roughness: 0.3 });
    o.visible = false;
    dumbbells.push(o);
  } else if (name.startsWith('bar_')) {        // 2026-11-16: the bar of a hanging exercise (bar_<exercise id>)
    o.material = new THREE.MeshStandardMaterial({ color: 0x8a8d92, metalness: 0.9, roughness: 0.3 });
    o.visible = false;
    dumbbells.push(o);
  } else {
    o.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.86, 0.82, 0.74), roughness: 0.75 });
    bones.push(o);
    const info = data.bones?.[name];
    if (info) boneItems.push({ mesh: o, bone: true, name, info });
  }
});
const groupIds = {};                          // group -> muscle ids in table order
for (const id of Object.keys(data.muscles)) {
  if (!byId.has(id)) continue;
  const g = data.muscles[id].group;
  (groupIds[g] = groupIds[g] || []).push(id);
}
const _b = new THREE.Box3(), _bb = new THREE.Box3(), _v = new THREE.Vector3();
function boxOf(ms) {                          // world box of meshes in their current (animated) pose
  _b.makeEmpty();
  for (const m of ms) {
    const o = m.mesh;
    if (o.isSkinnedMesh) { o.computeBoundingBox(); _bb.copy(o.boundingBox); } else {
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      _bb.copy(o.geometry.boundingBox);
    }
    _b.union(_bb.applyMatrix4(o.matrixWorld));
  }
  return _b;
}
root.updateMatrixWorld(true);
const leftMus = muscles.find((m) => m.side === 'l');
const LEFT_X = leftMus ? Math.sign(boxOf([leftMus]).getCenter(_v).x) || 1 : 1;   // the body's left side is at +x or -x

// ------------------------------------------------------------------ state
const S = {
  sel: new Set(), selKind: null, iso: false, hidden: new Set(), hiddenGroups: new Set(),
  layerOn: { superficial: true, middle: true, deep: true }, ghost: false, side: 'both', bones: true, fade: false,
};
let hovered = null;
const sideOk = (m) => S.side === 'both' || !m.side || m.side === S.side;

// ------------------------------------------------------------------ exercises
const mixer = new THREE.AnimationMixer(root);
const clips = Object.fromEntries(gltf.animations.map((c) => [c.name, c]));
const dec = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const nObj = data.objects.length;
const EX = data.exercises.map((e) => {
  const x = { ...e, A: dec(e.act), N: dec(e.ant), W: dec(e.work) };
  x.P = new Uint8Array(nObj);                 // peak activation of every muscle object over the exercise
  for (let f = 0; f < x.frames; f++) {
    for (let i = 0; i < nObj; i++) { const a = x.A[f * nObj + i]; if (a > x.P[i]) x.P[i] = a; }
  }
  return x;
});
const exTitle = (e) => (lang === 'en' ? e.title_en || e.title : e.title);
const idPeak = (e, id) => Math.max(0, ...(byId.get(id) || []).map((m) => e.P[m.idx]));
let cur = null, action = null, playing = true, lastFrame = -1;
let tabNow = null;
// 2026-11-17 (stage Face): the chosen facial expression, its strength now (amt) and where it is going (target)
const face = { id: null, amt: 0, target: 0 };
const FX = data.expressions || null;

// 2026-11-16 (author): the exercise keeps running on the other tabs; a small bar there pauses or ends it
function updateMotionBar() {
  $('motionbar').hidden = !cur || tabNow === 'ex';
  const pl = playing ? '❚❚ ' + t('pause') : '▶ ' + t('play');
  $('mbPlay').textContent = pl;
  $('play').textContent = playing ? '❚❚' : '▶';
  if (cur) $('mbName').textContent = exTitle(cur);
}
$('mbPlay').onclick = () => togglePlay();
$('mbStop').onclick = () => selectExercise(null);
$('exStop').onclick = () => selectExercise(null);

function buildExList() {
  const kinds = [...new Set(EX.map((e) => e.kind || 'sport'))];
  let h = `<button class="ex${cur ? '' : ' on'}" data-ex="">${esc(t('rest'))}</button>`;
  for (const k of kinds) {
    h += `<h2>${esc(t('kind_' + k))}</h2>`;
    for (const e of EX.filter((x) => (x.kind || 'sport') === k)) {
      h += `<button class="ex${cur === e ? ' on' : ''}" data-ex="${e.id}">${esc(exTitle(e))}` +
        `${e.kg ? `<span class="muted">, ${num(e.kg)} ${t('kg')}</span>` : ''}</button>`;
    }
  }
  $('exlist').innerHTML = h;
  if (DEMO?.locked_ex?.length) demoLocked('exLocked', 'playbox', DEMO.locked_ex);
}
$('exlist').onclick = (ev) => {
  const b = ev.target.closest('[data-ex]');
  if (b) selectExercise(EX.find((e) => e.id === b.dataset.ex) || null);
};

function selectExercise(e) {
  if (e && face.id) clearFace(false);
  cur = e;
  lastFrame = -1;
  mixer.stopAllAction();
  action = null;
  dumbbells.forEach((d) => {
    // 2026-11-16: data.json lists the objects of each exercise (a pair, the goblet dumbbell, the bar)
    d.visible = !!e && (e.props ? e.props.includes(d.name) : d.name.startsWith('bar_') ? d.name === `bar_${e.id}`
      : e.kg > 0 && d.name.endsWith(`_${Math.round(e.kg)}kg`));
  });
  $('playbox').hidden = !e;
  $('workbox').hidden = !e;
  if (!e) {
    root.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.pose(); });
    if (floorView) { floorView = false; viewTo('front'); }
  } else {
    const clip = clips[e.id];
    playing = true;                             // a newly chosen exercise always starts moving
    if (clip) { action = mixer.clipAction(clip); action.play(); action.paused = !playing; }
    $('scrub').max = e.frames - 1;
    frameExercise(e);
  }
  buildExList();
  exInfo();
  refresh();
  if (cur) updatePanel(frameNow());
  renderCard();
  updateMotionBar();
}
function exInfo() {
  if (!cur) return;
  const c = cur.checks || {};
  let h = cur.treadmill ? esc(t('checksGait', num(cur.gait?.grf_peak_bw ?? 0)))
    : c.balanced_all ? esc(t(cur.hang ? 'checksHang' : cur.kg ? 'checks' : 'checksBodyweight',
      num(c.balance_margin_cm_min))) : '';
  if (c.overload?.length) {                   // movement names, not the internal codes
    const dn = (k) => (lang === 'en' ? data.dofs_en?.[k] : data.dofs?.[k]) || k;
    // 2026-11-18: walking / running - brief peaks of a simplified model, not an error of the exercise (muted note)
    h += cur.treadmill ? `<br><span class="muted">${esc(t('overloadGait', c.overload.map(dn).join(', ')))}</span>`
      : `<br><span class="bad">${esc(t('overload', c.overload.map(dn).join(', ')))}</span>`;
  }
  $('checks').innerHTML = h;
  const top = [...byId.keys()].map((id) => ({ id, a: idPeak(cur, id) })).filter((x) => x.a > 12)
    .sort((x, y) => y.a - x.a).slice(0, 12);
  $('peak').innerHTML = top.map((x) => `<div class="pk" data-id="${x.id}"><span class="bar"><i style="width:${
    Math.round(x.a / 2.55)}%;background:${cssHeat(x.a / 255)}"></i></span><span>${esc(nm(x.id))}</span>` +
    `<span class="pct">${esc(level(x.a / 255))}</span></div>`).join('');
}
$('peak').onclick = (ev) => { const r = ev.target.closest('[data-id]'); if (r) selectId(r.dataset.id); };

function frameNow() {
  if (!cur || !action) return 0;
  return Math.min(cur.frames - 1, Math.max(0, Math.round(action.time * cur.fps)));
}
const gripText = (s) => { const g = lang === 'en' ? data.grip_en?.[s] ?? s : s; return g.charAt(0).toUpperCase() + g.slice(1); };
function updatePanel(f) {
  const best = new Map();
  for (const m of muscles) {
    const a = cur.A[f * nObj + m.idx] / 255;
    if (a <= 0) continue;
    const b = best.get(m.id);
    if (!b || a > b.a) best.set(m.id, { a, w: cur.W[f * nObj + m.idx], id: m.id });
  }
  const top = [...best.values()].sort((x, y) => y.a - x.a).slice(0, 9);
  $('working').innerHTML = top.length ? top.map((x) => `<div class="pk" data-id="${x.id}"><span class="dot" style="background:${
    cssHeat(x.a)}"></span><span>${esc(nm(x.id))}<br><span class="muted">${esc(t('w' + x.w))}</span></span></div>`).join('')
    : `<span class="muted">${esc(t('ligaments'))}</span>`;
  $('scrub').value = f;
  if (cur.phases) {                                // 2026-11-18: gait - the phase of each leg instead of the balance
    const ph = cur.phases[f] || ['swing', 'swing'];
    const g = cur.gait || {};
    $('status').innerHTML = `<span class="ok">${esc(ph[0] === 'swing' && ph[1] === 'swing' ? t('phFlight')
      : t('phLine', t('ph_' + ph[0]), t('ph_' + ph[1])))}</span><br><span class="muted">${esc(t('gaitInfo',
      num(cur.treadmill * 3.6), Math.round(g.cadence_spm || 0), num(g.stride_m || 0)))}</span>`;
    return;
  }
  const bal = cur.balance_cm[f];
  $('status').innerHTML = (bal != null && bal >= 0 ? `<span class="ok">${esc(t(cur.hang ? 'hangOk' : 'balOk',
    Math.round(bal)))}</span>`
    : `<span class="bad">${esc(t('balBad'))}</span>`) + (cur.kg ? `<br><span class="muted">${esc(gripText(cur.grip[f]))}</span>` : '');
}
$('working').onclick = (ev) => { const r = ev.target.closest('[data-id]'); if (r) selectId(r.dataset.id); };
function togglePlay() {
  playing = !playing;
  if (action) action.paused = !playing;
  updateMotionBar();
}
$('play').onclick = togglePlay;
$('scrub').oninput = (ev) => {
  if (!action) return;
  playing = false; action.paused = true; updateMotionBar();
  action.time = (+ev.target.value) / cur.fps; mixer.update(0);
};
document.querySelectorAll('input[name=spd]').forEach((r) => { r.onchange = () => { mixer.timeScale = +r.value; }; });
$('cbFade').onchange = () => { S.fade = $('cbFade').checked; refresh(); };

// ------------------------------------------------------------------ colours, visibility, selection glow
const tmp = new THREE.Color();
function glow(m) {
  if (m.bone) { const b = hovered === m ? 0.16 : 0; m.mesh.material.emissive.setRGB(b, b, b * 1.05); return; }
  const e = (S.sel.has(m.name) ? (cur ? 0.2 : 0.05) : 0) + (hovered === m ? 0.12 : 0);
  const mat = m.mesh.material;
  // in an exercise the glow keeps the hue of the effort colour (2026-11-16: a selected pectoral read as "white",
  // a different colour from the other side); at rest a neutral glow over the selection colour
  if (cur) mat.emissive.copy(mat.color).multiplyScalar(e * 1.6);
  else mat.emissive.setRGB(e, e, e * 1.1);
  if (mat.userData.uTendon) mat.userData.uTendon.value = S.sel.has(m.name) ? 0.3 : hovered === m ? 0.6 : 1.0;
}
function refresh() {
  const f = cur ? frameNow() : -1;
  for (const m of muscles) {
    const mat = m.mesh.material;
    const sel = S.sel.has(m.name);
    // a selected muscle stays visible even when its layer or group is switched off
    let vis = sideOk(m) && !S.hidden.has(m.name) && (sel || !S.hiddenGroups.has(m.group));
    let alpha = 1;
    if (vis && !sel && !S.layerOn[m.layer]) { if (S.ghost) alpha = 0.1; else vis = false; }
    if (vis && S.iso && S.sel.size && !sel) alpha = Math.min(alpha, 0.06);
    if (cur) {
      const k = f * nObj + m.idx, a = cur.A[k] / 255, n = cur.N[k] / 255;
      if (a > 0) mat.color.copy(C_IDLE).lerp(heat(a, tmp), Math.min(1, 0.35 + a));
      else if (n > 0) mat.color.copy(C_IDLE).lerp(C_BLUE, Math.min(1, n));
      else { mat.color.copy(C_IDLE); if (S.fade && !sel) alpha = Math.min(alpha, 0.12); }
    } else if (face.id) {                         // facial expression: the same colour scale as the exercises
      const a = (FX.work[face.id][m.id] || 0) * face.amt;
      if (a > 0) mat.color.copy(C_IDLE).lerp(heat(a, tmp), Math.min(1, 0.35 + a)); else mat.color.copy(C_IDLE);
    } else mat.color.copy(sel ? C_SEL : C_RED);
    m.mesh.visible = vis;
    setAlpha(mat, alpha);
    m.pickable = vis && alpha >= 0.5;
    glow(m);
  }
  bones.forEach((b) => { b.visible = S.bones; });
  // skeleton-only view (no muscle can be pointed at): the bones answer the cursor instead, the soft-tissue covers go
  S.boneMode = S.bones && boneItems.length > 0 && !muscles.some((m) => m.pickable);
  covers.forEach((c) => { if (c.name.startsWith('cover_')) c.visible = !S.boneMode; });
  if (hovered && !!hovered.bone !== S.boneMode) setHover(null);
  $('boneHint').textContent = boneItems.length ? t(S.boneMode ? 'boneHintOn' : 'boneHintOff') : '';
  const nh = S.hidden.size + S.hiddenGroups.size;
  $('bShowAll').hidden = !nh;
  $('bShowAll').textContent = t('bShowAll', nh);
}

// ------------------------------------------------------------------ selection
function ensureVisible(ms) { for (const m of ms) S.hidden.delete(m.name); }
function setSelection(ms, kind, add = false) {
  if (!add) S.sel.clear();
  for (const m of ms) S.sel.add(m.name);
  S.selKind = kind;
  if (!S.sel.size) S.iso = false;
  refresh();
  updateSelBox();
  markTree();
}
function selectId(id, { focus = true } = {}) {
  const ms = (byId.get(id) || []).filter(sideOk);
  if (!ms.length) return;
  ensureVisible(ms);
  setSelection(ms, { type: 'muscle', id });
  cardState = { type: 'muscle', id, side: ms.length === 1 ? ms[0].side : '' };
  renderCard();
  revealInTree(id);
  if (focus) focusOn(ms);
}
function selectGroup(g) {
  const ms = (groupIds[g] || []).flatMap((id) => byId.get(id)).filter(sideOk);
  if (!ms.length) return;
  ensureVisible(ms);
  setSelection(ms, { type: 'group', g });
  cardState = { type: 'group', g };
  renderCard();
  focusOn(ms);
}
function clickMuscle(m, add) {
  if (add && S.sel.has(m.name)) { S.sel.delete(m.name); setSelection([], { type: 'mixed' }, true); return; }
  setSelection([m], add ? { type: 'mixed' } : { type: 'muscle', id: m.id }, add);
  cardState = { type: 'muscle', id: m.id, side: m.side };
  renderCard();
  revealInTree(m.id);
}
function clearSel() { S.sel.clear(); S.iso = false; S.selKind = null; refresh(); updateSelBox(); markTree(); }
const selMeshes = () => muscles.filter((m) => S.sel.has(m.name));
function updateSelBox() {
  const ms = selMeshes();
  $('selbox').hidden = !ms.length;
  if (!ms.length) return;
  const ids = [...new Set(ms.map((m) => m.id))];
  let label;
  if (S.selKind?.type === 'group') label = groupById[S.selKind.g]?.[lang] + ' · ' + nMus(ids.length);
  else if (ids.length === 1) label = nm(ids[0]) + (ms.length === 1 && ms[0].side ? ` (${t(ms[0].side === 'l' ? 'left' : 'right')})` : '');
  else label = nMus(ids.length);
  $('selname').textContent = label;
  $('bIso').textContent = S.iso ? t('bIsoOff') : t('bIso');
  $('bIso').classList.toggle('on', S.iso);
}
$('bIso').onclick = () => { S.iso = !S.iso; refresh(); updateSelBox(); };
function hideSel() {
  if (!S.sel.size) return;
  S.sel.forEach((n) => S.hidden.add(n));
  clearSel();
}
$('bHide').onclick = hideSel;
$('bFocus').onclick = () => focusOn(selMeshes());
$('bClear').onclick = clearSel;
$('bShowAll').onclick = () => { S.hidden.clear(); S.hiddenGroups.clear(); buildTree(); refresh(); };

// ------------------------------------------------------------------ camera
let fly = null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function flyTo(target, pos) {
  fly = { t: 0, dur: reduceMotion ? 0.001 : 0.6, t0: controls.target.clone(), p0: camera.position.clone(), t1: target, p1: pos };
}
// 2026-11-17 (author: chose the auricular muscles with the back of the head towards him - the view zoomed but the
// muscle stayed out of sight): the outward side of a muscle = away from the nearest bone axis of the skeleton (posed);
// the camera turns there unless it already looks at that side
const skelBones = [];
root.traverse((o) => { if (o.isBone) skelBones.push(o); });
// the head: outward from the centre of the skull (from the bone axes the ear muscles "faced" up and back); the centre
// is kept in the frame of the head bone so it follows the head in the exercises
const headB = skelBones.find((b) => b.name === 'head');
const skullLocal = (() => {
  if (!headB) return null;
  const box = new THREE.Box3();
  root.traverse((o) => { if (o.isMesh && /^bn_bone_skull|^bone_skull/.test(o.name)) box.expandByObject(o); });
  if (box.isEmpty()) return null;
  root.updateMatrixWorld(true);
  return headB.worldToLocal(box.getCenter(new THREE.Vector3()));
})();
function outwardOf(m) {
  const c = new THREE.Box3().setFromObject(m.mesh).getCenter(new THREE.Vector3());
  if (skullLocal) {
    const hc = headB.localToWorld(skullLocal.clone());
    if (hc.distanceTo(c) < 0.13) { const o = c.clone().sub(hc); return o.lengthSq() > 1e-8 ? o.normalize() : null; }
  }
  let best = null;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), p = new THREE.Vector3(), seg = new THREE.Line3();
  for (const bo of skelBones) {
    bo.getWorldPosition(a);
    for (const ch of bo.children) {
      if (!ch.isBone) continue;
      ch.getWorldPosition(b);
      if (a.distanceToSquared(b) < 1e-6) continue;
      seg.set(a, b).closestPointToPoint(c, true, p);
      const d = p.distanceToSquared(c);
      if (!best || d < best.d) best = { d, p: p.clone() };
    }
  }
  if (!best) return null;
  const o = c.clone().sub(best.p);
  return o.lengthSq() > 1e-8 ? o.normalize() : null;
}
function viewDirFor(ms, cur) {
  const outs = ms.map(outwardOf).filter(Boolean);
  if (!outs.length) return cur;
  const avg = outs.reduce((s, o) => s.add(o), new THREE.Vector3()).divideScalar(outs.length);
  // a left-right pair on the sides (ears, temples) averages to ~0: show the side nearer to the camera
  const o = avg.length() > 0.5 ? avg.normalize() : outs.reduce((x, y) => (y.dot(cur) > x.dot(cur) ? y : x));
  if (o.dot(cur) > 0.7) return cur;                  // that side is already in view (within ~45 deg)
  return o.clone().multiplyScalar(0.85).addScaledVector(cur, 0.15).add(new THREE.Vector3(0, 0.15, 0)).normalize();
}
function focusOn(ms) {
  ms = ms.filter((m) => m.mesh.visible);
  if (!ms.length) return;
  const b = boxOf(ms);
  if (b.isEmpty()) return;
  const c = b.getCenter(new THREE.Vector3());
  const r = Math.max(0.05, b.getSize(_v).length() / 2);
  const fit = r / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2) * 1.05;
  const d = Math.min(controls.maxDistance, Math.max(controls.minDistance, fit));
  const dir = viewDirFor(ms, camera.position.clone().sub(controls.target).normalize());
  flyTo(c, c.clone().addScaledVector(dir, d));
}
// below (2026-11-17): through the floor, for the muscles a lying body rests on (slightly off the vertical: the orbit
// controls need an up direction)
const VIEWS = { front: [0, 0.12, 1], back: [0, 0.12, -1], left: [LEFT_X, 0.12, 0], right: [-LEFT_X, 0.12, 0],
  below: [0.2, -1, 0.35] };
const headBone = root.getObjectByName('head');
const pelvisBone = root.getObjectByName('pelvis');
root.updateMatrixWorld(true);
// standing at rest the views aim at 0.92 m (the pelvis bone head is a little higher)
const PELVIS_OFF = (() => {
  if (!pelvisBone) return 0;
  const o = 0.92 - pelvisBone.getWorldPosition(new THREE.Vector3()).y;
  return Math.abs(o) < 0.3 ? o : 0;
})();
function viewTo(v) {
  if (v === 'home') { flyTo(HOME.target.clone(), HOME.pos.clone()); return; }
  if (v === 'head') {                         // the face close up, wherever the head is in the exercise
    const tg = headBone ? headBone.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.08, 0.02))
      : new THREE.Vector3(0, 1.64, 0);
    flyTo(tg, tg.clone().add(new THREE.Vector3(0.18, 0.05, 0.78)));
    return;
  }
  // the views follow the body (pelvis) in the current frame: a floor exercise (push-up) is framed at the floor
  const tg = pelvisBone ? pelvisBone.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, PELVIS_OFF, 0))
    : new THREE.Vector3(0, 0.92, 0);
  tg.y = Math.max(0.2, tg.y);
  flyTo(tg, tg.clone().addScaledVector(new THREE.Vector3(...VIEWS[v]).normalize(), 3.9));
}
document.querySelectorAll('[data-view]').forEach((b) => { b.onclick = () => viewTo(b.dataset.view); });
// 2026-11-15: an exercise on the floor (plank, bridge, push-up: the pelvis low in its first frame) opens from the side;
// back to a standing exercise -> from the front
let floorView = false;
function frameExercise(e) {
  if (!e || !pelvisBone) return;
  mixer.update(0);
  root.updateMatrixWorld(true);
  const low = pelvisBone.getWorldPosition(new THREE.Vector3()).y < 0.6;
  if (low) viewTo('left');
  else if (floorView) viewTo('front');
  floorView = low;
}
$('bShot').onclick = () => {
  setHover(null);
  renderer.render(scene, camera);
  const a = document.createElement('a');
  a.href = renderer.domElement.toDataURL('image/png');
  a.download = `${t('shot')}_${cur ? cur.id : 'rest'}_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}.png`;
  a.click();
};
$('bHelp').onclick = () => { $('help').hidden = !$('help').hidden; };

// height bar: the view slides up and down the body (target and camera together), like scrolling a tall page
const H_MIN = 0.05, H_MAX = 1.82;
function setHeight(y) {
  y = Math.min(H_MAX, Math.max(H_MIN, y));
  const dy = y - controls.target.y;
  if (Math.abs(dy) < 1e-6) return;
  fly = null;
  controls.target.y += dy;
  camera.position.y += dy;
}
const moveHeight = (d) => setHeight(controls.target.y + d);
// a step proportional to how close the camera is: fine near the face, faster on the full figure
const hStep = () => Math.max(0.02, 0.08 * camera.position.distanceTo(controls.target));
function syncBar() {
  const f = (controls.target.y - H_MIN) / (H_MAX - H_MIN);
  $('hthumb').style.top = `${(1 - Math.min(1, Math.max(0, f))) * 100}%`;
}
{
  const track = $('htrack');
  const yAt = (clientY) => {
    const r = track.getBoundingClientRect();
    return H_MIN + (1 - Math.min(1, Math.max(0, (clientY - r.top) / r.height))) * (H_MAX - H_MIN);
  };
  let drag = false;
  track.addEventListener('pointerdown', (e) => { drag = true; track.setPointerCapture(e.pointerId); setHeight(yAt(e.clientY)); });
  track.addEventListener('pointermove', (e) => { if (drag) setHeight(yAt(e.clientY)); });
  track.addEventListener('pointerup', () => { drag = false; });
  $('hbar').addEventListener('wheel', (e) => { e.preventDefault(); moveHeight(-Math.sign(e.deltaY) * hStep()); },
    { passive: false });
  // Shift + wheel over the model: up / down instead of zoom (caught before the orbit controls see it)
  $('view').addEventListener('wheel', (e) => {
    if (!e.shiftKey) return;
    e.preventDefault(); e.stopPropagation();
    moveHeight(-Math.sign(e.deltaY || e.deltaX) * hStep());
  }, { passive: false, capture: true });
}

// ------------------------------------------------------------------ anatomy tab: search and group tree
const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/g, ' ').trim();
const searchIndex = [...byId.keys()].map((id) => {
  const r = data.muscles[id] || {};
  return { id, key: ' ' + norm([r.ru, r.la, r.en, r.alias, id.replace(/_/g, ' ')].join(' ')) };
});
function runSearch() {
  const words = norm($('q').value).split(' ').filter(Boolean);
  if (!words.length) { $('qres').innerHTML = ''; return; }
  const hits = searchIndex.filter((x) => words.every((w) => x.key.includes(' ' + w) || (w.length > 3 && x.key.includes(w))));
  const first = norm(words[0]);
  hits.sort((a, b) => (norm(nm(b.id)).startsWith(first) - norm(nm(a.id)).startsWith(first)) || nm(a.id).localeCompare(nm(b.id)));
  $('qres').innerHTML = hits.length ? hits.slice(0, 15).map((x) => `<div class="qi${selIds().has(x.id) ? ' sel' : ''}" data-id="${
    x.id}">${esc(nm(x.id))}<i>${esc(data.muscles[x.id]?.la)}</i></div>`).join('')
    : `<div class="muted small">${esc(t('noFound'))}</div>`;
}
$('q').oninput = runSearch;
$('q').onkeydown = (ev) => {
  if (ev.key === 'Enter') { const f = $('qres').querySelector('[data-id]'); if (f) selectId(f.dataset.id); }
  if (ev.key === 'Escape') { $('q').value = ''; runSearch(); $('q').blur(); }
};
$('qres').onclick = (ev) => { const r = ev.target.closest('[data-id]'); if (r) selectId(r.dataset.id); };

const openReg = new Set(), openGrp = new Set();
function buildTree() {
  const h = [];
  for (const reg of data.regions) {
    const groups = data.groups.filter((g) => g.region === reg.id && groupIds[g.id]?.length);
    if (!groups.length) continue;
    const n = groups.reduce((s, g) => s + groupIds[g.id].length, 0);
    h.push(`<div class="reg${openReg.has(reg.id) ? ' open' : ''}" data-r="${reg.id}"><div class="regh"><span class="arr"></span>` +
      `<span class="grow">${esc(reg[lang])}</span><span class="cnt">${n}</span></div><div class="regb">`);
    for (const g of groups) {
      h.push(`<div class="grp${openGrp.has(g.id) ? ' open' : ''}" data-g="${g.id}"><div class="grph"><span class="arr"></span>` +
        `<span class="gname">${esc(g[lang])}</span><span class="cnt">${groupIds[g.id].length}</span>` +
        `<input type="checkbox" class="gvis" title="${esc(t('showGroup'))}"${S.hiddenGroups.has(g.id) ? '' : ' checked'}></div>` +
        `<div class="mlist">${groupIds[g.id].map((id) => `<div class="mi" data-id="${id}">${esc(nm(id))}</div>`).join('')}</div></div>`);
    }
    h.push('</div></div>');
  }
  $('tree').innerHTML = h.join('');
  markTree();
}
// 2026-11-17 (author): a muscle chosen on the model opens its section in the Anatomy tree and is scrolled into view
function revealInTree(id) {
  if (tabNow !== 'anat') return;
  const g = Object.keys(groupIds).find((k) => groupIds[k].includes(id));
  if (!g) return;
  const reg = data.groups.find((x) => x.id === g)?.region;
  if (reg) openReg.add(reg);
  openGrp.add(g);
  document.querySelector(`#tree .reg[data-r="${reg}"]`)?.classList.add('open');
  document.querySelector(`#tree .grp[data-g="${g}"]`)?.classList.add('open');
  const el = document.querySelector(`#tree .grp[data-g="${g}"] .mi[data-id="${id}"]`);
  if (el) {
    el.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
}
const selIds = () => new Set(selMeshes().map((m) => m.id));
function markTree() {
  const ids = selIds();
  document.querySelectorAll('#tree .mi, #qres .qi').forEach((el) => el.classList.toggle('sel', ids.has(el.dataset.id)));
}
$('tree').addEventListener('click', (ev) => {
  const el = ev.target;
  if (el.classList.contains('gvis')) return;
  const mi = el.closest('.mi');
  if (mi) { selectId(mi.dataset.id); return; }
  const gh = el.closest('.grph');
  if (gh) {
    const g = gh.parentElement.dataset.g;
    if (el.classList.contains('gname')) { openGrp.add(g); gh.parentElement.classList.add('open'); selectGroup(g); return; }
    gh.parentElement.classList.toggle('open');
    if (gh.parentElement.classList.contains('open')) openGrp.add(g); else openGrp.delete(g);
    return;
  }
  const rh = el.closest('.regh');
  if (rh) {
    const r = rh.parentElement.dataset.r;
    rh.parentElement.classList.toggle('open');
    if (rh.parentElement.classList.contains('open')) openReg.add(r); else openReg.delete(r);
  }
});
$('tree').addEventListener('change', (ev) => {
  if (!ev.target.classList.contains('gvis')) return;
  const g = ev.target.closest('.grp').dataset.g;
  if (ev.target.checked) S.hiddenGroups.delete(g); else S.hiddenGroups.add(g);
  refresh();
});

// ------------------------------------------------------------------ layers tab
function syncLayerBoxes() { document.querySelectorAll('.cbL').forEach((c) => { c.checked = S.layerOn[c.value]; }); }
document.querySelectorAll('.cbL').forEach((c) => { c.onchange = () => { S.layerOn[c.value] = c.checked; refresh(); }; });
document.querySelectorAll('[data-lay]').forEach((b) => {
  b.onclick = () => {
    const p = b.dataset.lay;
    S.layerOn = p === 'none' ? { superficial: false, middle: false, deep: false }
      : { superficial: p === 'all', middle: p !== 'deep', deep: true };
    if (p === 'none' && !S.bones) { S.bones = true; $('cbBone').checked = true; }
    syncLayerBoxes();
    refresh();
  };
});
$('cbGhost').onchange = () => { S.ghost = $('cbGhost').checked; refresh(); };
$('cbBone').onchange = () => { S.bones = $('cbBone').checked; refresh(); };
document.querySelectorAll('input[name=side]').forEach((r) => {
  r.onchange = () => {
    S.side = r.value;
    muscles.forEach((m) => { if (!sideOk(m)) S.sel.delete(m.name); });
    refresh(); updateSelBox(); markTree();
  };
});

// ------------------------------------------------------------------ tabs, language, panels
function setTab(name) {
  if (name === 'face' && !FX) name = 'anat';
  document.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
  for (const n of ['anat', 'ex', 'layers', 'face']) $('tab-' + n).hidden = n !== name;
  store.set('tab', name);
  tabNow = name;
  updateMotionBar();
}
document.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => setTab(b.dataset.tab); });
setTab(store.get('tab', 'anat'));
function setLang(l) {
  lang = l;
  store.set('lang', lang);
  applyStatic(); buildTree(); buildExList(); exInfo(); runSearch(); updateSelBox(); renderCard(); refresh();
  buildFaceList(); updateFacePanel();
  $('attr').textContent = data.attribution ? t('attr', data.attribution) : '';
  if (cur) updatePanel(frameNow());
  if (hovered) setHover(hovered);
  updateMotionBar();
}
document.querySelectorAll('[data-lang]').forEach((b) => { b.onclick = () => setLang(b.dataset.lang); });
$('bLang').onclick = () => setLang(lang === 'ru' ? 'en' : 'ru');
function collapse(panel, on) {
  panel.classList.toggle('collapsed', on);
  const b = panel.querySelector('.head .min');
  if (b) b.textContent = on ? '+' : '–';
}
document.querySelectorAll('#left .min, #right .min').forEach((b) => {
  b.onclick = () => { const p = b.closest('.panel'); collapse(p, !p.classList.contains('collapsed')); };
});
if (innerWidth < 900) { collapse($('left'), true); collapse($('right'), true); }   // phones: the model first
$('attr').textContent = data.attribution ? t('attr', data.attribution) : '';

// ------------------------------------------------------------------ card
let cardState = null;
const ROLE = (w) => (w >= 1 ? `<span class="tag p">${esc(t('main'))}</span>` : w >= 0.5
  ? `<span class="tag h">${esc(t('helps'))}</span>` : `<span class="tag">${esc(t('weakRole'))}</span>`);
const field = (r, k) => (lang === 'ru' ? r[k + '_ru'] || r[k] : r[k] || r[k + '_ru']) || '—';
function renderCard() {
  const c = $('card');
  if (!cardState) { c.innerHTML = `<h1>${esc(t('cardH'))}</h1><div class="muted">${esc(t('cardHint'))}</div>`; return; }
  if (cardState.type === 'group') {
    const g = groupById[cardState.g];
    const ids = groupIds[cardState.g] || [];
    c.innerHTML = `<h1>${esc(g?.[lang])}</h1><div class="muted small">${esc(regionById[g?.region]?.[lang])} · ${esc(nMus(ids.length))}</div>
      <dl><dt>${esc(t('groupMuscles'))}</dt><dd>${ids.map((id) => `<div class="mi" data-id="${id}">${esc(nm(id))}
      <span class="cnt">· ${esc(data.layers?.[data.muscles[id].layer]?.[lang] ?? '')}</span></div>`).join('')}</dd></dl>`;
  } else {
    const id = cardState.id, r = data.muscles[id] || {}, g = groupById[r.group];
    const dofs = Object.entries(r.dofs || {}).sort((a, b) => b[1] - a[1])
      .map(([d, w]) => `<div>${ROLE(w)}${esc(dofLabel(d))}</div>`).join('');
    const exs = EX.map((e) => ({ e, a: idPeak(e, id) })).filter((x) => x.a > 12).sort((x, y) => y.a - x.a);
    const chips = [g ? `${regionById[g.region]?.[lang]}: ${g[lang]}` : '', data.layers?.[r.layer]?.[lang] ?? '',
      cardState.side ? t(cardState.side === 'l' ? 'left' : 'right') : ''].filter(Boolean);
    c.innerHTML = `<h1>${esc(nm(id))}</h1>
      <div class="muted small">${esc(r.la)}${lang === 'ru' && r.en ? ' · ' + esc(r.en) : ''}</div>
      <div class="chips">${chips.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>
      <dl>
        <dt>${esc(t('origin'))}</dt><dd>${esc(field(r, 'origin'))}</dd>
        <dt>${esc(t('insertion'))}</dt><dd>${esc(field(r, 'insertion'))}</dd>
        <dt>${esc(t('func'))}</dt><dd>${esc(field(r, 'function'))}</dd>
        <dt>${esc(t('nerve'))}</dt><dd>${esc(lang === 'ru' ? r.nerve_ru || r.nerve : r.nerve) || '—'}</dd>
        <dt>${esc(t('actions'))}</dt><dd>${dofs || '—'}</dd>
        <dt>${esc(t('inEx'))}</dt><dd>${exs.length ? exs.map((x) => `<div class="exl" data-ex="${x.e.id}"><span class="bar"><i style="width:${
          Math.round(x.a / 2.55)}%;background:${cssHeat(x.a / 255)}"></i></span><span>${esc(exTitle(x.e))}</span><span class="pct">${
          esc(level(x.a / 255))}</span></div>`).join('') : `<span class="muted">${esc(t('notInEx'))}</span>`}</dd>
      </dl>`;
  }
  if (cardState) collapse($('right'), false);
}
$('card').onclick = (ev) => {
  const mi = ev.target.closest('[data-id]');
  if (mi) { selectId(mi.dataset.id); return; }
  const ex = ev.target.closest('[data-ex]');
  if (ex) { selectExercise(EX.find((e) => e.id === ex.dataset.ex)); setTab('ex'); }
};

// ------------------------------------------------------------------ picking (GPU: one pixel under the cursor)
const pickTarget = new THREE.WebGLRenderTarget(1, 1);
const pickMats = muscles.map((m, i) => {
  const id = i + 1;
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
  mat.color.setRGB((id & 255) / 255, ((id >> 8) & 255) / 255, ((id >> 16) & 255) / 255, THREE.LinearSRGBColorSpace);
  return mat;
});
const bonePickMats = boneItems.map((b, j) => {      // ids after the muscles
  const id = muscles.length + 1 + j;
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
  mat.color.setRGB((id & 255) / 255, ((id >> 8) & 255) / 255, ((id >> 16) & 255) / 255, THREE.LinearSRGBColorSpace);
  return mat;
});
const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
const px = new Uint8Array(4);
let mouse = null, needPick = false;
function pick() {
  if (!mouse) return;
  const dpr = renderer.getPixelRatio();
  const w = renderer.domElement.width, h = renderer.domElement.height;
  camera.setViewOffset(w, h, Math.floor(mouse.x * dpr), Math.floor(mouse.y * dpr), 1, 1);
  const saved = muscles.map((m) => [m.mesh.material, m.mesh.visible]);
  muscles.forEach((m, i) => { m.mesh.material = pickMats[i]; m.mesh.visible = m.pickable; });
  const others = [...bones, ...dumbbells, ...covers];
  const savedO = others.map((b) => b.material);
  others.forEach((b) => { b.material = black; });      // bones, dumbbells, covers hide what is behind them (id 0)
  if (S.boneMode) boneItems.forEach((b, j) => { b.mesh.material = bonePickMats[j]; });
  const fv = floor.visible, bg = scene.background;
  floor.visible = false;
  scene.background = null;
  renderer.setRenderTarget(pickTarget);
  renderer.setClearColor(0x000000, 1);
  renderer.clear();
  renderer.render(scene, camera);
  renderer.readRenderTargetPixels(pickTarget, 0, 0, 1, 1, px);
  renderer.setRenderTarget(null);
  camera.clearViewOffset();
  muscles.forEach((m, i) => { [m.mesh.material, m.mesh.visible] = saved[i]; });
  others.forEach((b, i) => { b.material = savedO[i]; });
  floor.visible = fv;
  scene.background = bg;
  const id = px[0] | (px[1] << 8) | (px[2] << 16);
  const bj = id - muscles.length - 1;
  setHover(id > 0 && id <= muscles.length ? muscles[id - 1]
    : S.boneMode && bj >= 0 && bj < boneItems.length ? boneItems[bj] : null);
}
function boneTip(b) {
  const i = b.info;
  const g = data.bone_groups?.[i.grp]?.[lang];
  const side = i.side ? t(i.side === 'l' ? 'sideOfL' : 'sideOfR') : '';
  return `<b>${esc(lang === 'en' ? i.en : i.ru)}</b><i>${esc(i.la || '')}${side ? ' · ' + esc(side) : ''}</i>` +
    (g ? `<div class="small muted">${esc(g)}${lang === 'ru' && i.en ? ' · ' + esc(i.en) : ''}</div>` : '');
}

function setHover(m) {
  const prev = hovered;
  hovered = m;
  if (prev && prev !== m) glow(prev);
  const tip = $('tip');
  if (!m || !mouse) { tip.style.display = 'none'; renderer.domElement.style.cursor = ''; return; }
  glow(m);
  renderer.domElement.style.cursor = 'pointer';
  if (m.bone) {
    tip.innerHTML = boneTip(m);
    tip.style.display = 'block';
    tip.style.left = Math.max(8, Math.min(innerWidth - 330, mouse.x + 16)) + 'px';
    tip.style.top = Math.min(innerHeight - 80, mouse.y + 14) + 'px';
    return;
  }
  const row = data.muscles[m.id] || {};
  let st = '';
  if (cur) {
    const f = frameNow(), k = f * nObj + m.idx;
    const a = cur.A[k] / 255, n = cur.N[k] / 255;
    st = a > 0 ? `<span style="color:${cssHeat(a)}">${esc(t('works', level(a)))}</span> · ${esc(t('w' + cur.W[k]))}`
      : n > 0 ? `<span style="color:#6f95ff">${esc(t('antag'))}</span>` : `<span class="muted">${esc(t('idle'))}</span>`;
  }
  tip.innerHTML = `<b>${esc(nm(m.id))}</b><i>${esc(row.la ?? '')}${m.side ? ' · ' + esc(t(m.side === 'l' ? 'left' : 'right')) : ''}</i>` +
    (st ? `<div class="small">${st}</div>` : '');
  tip.style.display = 'block';
  tip.style.left = Math.max(8, Math.min(innerWidth - 330, mouse.x + 16)) + 'px';
  tip.style.top = Math.min(innerHeight - 80, mouse.y + 14) + 'px';
}

const cv = renderer.domElement;
let downAt = null;
cv.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  mouse = { x: e.clientX, y: e.clientY }; needPick = true;
});
cv.addEventListener('pointerleave', () => { mouse = null; setHover(null); });
cv.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; fly = null; $('q').blur(); });
cv.addEventListener('pointerup', (e) => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5 || e.button > 0) return;
  mouse = { x: e.clientX, y: e.clientY };
  pick();
  if (hovered && !hovered.bone) clickMuscle(hovered, e.shiftKey || e.ctrlKey || e.metaKey);
  if (e.pointerType === 'touch') { mouse = null; setHover(null); }
});
cv.addEventListener('dblclick', () => { if (S.sel.size) focusOn(selMeshes()); });
addEventListener('keydown', (e) => {
  if (e.target.closest('input[type=search], input[type=text]')) return;
  if (e.key === 'Escape') { clearSel(); $('help').hidden = true; } else if (e.code === 'Space' && cur) {
    e.preventDefault(); togglePlay();
  } else if (e.code === 'KeyF') focusOn(selMeshes()); else if (e.code === 'KeyH') hideSel();
  else if ((e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'PageUp' || e.code === 'PageDown') &&
           !e.target.closest('input, select, textarea')) {
    e.preventDefault();
    const big = e.code.startsWith('Page') ? 4 : 1;
    moveHeight((e.code.endsWith('Up') ? 1 : -1) * hStep() * big);
  }
});

// ------------------------------------------------------------------ facial expressions (2026-11-17, stage Face)
// The action units are morph targets (AU1, AU12 ...) of the face muscles; an expression mixes them and may open the
// mouth (the jaw bone turns about the left-right axis through its joint). Only without an exercise running.
const morphMeshes = [];
root.traverse((o) => {
  if (o.isMesh && o.morphTargetDictionary && Object.keys(o.morphTargetDictionary).some((k) => k.startsWith('AU'))) {
    morphMeshes.push(o);
  }
});
const jawBone = skelBones.find((b) => b.name === 'jaw');
const jawRest = jawBone ? jawBone.quaternion.clone() : null;
const exprName = (id) => { const n = FX?.names?.[id]; return n ? (lang === 'en' ? n[1] : n[0]) : id; };
function applyFace() {
  const e = face.id ? FX.expressions[face.id] : null;
  for (const o of morphMeshes) {
    const dict = o.morphTargetDictionary, inf = o.morphTargetInfluences;
    for (const k in dict) inf[dict[k]] = e ? (e.aus[k] || 0) * face.amt : 0;
  }
  if (jawBone && jawRest && !cur) {
    const deg = e ? (e.jaw || 0) * face.amt : 0;
    const pq = jawBone.parent.getWorldQuaternion(new THREE.Quaternion());
    const qa = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(deg));
    jawBone.quaternion.copy(pq.clone().invert().multiply(qa).multiply(pq).multiply(jawRest));
  }
}
function buildFaceList() {
  if (!FX) return;
  let h = `<button class="ex${face.id ? '' : ' on'}" data-fx="">${esc(t('rest'))}</button>`;
  for (const id of Object.keys(FX.expressions)) {
    h += `<button class="ex${face.id === id ? ' on' : ''}" data-fx="${id}">${esc(exprName(id))}</button>`;
  }
  $('facelist').innerHTML = h;
  if (DEMO?.locked_fx?.length) demoLocked('fxLocked', 'facebox', DEMO.locked_fx);
}

// ------------------------------------------------------------------ demo (website)
function demoBuyUrl() {
  return (DEMO.buy_url || '../') + '?lang=' + lang + '#' + (DEMO.buy_anchor || 'anatomy');
}
// the locked names go below the controls of the tab (play / scrub, the expression slider), not between the list and them
function demoLocked(boxId, afterId, pairs) {
  let box = document.getElementById(boxId);
  if (!box) {
    box = document.createElement('div');
    box.id = boxId;
    $(afterId).after(box);
  }
  box.innerHTML = `<h2>🔒 ${esc(t('demoLocked'))}</h2><div class="demo-locked">${
    pairs.map((x) => `<span>${esc(lang === 'en' ? x[1] : x[0])}</span>`).join('')}</div>` +
    `<a class="demo-buy" href="${esc(demoBuyUrl())}">${esc(t('demoBuy'))}</a>`;
}
function renderDemo() {
  if (!document.getElementById('demoCss')) {
    const s = document.createElement('style');
    s.id = 'demoCss';
    s.textContent = `
      .demo-pill { padding: 2px 7px; border-radius: 5px; background: var(--accent); color: #111; font-weight: 700;
        font-size: 11px; letter-spacing: .06em; text-decoration: none; }
      .demo-note { margin: 8px 0 2px; padding: 7px 9px; border-radius: 7px; border: 1px solid #4a3a1a;
        background: #1f1910; font-size: 12px; color: #e6d2b0; }
      .demo-note a, .demo-buy { color: var(--accent); font-weight: 600; text-decoration: none; }
      .demo-buy { display: block; margin: 8px 0 4px; padding: 7px 9px; border-radius: 7px; border: 1px solid var(--accent);
        text-align: center; background: #2a1f14; }
      .demo-locked { display: flex; flex-wrap: wrap; gap: 4px; }
      .demo-locked span { padding: 3px 8px; border-radius: 6px; border: 1px dashed var(--line2); color: #6f7480;
        font-size: 12px; cursor: not-allowed; }
      #bShot { display: none; }`;
    document.head.appendChild(s);
  }
  document.title = t('docTitle') + t('demoTitle');
  const head = document.querySelector('#left .head');
  let pill = document.getElementById('demoPill');
  if (!pill) {
    pill = document.createElement('a');
    pill.id = 'demoPill';
    pill.className = 'demo-pill';
    head.insertBefore(pill, head.querySelector('.lang'));
    const note = document.createElement('div');
    note.id = 'demoNote';
    note.className = 'demo-note';
    head.after(note);
  }
  pill.textContent = t('demoBadge');
  pill.href = demoBuyUrl();
  document.getElementById('demoNote').innerHTML = `${esc(t('demoNote'))} <a href="${esc(demoBuyUrl())}">${
    esc(t('demoBuy'))}</a>`;
}
function updateFacePanel() {
  if (!FX) return;
  $('facebox').hidden = !face.id;
  if (cur) return;                                 // the exercise panel owns the right side then
  $('workbox').hidden = !face.id;
  if (!face.id) return;
  const e = FX.expressions[face.id];
  const aus = Object.keys(e.aus).map((k) => `${k} ${(lang === 'en' ? FX.au_names[k]?.[1] : FX.au_names[k]?.[0]) || ''}`);
  $('faceAus').textContent = t('faceAus') + aus.join(', ') + (e.jaw ? '; ' + t('faceJaw', Math.round(e.jaw)) : '');
  $('status').innerHTML = `<b>${esc(exprName(face.id))}</b>`;
  const w = Object.entries(FX.work[face.id]).filter(([id]) => byId.has(id))
    .sort((x, y) => y[1] - x[1] || nm(x[0]).localeCompare(nm(y[0])));
  $('working').innerHTML = w.map(([id, r]) => `<div class="pk" data-id="${id}"><span class="dot" style="background:${
    cssHeat(r * Math.max(face.amt, 0.05))}"></span><span>${esc(nm(id))}<br><span class="muted">${
    esc(t(r >= 1 ? 'roleMain' : 'roleHelp'))}</span></span></div>`).join('');
  $('faceAmt').value = Math.round(face.target * 100);
}
function clearFace(redraw = true) {
  face.id = null; face.amt = 0; face.target = 0;
  applyFace();
  if (jawBone && jawRest) jawBone.quaternion.copy(jawRest);
  buildFaceList();
  updateFacePanel();
  if (redraw) refresh();
}
function selectFace(id) {
  if (!id) { clearFace(); return; }
  if (cur) selectExercise(null);
  face.id = id; face.amt = 0; face.target = 1;
  buildFaceList();
  updateFacePanel();
  viewTo('head');
}
if (FX) {
  $('facelist').onclick = (ev) => { const b = ev.target.closest('[data-fx]'); if (b) selectFace(b.dataset.fx || null); };
  $('faceAmt').oninput = (ev) => { face.target = +ev.target.value / 100; face.amt = face.target; applyFace(); refresh(); updateFacePanel(); };
  $('faceReplay').onclick = () => { if (face.id) { face.amt = 0; face.target = 1; } };
  buildFaceList();
} else {
  document.querySelector('[data-tab="face"]')?.remove();
}
function stepFace(dt) {
  if (!face.id || face.amt === face.target) return;
  const sp = dt / 0.9;                              // ~0.9 s from rest to full
  face.amt = face.amt < face.target ? Math.min(face.target, face.amt + sp) : Math.max(face.target, face.amt - sp);
  applyFace();
  refresh();
  updateFacePanel();
}

// ------------------------------------------------------------------ loop
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
});
buildTree();
buildExList();
renderCard();
refresh();
window.__viewer = { scene, root, camera, controls, muscles, S, selectId, selectGroup, selectExercise, refresh, focusOn,
  setTab, get hovered() { return hovered; }, get cur() { return cur; }, LEFT_X, boneItems, setLang, outwardOf,
  viewDirFor, byId, selectFace, face, treadmill,     // for checks
  resetCard() { cardState = null; renderCard(); } };  // 2026-11-18: the promo recorder (tools/record_viewer.py)
const clock = new THREE.Clock();
let pickTimer = 0;
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1);
  mixer.update(dt);
  if (fly) {
    fly.t += dt;
    const k = Math.min(1, fly.t / fly.dur), e = k * k * (3 - 2 * k);
    controls.target.lerpVectors(fly.t0, fly.t1, e);
    camera.position.lerpVectors(fly.p0, fly.p1, e);
    if (k >= 1) fly = null;
  }
  controls.update();
  stepFace(dt);
  stepTreadmill(dt);
  updateLights();
  syncBar();
  if (cur) {
    const f = frameNow();
    if (f !== lastFrame) { lastFrame = f; refresh(); updatePanel(f); if (hovered) setHover(hovered); }
  }
  pickTimer += dt;
  if (needPick && pickTimer > 0.05) { pick(); needPick = false; pickTimer = 0; }
  renderer.render(scene, camera);
});
