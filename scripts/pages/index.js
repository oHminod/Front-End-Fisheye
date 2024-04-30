import { photographerTemplate } from "../templates/photographer.js";
import { fetchData } from "../utils/dataUtils.js";

/**
 * Récupère les données des photographes.
 * @returns {Promise<{photographers: Object[]}>} Un objet contenant un tableau de photographes.
 */
async function getPhotographers() {
    const data = await fetchData();
    return { photographers: data.photographers };
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
    try {
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
    } catch (error) {
        console.error(error);
    }
}

init();
