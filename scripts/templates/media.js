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
        const article = document.createElement("article");
        article.setAttribute("class", "media-card");
        article.id = mediaId;
        article.setAttribute("data-photographer-id", photographerId);
        article.setAttribute("data-date", date);
        article.setAttribute("data-price", mediaPrice);
        article.setAttribute("data-index", index);

        if (image) {
            const img = document.createElement("img");
            img.setAttribute("src", `assets/media/${image}`);
            img.setAttribute("alt", title);
            img.setAttribute("tabindex", "0");
            img.setAttribute("aria-label", "Ouvrir l'image " + title);
            img.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    displayLightbox(sortedMedia, index);
                    mainContent.setAttribute("aria-hidden", "true");
                    lightBox.setAttribute("aria-hidden", "false");
                }
            });
            img.addEventListener("click", () => {
                displayLightbox(sortedMedia, index);
                mainContent.setAttribute("aria-hidden", "true");
                lightBox.setAttribute("aria-hidden", "false");
            });
            article.appendChild(img);
        } else if (video) {
            const posterUrl = `assets/media/poster/${video.slice(0, -4)}.jpg`;
            const videoElement = document.createElement("video");
            videoElement.setAttribute("src", `assets/media/${video}`);
            videoElement.setAttribute("alt", title);
            videoElement.setAttribute("poster", posterUrl);
            videoElement.setAttribute("tabindex", "0");
            videoElement.setAttribute("aria-label", "Ouvrir la vidéo " + title);
            videoElement.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    displayLightbox(sortedMedia, index);
                    mainContent.setAttribute("aria-hidden", "true");
                    lightBox.setAttribute("aria-hidden", "false");
                }
            });
            videoElement.addEventListener("click", () => {
                displayLightbox(sortedMedia, index);
                mainContent.setAttribute("aria-hidden", "true");
                lightBox.setAttribute("aria-hidden", "false");
            });
            article.appendChild(videoElement);
        }

        const cartouche = document.createElement("div");
        cartouche.setAttribute("class", "cartouche");
        const h2 = document.createElement("h2");
        h2.textContent = title;
        const itemLikes = document.createElement("p");
        const heart = document.createElement("i");
        heart.setAttribute("class", "fa-regular fa-heart");
        heart.setAttribute("tabindex", "0");
        heart.style.marginLeft = "0.5rem";
        heart.style.cursor = "pointer";
        // const selectedFilter =
        //     document
        //         .getElementById("selected_option")
        //         .getAttribute("data-value") || "likes";
        // const likedArticlesIds = [];
        heart.addEventListener("click", () => {
            // console.log("selectedFilter", selectedFilter);

            if (heart.classList.contains("fa-regular")) {
                heart.classList.replace("fa-regular", "fa");
                sortedMedia[index].likes += 1;
                // likedArticlesIds.push(sortedMedia[index].id);
            } else {
                heart.classList.replace("fa", "fa-regular");
                sortedMedia[index].likes -= 1;
                // likedArticlesIds.pop(sortedMedia[index].id);
            }
            // console.log("likedArticlesIds", likedArticlesIds);
            itemLikes.textContent = sortedMedia[index].likes;
            itemLikes.appendChild(heart);
            // if (selectedFilter === "likes") {
            //     const mediaSection = document.querySelector(".media_section");
            //     mediaSection.remove();
            //     displayMediaData(sortedMedia, photographer);
            // }
            displayInfoCard(photographer, sortedMedia);
        });
        heart.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (heart.classList.contains("fa-regular")) {
                    heart.classList.replace("fa-regular", "fa");
                    sortedMedia[index].likes += 1;
                    // likedArticlesIds.push(sortedMedia[index].id);
                } else {
                    heart.classList.replace("fa", "fa-regular");
                    sortedMedia[index].likes -= 1;
                    // likedArticlesIds.pop(sortedMedia[index].id);
                }
                // console.log("likedArticlesIds", likedArticlesIds);
                itemLikes.textContent = sortedMedia[index].likes;
                itemLikes.appendChild(heart);
                // if (selectedFilter === "likes") {
                //     const mediaSection = document.querySelector(".media_section");
                //     mediaSection.remove();
                //     displayMediaData(sortedMedia, photographer);
                // }
                displayInfoCard(photographer, sortedMedia);
            }
        });
        itemLikes.textContent = likes;
        itemLikes.appendChild(heart);
        cartouche.appendChild(h2);
        cartouche.appendChild(itemLikes);

        article.appendChild(cartouche);
        return article;
    }

    return {
        getMediaCardDOM,
    };
}
