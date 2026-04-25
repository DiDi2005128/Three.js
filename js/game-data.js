/* ============================================
   DC FIND THE HERO — GAME DATA
   21 héros DC et leurs objets iconiques
   ============================================ */

const DC_HEROES = [
  {
    id: 1,
    hero: "Batman",
    aliases: ["bruce wayne", "le chevalier noir", "dark knight"],
    object: "Batarang",
    objectDesc: "L'arme de lancer emblématique en forme de chauve-souris",
    image: "assets/images/objects/batarang.jpg",
    color: "#f5c518",
    difficulty: "facile"
  },
  {
    id: 2,
    hero: "Batman",
    aliases: ["bruce wayne", "le chevalier noir"],
    object: "Masque de Batman",
    objectDesc: "La cagoule emblématique avec les oreilles en pointe",
    image: "assets/images/objects/masque-batman.jpg",
    color: "#f5c518",
    difficulty: "facile"
  },
  {
    id: 3,
    hero: "Superman",
    aliases: ["clark kent", "l'homme d'acier", "man of steel"],
    object: "Cape de Superman",
    objectDesc: "La cape rouge avec le S doré",
    image: "assets/images/objects/cape-superman.jpg",
    color: "#c8102e",
    difficulty: "facile"
  },
  {
    id: 4,
    hero: "Superman",
    aliases: ["clark kent", "l'homme d'acier"],
    object: "Kryptonite",
    objectDesc: "Le cristal vert, seule faiblesse de l'homme d'acier",
    image: "assets/images/objects/kryptonite.jpg",
    color: "#00ff88",
    difficulty: "moyen"
  },
  {
    id: 5,
    hero: "Wonder Woman",
    aliases: ["diana prince", "la femme wonder", "amazone"],
    object: "Lasso de Vérité",
    objectDesc: "Le lasso doré qui force quiconque à dire la vérité",
    image: "assets/images/objects/lasso-wonder.jpg",
    color: "#f5c518",
    difficulty: "facile"
  },
  {
    id: 6,
    hero: "Wonder Woman",
    aliases: ["diana prince", "amazone"],
    object: "Bouclier d'Amazone",
    objectDesc: "Le bouclier circulaire orné de l'aigle",
    image: "assets/images/objects/bouclier-wonder.jpg",
    color: "#c8102e",
    difficulty: "moyen"
  },
  {
    id: 7,
    hero: "Wonder Woman",
    aliases: ["diana prince", "amazone"],
    object: "Tiare de Wonder Woman",
    objectDesc: "La tiare dorée qui peut être utilisée comme arme",
    image: "assets/images/objects/tiare-wonder.jpg",
    color: "#f5c518",
    difficulty: "moyen"
  },
  {
    id: 8,
    hero: "Flash",
    aliases: ["barry allen", "wally west", "l'éclair"],
    object: "Bague de Flash",
    objectDesc: "La bague qui contient le costume de Flash replié",
    image: "assets/images/objects/bague-flash.jpg",
    color: "#cc0000",
    difficulty: "difficile"
  },
  {
    id: 9,
    hero: "Flash",
    aliases: ["barry allen", "wally west", "l'éclair"],
    object: "Bottes de Flash",
    objectDesc: "Les bottes écarlates avec les ailes dorées",
    image: "assets/images/objects/bottes-flash.jpg",
    color: "#cc0000",
    difficulty: "moyen"
  },
  {
    id: 10,
    hero: "Aquaman",
    aliases: ["arthur curry", "roi des mers", "orin"],
    object: "Trident de Poséidon",
    objectDesc: "Le trident doré qui commande les océans",
    image: "assets/images/objects/trident-aquaman.jpg",
    color: "#00a8e8",
    difficulty: "facile"
  },
  {
    id: 11,
    hero: "Aquaman",
    aliases: ["arthur curry", "roi des mers"],
    object: "Couronne d'Atlantis",
    objectDesc: "La couronne dorée du roi d'Atlantis",
    image: "assets/images/objects/couronne-aquaman.jpg",
    color: "#f5c518",
    difficulty: "moyen"
  },
  {
    id: 12,
    hero: "Green Lantern",
    aliases: ["hal jordan", "john stewart", "lanterne verte"],
    object: "Anneau de Pouvoir",
    objectDesc: "L'anneau vert qui permet de créer tout ce qu'on imagine",
    image: "assets/images/objects/anneau-lantern.jpg",
    color: "#00ff44",
    difficulty: "facile"
  },
  {
    id: 13,
    hero: "Green Arrow",
    aliases: ["oliver queen", "arrow", "la flèche verte"],
    object: "Arc de Green Arrow",
    objectDesc: "L'arc recurve vert d'Oliver Queen",
    image: "assets/images/objects/arc-arrow.jpg",
    color: "#228b22",
    difficulty: "moyen"
  },
  {
    id: 14,
    hero: "Joker",
    aliases: ["le joker", "le prince du crime"],

object: "Carte de Joker",
    objectDesc: "La carte à jouer emblématique du clown criminel",
    image: "assets/images/objects/carte-joker.jpg",
    color: "#9b59b6",
    difficulty: "facile"
  },
  {
    id: 15,
    hero: "Joker",
    aliases: ["le joker", "le prince du crime"],
    object: "Marteau de Harley",
    objectDesc: "Le grand marteau avec le visage du Joker",
    image: "assets/images/objects/marteau-joker.jpg",
    color: "#9b59b6",
    difficulty: "difficile"
  },
  {
    id: 16,
    hero: "Harley Quinn",
    aliases: ["harleen quinzel", "harley"],
    object: "Batte de Baseball",
    objectDesc: "La batte rose et bleue d'Harley Quinn",
    image: "assets/images/objects/batte-harley.jpg",
    color: "#ff69b4",
    difficulty: "facile"
  },
  {
    id: 17,
    hero: "Deathstroke",
    aliases: ["slade wilson", "deathstroke the terminator"],
    object: "Épée de Deathstroke",
    objectDesc: "L'épée à lame orange et noire du mercenaire",
    image: "assets/images/objects/epee-deathstroke.jpg",
    color: "#ff6600",
    difficulty: "difficile"
  },
  {
    id: 18,
    hero: "Deadshot",
    aliases: ["floyd lawton", "dead shot"],
    object: "Canon de poignet",
    objectDesc: "Le canon de précision fixé au poignet de Deadshot",
    image: "assets/images/objects/canon-deadshot.jpg",
    color: "#888888",
    difficulty: "difficile"
  },
  {
    id: 19,
    hero: "Captain Boomerang",
    aliases: ["digger harkness", "boomerang"],
    object: "Boomerang",
    objectDesc: "Le boomerang de métal tranchant du voleur australien",
    image: "assets/images/objects/boomerang-captain.jpg",
    color: "#4488ff",
    difficulty: "moyen"
  },
  {
    id: 20,
    hero: "Martian Manhunter",
    aliases: ["j'onn j'onzz", "john jones", "le chasseur de mars"],
    object: "Cape de Martian Manhunter",
    objectDesc: "La cape bleue du dernier martien",
    image: "assets/images/objects/cape-martian.jpg",
    color: "#228b22",
    difficulty: "difficile"
  },
  {
    id: 21,
    hero: "Batman",
    aliases: ["bruce wayne", "le chevalier noir"],
    object: "Ceinture Utilitaire",
    objectDesc: "La ceinture jaune avec tous les gadgets de Batman",
    image: "assets/images/objects/ceinture-batman.jpg",
    color: "#f5c518",
    difficulty: "moyen"
  }
];

/* ============================================
   ÉTAT DU JEU — sauvegardé dans localStorage
   ============================================ */

const STORAGE_KEY = "dc_game_state";

const GameState = {

  /* Initialise ou récupère l'état sauvegardé */
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return this.fresh();
  },

  /* Crée un état vierge */
  fresh() {
    return {
      found: [],          // ids des héros trouvés
      player: null,       // nom du joueur connecté
      startedAt: Date.now()
    };
  },

  /* Sauvegarde l'état */
  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  /* Réinitialise complètement */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/* ============================================
   HELPERS
   ============================================ */

/**
 * Vérifie si la réponse du joueur correspond au héros
 * Accepte le nom exact, les aliases, et est insensible
 * à la casse et aux accents
 */
function checkAnswer(heroId, playerAnswer) {
  const hero = DC_HEROES.find(h => h.id === heroId);
  if (!hero) return false;

  const normalize = str =>
    str.toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .trim();

  const answer = normalize(playerAnswer);
  const heroName = normalize(hero.hero);
  const aliases = hero.aliases.map(normalize);

  return answer === heroName || aliases.includes(answer);
}

/**
 * Retourne le nombre de héros trouvés
 */
function getFoundCount(state) {
  return state.found.length;
}

/**
 * Vérifie si le joueur a tout trouvé (victoire)
 */
function isVictory(state) {
  return state.found.length === DC_HEROES.length;
}

/**
* Mélange le tableau des héros (Fisher-Yates)
 */
function shuffleHeroes() {
  const arr = [...DC_HEROES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}