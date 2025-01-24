// script.js
"use strict";

// Liste des mots possibles dans le jeu
const mots = ["pendu", "javascript", "codage", "programmation", "configuration", "developpeur", "robotique", "aptitude", "difficulté"]; // Liste des mots sélectionnables

// Variables principales
let motSecret       = "";    // Stocke le mot à deviner
let lettresTrouvees = [];    // Tableau des lettres trouvées
let lettresTentees  = [];    // Tableau des lettres déjà essayées
let motsProposes    = [];    // Tableau des mots proposés
let erreurs         = 0;     // Compteur des erreurs effectuées
const maxErreurs    = 7;     // Nombre maximum d'erreurs autorisées
let jeuTermine      = false; // État du jeu (en cours ou terminé)

// Références aux éléments HTML (DOM)
const motCacheElement       = document.getElementById("motCache");           // Élément pour afficher le mot caché
const messageElement        = document.getElementById("message");            // Élément pour afficher les messages
const lettresTenteesElement = document.getElementById("lettresTentees");     // Élément pour afficher les lettres tentées
const imagePenduElement     = document.querySelector("#imagePendu img");     // Image du pendu
const inputLettre           = document.getElementById("inputLettre");        // Champ de saisie pour les lettres
const inputProposition      = document.getElementById("inputProposition");   // Champ pour proposer un mot entier
const boutonVerifier        = document.getElementById("boutonVerifier");     // Bouton pour vérifier une saisie
const boutonChangerDeMot    = document.getElementById("boutonChangerDeMot"); // Bouton pour changer de mot

// Fonction pour initialiser un nouveau mot et réinitialiser le jeu
function choisirNouveauMot() {
    motSecret                  = mots[Math.floor(Math.random() * mots.length)]; // Sélectionne un mot aléatoire
    lettresTrouvees            = Array(motSecret.length).fill("_");             // Initialise les lettres trouvées
    lettresTentees             = [];                                            // Réinitialise les lettres tentées
    motsProposes               = [];                                            // Réinitialise les mots proposés
    erreurs                    = 0;                                             // Réinitialise le compteur d'erreurs
    jeuTermine                 = false;                                         // Réinitialise l'état du jeu
    messageElement.textContent = "";                                            // Vide les messages
    inputLettre.value          = "";                                            // Vide le champ de saisie des lettres
    inputProposition.value     = "";                                            // Vide le champ de saisie des mots
    boutonVerifier.disabled    = false;                                         // Active le bouton "Vérifier"
    mettreAJourAffichage();                                                     // Met à jour l'affichage initial
    inputLettre.focus();                                                        // Place le curseur dans le champ des lettres
    gererChampsActifs();                                                        // Gère l'état des champs
}

// Fonction pour mettre à jour l'affichage
function mettreAJourAffichage() {
    motCacheElement.textContent       = lettresTrouvees.join(" ");     // Affiche le mot caché avec des espaces
    lettresTenteesElement.textContent = lettresTentees.join("-");      // Affiche les lettres tentées avec des tirets
    imagePenduElement.src             = `images/Pendu${erreurs}.png`;  // Met à jour l'image selon le nombre d'erreurs
    if (messageElement.textContent.includes("Veuillez")) {
        messageElement.textContent = "";                               // Efface les messages d'erreur
    }
}

// Fonction pour vérifier une lettre saisie
function verifierLettre(lettre) {
    if (jeuTermine) return;                // Empêche toute action si le jeu est terminé

    if (lettresTentees.includes(lettre)) { // Si la lettre a déjà été tentée
        messageElement.textContent = "Vous avez déjà tenté cette lettre.";
        inputLettre.value          = "";   // Vide le champ de saisie
        return;
    }

    lettresTentees.push(lettre); // Ajoute la lettre au tableau des lettres tentées

    if (motSecret.includes(lettre)) { // Si la lettre est correcte
        for (let i = 0; i < motSecret.length; i++) {
            if (motSecret[i] === lettre) {
                lettresTrouvees[i] = lettre; // Révèle la lettre correcte
            }
        }
        if (!lettresTrouvees.includes("_")) {  // Si toutes les lettres sont trouvées
            messageElement.textContent = "Félicitations ! Vous avez gagné 🎉.";
            boutonVerifier.disabled    = true; // Désactive le bouton "Vérifier"
            jeuTermine                 = true; // Marque le jeu comme terminé
        }
    } else {
        erreurs++;       // Incrémente le compteur d'erreurs
        verifierPerte(); // Vérifie si le joueur a perdu
    }
    mettreAJourAffichage(); // Met à jour l'affichage
    inputLettre.value = ""; // Vide le champ de saisie
}

// Fonction pour vérifier un mot proposé
function verifierProposition(mot) {
    if (jeuTermine) return;              // Empêche toute action si le jeu est terminé

    if (!/^[a-zA-Z]+$/.test(mot)) {      // Si le mot contient des caractères non valides
        messageElement.textContent = "Veuillez entrer un mot valide (lettres uniquement).";
        inputProposition.value     = ""; // Vide le champ de saisie
        inputProposition.focus();        // Replace le curseur dans le champ
        return;
    }

    if (motsProposes.includes(mot)) {    // Si le mot a déjà été proposé
        messageElement.textContent = "Vous avez déjà proposé ce mot.";
        inputProposition.value     = ""; // Vide le champ de saisie
        inputProposition.focus();
        return;
    }

    motsProposes.push(mot);              // Ajoute le mot au tableau des mots proposés

    if (mot === motSecret) {                              // Si le mot proposé est correct
        messageElement.textContent = "Félicitations ! Vous avez trouvé le mot 🎉.";
        lettresTrouvees            = motSecret.split(""); // Révèle le mot entier
        boutonVerifier.disabled    = true;                // Désactive le bouton "Vérifier"
        jeuTermine                 = true;                // Marque le jeu comme terminé
    } else {
        erreurs++;               // Incrémente le compteur d'erreurs
        verifierPerte();         // Vérifie si le joueur a perdu
    }
    mettreAJourAffichage();      // Met à jour l'affichage
    inputProposition.value = ""; // Vide le champ de saisie
}

// Fonction pour vérifier si le joueur a perdu
function verifierPerte() {
    if (erreurs >= maxErreurs) {           // Si le nombre d'erreurs atteint la limite
        messageElement.textContent = `Dommage, vous avez perdu. Le mot était : ${motSecret}. 😞`;
        boutonVerifier.disabled    = true; // Désactive le bouton "Vérifier"
        jeuTermine                 = true; // Marque le jeu comme terminé
    } else {
        messageElement.textContent = `Il vous reste ${maxErreurs - erreurs} essais.`; // Affiche le nombre d'essais restants
    }
}

// Fonction pour gérer l'état des champs
function gererChampsActifs() {
    if (inputLettre.value.trim() !== "") {
        inputProposition.disabled = true;  // Désactive la saisie des mots si une lettre est en cours de saisie
    } else if (inputProposition.value.trim() !== "") {
        inputLettre.disabled      = true;  // Désactive la saisie des lettres si un mot est en cours de saisie
    } else {
        inputLettre.disabled      = false; // Réactive les deux champs si aucun n'est utilisé
        inputProposition.disabled = false;
    }
}

// Écouteurs pour activer/désactiver les champs
inputLettre.addEventListener("input", gererChampsActifs);
inputProposition.addEventListener("input", gererChampsActifs);

// Vérifie une lettre ou un mot lorsque "Enter" est pressée
inputLettre.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && inputProposition.value.trim() === "" && !jeuTermine) {
        const lettre = inputLettre.value.toLowerCase(); // Récupère la lettre saisie en minuscule
        if (lettre && /^[a-z]$/.test(lettre)) {
            verifierLettre(lettre); // Vérifie la lettre
        } else {
            messageElement.textContent = "Veuillez entrer une lettre valide.";
            inputLettre.value          = ""; // Vide le champ si invalide
        }
        gererChampsActifs(); // Met à jour l'état des champs
        inputLettre.focus(); // Replace le curseur
    }
});

inputProposition.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && inputLettre.value.trim() === "" && !jeuTermine) {
        const proposition = inputProposition.value.trim().toLowerCase(); // Récupère le mot proposé
        if (proposition && /^[a-zA-Z]+$/.test(proposition)) {
            verifierProposition(proposition); // Vérifie le mot proposé
        } else {
            messageElement.textContent = "Veuillez entrer un mot valide.";
            inputProposition.value     = ""; // Vide le champ si invalide
        }
        gererChampsActifs();      // Met à jour l'état des champs
        inputProposition.focus(); // Replace le curseur
    }
});

// Vérifie une lettre ou un mot lorsque le bouton "Vérifier" est cliqué
boutonVerifier.addEventListener("click", () => {
    if (jeuTermine) return; // Empêche l'action si le jeu est terminé

    const lettre      = inputLettre.value.toLowerCase();             // Récupère la lettre saisie
    const proposition = inputProposition.value.trim().toLowerCase(); // Récupère le mot proposé

    if (lettre && /^[a-z]$/.test(lettre) && inputProposition.value.trim() === "") {
        verifierLettre(lettre); // Vérifie la lettre
    } else if (proposition && /^[a-zA-Z]+$/.test(proposition) && inputLettre.value.trim() === "") {
        verifierProposition(proposition); // Vérifie le mot
    } else {
        messageElement.textContent = "Veuillez entrer une lettre valide.";
        inputLettre.value          = ""; // Vide le champ des lettres
        inputProposition.value     = ""; // Vide le champ des mots
    }
    gererChampsActifs(); // Met à jour l'état des champs
});

// Change de mot lorsque le bouton "Changer de mot" est cliqué
boutonChangerDeMot.addEventListener("click", choisirNouveauMot);

// Initialisation du jeu
choisirNouveauMot();
