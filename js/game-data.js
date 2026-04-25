/* ============================================
   DC FIND THE HERO — GAME DATA
   21 héros DC et leurs objets iconiques
   ============================================ */

const DC_HEROES = [
  {
    id: 1,
    hero: "Batman",
    aliases: ["bruce wayne", "le chevalier noir", "dark knight", "bat man"],
    object: "Batarang",
    objectDesc: "L'arme de lancer emblématique en forme de chauve-souris",
    image: "assets/images/objets/Batarang.jpg",
    color: "#f5c518",
    difficulty: "facile"
  },
  {
    id: 2,
    hero: "Aquaman",
    aliases: ["arthur curry", "roi des mers", "orin"],
    object: "Trident",
    objectDesc: "Le trident doré qui commande les océans d'Atlantis",
    image: "assets/images/objets/Trident.jpg",
    color: "#00a8e8",
    difficulty: "facile"
  },
  {
    id: 3,
    hero: "Blue Beetle",
    aliases: ["jaime reyes", "ted kord", "blue beetle"],
    object: "Scarabée",
    objectDesc: "Le scarabée alien qui fusionne avec son porteur",
    image: "assets/images/objets/scarabé blue beetle.jpg",
    color: "#4a9eff",
    difficulty: "moyen"
  },
  {
    id: 4,
    hero: "Raven",
    aliases: ["rachel roth", "rachel"],
    object: "Cape violette",
    objectDesc: "La cape mystique violette à capuche de Raven",
    image: "assets/images/objets/Raven Costume.jpg",
    color: "#9b59b6",
    difficulty: "moyen"
  },
  {
    id: 5,
    hero: "Lobo",
    aliases: ["the main man", "lobo le chasseur"],
    object: "Moto",
    objectDesc: "La moto spatiale à tête de mort de Lobo",
    image: "assets/images/objets/moto lobo.jpg",
    color: "#c8102e",
    difficulty: "difficile"
  },
  {
    id: 6,
    hero: "Mas y Menos",
    aliases: ["mas", "menos", "mas and menos", "mas & menos", "mas et menos"],
    object: "Signes + et -",
    objectDesc: "Les emblèmes + et - des jumeaux super-rapides",
    image: "assets/images/objets/mas&menos.jpg",
    color: "#ffffff",
    difficulty: "difficile"
  },
  {
    id: 7,
    hero: "Hawkman",
    aliases: ["carter hall", "katar hol", "hawk man"],
    object: "Masse dorée",
    objectDesc: "La masse à pointes en métal nth de Hawkman",
    image: "assets/images/objets/mace hawkman.jpg",
    color: "#f5c518",
    difficulty: "moyen"
  },
  {
    id: 8,
    hero: "Wonder Woman",
    aliases: ["diana prince", "diana", "la femme wonder", "amazone"],
    object: "Lasso de Vérité",
    objectDesc: "Le lasso doré qui force quiconque à dire la vérité",
    image: "assets/images/objets/lasso wonder-woman.jpg",
    color: "#f5c518",
    difficulty: "facile"
  },
  {
    id: 9,
    hero: "Joker",
    aliases: ["le joker", "le prince du crime"],
    object: "Sourire du Joker",
    objectDesc: "Le sourire terrifiant et emblématique du Clown Prince du Crime",
    image: "assets/images/objets/joker smlie.jpg",
    color: "#9b59b6",
    difficulty: "facile"
  },
  {
    id: 10,
    hero: "Green Lantern",
    aliases: ["hal jordan", "john stewart", "lanterne verte"],
    object: "Lanterne verte",
    objectDesc: "La lanterne source de pouvoir des Green Lanterns",
    image: "assets/images/objets/Green Lantern Power Battery.jpg",
    color: "#00ff44",
    difficulty: "facile"
  },
  {
    id: 11,
    hero: "Deadshot",
    aliases: ["floyd lawton", "dead shot", "death shot"],
    object: "Costume de Deadshot",
    objectDesc: "L'armure rouge et grise du mercenaire le plus précis au monde",
    image: "assets/images/objets/Deadshot.jpg",
    color: "#888888",
    difficulty: "moyen"
  },
  {
    id: 12,
    hero: "Darkseid",
    aliases: ["uxas", "dark side", "darkside"],
    object: "Visage de Darkseid",
    objectDesc: "Le visage de pierre aux yeux rouges du dieu tyran d'Apokolips",
    image: "assets/images/objets/darkseid.jpg",
    color: "#c8102e",
    difficulty: "moyen"
  },
  {
    id: 13,
    hero: "Cyborg",
    aliases: ["victor stone", "vic stone"],
    object: "Torse robotique",
    objectDesc: "Le torse cybernétique mi-humain mi-machine de Victor Stone",
    image: "assets/images/objets/cyborg.jpg",
    color: "#888888",
    difficulty: "facile"
  },
  {
    id: 14,
    hero: "Superman",
    aliases: ["clark kent", "kal el", "l'homme d'acier", "man of steel"],
    object: "Costume de Superman",
    objectDesc: "Le costume bleu et rouge avec le S emblématique",
    image: "assets/images/objets/costume superman.jpg",
    color: "#c8102e",
    difficulty: "facile"
  },
  {
    id: 15,
    hero: "Nightwing",
    aliases: ["dick grayson", "richard grayson", "night wing"],
    object: "Costume de Nightwing",
    objectDesc: "Le costume noir et bleu avec l'emblème en forme d'oiseau",
    image: "assets/images/objets/Costume de nightwing.jpg",
    color: "#4a9eff",
    difficulty: "moyen"
  },
  {
    id: 16,
    hero: "Doctor Fate",
    aliases: ["kent nelson", "docteur fate", "docteur fathe", "doctor fathe", "dr fate"],
    object: "Casque doré",
    objectDesc: "Le casque doré du Seigneur de l'Ordre et de la magie",
    image: "assets/images/objets/casque dr.fathe.jpg",
    color: "#f5c518",
    difficulty: "difficile"
  },
  {
    id: 17,
    hero: "Harley Quinn",
    aliases: ["harleen quinzel", "harley", "harley queen"],
    object: "Batte Good Night",
    objectDesc: "La batte de baseball 'Good Night' d'Harley Quinn",
    image: "assets/images/objets/batte harley.jpg",
    color: "#ff69b4",
    difficulty: "facile"
  },
  {
    id: 18,
    hero: "Bane",
    aliases: ["bane"],
    object: "Masque de Bane",
    objectDesc: "Le masque qui diffuse le venom dans le corps de Bane",
    image: "assets/images/objets/Bane paintball Mask.jpg",
    color: "#444444",
    difficulty: "moyen"
  },
  {
    id: 19,
    hero: "Flash",
    aliases: ["barry allen", "wally west", "l'éclair", "the flash"],
    object: "Bague de Flash",
    objectDesc: "La bague dorée avec l'éclair rouge qui contient le costume",
    image: "assets/images/objets/bague flash.jpg",
    color: "#cc0000",
    difficulty: "moyen"
  },
  {
    id: 20,
    hero: "Green Arrow",
    aliases: ["oliver queen", "arrow", "la flèche verte"],
    object: "Arc composé",
    objectDesc: "L'arc composé noir ultra-précis d'Oliver Queen",
    image: "assets/images/objets/arc green arrow.jpg",
    color: "#228b22",
    difficulty: "moyen"
  },
  {
    id: 21,
    hero: "Red Lantern",
    aliases: ["atrocitus", "lanterne rouge", "red lanterns", "red lantern corps"],
    object: "Anneau rouge",
    objectDesc: "L'anneau rouge alimenté par la rage des Red Lanterns",
    image: "assets/images/objets/anneau red lantern.jpg",
    color: "#cc0000",
    difficulty: "difficile"
  }
];

/* ============================================
   ÉTAT DU JEU — sauvegardé dans localStorage
   ============================================ */

const STORAGE_KEY = "dc_game_state";

const GameState = {

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return this.fresh();
  },

  fresh() {
    return {
      found: [],
      player: null,
      startedAt: Date.now()
    };
  },

  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/* ============================================
   HELPERS
   ============================================ */

function checkAnswer(heroId, playerAnswer) {
  const hero = DC_HEROES.find(h => h.id === heroId);
  if (!hero) return false;

  const normalize = str =>
    str.toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .trim();

  const answer  = normalize(playerAnswer);
  const name    = normalize(hero.hero);
  const aliases = hero.aliases.map(normalize);

  return answer === name || aliases.includes(answer);
}

function isVictory(state) {
  return state.found.length === DC_HEROES.length;
}

function shuffleHeroes() {
  const arr = [...DC_HEROES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}