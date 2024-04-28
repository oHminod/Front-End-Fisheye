import { displayInfoCard, displayMediaData } from "../pages/photographer.js";
import {
    getPhotographerDOMElements,
    setClickAndEnterListener,
} from "../utils/DOMUtils.js";
import { displayLightbox } from "../utils/lightBox.js";

export function mediaTemplate(media, index, sortedMedia, photographer, filter) {
    const {
        id: mediaId,
        photographerId,
        image,
        video,
        likes,
        date,
        price: mediaPrice,
        title,
    } = media;
    const { mainSection, lightBox } = getPhotographerDOMElements();

    function getMediaCardDOM() {
        const article = createArticle();
        const cartouche = createCartouche();

        if (image) {
            const img = createImageElement();
            article.appendChild(img);
        } else if (video) {
            const videoElement = createVideoElement();
            article.appendChild(videoElement);
        }

        article.appendChild(cartouche);
        return article;
    }

    function createArticle() {
        const article = document.createElement("article");
        article.setAttribute("class", "media-card");
        article.id = mediaId;
        article.setAttribute("data-photographer-id", photographerId);
        article.setAttribute("data-date", date);
        article.setAttribute("data-price", mediaPrice);
        article.setAttribute("data-index", index);
        return article;
    }

    function createImageElement() {
        const imgBtn = document.createElement("button");
        imgBtn.setAttribute("class", "media-card__btn");
        imgBtn.setAttribute("tabindex", "0");
        imgBtn.setAttribute("aria-label", "Ouvrir l'image " + title);
        imgBtn.id = "media" + mediaId;
        const img = document.createElement("img");
        img.setAttribute("src", `assets/media/${image}`);
        img.setAttribute("alt", title);
        imgBtn.appendChild(img);
        setClickAndEnterListener(imgBtn, mediaAction);
        return imgBtn;
    }

    function createVideoElement() {
        const vidBtn = document.createElement("button");
        vidBtn.setAttribute("class", "media-card__btn");
        vidBtn.setAttribute("tabindex", "0");
        vidBtn.setAttribute("aria-label", "Ouvrir la vidéo " + title);
        vidBtn.id = "media" + mediaId;
        const posterUrl = `assets/media/poster/${video.slice(0, -4)}.jpg`;
        const videoElement = document.createElement("video");
        videoElement.setAttribute("src", `assets/media/${video}`);
        videoElement.setAttribute("alt", title);
        videoElement.setAttribute("poster", posterUrl);
        vidBtn.appendChild(videoElement);
        setClickAndEnterListener(vidBtn, mediaAction);
        return vidBtn;
    }

    function mediaAction() {
        displayLightbox(sortedMedia, index);
        mainSection.setAttribute("aria-hidden", "true");
        lightBox.setAttribute("aria-hidden", "false");
    }

    function createCartouche() {
        const cartouche = document.createElement("div");
        cartouche.setAttribute("class", "cartouche");
        const h2 = document.createElement("h2");
        h2.textContent = title;
        const itemLikes = createItemLikes();
        cartouche.appendChild(h2);
        cartouche.appendChild(itemLikes);
        return cartouche;
    }

    function createItemLikes() {
        function handleLikes() {
            toggleLike();
            displayInfoCard(photographer, sortedMedia);
        }

        function toggleLike() {
            const anotherItemHasTheSameLikes = sortedMedia.some((media) => {
                if (media.photographerId === photographer.id) {
                    return (
                        media.likes === sortedMedia[index].likes &&
                        media.id !== sortedMedia[index].id
                    );
                }
            });

            if (heart.classList.contains("fa-regular")) {
                heart.classList.replace("fa-regular", "fa");
                sortedMedia[index].likes += 1;
                sortedMedia[index].liked = true;
                likesWrapper.setAttribute(
                    "aria-label",
                    "Ne plus aimer l'image " + title
                );
            } else {
                heart.classList.replace("fa", "fa-regular");
                sortedMedia[index].likes -= 1;
                sortedMedia[index].liked = false;
                likesWrapper.setAttribute(
                    "aria-label",
                    "Aimer l'image " + title
                );
            }
            itemLikes.textContent = sortedMedia[index].likes;

            if (filter === "likes" && anotherItemHasTheSameLikes) {
                const mediaSection = document.querySelector(".media_section");
                mediaSection.remove();
                displayMediaData(sortedMedia, photographer, filter);
            }
        }

        const itemLikes = document.createElement("p");
        itemLikes.setAttribute("aria-label", "Nombre de j'aime");
        itemLikes.textContent = likes;
        const heart = document.createElement("p");
        const likesWrapper = document.createElement("button");
        likesWrapper.classList.add("likes");
        likesWrapper.setAttribute("tabindex", "0");
        if (media.liked) {
            heart.setAttribute("class", "fa fa-heart");
            likesWrapper.setAttribute(
                "aria-label",
                "Ne plus aimer l'image " + title
            );
        } else {
            heart.setAttribute("class", "fa-regular fa-heart");
            likesWrapper.setAttribute("aria-label", "Aimer l'image " + title);
        }
        likesWrapper.style.cursor = "pointer";
        setClickAndEnterListener(likesWrapper, handleLikes);

        likesWrapper.appendChild(itemLikes);
        likesWrapper.appendChild(heart);

        return likesWrapper;
    }

    return {
        getMediaCardDOM,
    };
}
