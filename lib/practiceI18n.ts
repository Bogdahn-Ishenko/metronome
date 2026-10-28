import type { Language } from '@/lib/i18n';
import type { PracticePage } from '@/lib/practicePages';

export type PracticePageId = 'guitar' | 'compound' | 'tap';
export type PracticePageCopy = Pick<PracticePage, 'title' | 'description' | 'intro' | 'sections' | 'faq'>;

export const PRACTICE_COPY: Partial<Record<Language, Record<PracticePageId, PracticePageCopy>>> = {
  en: {
    guitar: {
      title: 'Online Guitar Metronome',
      description: 'An online metronome for guitar practice. Set the tempo, meter, and accents to work on rhythm, picking patterns, and chord changes.',
      intro: 'Use this metronome for acoustic or electric guitar practice. Choose a comfortable tempo, turn on accents, and build up your exercises while keeping a steady pulse.',
      sections: [
        { title: 'Start at a comfortable tempo', text: 'Set a tempo at which you can play the passage cleanly and without strain. If the rhythm falls apart, lower the BPM. Once several repetitions feel steady, increase it gradually and keep listening for clean notes.' },
        { title: 'Practice the rhythm on its own', text: 'Start with one downstroke per click, then add upstrokes, eighth notes, and other patterns. In 4/4, the metronome marks each beat of the bar, while the accent helps you keep track of beat one.' },
        { title: 'Work on chord changes', text: 'Choose a short chord progression and change chords after the same number of beats. Increase the tempo only when the changes stay even and your picking hand remains relaxed.' },
      ],
      faq: [
        { question: 'What tempo should I start practicing guitar at?', answer: 'There is no universal number. Start at a tempo where you can play the exercise cleanly. If you have to rush or stop, lower the BPM and build up gradually.' },
        { question: 'How does a metronome help me play more steadily?', answer: 'It provides a consistent external pulse. Line up chord changes, picking, and rests with the beat, then check whether familiar passages make you speed up.' },
      ],
    },
    compound: {
      title: 'Online 6/8 Metronome',
      description: 'A metronome for 6/8 with groups of three eighth notes, accents on beats 1 and 4, and adjustable tempo.',
      intro: 'Set the metronome to 6/8 and feel two main beats in each bar. In compound meter, six eighth notes are grouped into two groups of three.',
      sections: [
        { title: 'How to count 6/8', text: 'Count “one-two-three, four-five-six,” emphasizing the first and fourth eighth notes. This creates two main pulses, each subdivided into three.' },
        { title: 'Choose how you feel the pulse', text: 'Turn on grouping by three to hear a click at the start of each group. Turn it off to hear all six eighth notes separately. This changes the grouping and accents, not the tempo formula.' },
        { title: 'Adjust the tempo', text: 'Start slowly and say the three eighth notes within each main beat. Increase the tempo once the transition between groups feels even.' },
      ],
      faq: [
        { question: 'Where do the accents fall in 6/8?', answer: 'With groups of three, the main accents fall at the start of each group: on the first and fourth eighth notes of the bar.' },
        { question: 'How is 6/8 different from 3/4?', answer: 'In 6/8, you usually hear two compound beats, each divided into three eighth notes. In 3/4, you usually hear three beats, each divided into two eighth notes. The same number of eighth notes does not mean the pulse feels the same.' },
      ],
    },
    tap: {
      title: 'Tap Tempo Online: Find the BPM by Tapping',
      description: 'Find the tempo of a song or exercise with tap tempo. Tap along to get the BPM, then keep practicing with the metronome.',
      intro: 'Not sure how fast a song is? Tap the button along with the music. The metronome averages the intervals between taps and sets the measured tempo in BPM.',
      sections: [
        { title: 'How to measure tempo', text: 'Choose a steady part of the song and tap on each main beat. Several consecutive taps give a more stable estimate than a single interval. After a short pause, the measurement starts over.' },
        { title: 'What BPM means', text: 'BPM is the number of beats per minute. For example, 120 BPM means two beats per second. Press Start to check the result against the music.' },
        { title: 'When the rhythm changes', text: 'Measure a section with a steady pulse. Intros, pauses, and free rubato can skew the average, so repeat the tap tempo on a more consistent passage.' },
      ],
      faq: [
        { question: 'How many times should I tap?', answer: 'Tap several consecutive beats. The metronome averages the intervals, so a series of taps is usually more accurate than a single measurement.' },
        { question: 'Why can tap tempo give a different result?', answer: 'Human reaction time and your choice of pulse both affect accuracy: you might tap the main beats or their subdivisions. Repeat the measurement on a steady passage using the same rhythmic feel.' },
      ],
    },
  },
  es: {
    guitar: {
      title: 'Metrónomo online para guitarra',
      description: 'Metrónomo online para practicar guitarra. Ajusta el tempo, el compás y los acentos para trabajar el ritmo, los patrones de púa y los cambios de acordes.',
      intro: 'Usa este metrónomo para practicar con guitarra acústica o eléctrica. Elige un tempo cómodo, activa los acentos y aumenta poco a poco la dificultad sin perder el pulso.',
      sections: [
        { title: 'Empieza a un tempo cómodo', text: 'Elige un tempo al que puedas tocar el fragmento con limpieza y sin tensión. Si el ritmo se desordena, baja los BPM. Cuando varias repeticiones salgan estables, aumenta poco a poco y sigue cuidando el sonido.' },
        { title: 'Practica el ritmo por separado', text: 'Empieza con un rasgueo hacia abajo por clic y luego añade golpes hacia arriba, corcheas y otros patrones. En 4/4, el metrónomo marca cada pulso del compás y el acento ayuda a localizar el primero.' },
        { title: 'Trabaja los cambios de acordes', text: 'Elige una secuencia breve y cambia de acorde tras el mismo número de pulsos. Sube el tempo solo cuando los cambios sean regulares y la mano derecha siga relajada.' },
      ],
      faq: [
        { question: '¿A qué tempo debería empezar a practicar guitarra?', answer: 'No hay una cifra universal. Empieza a un tempo que te permita tocar el ejercicio con limpieza. Si tienes que correr o parar, baja los BPM y aumenta gradualmente.' },
        { question: '¿Cómo ayuda el metrónomo a tocar con más regularidad?', answer: 'Ofrece un pulso externo constante. Coordina con él los cambios de acordes, la púa y los silencios, y comprueba si aceleras en los pasajes que ya conoces.' },
      ],
    },
    compound: {
      title: 'Metrónomo online para 6/8',
      description: 'Metrónomo para 6/8 con grupos de tres corcheas, acentos en los pulsos 1 y 4 y tempo ajustable.',
      intro: 'Configura el metrónomo en 6/8 y siente dos pulsos principales por compás. En el compás compuesto, seis corcheas se agrupan en dos grupos de tres.',
      sections: [
        { title: 'Cómo contar 6/8', text: 'Cuenta «uno-dos-tres, cuatro-cinco-seis» y marca la primera y la cuarta corchea. Así se perciben dos pulsos principales, cada uno dividido en tres.' },
        { title: 'Elige cómo sentir el pulso', text: 'Activa la agrupación de tres para oír un clic al inicio de cada grupo. Desactívala si quieres oír las seis corcheas por separado. Esto cambia la agrupación y los acentos, no la fórmula del tempo.' },
        { title: 'Ajusta la velocidad', text: 'Empieza despacio y pronuncia las tres corcheas dentro de cada pulso principal. Aumenta el tempo cuando el paso entre grupos sea regular.' },
      ],
      faq: [
        { question: '¿Dónde van los acentos en 6/8?', answer: 'Con grupos de tres, los acentos principales van al inicio de cada grupo: en la primera y la cuarta corchea del compás.' },
        { question: '¿En qué se diferencia el 6/8 del 3/4?', answer: 'En 6/8 suelen sentirse dos pulsos compuestos, cada uno dividido en tres corcheas. En 3/4 suelen sentirse tres pulsos, cada uno dividido en dos. Tener el mismo número de corcheas no implica el mismo pulso.' },
      ],
    },
    tap: {
      title: 'Tap tempo online: calcula los BPM con golpecitos',
      description: 'Descubre el tempo de una canción o ejercicio con tap tempo. Marca el ritmo, obtén los BPM y sigue practicando con el metrónomo.',
      intro: '¿No sabes el tempo exacto de una canción? Pulsa el botón al ritmo de la música. El metrónomo calcula la media entre pulsaciones y ajusta el tempo en BPM.',
      sections: [
        { title: 'Cómo medir el tempo', text: 'Escucha una parte estable de la canción y pulsa en cada pulso principal. Varias pulsaciones seguidas ofrecen una estimación más estable que un solo intervalo. Tras una pausa breve, la medición empieza de nuevo.' },
        { title: 'Qué significa BPM', text: 'BPM es el número de pulsos por minuto. Por ejemplo, 120 BPM son dos pulsos por segundo. Pulsa Iniciar para comparar el resultado con la música.' },
        { title: 'Si cambia el ritmo', text: 'Mide una sección con un pulso constante. Las introducciones, pausas y el rubato libre pueden alterar la media; repite tap tempo en un fragmento más regular.' },
      ],
      faq: [
        { question: '¿Cuántas veces debo pulsar?', answer: 'Marca varios pulsos seguidos. El metrónomo calcula la media de los intervalos, así que una serie suele ser más precisa que una sola medición.' },
        { question: '¿Por qué puede variar el resultado de tap tempo?', answer: 'Influyen el tiempo de reacción y el pulso que elijas: puedes marcar los pulsos principales o sus subdivisiones. Repite la medición en un fragmento estable y con la misma sensación rítmica.' },
      ],
    },
  },
  fr: {
    guitar: {
      title: 'Métronome en ligne pour guitare',
      description: 'Un métronome en ligne pour travailler la guitare. Réglez le tempo, la mesure et les accents pour exercer le rythme, les coups de médiator et les changements d’accords.',
      intro: 'Utilisez ce métronome pour travailler la guitare acoustique ou électrique. Choisissez un tempo confortable, activez les accents et augmentez progressivement la difficulté tout en gardant une pulsation régulière.',
      sections: [
        { title: 'Commencez à un tempo confortable', text: 'Choisissez un tempo auquel vous pouvez jouer le passage proprement et sans tension. Si le rythme se défait, baissez les BPM. Quand plusieurs répétitions sont régulières, augmentez progressivement en restant attentif à la qualité du son.' },
        { title: 'Travaillez le rythme séparément', text: 'Commencez par un coup vers le bas par clic, puis ajoutez les coups vers le haut, les croches et d’autres motifs. En 4/4, le métronome marque chaque temps et l’accent aide à repérer le premier.' },
        { title: 'Travaillez les changements d’accords', text: 'Choisissez une courte suite d’accords et changez d’accord après le même nombre de temps. N’augmentez le tempo que lorsque les changements restent réguliers et que la main droite est détendue.' },
      ],
      faq: [
        { question: 'À quel tempo commencer la guitare ?', answer: 'Il n’existe pas de valeur universelle. Commencez à un tempo où vous pouvez jouer proprement. Si vous devez vous presser ou vous arrêter, baissez les BPM puis augmentez-les progressivement.' },
        { question: 'Comment le métronome aide-t-il à jouer régulièrement ?', answer: 'Il fournit une pulsation externe constante. Alignez les changements d’accords, les coups de médiator et les silences sur le temps, puis vérifiez si vous accélérez dans les passages familiers.' },
      ],
    },
    compound: {
      title: 'Métronome 6/8 en ligne',
      description: 'Métronome pour la mesure 6/8 avec groupes de trois croches, accents sur les temps 1 et 4 et tempo réglable.',
      intro: 'Réglez le métronome en 6/8 et ressentez deux temps principaux par mesure. En mesure composée, les six croches se répartissent en deux groupes de trois.',
      sections: [
        { title: 'Compter en 6/8', text: 'Comptez « un-deux-trois, quatre-cinq-six » en accentuant la première et la quatrième croche. Vous entendrez ainsi deux pulsations principales, chacune divisée en trois.' },
        { title: 'Choisissez votre ressenti de la pulsation', text: 'Activez le groupement par trois pour entendre un clic au début de chaque groupe. Désactivez-le pour entendre les six croches séparément. Cela change le groupement et les accents, pas la formule du tempo.' },
        { title: 'Réglez la vitesse', text: 'Commencez lentement et prononcez les trois croches de chaque temps principal. Augmentez le tempo lorsque le passage d’un groupe à l’autre reste régulier.' },
      ],
      faq: [
        { question: 'Où placer les accents en 6/8 ?', answer: 'Avec un groupement par trois, les accents principaux tombent au début de chaque groupe : sur la première et la quatrième croche de la mesure.' },
        { question: 'Quelle différence entre 6/8 et 3/4 ?', answer: 'En 6/8, on ressent généralement deux temps composés, chacun divisé en trois croches. En 3/4, on ressent généralement trois temps, chacun divisé en deux croches. Le même nombre de croches ne signifie pas la même pulsation.' },
      ],
    },
    tap: {
      title: 'Tap tempo en ligne : trouvez les BPM en tapant',
      description: 'Trouvez le tempo d’un morceau ou d’un exercice avec le tap tempo. Marquez la pulsation, obtenez les BPM et continuez à travailler avec le métronome.',
      intro: 'Vous ne connaissez pas le tempo exact d’un morceau ? Tapez sur le bouton au rythme de la musique. Le métronome moyenne les intervalles et règle le tempo mesuré en BPM.',
      sections: [
        { title: 'Mesurer le tempo', text: 'Écoutez une partie régulière du morceau et tapez sur chaque temps principal. Plusieurs frappes consécutives donnent une estimation plus stable qu’un seul intervalle. Après une courte pause, la mesure recommence.' },
        { title: 'Que signifie BPM ?', text: 'BPM indique le nombre de temps par minute. Par exemple, 120 BPM correspond à deux temps par seconde. Appuyez sur Démarrer pour comparer le résultat à la musique.' },
        { title: 'Lorsque le rythme change', text: 'Mesurez une section dont la pulsation est stable. Les introductions, les pauses et le rubato libre peuvent fausser la moyenne ; recommencez sur un passage plus régulier.' },
      ],
      faq: [
        { question: 'Combien de fois faut-il taper ?', answer: 'Tapez sur plusieurs temps consécutifs. Le métronome moyenne les intervalles ; une série est donc généralement plus précise qu’une seule mesure.' },
        { question: 'Pourquoi le résultat du tap tempo peut-il varier ?', answer: 'Le temps de réaction et le choix de la pulsation influencent la précision : vous pouvez taper les temps principaux ou leurs subdivisions. Recommencez sur un passage régulier en gardant le même ressenti rythmique.' },
      ],
    },
  },
  de: {
    guitar: {
      title: 'Online-Metronom für Gitarre',
      description: 'Online-Metronom zum Gitarreüben. Stelle Tempo, Taktart und Akzente ein, um Rhythmus, Anschlagmuster und Akkordwechsel zu trainieren.',
      intro: 'Nutze dieses Metronom zum Üben auf Akustik- oder E-Gitarre. Wähle ein angenehmes Tempo, aktiviere Akzente und steigere die Schwierigkeit schrittweise, ohne den gleichmäßigen Puls zu verlieren.',
      sections: [
        { title: 'Mit einem angenehmen Tempo beginnen', text: 'Wähle ein Tempo, bei dem du die Passage sauber und ohne Anspannung spielen kannst. Wenn der Rhythmus auseinanderfällt, senke die BPM. Sobald mehrere Wiederholungen gleichmäßig gelingen, erhöhe das Tempo schrittweise und achte weiter auf klare Töne.' },
        { title: 'Den Rhythmus einzeln üben', text: 'Beginne mit einem Abschlag pro Klick und ergänze dann Aufschläge, Achtelnoten und weitere Muster. Im 4/4-Takt markiert das Metronom jeden Taktschlag; der Akzent hilft dir, den ersten Schlag zu finden.' },
        { title: 'Akkordwechsel üben', text: 'Wähle eine kurze Akkordfolge und wechsle nach derselben Anzahl von Schlägen. Erhöhe das Tempo erst, wenn die Wechsel gleichmäßig bleiben und deine Schlaghand entspannt ist.' },
      ],
      faq: [
        { question: 'Mit welchem Tempo sollte ich Gitarre üben?', answer: 'Es gibt keine allgemeingültige Zahl. Beginne in einem Tempo, bei dem du die Übung sauber spielen kannst. Wenn du hetzen oder stoppen musst, senke die BPM und steigere sie langsam.' },
        { question: 'Wie hilft ein Metronom beim gleichmäßigen Spielen?', answer: 'Es liefert einen gleichmäßigen äußeren Puls. Richte Akkordwechsel, Anschläge und Pausen daran aus und prüfe, ob du bei vertrauten Stellen schneller wirst.' },
      ],
    },
    compound: {
      title: 'Online-Metronom für 6/8',
      description: 'Metronom für den 6/8-Takt mit Dreiergruppen aus Achtelnoten, Akzenten auf Schlag 1 und 4 und einstellbarem Tempo.',
      intro: 'Stelle das Metronom auf 6/8 und fühle zwei Hauptschläge pro Takt. Im zusammengesetzten Takt werden sechs Achtelnoten in zwei Dreiergruppen gegliedert.',
      sections: [
        { title: '6/8 zählen', text: 'Zähle „eins-zwei-drei, vier-fünf-sechs“ und betone das erste und vierte Achtel. So entstehen zwei Hauptpulse, die jeweils in drei Teile untergliedert sind.' },
        { title: 'Das Pulsgefühl wählen', text: 'Aktiviere die Dreiergruppierung, damit der Klick am Anfang jeder Gruppe erklingt. Schalte sie aus, wenn du alle sechs Achtel einzeln hören möchtest. Das ändert Gruppierung und Akzente, nicht die Tempoberechnung.' },
        { title: 'Das Tempo anpassen', text: 'Beginne langsam und sprich die drei Achtel innerhalb jedes Hauptschlags mit. Erhöhe das Tempo, wenn der Wechsel zwischen den Gruppen gleichmäßig bleibt.' },
      ],
      faq: [
        { question: 'Wo liegen die Akzente im 6/8-Takt?', answer: 'Bei Dreiergruppen liegen die Hauptakzente am Anfang jeder Gruppe: auf dem ersten und vierten Achtel des Takts.' },
        { question: 'Was unterscheidet 6/8 von 3/4?', answer: 'Im 6/8-Takt hört man meist zwei zusammengesetzte Schläge, die jeweils in drei Achtel unterteilt sind. Im 3/4-Takt hört man meist drei Schläge mit jeweils zwei Achteln. Dieselbe Anzahl an Achteln bedeutet nicht dasselbe Pulsgefühl.' },
      ],
    },
    tap: {
      title: 'Tap Tempo online: BPM durch Tippen ermitteln',
      description: 'Ermittle das Tempo eines Songs oder einer Übung mit Tap Tempo. Tippe den Puls mit, lies die BPM ab und übe anschließend mit dem Metronom weiter.',
      intro: 'Du kennst das genaue Tempo eines Songs nicht? Tippe im Takt auf die Schaltfläche. Das Metronom mittelt die Abstände zwischen den Eingaben und stellt das ermittelte Tempo in BPM ein.',
      sections: [
        { title: 'Tempo messen', text: 'Höre einen gleichmäßigen Abschnitt des Songs und tippe auf jeden Hauptschlag. Mehrere aufeinanderfolgende Eingaben ergeben einen stabileren Wert als ein einzelner Abstand. Nach einer kurzen Pause beginnt die Messung von vorn.' },
        { title: 'Was BPM bedeutet', text: 'BPM gibt die Anzahl der Schläge pro Minute an. 120 BPM entsprechen zum Beispiel zwei Schlägen pro Sekunde. Drücke Start, um das Ergebnis mit der Musik zu vergleichen.' },
        { title: 'Wenn sich der Rhythmus ändert', text: 'Miss einen Abschnitt mit gleichmäßigem Puls. Intros, Pausen und freies Rubato können den Mittelwert verfälschen. Wiederhole die Messung in einer gleichmäßigeren Passage.' },
      ],
      faq: [
        { question: 'Wie oft sollte ich tippen?', answer: 'Tippe mehrere aufeinanderfolgende Schläge mit. Das Metronom mittelt die Abstände, deshalb ist eine Folge meist genauer als eine einzelne Messung.' },
        { question: 'Warum kann das Tap-Tempo-Ergebnis abweichen?', answer: 'Reaktionszeit und gewählter Puls beeinflussen die Genauigkeit: Du kannst die Hauptschläge oder ihre Unterteilungen tippen. Wiederhole die Messung in einem gleichmäßigen Abschnitt mit demselben Rhythmusgefühl.' },
      ],
    },
  },
};
