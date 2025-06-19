
import { reactive } from 'vue';
import { Storage } from '@ionic/storage';

const storage = new Storage();
storage.create();

// État initial
const state = reactive({
  aventures: [],
  theme: 'light',
  couleurPrincipale: '#3880ff',
  chargementTermine: false,
});

// Charger les données depuis le stockage local
const chargerDonnees = async () => {
  try {
    const aventures = await storage.get('aventures');
    if (aventures) {
      state.aventures = aventures;
    }
    
    const theme = await storage.get('theme');
    if (theme) {
      state.theme = theme;
      document.body.classList.toggle('dark', theme === 'dark');
    }
    
    const couleur = await storage.get('couleurPrincipale');
    if (couleur) {
      state.couleurPrincipale = couleur;
      document.documentElement.style.setProperty('--ion-color-primary', couleur);
    }
    
    state.chargementTermine = true;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    state.chargementTermine = true;
  }
};

// Sauvegarder les données dans le stockage local
const sauvegarderDonnees = async () => {
  await storage.set('aventures', state.aventures);
  await storage.set('theme', state.theme);
  await storage.set('couleurPrincipale', state.couleurPrincipale);
};

// Fonctions de manipulation des aventures
const ajouterAventure = (aventure) => {
  const nouvelleAventure = {
    ...aventure,
    id: Date.now().toString(),
    dateCreation: new Date().toISOString()
  };
  state.aventures.push(nouvelleAventure);
  sauvegarderDonnees();
  return nouvelleAventure;
};

const modifierAventure = (id, nouvellesDonnees) => {
  const index = state.aventures.findIndex(a => a.id === id);
  if (index !== -1) {
    state.aventures[index] = { ...state.aventures[index], ...nouvellesDonnees };
    sauvegarderDonnees();
    return true;
  }
  return false;
};

const supprimerAventure = (id) => {
  const index = state.aventures.findIndex(a => a.id === id);
  if (index !== -1) {
    state.aventures.splice(index, 1);
    sauvegarderDonnees();
    return true;
  }
  return false;
};

const reinitialiserAventures = () => {
  state.aventures = [];
  sauvegarderDonnees();
};

// Fonctions pour les paramètres
const changerTheme = (theme) => {
  state.theme = theme;
  document.body.classList.toggle('dark', theme === 'dark');
  sauvegarderDonnees();
};

const changerCouleurPrincipale = (couleur) => {
  state.couleurPrincipale = couleur;
  document.documentElement.style.setProperty('--ion-color-primary', couleur);
  sauvegarderDonnees();
};

// Initialiser l'état
chargerDonnees();

export default {
  state,
  ajouterAventure,
  modifierAventure,
  supprimerAventure,
  reinitialiserAventures,
  changerTheme,
  changerCouleurPrincipale
};