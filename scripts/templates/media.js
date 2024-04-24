import { displayInfoCard } from "../pages/photographer.js";
import { displayLightbox } from "../utils/lightBox.js";

export function mediaTemplate(media, index, sortedMedia, photographer) {
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
    const mainContent = document.getElementById("main");
    const lightBox = document.getElementById("lightbox");

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
        img.addEventListener("keydown", handleMediaKeydown);
        img.addEventListener("click", handleMediaClick);
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
        videoElement.addEventListener("keydown", handleMediaKeydown);
        videoElement.addEventListener("click", handleMediaClick);
        return videoElement;
    }

    function handleMediaKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            displayLightbox(sortedMedia, index);
            mainContent.setAttribute("aria-hidden", "true");
            lightBox.setAttribute("aria-hidden", "false");
        }
    }

    function handleMediaClick() {
        displayLightbox(sortedMedia, index);
        mainContent.setAttribute("aria-hidden", "true");
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
        function handleLikesClick() {
            toggleLike();
            displayInfoCard(photographer, sortedMedia);
        }

        function handleLikesKeydown(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                toggleLike();
                displayInfoCard(photographer, sortedMedia);
            }
        }

        function toggleLike() {
            if (heart.classList.contains("fa-regular")) {
                heart.classList.replace("fa-regular", "fa");
                sortedMedia[index].likes += 1;
            } else {
                heart.classList.replace("fa", "fa-regular");
                sortedMedia[index].likes -= 1;
            }
            itemLikes.textContent = sortedMedia[index].likes;
            itemLikes.appendChild(heart);
        }

        const itemLikes = document.createElement("p");
        const heart = document.createElement("span");
        heart.setAttribute("class", "fa-regular fa-heart");
        itemLikes.setAttribute("tabindex", "0");
        itemLikes.setAttribute("aria-label", "liker l'image " + title);
        heart.style.marginLeft = "0.5rem";
        itemLikes.style.cursor = "pointer";
        itemLikes.addEventListener("click", handleLikesClick);
        itemLikes.addEventListener("keydown", handleLikesKeydown);
        itemLikes.textContent = likes;
        itemLikes.appendChild(heart);

        return itemLikes;
    }

    return {
        getMediaCardDOM,
    };
}
