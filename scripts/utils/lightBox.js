import {
    trapFocus,
    untrapFocus,
    setClickAndEnterListener,
    removeClickAndEnterListener,
} from "./DOMUtils.js";

const lightBox = document.getElementById("lightbox");
const lightboxBackground = document.getElementById("lightbox_background");
const lightboxContent = document.getElementById("lightbox_content");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");
const mainContent = document.getElementById("main");

const callbacks = {};

let lastFocusedElement;
let lastFocusedNavBtn = null;

/**
 * Affiche la lightbox avec le média sélectionné.
 * @param {Object[]} media - Le tableau de médias.
 * @param {number} index - L'index du média sélectionné dans le tableau.
 */
export function displayLightbox(media, index) {
    const previousIndex = getPreviousIndex(index, media.length);
    const nextIndex = getNextIndex(index, media.length);

    lastFocusedElement = document.getElementById("media" + media[index].id);

    trapFocus("preserve-lightbox-element");
    setupLightbox();
    setupCloseButton();
    setupPreviousButton(media, previousIndex);
    setupNextButton(media, nextIndex);
    setupKeyboardNavigation(media, previousIndex, nextIndex);

    if (media[index].image) {
        displayImage(media[index]);
        lightboxContent.setAttribute(
            "aria-label",
            "Vous visionnez l'image " + media[index].title
        );
    } else if (media[index].video) {
        displayVideo(media[index]);
        lightboxContent.setAttribute(
            "aria-label",
            "Vous visionnez la vidéo " + media[index].title
        );
    }
}

/**
 * Obtient l'index précédent dans le tableau.
 * @param {number} index - L'index actuel.
 * @param {number} length - La longueur du tableau.
 * @returns {number} L'index précédent.
 */
function getPreviousIndex(index, length) {
    return index - 1 < 0 ? length - 1 : index - 1;
}

/**
 * Obtient l'index suivant dans le tableau.
 * @param {number} index - L'index actuel.
 * @param {number} length - La longueur du tableau.
 * @returns {number} L'index suivant.
 */
function getNextIndex(index, length) {
    return index + 1 >= length ? 0 : index + 1;
}

/**
 * Configure la lightbox pour l'affichage.
 */
function setupLightbox() {
    lightBox.style.display = "flex";
    lightboxBackground.addEventListener("click", closeLightbox);
}

/**
 * Configure le bouton de fermeture de la lightbox.
 */
function setupCloseButton() {
    closeLightboxBtn.addEventListener("click", closeLightbox);
    closeLightboxBtn.setAttribute("aria-label", "Fermer la lightbox");
    const closeIcon = document.createElement("span");
    closeIcon.setAttribute("class", "fa fa-times");
    closeLightboxBtn.innerText = "";
    closeLightboxBtn.appendChild(closeIcon);
    callbacks.handleClose = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            closeLightbox();
        }
    };
    closeLightboxBtn.addEventListener("keydown", callbacks.handleClose);
}

/**
 * Configure le bouton précédent de la lightbox.
 * @param {Object[]} media - Le tableau de médias.
 * @param {number} previousIndex - L'index du média précédent.
 */
function setupPreviousButton(media, previousIndex) {
    const previousBtn = createButton("previous-btn", "Image précédente", "<");
    const isPreviousBtnFocused = lastFocusedNavBtn === "previousBtn";
    callbacks.handlePrevious = () => {
        lastFocusedNavBtn = "previousBtn";
        removeLighboxContent();
        displayLightbox(media, previousIndex);
    };
    setClickAndEnterListener(previousBtn, callbacks.handlePrevious);
    lightboxContent.appendChild(previousBtn);
    isPreviousBtnFocused && previousBtn.focus();
}

/**
 * Configure le bouton suivant de la lightbox.
 * @param {Object[]} media - Le tableau de médias.
 * @param {number} nextIndex - L'index du média suivant.
 */
function setupNextButton(media, nextIndex) {
    const nextBtn = createButton("next-btn", "Image suivante", ">");
    const isNextBtnFocused = lastFocusedNavBtn === "nextBtn";
    callbacks.handleNext = () => {
        lastFocusedNavBtn = "nextBtn";
        removeLighboxContent();
        displayLightbox(media, nextIndex);
    };
    setClickAndEnterListener(nextBtn, callbacks.handleNext);
    lightboxContent.appendChild(nextBtn);
    !lastFocusedNavBtn && nextBtn.focus();
    isNextBtnFocused && nextBtn.focus();
}

/**
 * Configure la navigation au clavier pour la lightbox.
 * @param {Object[]} media - Le tableau de médias.
 * @param {number} previousIndex - L'index du média précédent.
 * @param {number} nextIndex - L'index du média suivant.
 */
function setupKeyboardNavigation(media, previousIndex, nextIndex) {
    document.removeEventListener("keydown", callbacks.handleArrowLeft);
    document.removeEventListener("keydown", callbacks.handleArrowRight);
    document.removeEventListener("keydown", callbacks.handleEscape);

    callbacks.handleArrowLeft = (event) => {
        if (event.key === "ArrowLeft") {
            lastFocusedNavBtn = "previousBtn";
            removeLighboxContent();
            displayLightbox(media, previousIndex);
        }
    };

    callbacks.handleArrowRight = (event) => {
        if (event.key === "ArrowRight") {
            lastFocusedNavBtn = "nextBtn";
            removeLighboxContent();
            displayLightbox(media, nextIndex);
        }
    };

    callbacks.handleEscape = (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    };

    document.addEventListener("keydown", callbacks.handleArrowLeft);
    document.addEventListener("keydown", callbacks.handleArrowRight);
    document.addEventListener("keydown", callbacks.handleEscape);
}

/**
 * Crée un bouton pour la lightbox.
 * @param {string} className - Le nom de la classe CSS à appliquer au bouton.
 * @param {string} ariaLabel - Le label ARIA à appliquer au bouton.
 * @param {string} innerText - Le texte à afficher dans le bouton.
 * @returns {HTMLElement} Le bouton créé.
 */
function createButton(className, ariaLabel, innerText) {
    const btn = document.createElement("button");
    btn.classList.add(className);
    btn.setAttribute("aria-label", ariaLabel);
    btn.setAttribute("tabindex", "0");
    btn.innerText = innerText;
    return btn;
}

/**
 * Affiche une image dans la lightbox.
 * @param {Object} mediaItem - L'objet média contenant les informations de l'image.
 */
function displayImage(mediaItem) {
    const image = document.createElement("img");
    image.setAttribute("src", `assets/media/${mediaItem.image}`);
    image.setAttribute(
        "alt",
        mediaItem.title + ", image de " + mediaItem.photographerName
    );
    const imageTitle = document.createElement("h2");
    imageTitle.textContent = mediaItem.title;
    lightboxContent.appendChild(image);
    lightboxContent.appendChild(imageTitle);
}

/**
 * Affiche une vidéo dans la lightbox.
 * @param {Object} mediaItem - L'objet média contenant les informations de la vidéo.
 */
function displayVideo(mediaItem) {
    const video = document.createElement("video");
    video.setAttribute("src", `assets/media/${mediaItem.video}`);
    video.setAttribute(
        "poster",
        `assets/media/poster/${mediaItem.video.slice(0, -4)}.jpg`
    );
    video.setAttribute("title", mediaItem.title);
    video.setAttribute("controls", true);
    video.setAttribute("track", "no audio");
    const videoTitle = document.createElement("h2");
    videoTitle.textContent = mediaItem.title;
    lightboxContent.appendChild(video);
    lightboxContent.appendChild(videoTitle);
}

/**
 * Supprime le contenu de la lightbox.
 */
function removeLighboxContent() {
    const previousBtn = document.querySelector(".previous-btn");
    const nextBtn = document.querySelector(".next-btn");
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", callbacks.handleClose);
    removeClickAndEnterListener(previousBtn, callbacks.handlePrevious);
    removeClickAndEnterListener(nextBtn, callbacks.handleNext);
    lightboxContent.innerHTML = "";
}

/**
 * Ferme la lightbox.
 */
export function closeLightbox() {
    lastFocusedNavBtn = null;
    lightBox.style.display = "none";
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", callbacks.handleClose);
    lightboxContent.innerHTML = "";

    mainContent.setAttribute("aria-hidden", "false");
    lightBox.setAttribute("aria-hidden", "true");

    untrapFocus(lastFocusedElement);
}
