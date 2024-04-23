import { mediaTemplate } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";
import { fetchData } from "./index.js";

function displayPhotographerData(photographer) {
    const photographerHeader = document.querySelector(".photograph-header");
    const photographerInfoModel = photographerTemplate(photographer);
    const photographerInfoDOM = photographerInfoModel.getPhotographerInfoDOM();
    photographerHeader.appendChild(photographerInfoDOM);
}

function sortMedia(filter = "id", media) {
    return media.sort((a, b) => {
        if (filter === "likes") {
            return b[filter] - a[filter];
        }
        return a[filter] - b[filter];
    });
}

function displayMediaData(media) {
    const mainSection = document.getElementById("main");
    const mediaSection = document.createElement("section");
    mediaSection.setAttribute("class", "media_section");

    const sortedMedia = sortMedia("date", media);

    sortedMedia.forEach((media) => {
        const mediaModel = mediaTemplate(media);
        const mediaDOM = mediaModel.getMediaCardDOM();
        mediaSection.appendChild(mediaDOM);
    });

    mainSection.appendChild(mediaSection);
}

function displayInfoCard(photographer, media) {
    const infoCard = document.getElementById("info_card");
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

    displayPhotographerData(photographer);
    displayMediaData(photographerMedia);
    displayInfoCard(photographer, photographerMedia);
}

init();
