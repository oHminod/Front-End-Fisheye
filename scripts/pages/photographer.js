import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import { globallyFetchData } from "../utils/dataUtils.js";
import {
    getPhotographerDOMElements,
    logoLinkHref,
    setClickAndEnterListener,
    trapFocus,
} from "../utils/DOMUtils.js";
import { setupFilterMenu } from "../utils/setupFilterMenu.js";

/**
 * Initialise l'application.
 */
async function init() {
    try {
        const { photographers, media } = await globallyFetchData();
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");
        const photographer = photographers.find(
            (photographer) => photographer.id == id
        );
        const photographerMedia = media.filter(
            (media) => media.photographerId == id
        );

        displayPhotographerData(photographer);
        displayMediaData(photographerMedia, photographer);
        displayInfoCard(photographer, photographerMedia);

        const { logoLink } = getPhotographerDOMElements();
        setClickAndEnterListener(logoLink, () => {
            window.location.href = logoLinkHref;
        });

        setupFilterMenu();
        trapFocus("all");
    } catch (error) {
        console.error(error);
    }
}

init();

/**
 * Affiche les données du photographe.
 * @param {Object} photographer - Les données du photographe.
 */
function displayPhotographerData(photographer) {
    const { photographerHeader } = getPhotographerDOMElements();
    const photographerInfoModel = photographerTemplate(photographer);
    const photographerInfoDOM = photographerInfoModel.getPhotographerInfoDOM();
    photographerHeader.appendChild(photographerInfoDOM);
}

/**
 * Trie les médias en fonction du filtre.
 * @param {string} filter - Le filtre à utiliser pour le tri.
 * @param {Object[]} media - Les médias à trier.
 * @returns {Object[]} Les médias triés.
 */
function sortMedia(filter = "id", media) {
    return media.sort((a, b) => {
        if (filter === "likes") {
            return b[filter] - a[filter];
        }
        if (filter === "title") {
            return a[filter].localeCompare(b[filter]);
        }
        if (filter === "date") {
            return new Date(a[filter]) - new Date(b[filter]);
        }
        return a[filter] - b[filter];
    });
}

/**
 * Affiche les données des médias.
 * @param {Object[]} media - Les médias à afficher.
 * @param {Object} photographer - Les données du photographe.
 * @param {string} filter - Le filtre à utiliser pour le tri des médias.
 */
export function displayMediaData(media, photographer, filter = "likes") {
    const { mainSection } = getPhotographerDOMElements();
    const mediaSection = document.createElement("section");
    mediaSection.setAttribute("class", "media_section");

    const sortedMedia = sortMedia(filter, media);

    sortedMedia.forEach((media, index) => {
        const mediaModel = mediaTemplate(
            media,
            index,
            sortedMedia,
            photographer,
            filter
        );
        const mediaDOM = mediaModel.getMediaCardDOM();
        mediaSection.appendChild(mediaDOM);
    });

    mainSection.appendChild(mediaSection);
}

/**
 * Affiche la carte d'information.
 * @param {Object} photographer - Les données du photographe.
 * @param {Object[]} media - Les médias du photographe.
 */
export function displayInfoCard(photographer, media) {
    const { infoCard } = getPhotographerDOMElements();
    infoCard.innerHTML = "";
    const totalLikes = media.reduce((acc, media) => acc + media.likes, 0);
    const price = photographer.price;
    const likes = document.createElement("h2");
    likes.textContent = totalLikes;
    const priceP = document.createElement("h2");
    priceP.textContent = `${price}€ / jour`;
    const heart = document.createElement("i");
    heart.setAttribute("class", "fa fa-heart");
    heart.style.marginLeft = "0.5rem";
    likes.appendChild(heart);
    infoCard.appendChild(likes);
    infoCard.appendChild(priceP);
}
