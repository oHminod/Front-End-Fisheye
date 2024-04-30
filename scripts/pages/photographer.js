import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import { fetchData } from "../utils/dataUtils.js";
import {
    getPhotographerDOMElements,
    logoLinkHref,
    setClickAndEnterListener,
    trapFocus,
    untrapFocus,
} from "../utils/DOMUtils.js";

const photographers = [];
const media = [];

/**
 * Récupère globalement les données si elles n'ont pas déjà été récupérées.
 */
async function globallyFetchData() {
    if (!photographers.length || !media.length) {
        const data = await fetchData();
        photographers.push(...data.photographers);
        media.push(...data.media);
    }
}

/**
 * Initialise l'application.
 */
async function init() {
    try {
        await globallyFetchData();
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
    } catch (error) {
        console.error(error);
    }
    // await globallyFetchData();
    // const searchParams = new URLSearchParams(window.location.search);
    // const id = searchParams.get("id");
    // const photographer = photographers.find(
    //     (photographer) => photographer.id == id
    // );
    // const photographerMedia = media.filter(
    //     (media) => media.photographerId == id
    // );

    // displayPhotographerData(photographer);
    // displayMediaData(photographerMedia, photographer);
    // displayInfoCard(photographer, photographerMedia);

    // const { logoLink } = getPhotographerDOMElements();
    // setClickAndEnterListener(logoLink, () => {
    //     window.location.href = logoLinkHref;
    // });

    // setupFilterMenu();
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

/**
 * Configure le menu de filtrage.
 */
function setupFilterMenu() {
    const callbacks = {};
    const { customOptions, optionsTrigger, mainContent } =
        getPhotographerDOMElements();
    let lastFocusedElement;

    /**
     * Ferme le menu déroulant du filtre.
     */
    function closeFilterDropDown() {
        untrapFocus(lastFocusedElement);
        mainContent.setAttribute("aria-hidden", "false");
        customOptions.setAttribute("aria-hidden", "true");
        customOptions.classList.remove("flex");
        optionsTrigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("keydown", callbacks.handleEscClose);
    }
    setClickAndEnterListener(optionsTrigger, triggerFilterDropDown);

    /**
     * Déclenche le menu déroulant du filtre.
     */
    function triggerFilterDropDown() {
        const previouslySelectedOption = customOptions.querySelector(
            ".custom-option.selected"
        );
        lastFocusedElement = document.activeElement;
        trapFocus("custom-option");

        mainContent.setAttribute("aria-hidden", "true");
        customOptions.setAttribute("aria-hidden", "false");
        customOptions.classList.add("flex");
        optionsTrigger.setAttribute("aria-expanded", "true");
        callbacks.handleEscClose = (event) => {
            if (event.key === "Escape") {
                closeFilterDropDown();
                document.removeEventListener(
                    "keydown",
                    callbacks.handleEscClose
                );
            }
        };

        previouslySelectedOption.focus();
        document.addEventListener("keydown", callbacks.handleEscClose);

        function closefilterDropDownOnOutsideClick(event) {
            const isClickInsideDropdown = optionsTrigger.contains(event.target);
            if (!isClickInsideDropdown) {
                closeFilterDropDown();
                document.removeEventListener(
                    "click",
                    closefilterDropDownOnOutsideClick
                );
                mainContent.focus();
            }
        }
        document.addEventListener("click", closefilterDropDownOnOutsideClick);
    }

    /**
     * Sélectionne un filtre.
     * @param {HTMLElement} option - L'option de filtre à sélectionner.
     */
    async function selectFilter(option) {
        if (!option.classList.contains("selected")) {
            const previouslySelectedOption = customOptions.querySelector(
                ".custom-option.selected"
            );
            previouslySelectedOption.classList.remove("selected");
            previouslySelectedOption.id =
                previouslySelectedOption.getAttribute("data-value");
            previouslySelectedOption.setAttribute("aria-selected", "false");
            option.id = "currently_selected_option";
            option.classList.add("selected");
            option.setAttribute("aria-selected", "true");

            const { selectedOption, mediaSection } =
                getPhotographerDOMElements();
            selectedOption.textContent = option.textContent;
            selectedOption.setAttribute(
                "data-value",
                option.getAttribute("data-value")
            );
            mediaSection.remove();
            await globallyFetchData();
            const searchParams = new URLSearchParams(window.location.search);
            const id = searchParams.get("id");
            const photographer = photographers.find(
                (photographer) => photographer.id == id
            );
            const photographerMedia = media.filter(
                (media) => media.photographerId == id
            );
            displayMediaData(
                photographerMedia,
                photographer,
                option.getAttribute("data-value")
            );
        }

        closeFilterDropDown();
    }

    // Ajoute des écouteurs d'événements à chaque option de filtre.
    document.querySelectorAll(".custom-option").forEach((option) => {
        setClickAndEnterListener(option, async () => {
            await selectFilter(option);
        });
    });
}
