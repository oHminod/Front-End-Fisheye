import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import {
    getPhotographerDOMElements,
    logoLinkHref,
    setClickAndEnterListener,
    trapFocus,
    untrapFocus,
} from "../utils/DOMUtils.js";
import { fetchData } from "./index.js";

const photographers = [];
const media = [];

async function globallyFetchData() {
    if (!photographers.length || !media.length) {
        const data = await fetchData();
        photographers.push(...data.photographers);
        media.push(...data.media);
    }
}

async function init() {
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
}

init();

function displayPhotographerData(photographer) {
    const { photographerHeader } = getPhotographerDOMElements();
    const photographerInfoModel = photographerTemplate(photographer);
    const photographerInfoDOM = photographerInfoModel.getPhotographerInfoDOM();
    photographerHeader.appendChild(photographerInfoDOM);
}

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

function setupFilterMenu() {
    const callbacks = {};
    const { customOptions, optionsTrigger, mainContent } =
        getPhotographerDOMElements();
    let lastFocusedElement;
    function closeFilterDropDown() {
        untrapFocus(lastFocusedElement);
        mainContent.setAttribute("aria-hidden", "false");
        customOptions.setAttribute("aria-hidden", "true");
        customOptions.classList.remove("flex");
        optionsTrigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("keydown", callbacks.handleEscClose);
    }
    setClickAndEnterListener(optionsTrigger, triggerFilterDropDown);

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

    document.querySelectorAll(".custom-option").forEach((option) => {
        setClickAndEnterListener(option, async () => {
            await selectFilter(option);
        });
    });
}
