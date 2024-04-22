import { photographerTemplate } from "../templates/photographer.js";
import { fetchData } from "./index.js";

async function displayPhotographerData(photographer) {
    const photographerHeader = document.querySelector(".photograph-header");
    const photographerInfoModel = photographerTemplate(photographer);
    const photographerInfoDOM = photographerInfoModel.getPhotographerInfoDOM();
    photographerHeader.appendChild(photographerInfoDOM);
    console.log("photographer", photographer);
}

async function displayMediaData(media) {
    console.log(media);
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
