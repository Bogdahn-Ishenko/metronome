export const LANGUAGES = ['ru', 'en', 'es', 'fr', 'de'] as const;
export type Language = (typeof LANGUAGES)[number];
export type Theme = 'auto' | 'dark' | 'light';

export interface Messages {
  language: string;
  theme: string;
  themes: Record<Theme, string>;
  brand: string;
  headerMeta: string;
  footerTitle: string;
  footerMeta: string;
  githubLink: string;
  documentTitle: string;
  title: string;
  lead: string;
  featuresTitle: string;
  features: { title: string; text: string }[];
  relatedTitle: string;
  relatedPages: { href: string; title: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  bar: string;
  beatCells: (beats: number, unit: number) => string;
  running: string;
  paused: string;
  audioBlocked: string;
  start: string;
  stop: string;
  tap: string;
  tapAgain: string;
  slower: string;
  faster: string;
  tempo: string;
  meter: string;
  fewerBeats: string;
  moreBeats: string;
  shorterUnit: string;
  longerUnit: string;
  groupByThree: string;
  subdivisions: string;
  noSubdivisions: string;
  sound: string;
  volume: string;
  accent: string;
  mute: string;
  tempos: string;
  accentPattern: (positions: string) => string;
}

export const MESSAGES: Record<Language, Messages> = {
  ru: {
    language: 'Язык',
    theme: 'Тема',
    themes: { auto: 'Авто', dark: 'Тёмная', light: 'Светлая' },
    brand: 'Метроном',
    headerMeta: 'Web Audio · без установки',
    footerTitle: 'Онлайн-метроном',
    footerMeta: 'Работает офлайн · звук синтезируется локально',
    githubLink: 'Проект на GitHub',
    documentTitle: 'Онлайн-метроном — точный темп, размер и дробление',
    title: 'Онлайн-метроном',
    lead: 'Метроном, который не врёт: щелчки планируются по аудиочасам, а не по таймерам браузера. Задайте темп, размер и дробление — и отсчитывайте такт за тактом. Без установки, регистрации и рекламы.',
    featuresTitle: 'Возможности',
    relatedTitle: 'Метроном для разных задач',
    relatedPages: [
      { href: '/metronome-for-guitar/', title: 'Для гитары' },
      { href: '/6-8-metronome/', title: 'Размер 6/8' },
      { href: '/tap-tempo/', title: 'Tap tempo' },
    ],
    features: [
      { title: 'Точность до сэмпла', text: 'Щелчки планируются по аудиочасам Web Audio, а не по таймерам браузера: расхождение между щелчком и заданным темпом не превышает единицу сэмпла.' },
      { title: 'Tap tempo', text: 'Постучите по кнопке «Тап» в ритме — метроном посчитает средний интервал между ударами и сразу поставит его рабочим темпом.' },
      { title: 'Размеры и акценты', text: 'Числитель от 2 до 12, знаменатель 1/2, 1/4, 1/8 или 1/16. Акценты отмечают сильные доли, сложные размеры группируются по три.' },
      { title: 'Дробление', text: 'Половинные, триольные и четвертные доли поверх основного пульса — чтобы выучить сложные места на слух.' },
      { title: 'Без установки', text: 'Никаких плагинов и аккаунтов: звук синтезируется прямо в браузере, а страница работает даже без интернета.' },
      { title: 'Горячие клавиши', text: 'Пробел — старт и стоп, стрелки — темп, Shift со стрелками — шаг в 10 BPM, клавиша T — тап-темпо.' },
    ],
    faqTitle: 'Частые вопросы',
    faq: [
      { q: 'Почему звук начинается только после нажатия?', a: 'Браузеры блокируют автовоспроизведение до жеста пользователя. Нажмите «Старт» или «Тап» — и звук пойдёт сразу.' },
      { q: 'Как пользоваться tap tempo?', a: 'Нажимайте «Тап» в ритме, не делая пауз длиннее двух секунд: после первого перерыва отсчёт сбрасывается. Метроном считает средний интервал между ударами и подставляет темп в BPM.' },
      { q: 'Чем 6/8 с группировкой по три отличается от обычного 6/8?', a: 'В сложных размерах пульс идёт по пунктирной четверти (♩.), а восьмые звучат как дробление внутри группы. Акценты падают на начало каждой группы из трёх: в 6/8 это доли 1 и 4.' },
      { q: 'Какие размеры поддерживаются?', a: 'Числитель — от 2 до 12 долей, знаменатель — 1/2, 1/4, 1/8 или 1/16. Размеры 6/8, 9/8 и 12/8 дополнительно дают переключатель группировки по три.' },
      { q: 'Можно ли пользоваться метрономом без интернета?', a: 'Да. Это обычная статическая страница, а звук синтезируется локально через Web Audio API. Один визит — и страница доступна офлайн из кеша браузера.' },
    ],
    bar: 'Такт',
    beatCells: (beats, unit) => `Доли такта ${beats} из ${unit}`,
    running: 'Идёт',
    paused: 'Пауза',
    audioBlocked: 'Браузер не дал запустить звук. Нажмите «Старт» ещё раз — аудио включается только после действия пользователя.',
    start: 'Старт', stop: 'Стоп', tap: 'Тап', tapAgain: 'Ещё раз',
    slower: 'Медленнее', faster: 'Быстрее', tempo: 'Темп', meter: 'Размер',
    fewerBeats: 'Меньше долей', moreBeats: 'Больше долей', shorterUnit: 'Меньше длительность', longerUnit: 'Больше длительность',
    groupByThree: 'Группировать по три', subdivisions: 'Дробление', noSubdivisions: 'Нет',
    sound: 'Звук', volume: 'Громкость', accent: 'Акцент', mute: 'Без звука', tempos: 'Темпы',
    accentPattern: (positions) => `Акцент: ${positions}`,
  },
  en: {
    language: 'Language', theme: 'Theme', themes: { auto: 'Auto', dark: 'Dark', light: 'Light' },
    brand: 'Metronome', headerMeta: 'Web Audio · no install', footerTitle: 'Online metronome', footerMeta: 'Works offline · sound is synthesized locally', githubLink: 'Project on GitHub', documentTitle: 'Online Metronome — precise tempo, meter and subdivisions',
    title: 'Online Metronome', lead: 'A metronome that keeps time: clicks are scheduled by the Web Audio clock, not browser timers. Set your tempo, meter, and subdivisions, then keep time bar by bar. No installation, account, or ads.',
    featuresTitle: 'Features', relatedTitle: 'Metronome guides', relatedPages: [
      { href: '/metronome-for-guitar/', title: 'For guitar' },
      { href: '/6-8-metronome/', title: '6/8 meter' },
      { href: '/tap-tempo/', title: 'Tap tempo' },
    ], features: [
      { title: 'Sample-accurate timing', text: 'Clicks are scheduled against the Web Audio clock rather than browser timers, keeping timing drift within a single audio sample.' },
      { title: 'Tap tempo', text: 'Tap along with the button and the metronome averages the intervals, then sets the measured BPM immediately.' },
      { title: 'Meters and accents', text: 'Choose 2 to 12 beats and a 1/2, 1/4, 1/8, or 1/16 note value. Accents mark strong beats, and compound meters can be grouped in threes.' },
      { title: 'Subdivisions', text: 'Add eighth-note, triplet, or sixteenth-note subdivisions over the main pulse to work through tricky passages.' },
      { title: 'No installation', text: 'No plugins or account needed. Sound is synthesized in your browser, and the page works offline.' },
      { title: 'Keyboard shortcuts', text: 'Space starts and stops, arrow keys adjust tempo, Shift plus an arrow changes it by 10 BPM, and T taps the tempo.' },
    ],
    faqTitle: 'Frequently asked questions', faq: [
      { q: 'Why does sound start only after I click?', a: 'Browsers block autoplay until you interact with the page. Press Start or Tap and sound will begin.' },
      { q: 'How do I use tap tempo?', a: 'Tap along with the beat, keeping gaps under two seconds. The metronome averages your taps and sets the tempo in BPM.' },
      { q: 'How is grouped 6/8 different from regular 6/8?', a: 'In compound meter, the pulse falls on the dotted quarter (♩.) and eighth notes subdivide each group. In 6/8, accents fall on beats 1 and 4.' },
      { q: 'Which time signatures are supported?', a: 'Choose 2 to 12 beats and a denominator of 2, 4, 8, or 16. The 6/8, 9/8, and 12/8 meters also support grouping by three.' },
      { q: 'Can I use the metronome offline?', a: 'Yes. Sound is generated locally with the Web Audio API, and the page remains available offline after it has loaded.' },
    ],
    bar: 'Bar', beatCells: (beats, unit) => `Beats in ${beats}/${unit} meter`, running: 'Playing', paused: 'Paused',
    audioBlocked: 'Your browser blocked audio. Press Start again; audio can only play after a user action.',
    start: 'Start', stop: 'Stop', tap: 'Tap', tapAgain: 'Tap again', slower: 'Slower', faster: 'Faster', tempo: 'Tempo', meter: 'Meter',
    fewerBeats: 'Fewer beats', moreBeats: 'More beats', shorterUnit: 'Shorter note value', longerUnit: 'Longer note value', groupByThree: 'Group by three', subdivisions: 'Subdivisions', noSubdivisions: 'None',
    sound: 'Sound', volume: 'Volume', accent: 'Accent', mute: 'Mute', tempos: 'Tempo markings', accentPattern: (positions) => `Accent: ${positions}`,
  },
  es: {
    language: 'Idioma', theme: 'Tema', themes: { auto: 'Automático', dark: 'Oscuro', light: 'Claro' },
    brand: 'Metrónomo', headerMeta: 'Web Audio · sin instalación', footerTitle: 'Metrónomo online', footerMeta: 'Funciona sin conexión · sonido sintetizado localmente', githubLink: 'Proyecto en GitHub', documentTitle: 'Metrónomo online — tempo, compás y subdivisiones',
    title: 'Metrónomo online', lead: 'Un metrónomo que mantiene el pulso: los clics se programan con el reloj de Web Audio, no con temporizadores del navegador. Ajusta el tempo, el compás y las subdivisiones, y sigue el ritmo compás a compás. Sin instalación, cuenta ni anuncios.',
    featuresTitle: 'Funciones', relatedTitle: 'Guías de metrónomo', relatedPages: [
      { href: '/metronome-for-guitar/', title: 'Para guitarra' },
      { href: '/6-8-metronome/', title: 'Compás 6/8' },
      { href: '/tap-tempo/', title: 'Tap tempo' },
    ], features: [
      { title: 'Precisión de muestra', text: 'Los clics se programan con el reloj de Web Audio, no con temporizadores del navegador, con una desviación inferior a una muestra de audio.' },
      { title: 'Tap tempo', text: 'Pulsa al ritmo y el metrónomo calculará el intervalo medio para ajustar el tempo en BPM al instante.' },
      { title: 'Compases y acentos', text: 'Elige de 2 a 12 pulsos y valores de 1/2, 1/4, 1/8 o 1/16. Los acentos marcan los pulsos fuertes y los compases compuestos se agrupan de tres en tres.' },
      { title: 'Subdivisiones', text: 'Añade subdivisiones de corcheas, tresillos o semicorcheas al pulso principal para practicar pasajes difíciles.' },
      { title: 'Sin instalación', text: 'No necesitas complementos ni cuenta. El sonido se genera en el navegador y la página funciona sin conexión.' },
      { title: 'Atajos de teclado', text: 'Espacio inicia y detiene; las flechas ajustan el tempo; Mayús y una flecha cambian 10 BPM; T marca el tempo.' },
    ],
    faqTitle: 'Preguntas frecuentes', faq: [
      { q: '¿Por qué el sonido empieza solo después de pulsar?', a: 'Los navegadores bloquean la reproducción automática hasta que interactúas con la página. Pulsa Iniciar o Tap para empezar.' },
      { q: '¿Cómo se usa tap tempo?', a: 'Pulsa al ritmo y evita pausas de más de dos segundos. El metrónomo calcula la media de tus pulsaciones y ajusta los BPM.' },
      { q: '¿En qué se diferencia el 6/8 agrupado de un 6/8 normal?', a: 'En el compás compuesto, el pulso cae en la negra con puntillo (♩.) y las corcheas subdividen cada grupo. En 6/8, los acentos caen en los pulsos 1 y 4.' },
      { q: '¿Qué compases admite?', a: 'Elige de 2 a 12 pulsos y denominadores de 2, 4, 8 o 16. Los compases 6/8, 9/8 y 12/8 también permiten agrupar de tres en tres.' },
      { q: '¿Puedo usar el metrónomo sin conexión?', a: 'Sí. El sonido se genera localmente con Web Audio API y, una vez cargada, la página está disponible sin conexión.' },
    ],
    bar: 'Compás', beatCells: (beats, unit) => `Pulsos del compás ${beats}/${unit}`, running: 'En marcha', paused: 'En pausa',
    audioBlocked: 'El navegador bloqueó el sonido. Pulsa Iniciar otra vez; el audio solo se activa tras una acción del usuario.',
    start: 'Iniciar', stop: 'Parar', tap: 'Tap', tapAgain: 'Toca otra vez', slower: 'Más lento', faster: 'Más rápido', tempo: 'Tempo', meter: 'Compás',
    fewerBeats: 'Menos pulsos', moreBeats: 'Más pulsos', shorterUnit: 'Valor más corto', longerUnit: 'Valor más largo', groupByThree: 'Agrupar de tres en tres', subdivisions: 'Subdivisiones', noSubdivisions: 'Ninguna',
    sound: 'Sonido', volume: 'Volumen', accent: 'Acento', mute: 'Silenciar', tempos: 'Indicaciones de tempo', accentPattern: (positions) => `Acento: ${positions}`,
  },
  fr: {
    language: 'Langue', theme: 'Thème', themes: { auto: 'Auto', dark: 'Sombre', light: 'Clair' },
    brand: 'Métronome', headerMeta: 'Web Audio · sans installation', footerTitle: 'Métronome en ligne', footerMeta: 'Fonctionne hors ligne · son synthétisé localement', githubLink: 'Projet sur GitHub', documentTitle: 'Métronome en ligne — tempo, mesure et subdivisions',
    title: 'Métronome en ligne', lead: 'Un métronome qui garde le temps : les clics sont programmés avec l’horloge Web Audio, et non avec les minuteurs du navigateur. Réglez le tempo, la mesure et les subdivisions, puis gardez le rythme mesure après mesure. Sans installation, compte ni publicité.',
    featuresTitle: 'Fonctionnalités', relatedTitle: 'Guides du métronome', relatedPages: [
      { href: '/metronome-for-guitar/', title: 'Pour guitare' },
      { href: '/6-8-metronome/', title: 'Mesure 6/8' },
      { href: '/tap-tempo/', title: 'Tap tempo' },
    ], features: [
      { title: 'Précision à l’échantillon', text: 'Les clics sont programmés selon l’horloge Web Audio plutôt que les minuteurs du navigateur, avec une dérive inférieure à un échantillon audio.' },
      { title: 'Tap tempo', text: 'Tapez en rythme et le métronome calcule l’intervalle moyen pour régler immédiatement le tempo en BPM.' },
      { title: 'Mesures et accents', text: 'Choisissez de 2 à 12 temps et une valeur de 1/2, 1/4, 1/8 ou 1/16. Les accents marquent les temps forts et les mesures composées peuvent être groupées par trois.' },
      { title: 'Subdivisions', text: 'Ajoutez des subdivisions en croches, triolets ou doubles croches au battement principal pour travailler les passages difficiles.' },
      { title: 'Sans installation', text: 'Aucun plug-in ni compte requis. Le son est synthétisé dans votre navigateur et la page fonctionne hors ligne.' },
      { title: 'Raccourcis clavier', text: 'Espace démarre et arrête, les flèches règlent le tempo, Maj et une flèche le modifient de 10 BPM, et T marque le tempo.' },
    ],
    faqTitle: 'Questions fréquentes', faq: [
      { q: 'Pourquoi le son ne démarre-t-il qu’après un clic ?', a: 'Les navigateurs bloquent la lecture automatique jusqu’à une interaction. Appuyez sur Démarrer ou Tap pour lancer le son.' },
      { q: 'Comment utiliser le tap tempo ?', a: 'Tapez en rythme sans faire de pause de plus de deux secondes. Le métronome calcule la moyenne de vos frappes et règle les BPM.' },
      { q: 'Quelle différence entre un 6/8 groupé et un 6/8 classique ?', a: 'En mesure composée, le battement tombe sur la noire pointée (♩.) et les croches subdivisent chaque groupe. En 6/8, les accents tombent sur les temps 1 et 4.' },
      { q: 'Quelles mesures sont prises en charge ?', a: 'Choisissez de 2 à 12 temps et un dénominateur de 2, 4, 8 ou 16. Les mesures 6/8, 9/8 et 12/8 peuvent aussi être groupées par trois.' },
      { q: 'Puis-je utiliser le métronome hors ligne ?', a: 'Oui. Le son est généré localement avec Web Audio API et la page reste disponible hors ligne après son chargement.' },
    ],
    bar: 'Mesure', beatCells: (beats, unit) => `Temps de la mesure ${beats}/${unit}`, running: 'En marche', paused: 'En pause',
    audioBlocked: 'Votre navigateur a bloqué le son. Appuyez à nouveau sur Démarrer ; le son ne peut être activé qu’après une action.',
    start: 'Démarrer', stop: 'Arrêter', tap: 'Tap', tapAgain: 'Tapez encore', slower: 'Plus lent', faster: 'Plus rapide', tempo: 'Tempo', meter: 'Mesure',
    fewerBeats: 'Moins de temps', moreBeats: 'Plus de temps', shorterUnit: 'Valeur plus courte', longerUnit: 'Valeur plus longue', groupByThree: 'Grouper par trois', subdivisions: 'Subdivisions', noSubdivisions: 'Aucune',
    sound: 'Son', volume: 'Volume', accent: 'Accent', mute: 'Muet', tempos: 'Indications de tempo', accentPattern: (positions) => `Accent : ${positions}`,
  },
  de: {
    language: 'Sprache', theme: 'Design', themes: { auto: 'Automatisch', dark: 'Dunkel', light: 'Hell' },
    brand: 'Metronom', headerMeta: 'Web Audio · keine Installation', footerTitle: 'Online-Metronom', footerMeta: 'Offline nutzbar · Klang wird lokal erzeugt', githubLink: 'Projekt auf GitHub', documentTitle: 'Online-Metronom — Tempo, Taktart und Unterteilungen',
    title: 'Online-Metronom', lead: 'Ein Metronom, das den Takt hält: Die Klicks werden mit der Web-Audio-Uhr statt mit Browser-Timern geplant. Stelle Tempo, Taktart und Unterteilungen ein und bleibe Takt für Takt im Rhythmus. Ohne Installation, Konto oder Werbung.',
    featuresTitle: 'Funktionen', relatedTitle: 'Metronom-Ratgeber', relatedPages: [
      { href: '/metronome-for-guitar/', title: 'Für Gitarre' },
      { href: '/6-8-metronome/', title: '6/8-Takt' },
      { href: '/tap-tempo/', title: 'Tap Tempo' },
    ], features: [
      { title: 'Samplegenaues Timing', text: 'Klicks werden anhand der Web-Audio-Uhr statt mit Browser-Timern geplant. Die Abweichung bleibt unter einer Audioabtastung.' },
      { title: 'Tap Tempo', text: 'Tippe im Takt mit. Das Metronom mittelt die Abstände und stellt das ermittelte BPM-Tempo sofort ein.' },
      { title: 'Taktarten und Akzente', text: 'Wähle 2 bis 12 Schläge und Notenwerte von 1/2, 1/4, 1/8 oder 1/16. Akzente markieren betonte Schläge; zusammengesetzte Taktarten lassen sich in Dreiergruppen gliedern.' },
      { title: 'Unterteilungen', text: 'Ergänze Achtel-, Triolen- oder Sechzehntel-Unterteilungen zum Grundschlag, um schwierige Passagen zu üben.' },
      { title: 'Keine Installation', text: 'Keine Plugins und kein Konto nötig. Der Klang wird im Browser erzeugt, und die Seite funktioniert offline.' },
      { title: 'Tastenkürzel', text: 'Leertaste startet und stoppt, Pfeiltasten ändern das Tempo, Umschalt plus Pfeil ändert es um 10 BPM und T tippt das Tempo.' },
    ],
    faqTitle: 'Häufige Fragen', faq: [
      { q: 'Warum startet der Ton erst nach einem Klick?', a: 'Browser blockieren die automatische Wiedergabe bis zur ersten Interaktion. Drücke Start oder Tap, um den Ton zu aktivieren.' },
      { q: 'Wie funktioniert Tap Tempo?', a: 'Tippe im Takt und mache keine Pause von mehr als zwei Sekunden. Das Metronom mittelt deine Eingaben und stellt die BPM ein.' },
      { q: 'Was unterscheidet gruppiertes 6/8 von normalem 6/8?', a: 'Im zusammengesetzten Takt liegt der Puls auf der punktierten Viertelnote (♩.); Achtel unterteilen jede Gruppe. In 6/8 liegen die Akzente auf Schlag 1 und 4.' },
      { q: 'Welche Taktarten werden unterstützt?', a: 'Wähle 2 bis 12 Schläge und einen Nenner von 2, 4, 8 oder 16. Bei 6/8, 9/8 und 12/8 kannst du zusätzlich in Dreiergruppen gliedern.' },
      { q: 'Kann ich das Metronom offline verwenden?', a: 'Ja. Der Klang wird lokal mit der Web Audio API erzeugt. Nach dem Laden ist die Seite auch offline verfügbar.' },
    ],
    bar: 'Takt', beatCells: (beats, unit) => `Schläge im ${beats}/${unit}-Takt`, running: 'Läuft', paused: 'Pause',
    audioBlocked: 'Dein Browser hat den Ton blockiert. Drücke erneut auf Start; Audio wird erst nach einer Nutzeraktion aktiviert.',
    start: 'Start', stop: 'Stopp', tap: 'Tap', tapAgain: 'Noch einmal tippen', slower: 'Langsamer', faster: 'Schneller', tempo: 'Tempo', meter: 'Taktart',
    fewerBeats: 'Weniger Schläge', moreBeats: 'Mehr Schläge', shorterUnit: 'Kürzerer Notenwert', longerUnit: 'Längerer Notenwert', groupByThree: 'In Dreiergruppen', subdivisions: 'Unterteilungen', noSubdivisions: 'Keine',
    sound: 'Klang', volume: 'Lautstärke', accent: 'Akzent', mute: 'Stumm', tempos: 'Tempobezeichnungen', accentPattern: (positions) => `Akzent: ${positions}`,
  },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};