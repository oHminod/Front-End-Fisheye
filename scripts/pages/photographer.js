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
    const mainSection = document.getElementById("main");
    const mediaSection = document.createElement("section");
    mediaSection.setAttribute("class", "media_section");

    const sortedMedia = sortMedia(filter, media);

    sortedMedia.forEach((media, index) => {
        const mediaModel = mediaTemplate(
            media,
            index,
            sortedMedia,
            photographer
        );
        const mediaDOM = mediaModel.getMediaCardDOM();
        mediaSection.appendChild(mediaDOM);
    });

    mainSection.appendChild(mediaSection);
}

export function displayInfoCard(photographer, media) {
    const infoCard = document.getElementById("info_card");
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
    displayMediaData(photographerMedia, photographer);
    displayInfoCard(photographer, photographerMedia);
}

init();

const customOptions = document.getElementById("custom_options");
document
    .querySelector(".custom-select-trigger")
    .addEventListener("click", function () {
        customOptions.classList.add("flex");
    });

document.querySelectorAll(".custom-option").forEach((option) => {
    option.addEventListener("click", async function () {
        if (!option.classList.contains("selected")) {
            option.parentNode
                .querySelector(".custom-option.selected")
                .classList.remove("selected");
            option.classList.add("selected");
            const selectedOption = document.getElementById("selected_option");
            selectedOption.textContent = option.textContent;
            selectedOption.setAttribute(
                "data-value",
                option.getAttribute("data-value")
            );
            const mediaSection = document.querySelector(".media_section");
            mediaSection.remove();
            const { photographers, media } = await fetchData();
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

        customOptions.classList.remove("flex");
    });
});
