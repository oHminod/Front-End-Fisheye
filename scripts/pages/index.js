import { photographerTemplate } from "../templates/photographer.js";

/**
 * Récupère les données des photographes.
 * @returns {Promise<{photographers: Object[]}>} Un objet contenant un tableau de photographes.
 */
async function getPhotographers() {
    const data = await fetchData();
    return { photographers: data.photographers };
}

/**
 * Récupère les données à partir d'un fichier JSON.
 * @returns {Promise<Object>} Les données récupérées.
 */
export async function fetchData() {
    const res = await fetch("data/photographers.json");
    const data = await res.json();
    return data;
}

/**
 * Affiche les données des photographes sur la page.
 * @param {Object[]} photographers - Un tableau d'objets représentant les photographes.
 */
async function displayData(photographers) {
    const photographersSection = document.querySelector(
        ".photographer_section"
    );

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection && photographersSection.appendChild(userCardDOM);
    });
}

/**
 * Initialise l'application.
 */
async function init() {
    const { photographers } = await getPhotographers();

    displayData(photographers);

    const aElements = document.querySelectorAll("a");
    aElements.forEach((aElement) => {
        aElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                aElement.click();
            }
        });
    });
}

init();
