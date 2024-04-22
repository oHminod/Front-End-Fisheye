import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import { fetchData } from "./index.js";

async function displayPhotographerData(photographer) {
    const photographerHeader = document.querySelector(".photograph-header");
    const photographerInfoModel = photographerTemplate(photographer);
    const photographerInfoDOM = photographerInfoModel.getPhotographerInfoDOM();
    photographerHeader.appendChild(photographerInfoDOM);
}

async function displayMediaData(media) {
    const mainSection = document.getElementById("main");
    const mediaSection = document.createElement("section");
    mediaSection.setAttribute("class", "media_section");

    media.forEach((media) => {
        const mediaModel = mediaTemplate(media);
        const mediaDOM = mediaModel.getMediaCardDOM();
        mediaSection.appendChild(mediaDOM);
    });

    mainSection.appendChild(mediaSection);
}

async function init() {
    const { photographers, media } = await fetchData();
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const photographer = photographers.find(
        (photographer) => photographer.id == id
    );
    const photographerMedia = media.filter(
        (media) => media.photographerId == id
    );

    await displayPhotographerData(photographer);
    await displayMediaData(photographerMedia);
}

init();
