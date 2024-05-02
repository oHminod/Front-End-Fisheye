import { displayInfoCard, displayMediaData } from "../pages/photographer.js";
import { setClickAndEnterListener } from "../utils/DOMUtils.js";

/**
 * Crée un élément de likes.
 * @returns {HTMLElement} L'élément de likes.
 */
export function createItemLikes(
    media,
    index,
    sortedMedia,
    photographer,
    filter
) {
    const { id: mediaId, likes, title } = media;
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
            likesWrapper.setAttribute("aria-label", "Aimer l'image " + title);
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
            "Ne plus aimer l'image " + title + ", Nombre de j'aime : " + likes
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
