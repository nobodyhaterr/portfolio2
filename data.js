/* NOBODYHATERR® — content.
   Add a project: push an object into `projects` (images go in /assets as NAME.webp + NAME-s.webp for the grid).
   Add a video: push an object into `videos` with the YouTube ids in `yt`. */
window.SITE = {
  email: "nobodyhaterr@gmail.com",
  instagram: "https://instagram.com/nobodyhaterr",

  projects: [
    {
      title: "Dead Insect's Eye", year: "2026", ratio: [1, 1],
      cat: { en: "Covers", fr: "Covers" },
      tools: "Photoshop",
      ig: "https://www.instagram.com/p/Demquh_jGip/",
      slides: [
        { src: "dead-insect-1", alt: { en: "Grey and blue variation: a close-up eye and an insect silhouette in layered, pixelated textures.", fr: "Variation gris et bleu : un œil en gros plan et une silhouette d’insecte dans des textures superposées et pixelisées." } },
        { src: "dead-insect-2", alt: { en: "Deep purple and red variation of the same eye collage.", fr: "Variation violet profond et rouge du même collage d’œil." } },
        { src: "dead-insect-3", alt: { en: "Saturated pink and cyan variation of the same eye collage.", fr: "Variation rose et cyan saturés du même collage d’œil." } },
        { src: "dead-insect-4", alt: { en: "Muted blue-grey and gold variation of the same eye collage.", fr: "Variation gris-bleu atténué et or du même collage d’œil." } }
      ],
      desc: {
        en: [
          "An experimental digital collage exploring visual distortion, texture and fragmented perception.",
          "Built around a close-up eye image, the composition combines layered imagery, irregular patterns and aggressive color treatments to create a dense and distorted visual environment.",
          "The original image is reworked through overlapping textures, pixelated fragments and contrasting color channels. Multiple color variations reinterpret the same composition, shifting between saturated pink and cyan, deep purple and muted blue-grey tones."
        ],
        fr: [
          "Un collage numérique expérimental explorant la distorsion visuelle, la texture et la perception fragmentée.",
          "Construite autour d’une image en gros plan d’un œil, la composition combine des images superposées, des motifs irréguliers et des traitements de couleur agressifs pour créer un environnement visuel dense et déformé.",
          "L’image d’origine est retravaillée à travers des textures qui se chevauchent, des fragments pixelisés et des canaux de couleur contrastés. Plusieurs variations de couleur réinterprètent la même composition, oscillant entre rose et cyan saturés, violet profond et tons gris-bleu atténués."
        ]
      }
    },
    {
      title: "Brambles Birds", year: "2026", ratio: [1, 1],
      cat: { en: "Covers", fr: "Covers" },
      tools: "Photoshop",
      ig: "https://www.instagram.com/p/Deroq4XjPwJ/",
      slides: [
        { src: "brambles-1", alt: { en: "A grey bird silhouette over scratchy orange and yellow brambles on a linen-like texture.", fr: "Une silhouette d’oiseau grise sur des ronces orange et jaune griffonnées, sur une texture de lin." } },
        { src: "brambles-2", alt: { en: "A pale bird silhouette, wings folded, in faded pink and brown tangles.", fr: "Une silhouette d’oiseau pâle, ailes repliées, dans des enchevêtrements de rose délavé et de brun." } },
        { src: "brambles-3", alt: { en: "A white bird in flight over warm red and green brambles.", fr: "Un oiseau blanc en vol au-dessus de ronces rouges et vertes chaudes." } }
      ],
      desc: {
        en: [
          "An experimental illustration series exploring the relationship between nature, organic forms and visual texture.",
          "Combining bird silhouettes with tangled brambles, botanical patterns and layered textures, the compositions create an interplay between natural elements and abstract forms.",
          "The artwork uses a muted palette of earthy browns, faded pinks, soft greens and warm neutrals. Textured surfaces and imperfect details give the compositions an aged, tactile appearance, evoking the visual qualities of traditional drawing and printed materials."
        ],
        fr: [
          "Une série d’illustrations expérimentales explorant la relation entre la nature, les formes organiques et la texture visuelle.",
          "En associant des silhouettes d’oiseaux à des ronces entremêlées, des motifs botaniques et des textures superposées, les compositions créent un dialogue entre éléments naturels et formes abstraites.",
          "L’œuvre utilise une palette atténuée de bruns terreux, de roses délavés, de verts doux et de neutres chauds. Les surfaces texturées et les détails imparfaits donnent aux compositions un aspect ancien et tactile, évoquant les qualités visuelles du dessin traditionnel et des supports imprimés."
        ]
      }
    },
    {
      title: "My Digital Avatar", year: "2026", ratio: [842, 1191],
      cat: { en: "Poster Design", fr: "Design d’affiche" },
      tools: "Photoshop",
      ig: "https://www.instagram.com/p/Dewc5KSDNaI/",
      slides: [
        { src: "avatar-1", alt: { en: "Poster: a portrait dissolved into blue and violet grain, with the words “My digital avatar”.", fr: "Affiche : un portrait dissous dans un grain bleu et violet, avec les mots « My digital avatar »." } },
        { src: "avatar-2", alt: { en: "The same poster in vivid pink and red.", fr: "La même affiche en rose vif et rouge." } }
      ],
      desc: {
        en: [
          "An experimental exploration of digital identity through image manipulation, texture and color distortion.",
          "This project transforms a portrait into a fragmented digital composition, playing with the relationship between image, noise and visual perception. By breaking down the original photograph into layers of grain, scattered particles and distorted textures, the face becomes an abstract visual structure rather than a conventional portrait.",
          "Two chromatic variations explore different visual atmospheres: an electric blue and violet palette, contrasted with a vibrant pink and red interpretation."
        ],
        fr: [
          "Une exploration expérimentale de l’identité numérique à travers la manipulation d’image, la texture et la distorsion des couleurs.",
          "Ce projet transforme un portrait en une composition numérique fragmentée, jouant avec la relation entre l’image, le bruit et la perception visuelle. En décomposant la photographie d’origine en couches de grain, de particules dispersées et de textures déformées, le visage devient une structure visuelle abstraite plutôt qu’un portrait conventionnel.",
          "Deux variations chromatiques explorent des atmosphères visuelles différentes : une palette bleu électrique et violet, contrastée avec une interprétation rose vif et rouge."
        ]
      }
    }
  ],

  videos: [
    {
      title: "Particles effect", year: "2026",
      cat: { en: "Motion", fr: "Motion" },
      tools: "TouchDesigner",
      ig: "https://www.instagram.com/p/De5BcKFjC7e/",
      yt: ["Zg6aavwdpsc", "qzRsw6NLD0A", "XBRtw_xuHo0", "n5imnb0i5tM"],
      desc: {
        en: [
          "An exploration of audio-reactive visuals and particle-based motion, focusing on the relationship between sound, movement and digital interaction.",
          "The animation uses particle systems that dynamically react to audio input, transforming sound frequencies and rhythms into visual movement. Particles respond to the music in real time, creating an evolving composition shaped by sound intensity, frequency and rhythm.",
          "Through motion, repetition and spatial interaction, the project explores the connection between sound and visual expression."
        ],
        fr: [
          "Une exploration de visuels audio-réactifs et de mouvements de particules, centrée sur la relation entre le son, le mouvement et l’interaction numérique.",
          "L’animation utilise des systèmes de particules qui réagissent dynamiquement à l’entrée audio, transformant les fréquences et les rythmes sonores en mouvement visuel. Les particules répondent à la musique en temps réel, créant une composition évolutive façonnée par l’intensité, la fréquence et le rythme du son.",
          "À travers le mouvement, la répétition et l’interaction spatiale, le projet explore le lien entre le son et l’expression visuelle."
        ]
      }
    }
  ]
};

/* Interface strings. */
window.STR = {
  en: {
    skip: "Skip to content",
    "nav.work": "Graphics", "nav.video": "Motion", "nav.about": "About", "nav.contact": "Contact",
    "nav.label": "Main", "lang.label": "Language / Langue", "home.label": "NOBODYHATERR — home",
    "hero.role": "Independent graphic designer",
    "hero.focus": "Visual experiments / Art direction / Graphic design",
    "hero.avail": "Available for select projects",
    "work.title": "Graphics", "work.meta": "Covers / Posters", "work.tools": "Photoshop + Illustrator",
    "video.title": "Motion", "video.meta": "Motion / Effects", "video.tools": "TouchDesigner",
    "about.title": "Graphic design &<br>visual experimentation",
    "about.p1": "NOBODYHATERR is an independent graphic designer exploring visual identities, typography, digital culture and experimental graphic design.",
    "about.p2": "Creating visuals between art, music, fashion and contemporary culture.",
    "about.disciplines": "Disciplines",
    "d0.t": "Graphic design", "d0.p": "Exploring the relationship between typography, composition and visual elements. Combining shapes, textures and imagery to create distinctive graphic compositions. Experimenting with different styles, layouts and visual languages. Balancing structure and spontaneity to develop expressive and unconventional designs.",
    "d1.t": "Art direction", "d1.p": "Developing visual concepts and defining the overall aesthetic direction of a project. Exploring colors, imagery, typography and composition to build a coherent visual atmosphere. Drawing inspiration from contemporary culture, fashion, music and art. Turning creative ideas into strong and recognizable visual experiences.",
    "d2.t": "Visual identity", "d2.p": "Creating visual languages that give projects their own distinctive character. Working with typography, color systems, symbols and graphic elements. Building consistent visual systems while exploring different creative possibilities. Focusing on originality, coherence and visual recognition.",
    "d3.t": "Digital art", "d3.p": "Experimenting with digital imagery, textures, distortion and visual manipulation. Combining photography, illustration and digital techniques to create unexpected compositions. Exploring the boundaries between abstraction and recognizable forms. Using digital tools as a medium for visual experimentation and artistic expression.",
    "d4.t": "Motion design", "d4.p": "Bringing graphic elements to life through movement and animation. Exploring rhythm, transitions, visual effects and dynamic compositions. Combining motion and graphic design to create engaging visual experiences. Experimenting with audio-reactive visuals and digital animation.",
    "d5.t": "Experimental design", "d5.p": "Exploring unconventional approaches to graphic composition and visual expression. Playing with textures, shapes, distortion and unexpected combinations. Breaking traditional visual structures to develop original compositions. Using experimentation as a way to discover new visual languages.",
    "contact.title": "Have a project<br>in mind? Let’s create something different.",
    "contact.mail": "Email me", "contact.copy": "Copy email address", "contact.copied": "Email address copied", "contact.ig": "Instagram",
    "foot.tag": "Nobody is watching. Create anyway.", "foot.credit": "Vibecoded with Claude",
    "p.no": "No.", "p.year": "Year", "p.cat": "Category", "p.role": "Role", "p.role.v": "Design / Art direction",
    "p.format": "Format", "p.video": "Video",
    "p.desc": "Description", "p.credits": "Credits", "p.design": "Design", "p.tools": "Software / tools",
    "p.ig": "View on Instagram", "p.prev": "Previous project", "p.next": "Next project",
    "p.back": "Back to", "p.var": "Variations", "p.var1": "Variation", "p.of": "of",
    "p.prevv": "Previous", "p.nextv": "Next", "p.watch": "Watch on YouTube", "p.play": "Play video", "p.new": "opens in a new tab",
    "p.dialog": "Project"
  },
  fr: {
    skip: "Aller au contenu",
    "nav.work": "Graphisme", "nav.video": "Motion", "nav.about": "À propos", "nav.contact": "Contact",
    "nav.label": "Principale", "lang.label": "Language / Langue", "home.label": "NOBODYHATERR — accueil",
    "hero.role": "Designer graphique indépendant",
    "hero.focus": "Expérimentations visuelles / Direction artistique / Design graphique",
    "hero.avail": "Disponible pour des projets sélectionnés",
    "work.title": "Graphisme", "work.meta": "Covers / Affiches", "work.tools": "Photoshop + Illustrator",
    "video.title": "Motion", "video.meta": "Motion / Effets", "video.tools": "TouchDesigner",
    "about.title": "Design graphique &<br>expérimentation visuelle",
    "about.p1": "NOBODYHATERR est un designer graphique indépendant qui explore les identités visuelles, la typographie, la culture numérique et le design graphique expérimental.",
    "about.p2": "Créer des visuels entre l’art, la musique, la mode et la culture contemporaine.",
    "about.disciplines": "Disciplines",
    "d0.t": "Design graphique", "d0.p": "Explorer la relation entre la typographie, la composition et les éléments visuels. Combiner formes, textures et images pour créer des compositions graphiques distinctives. Expérimenter différents styles, mises en page et langages visuels. Équilibrer structure et spontanéité pour développer des designs expressifs et non conventionnels.",
    "d1.t": "Direction artistique", "d1.p": "Développer des concepts visuels et définir la direction esthétique globale d’un projet. Explorer les couleurs, l’imagerie, la typographie et la composition pour construire une atmosphère visuelle cohérente. S’inspirer de la culture contemporaine, de la mode, de la musique et de l’art. Transformer des idées créatives en expériences visuelles fortes et reconnaissables.",
    "d2.t": "Identité visuelle", "d2.p": "Créer des langages visuels qui donnent aux projets leur propre caractère. Travailler avec la typographie, les systèmes de couleurs, les symboles et les éléments graphiques. Construire des systèmes visuels cohérents tout en explorant différentes possibilités créatives. Privilégier l’originalité, la cohérence et la reconnaissance visuelle.",
    "d3.t": "Art numérique", "d3.p": "Expérimenter avec l’imagerie numérique, les textures, la distorsion et la manipulation visuelle. Combiner photographie, illustration et techniques numériques pour créer des compositions inattendues. Explorer les frontières entre abstraction et formes reconnaissables. Utiliser les outils numériques comme un médium d’expérimentation visuelle et d’expression artistique.",
    "d4.t": "Motion design", "d4.p": "Donner vie aux éléments graphiques par le mouvement et l’animation. Explorer le rythme, les transitions, les effets visuels et les compositions dynamiques. Associer motion et design graphique pour créer des expériences visuelles captivantes. Expérimenter avec des visuels audio-réactifs et l’animation numérique.",
    "d5.t": "Design expérimental", "d5.p": "Explorer des approches non conventionnelles de la composition graphique et de l’expression visuelle. Jouer avec les textures, les formes, la distorsion et les combinaisons inattendues. Briser les structures visuelles traditionnelles pour développer des compositions originales. Utiliser l’expérimentation comme moyen de découvrir de nouveaux langages visuels.",
    "contact.title": "Un projet<br>en tête ? Créons quelque chose de différent.",
    "contact.mail": "M’écrire", "contact.copy": "Copier l’adresse e-mail", "contact.copied": "Adresse e-mail copiée", "contact.ig": "Instagram",
    "foot.tag": "Personne ne regarde. Crée quand même.", "foot.credit": "Vibecodé avec Claude",
    "p.no": "N°", "p.year": "Année", "p.cat": "Catégorie", "p.role": "Rôle", "p.role.v": "Design / Direction artistique",
    "p.format": "Format", "p.video": "Vidéo",
    "p.desc": "Description", "p.credits": "Crédits", "p.design": "Design", "p.tools": "Logiciels / outils",
    "p.ig": "Voir sur Instagram", "p.prev": "Projet précédent", "p.next": "Projet suivant",
    "p.back": "Retour à", "p.var": "Variations", "p.var1": "Variation", "p.of": "sur",
    "p.prevv": "Précédent", "p.nextv": "Suivant", "p.watch": "Voir sur YouTube", "p.play": "Lire la vidéo", "p.new": "s’ouvre dans un nouvel onglet",
    "p.dialog": "Projet"
  }
};
