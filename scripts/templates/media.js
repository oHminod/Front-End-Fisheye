import { displayInfoCard, displayMediaData } from "../pages/photographer.js";
import {
    getPhotographerDOMElements,
    setClickAndEnterListener,
} from "../utils/DOMUtils.js";
import { displayLightbox } from "../utils/lightBox.js";

/**
 * Crée un modèle de média.
 * @param {Object} media - Les données du média.
 * @param {number} index - L'index du média dans le tableau de médias.
 * @param {Object[]} sortedMedia - Le tableau de médias triés.
 * @param {Object} photographer - Les données du photographe.
 * @param {string} filter - Le filtre utilisé pour trier les médias.
 * @returns {Object} Un objet avec une méthode pour obtenir le DOM du média.
 */
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

    /**
     * Obtient le DOM de la carte de média.
     * @returns {HTMLElement} L'élément DOM de la carte de média.
     */
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

    /**
     * Crée un élément d'article.
     * @returns {HTMLElement} L'élément d'article.
     */
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

    /**
     * Crée un élément d'image.
     * @returns {HTMLElement} L'élément d'image.
     */
    function createImageElement() {
        const imgBtn = document.createElement("button");
        imgBtn.setAttribute("class", "media-card__btn");
        imgBtn.setAttribute("tabindex", "0");
        imgBtn.setAttribute("aria-label", "Ouvrir l'image " + title);
        imgBtn.id = "media" + mediaId;
        const img = document.createElement("img");
        img.setAttribute("src", `assets/media/${image}`);
        img.setAttribute("alt", title + " par " + photographer.name);
        imgBtn.appendChild(img);
        setClickAndEnterListener(imgBtn, mediaAction);
        return imgBtn;
    }

    /**
     * Crée un élément vidéo.
     * @returns {HTMLElement} L'élément vidéo.
     */
    function createVideoElement() {
        const imgBtn = document.createElement("button");
        imgBtn.setAttribute("class", "media-card__btn");
        imgBtn.setAttribute("tabindex", "0");
        imgBtn.setAttribute("aria-label", "Ouvrir la vidéo " + title);
        imgBtn.id = "media" + mediaId;
        const img = document.createElement("img");
        img.setAttribute(
            "src",
            `assets/media/poster/${video.slice(0, -4)}.jpg`
        );
        img.setAttribute("alt", title + " par " + photographer.name);
        imgBtn.appendChild(img);
        setClickAndEnterListener(imgBtn, mediaAction);
        return imgBtn;
    }

    /**
     * Exécute l'action de média (affichage de la lightbox).
     */
    function mediaAction() {
        displayLightbox(sortedMedia, index);
        mainSection.setAttribute("aria-hidden", "true");
        lightBox.setAttribute("aria-hidden", "false");
    }

    /**
     * Crée un cartouche.
     * @returns {HTMLElement} L'élément de cartouche.
     */
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

    /**
     * Crée un élément de likes.
     * @returns {HTMLElement} L'élément de likes.
     */
    function createItemLikes() {
        /**
         * Gère les likes.
         */
        function handleLikes() {
            toggleLike();
            displayInfoCard(photographer, sortedMedia);
        }

        /**
         * Bascule le like.
         */
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
                const likeButtonToFocusAfterRender = document.getElementById(
                    "like" + mediaId
                );
                likeButtonToFocusAfterRender.focus();
            }
        }

        const itemLikes = document.createElement("p");
        itemLikes.setAttribute("aria-label", "Nombre de j'aime");
        itemLikes.textContent = likes;
        const heart = document.createElement("p");
        const likesWrapper = document.createElement("button");
        likesWrapper.classList.add("likes");
        likesWrapper.setAttribute("tabindex", "0");
        likesWrapper.id = "like" + mediaId;
        if (media.liked) {
            heart.setAttribute("class", "fa fa-heart");
            likesWrapper.setAttribute(
                "aria-label",
                "Ne plus aimer l'image " +
                    title +
                    ", Nombre de j'aime : " +
                    likes
            );
        } else {
            heart.setAttribute("class", "fa-regular fa-heart");
            likesWrapper.setAttribute(
                "aria-label",
                "Aimer l'image " + title + ", Nombre de j'aime : " + likes
            );
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
