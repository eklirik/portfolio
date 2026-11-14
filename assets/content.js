// Тексты сайта на двух языках. Картинки подключаются из media.js (tools/build_media.py).
window.CONTENT = {
  // Контакты: пустое значение = кнопка не показывается
  contacts: {
    telegram: 'eklirik',
    email: '',
  },

  ui: {
    ru: {
      nav_3d: '3D', nav_brand: 'Брендинг', nav_games: 'Игры', nav_contact: 'Контакты',
      hero_kicker: 'Студия цифрового дизайна',
      hero_title: '3D-персонажи,<br><em>бренды</em> и&nbsp;игры',
      hero_text: 'Делаем персонажей со скелетом и анимациями, фирменные стили от логотипа до мерча и игры для Roblox. Каждую работу можно открыть, рассмотреть крупно и прочитать подробности.',
      hero_cta1: 'Смотреть работы', hero_cta2: 'Обсудить проект',
      s1: '3D-персонажей', s2: 'анимаций у каждого', s3: 'стиля на модель', s4: 'игры в Roblox',
      srv_t: 'Что мы делаем',
      srv1_t: '3D-персонажи', srv1_d: 'Моделинг, скелет, 14 анимаций и четыре стиля: мультяшный, детальный, low-poly и кубический. Форматы GLB и FBX для Unity, Unreal, Godot, three.js и Roblox.',
      srv2_t: 'Брендинг', srv2_d: 'Логотип, палитра, шрифты, брендбук и носители: визитки, упаковка, мерч, соцсети. Стиль, который узнают с первого взгляда.',
      srv3_t: 'Игры Roblox', srv3_d: 'Геймдизайн, скрипты на Luau, свои 3D-персонажи с мутациями, иконки, обложки и трейлеры для TikTok.',
      sec3d_k: '01 — 3D', sec3d_t: '3D-персонажи',
      sec3d_d: 'Персонажи готовы к игре: скелет, анимации, текстуры и четыре стиля в каждом паке. Здесь 15 из 35 моделей. Наведите курсор, чтобы увидеть анимацию, или откройте карточку.',
      secbrand_k: '02 — Брендинг', secbrand_t: 'Фирменный стиль и логотипы',
      secbrand_d: 'Знак, цвет, типографика и все носители: от визитки и упаковки до формы и мерча. Откройте любой борд, чтобы рассмотреть детали.',
      secgames_k: '03 — Игры', secgames_t: 'Игры в Roblox',
      secgames_d: 'Свои игры от идеи до запуска: механики, скрипты, персонажи, обложки и видео для продвижения.',
      contact_t: 'Есть задача?<br>Давайте обсудим', contact_d: 'Персонаж для игры, логотип, фирменный стиль или целая игра в Roblox. Напишите, что нужно, и мы предложим решение.',
      contact_tg: 'Написать в Telegram', contact_mail: 'Написать на почту',
      footer: 'Все работы на сайте сделаны студией EKLIRIK.',
      more: 'Подробнее', open: 'Открыть', soon: 'Скоро',
      anims: 'анимаций', styles: 'стиля', bones: 'костей',
      m_included: 'В комплекте', m_anims: 'Анимации', m_features: 'Особенности', m_role: 'Что мы сделали',
      m_deliv: 'Что входит', m_prev: 'Предыдущая работа', m_next: 'Следующая работа', m_close: 'Закрыть',
      m_zoom_in: 'Увеличить', m_zoom_out: 'Уменьшить', m_fit: 'По размеру', m_full: 'Во весь экран',
      m_hint: 'Клик или колёсико — увеличение, перетаскивание — перемещение',
      m_hint_touch: 'Двойное касание или щипок — увеличение',
      label_3d: '3D-персонаж', label_brand: 'Фирменный стиль', label_logo: 'Логотипы', label_game: 'Игра Roblox',
      shot_anim: 'Анимация', shot_01_Cover: 'Обложка', shot_02_Styles: '4 стиля', shot_03_Animations: 'Анимации',
      shot_04_Specs: 'Характеристики', shot_05_Wireframe: 'Сетка', shot_06_Details: 'Детали',
      styles_list: 'Мультяшный · Детальный · Low-poly · Кубический',
    },
    en: {
      nav_3d: '3D', nav_brand: 'Branding', nav_games: 'Games', nav_contact: 'Contact',
      hero_kicker: 'Digital design studio',
      hero_title: '3D characters,<br><em>brands</em> &amp;&nbsp;games',
      hero_text: 'We make rigged and animated characters, brand identities from logo to merch, and games for Roblox. Open any project to see it up close and read the details.',
      hero_cta1: 'See the work', hero_cta2: 'Start a project',
      s1: '3D characters', s2: 'animations each', s3: 'styles per model', s4: 'Roblox games',
      srv_t: 'What we do',
      srv1_t: '3D characters', srv1_d: 'Modelling, rigging, 14 animations and four styles: cartoon, high-detail, low-poly and blocky. GLB and FBX for Unity, Unreal, Godot, three.js and Roblox.',
      srv2_t: 'Branding', srv2_d: 'Logo, palette, typography, brand book and touchpoints: cards, packaging, merch, social media. An identity people recognise at a glance.',
      srv3_t: 'Roblox games', srv3_d: 'Game design, Luau scripting, our own 3D characters with mutations, icons, thumbnails and TikTok trailers.',
      sec3d_k: '01 — 3D', sec3d_t: '3D characters',
      sec3d_d: 'Game-ready characters: skeleton, animations, textures and four styles in every pack. Here are 15 of our 35 models. Hover to see the animation, or open a card.',
      secbrand_k: '02 — Branding', secbrand_t: 'Brand identity & logos',
      secbrand_d: 'Mark, colour, typography and every touchpoint, from business cards and packaging to uniforms and merch. Open any board to see the details.',
      secgames_k: '03 — Games', secgames_t: 'Roblox games',
      secgames_d: 'Our own games from idea to launch: mechanics, scripts, characters, thumbnails and promo videos.',
      contact_t: 'Have a project?<br>Let’s talk', contact_d: 'A game character, a logo, a brand identity or a whole Roblox game. Tell us what you need and we will suggest a solution.',
      contact_tg: 'Message on Telegram', contact_mail: 'Send an email',
      footer: 'All work on this site was made by EKLIRIK studio.',
      more: 'Details', open: 'Open', soon: 'Coming soon',
      anims: 'animations', styles: 'styles', bones: 'bones',
      m_included: 'What’s included', m_anims: 'Animations', m_features: 'Features', m_role: 'What we did',
      m_deliv: 'Deliverables', m_prev: 'Previous project', m_next: 'Next project', m_close: 'Close',
      m_zoom_in: 'Zoom in', m_zoom_out: 'Zoom out', m_fit: 'Fit', m_full: 'Full screen',
      m_hint: 'Click or scroll to zoom, drag to pan',
      m_hint_touch: 'Double-tap or pinch to zoom',
      label_3d: '3D character', label_brand: 'Brand identity', label_logo: 'Logos', label_game: 'Roblox game',
      shot_anim: 'Animation', shot_01_Cover: 'Cover', shot_02_Styles: '4 styles', shot_03_Animations: 'Animations',
      shot_04_Specs: 'Specs', shot_05_Wireframe: 'Wireframe', shot_06_Details: 'Details',
      styles_list: 'Cartoon · High-detail · Low-poly · Blocky',
    },
  },

  // Работа без картинок в media.js показывается заглушкой с меткой «Скоро».
  brands: [
    {
      id: 'volta', name: 'VOLTA', key: 'brand/volta',
      type: { ru: 'Энергетический напиток', en: 'Energy drink' },
      desc: {
        ru: 'Яркий неоновый стиль для энергетика: чёрный и кислотно-зелёный, молния в знаке и слоган Charge your focus. Стиль работает на банке, постерах, худи и кепке.',
        en: 'A loud neon identity for an energy drink: black and acid green, a lightning bolt in the mark and the line Charge your focus. It works on cans, posters, hoodies and caps.',
      },
      deliv: { ru: ['Логотип', 'Палитра', 'Упаковка', 'Постеры', 'Мерч'], en: ['Logo', 'Palette', 'Packaging', 'Posters', 'Merch'] },
    },
    {
      id: 'luma', name: 'LUMA Coffee', key: 'brand/luma',
      type: { ru: 'Кофейня и обжарка', en: 'Coffee shop & roastery' },
      desc: {
        ru: 'Тёплая терракотово-кремовая айдентика кофейни: круглый знак, крафтовая упаковка зерна, стаканы, меню и мерч. Слоган Roasted with care.',
        en: 'A warm terracotta-and-cream identity for a coffee shop: a round mark, kraft bean bags, cups, menus and merch, with the line Roasted with care.',
      },
      deliv: { ru: ['Логотип', 'Упаковка', 'Меню', 'Стаканы', 'Мерч'], en: ['Logo', 'Packaging', 'Menu', 'Cups', 'Merch'] },
    },
    {
      id: 'stride', name: 'STRIDE', key: 'brand/stride',
      type: { ru: 'Спортивная одежда', en: 'Sportswear' },
      desc: {
        ru: 'Энергичный стиль спортивного бренда: чёрный с оранжевым и динамичный наклонный логотип. Футболки, худи, кепки, сумки, носки и бирки.',
        en: 'An energetic sportswear identity: black and orange with a dynamic slanted logotype. T-shirts, hoodies, caps, bags, socks and tags.',
      },
      deliv: { ru: ['Логотип', 'Палитра', 'Одежда', 'Бирки', 'Сумки'], en: ['Logo', 'Palette', 'Apparel', 'Tags', 'Bags'] },
    },
    {
      id: 'fjord', name: 'FJORD', key: 'brand/fjord',
      type: { ru: 'Путешествия и outdoor', en: 'Travel & outdoor' },
      desc: {
        ru: 'Строгий северный стиль для туристического бренда: глубокий синий, графичный знак с горами и слоган Explore the wild. Блокноты, визитки, кружка, брошюры и календарь.',
        en: 'A clean Nordic identity for a travel brand: deep blue, a graphic mountain mark and the line Explore the wild. Notebooks, cards, a mug, brochures and a calendar.',
      },
      deliv: { ru: ['Логотип', 'Визитки', 'Брошюры', 'Календарь', 'Сувениры'], en: ['Logo', 'Business cards', 'Brochures', 'Calendar', 'Souvenirs'] },
    },
    {
      id: 'oakwell', name: 'Oakwell Academy', key: 'brand/oakwell',
      type: { ru: 'Частная школа', en: 'Private school' },
      desc: {
        ru: 'Классический академический стиль: герб, тёмно-синий с золотом и шрифт с засечками. Форма, шарф, вымпел, папки, бланки и сувениры.',
        en: 'A classic academic identity: a crest, navy and gold, and a serif typeface. Uniform, scarf, pennant, folders, letterheads and souvenirs.',
      },
      deliv: { ru: ['Герб', 'Типографика', 'Форма', 'Бланки', 'Сувениры'], en: ['Crest', 'Typography', 'Uniform', 'Stationery', 'Souvenirs'] },
    },
    {
      id: 'botane', name: 'BOTANE', key: 'brand/botane',
      type: { ru: 'Натуральная косметика', en: 'Natural skincare' },
      desc: {
        ru: 'Спокойный ботанический стиль для натуральной косметики: шалфейно-зелёная палитра, тонкая типографика и знак-листок. Упаковка, канцелярия, календарь и брелоки.',
        en: 'A calm botanical identity for natural skincare: a sage-green palette, light typography and a leaf mark. Packaging, stationery, a calendar and key tags.',
      },
      deliv: { ru: ['Логотип', 'Палитра', 'Упаковка', 'Канцелярия'], en: ['Logo', 'Palette', 'Packaging', 'Stationery'] },
    },
    {
      id: 'serena', name: 'SERENA Spa', key: 'brand/serena',
      type: { ru: 'Спа и велнес', en: 'Spa & wellness' },
      desc: {
        ru: 'Мягкая минималистичная айдентика спа-салона: пудровые и шалфейные оттенки, воздушный логотип. Халаты, сумки, косметика и печатные материалы.',
        en: 'A soft minimal identity for a spa: powder and sage tones and an airy logotype. Robes, bags, cosmetics and print.',
      },
      deliv: { ru: ['Логотип', 'Палитра', 'Текстиль', 'Полиграфия'], en: ['Logo', 'Palette', 'Textiles', 'Print'] },
    },
    {
      id: 'terra', name: 'TERRA', key: 'brand/terra',
      type: { ru: 'Волонтёрское движение', en: 'Volunteer community' },
      desc: {
        ru: 'Тёплая природная айдентика волонтёрского сообщества: землистые зелёный и коричневый, знак с листьями. Форма волонтёров, кепки, шопперы, бейджи и листовки.',
        en: 'A warm, earthy identity for a volunteer community: green and brown tones and a leaf mark. Volunteer uniforms, caps, tote bags, badges and flyers.',
      },
      deliv: { ru: ['Логотип', 'Форма', 'Шопперы', 'Бейджи', 'Листовки'], en: ['Logo', 'Uniform', 'Tote bags', 'Badges', 'Flyers'] },
    },
    {
      id: 'logos', name: 'Logo set', key: 'brand/logos', kind: 'logo',
      nameRu: 'Серия логотипов',
      type: { ru: 'Логотипы', en: 'Logos' },
      desc: {
        ru: 'Серия минималистичных знаков: NOVA, APEX, FLARE, MESA, PULSE, VERDE и геометрические логотипы. Простые формы, которые читаются и в иконке приложения, и на вывеске.',
        en: 'A series of minimal marks: NOVA, APEX, FLARE, MESA, PULSE, VERDE and geometric logos. Simple shapes that read well both as an app icon and on a sign.',
      },
      deliv: { ru: ['11 знаков', 'Цветовые версии', 'Презентация'], en: ['11 marks', 'Colour versions', 'Presentation'] },
    },
    {
      id: 'eklirik', name: 'EKLIRIK', key: 'brand/eklirik', kind: 'logo',
      type: { ru: 'Логотип студии', en: 'Studio logo' },
      desc: {
        ru: 'Собственный знак студии: оранжевая буква «e» в мягком квадрате с градиентом. Хорошо смотрится в аватаре, иконке и на обложках.',
        en: 'Our own studio mark: an orange “e” in a soft gradient square. It works as an avatar, an app icon and on covers.',
      },
      deliv: { ru: ['Знак', 'Иконка', 'Аватар'], en: ['Mark', 'Icon', 'Avatar'] },
    },
  ],

  games: [
    {
      id: 'dig', name: 'Dig a Brainrot', key: 'games/dig',
      tagline: { ru: 'Копай, освобождай, собирай', en: 'Dig, free, collect' },
      desc: {
        ru: 'Игрок разбивает пирамиды и сундуки, спускается в хрустальные пещеры и храмы в джунглях, побеждает големов и стражей и освобождает брейнротов. Освобождённые персонажи оживают, гуляют по базе и приносят доход. Все персонажи — наши собственные 3D-модели со скелетом и анимациями.',
        en: 'Players smash pyramids and chests, go down into crystal caves and jungle temples, beat golems and guards, and free the brainrots. Freed characters come alive, walk around your base and earn cash. Every character is our own rigged and animated 3D model.',
      },
      features: {
        ru: ['5 зон: пирамиды, сокровищница, хрустальные пещеры, храмы в джунглях', 'Редкости вплоть до Mythic и Secret', '15 мутаций персонажей: Gold, Diamond, Galaxy, Rainbow, Lava, Neon и другие', 'Пассивный доход от персонажей на базе'],
        en: ['5 zones: pyramids, treasure vault, crystal caves, jungle temples', 'Rarities up to Mythic and Secret', '15 character mutations: Gold, Diamond, Galaxy, Rainbow, Lava, Neon and more', 'Passive income from characters on your base'],
      },
      role: {
        ru: ['Геймдизайн', 'Скрипты на Luau', '3D-персонажи и мутации', 'Иконка и обложки', 'Видео для TikTok'],
        en: ['Game design', 'Luau scripting', '3D characters & mutations', 'Icon & thumbnails', 'TikTok video'],
      },
    },
    {
      id: 'express', name: 'Brainrot Express', key: 'games/express',
      tagline: { ru: 'Лови, вези, богатей', en: 'Catch them, carry them, get rich' },
      desc: {
        ru: 'Игрок ловит брейнротов и везёт их на поезде к себе на базу. Персонажи приносят деньги, а базу нужно защищать: другие игроки могут украсть твоих брейнротов, и ты можешь украсть их у них.',
        en: 'Players catch brainrots and carry them by train back to their base. Characters earn money, and the base needs protecting: other players can steal your brainrots, and you can steal theirs.',
      },
      features: {
        ru: ['Ловля и перевозка персонажей', 'Своя база с доходом', 'Защита базы и кражи у соперников', 'Коллекция брейнротов'],
        en: ['Catching and carrying characters', 'Your own base with income', 'Base defence and raiding rivals', 'A brainrot collection'],
      },
      role: {
        ru: ['Геймдизайн', 'Скрипты на Luau', 'Иконка и обложки', 'Видео для TikTok'],
        en: ['Game design', 'Luau scripting', 'Icon & thumbnails', 'TikTok video'],
      },
    },
    {
      id: 'bomb', name: 'Bomb Dungeon', key: 'games/bomb',
      tagline: { ru: 'Бомбы, подземелья и боссы', en: 'Bombs, dungeons and bosses' },
      desc: {
        ru: 'Подземелье, где всё решают бомбы. Игроки спускаются всё глубже, прорываются через бесконечные этажи и каждые пять этажей встречают босса. По пути собирают коллекцию тематических бомб.',
        en: 'A dungeon crawler where bombs decide everything. Players go deeper through endless floors and face a boss every five floors, collecting themed bombs along the way.',
      },
      features: {
        ru: ['10 миров и бесконечные этажи', 'Босс каждые 5 этажей', 'Коллекция тематических бомб'],
        en: ['10 worlds and endless floors', 'A boss every 5 floors', 'A collection of themed bombs'],
      },
      role: {
        ru: ['Геймдизайн', 'Скрипты на Luau', 'Арт для обложек', 'Иконка'],
        en: ['Game design', 'Luau scripting', 'Thumbnail art', 'Icon'],
      },
    },
  ],
};
