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

    function createMediaElement(type, source, title, index) {
        const element = document.createElement(type);
        element.setAttribute("src", `assets/media/${source}`);
        element.setAttribute("alt", title);
        element.setAttribute("tabindex", "0");
        element.setAttribute(
            "aria-label",
            `Ouvrir ${type === "img" ? "l'image" : "la vidéo"} ${title}`
        );
        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                displayLightbox(sortedMedia, index);
                mainContent.setAttribute("aria-hidden", "true");
                lightBox.setAttribute("aria-hidden", "false");
            }
        });
        element.addEventListener("click", () => {
            displayLightbox(sortedMedia, index);
            mainContent.setAttribute("aria-hidden", "true");
            lightBox.setAttribute("aria-hidden", "false");
        });
        return element;
    }

    function createLikesElement(index, likes) {
        const itemLikes = document.createElement("p");
        const heart = document.createElement("span");
        heart.setAttribute("class", "fa-regular fa-heart");
        itemLikes.setAttribute("tabindex", "0");
        heart.style.marginLeft = "0.5rem";
        itemLikes.style.cursor = "pointer";

        itemLikes.addEventListener("click", () => {
            toggleLike(heart, index);
            displayInfoCard(photographer, sortedMedia);
        });

        itemLikes.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                toggleLike(heart, index);
                displayInfoCard(photographer, sortedMedia);
            }
        });
        itemLikes.textContent = likes;
        itemLikes.appendChild(heart);
        return itemLikes;
    }

    function toggleLike(heart, index) {
        if (heart.classList.contains("fa-regular")) {
            heart.classList.replace("fa-regular", "fa");
            sortedMedia[index].likes += 1;
        } else {
            heart.classList.replace("fa", "fa-regular");
            sortedMedia[index].likes -= 1;
        }
    }

    function getMediaCardDOM() {
        const article = document.createElement("article");
        article.setAttribute("class", "media-card");
        article.id = mediaId;
        article.setAttribute("data-photographer-id", photographerId);
        article.setAttribute("data-date", date);
        article.setAttribute("data-price", mediaPrice);
        article.setAttribute("data-index", index);

        if (image) {
            const img = createMediaElement("img", image, title, index);
            article.appendChild(img);
        } else if (video) {
            const videoElement = createMediaElement(
                "video",
                video,
                title,
                index
            );
            videoElement.setAttribute(
                "poster",
                `assets/media/poster/${video.slice(0, -4)}.jpg`
            );
            article.appendChild(videoElement);
        }

        const cartouche = document.createElement("div");
        cartouche.setAttribute("class", "cartouche");
        const h2 = document.createElement("h2");
        h2.textContent = title;
        const itemLikes = createLikesElement(index, likes);
        cartouche.appendChild(h2);
        cartouche.appendChild(itemLikes);

        article.appendChild(cartouche);
        return article;
    }

    return {
        getMediaCardDOM,
    };
}
