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
        const img = document.createElement("img");
        img.setAttribute("src", `assets/media/${image}`);
        img.setAttribute("alt", title);
        img.setAttribute("tabindex", "0");
        img.setAttribute("aria-label", "Ouvrir l'image " + title);
        setClickAndEnterListener(img, mediaAction);
        return img;
    }

    function createVideoElement() {
        const posterUrl = `assets/media/poster/${video.slice(0, -4)}.jpg`;
        const videoElement = document.createElement("video");
        videoElement.setAttribute("src", `assets/media/${video}`);
        videoElement.setAttribute("alt", title);
        videoElement.setAttribute("poster", posterUrl);
        videoElement.setAttribute("tabindex", "0");
        videoElement.setAttribute("aria-label", "Ouvrir la vidéo " + title);
        setClickAndEnterListener(videoElement, mediaAction);
        return videoElement;
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
            } else {
                heart.classList.replace("fa", "fa-regular");
                sortedMedia[index].likes -= 1;
                sortedMedia[index].liked = false;
            }
            itemLikes.textContent = sortedMedia[index].likes;

            if (filter === "likes" && anotherItemHasTheSameLikes) {
                const mediaSection = document.querySelector(".media_section");
                mediaSection.remove();
                displayMediaData(sortedMedia, photographer, filter);
            }
        }

        const itemLikes = document.createElement("p");
        itemLikes.textContent = likes;
        const heart = document.createElement("p");
        heart.style.marginLeft = "0.5rem";
        if (media.liked) {
            heart.setAttribute("class", "fa fa-heart");
        } else {
            heart.setAttribute("class", "fa-regular fa-heart");
        }
        const likesWrapper = document.createElement("div");
        likesWrapper.classList.add("likes");
        likesWrapper.setAttribute("tabindex", "0");
        likesWrapper.setAttribute("aria-label", "liker l'image " + title);
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
