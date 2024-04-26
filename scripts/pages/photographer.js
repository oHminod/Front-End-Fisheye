import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import {
    getPhotographerDOMElements,
    setClickAndEnterListener,
} from "../utils/DOMUtils.js";
import { fetchData } from "./index.js";

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
    const likes = document.createElement("p");
    likes.textContent = totalLikes;
    const priceP = document.createElement("p");
    priceP.textContent = `${price}€ / jour`;
    const heart = document.createElement("i");
    heart.setAttribute("class", "fa fa-heart");
    heart.style.marginLeft = "0.5rem";
    likes.appendChild(heart);
    infoCard.appendChild(likes);
    infoCard.appendChild(priceP);
}

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
}

init();

const callbacks = {};
const { customOptions, mainContent } = getPhotographerDOMElements();
setClickAndEnterListener(
    document.querySelector(".custom-select-trigger"),
    () => {
        mainContent.setAttribute("aria-hidden", "true");
        customOptions.setAttribute("aria-hidden", "false");
        customOptions.classList.add("flex");
        callbacks.handleEscClose = (event) => {
            if (event.key === "Escape") {
                mainContent.setAttribute("aria-hidden", "false");
                customOptions.setAttribute("aria-hidden", "true");
                customOptions.classList.remove("flex");
                document.removeEventListener(
                    "keydown",
                    callbacks.handleEscClose
                );
            }
        };

        document.addEventListener("keydown", callbacks.handleEscClose);
    }
);

document.querySelectorAll(".custom-option").forEach((option) => {
    setClickAndEnterListener(option, async () => {
        await selectFilter(option);
    });
});

async function selectFilter(option) {
    if (!option.classList.contains("selected")) {
        option.parentNode
            .querySelector(".custom-option.selected")
            .classList.remove("selected");
        option.classList.add("selected");

        const { selectedOption, mediaSection } = getPhotographerDOMElements();
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

    mainContent.setAttribute("aria-hidden", "false");
    customOptions.setAttribute("aria-hidden", "true");
    customOptions.classList.remove("flex");
}
