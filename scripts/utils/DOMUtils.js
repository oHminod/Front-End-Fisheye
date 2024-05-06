/**
 * Récupère les éléments DOM liés à la page photographe.
 * @returns {Object} Un objet contenant les éléments DOM liés au photographe.
 */
export function getPhotographerDOMElements() {
    const photographerHeader = document.querySelector(".photograph-header");
    const mainSection = document.getElementById("main");
    const infoCard = document.getElementById("info_card");
    const customOptions = document.getElementById("custom_options");
    const optionsTrigger = document.querySelector(".custom-select-trigger");
    const mainContent = document.getElementById("main");
    const selectedOption = document.getElementById("selected_option");
    const mediaSection = document.querySelector(".media_section");
    const lightBox = document.getElementById("lightbox");
    const contactModal = document.getElementById("contact_modal");
    const modalBackground = document.getElementById("modal_background");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const form = document.getElementById("modal_form");

    const firstName = document.getElementById("firstname");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const submit = document.getElementById("submit");
    const photographerName = document.getElementById("photographer_name");

    const logoLink = document.getElementById("logo_link");

    return {
        photographerHeader,
        mainSection,
        infoCard,
        customOptions,
        optionsTrigger,
        mainContent,
        selectedOption,
        mediaSection,
        lightBox,
        firstName,
        contactModal,
        modalBackground,
        closeModalBtn,
        form,
        firstname,
        lastname,
        email,
        message,
        submit,
        photographerName,
        logoLink,
    };
}

const clickCallbacks = {};

/**
 * Définit des écouteurs pour les événements de clic et de touche Entrée.
 * @param {HTMLElement} element - L'élément sur lequel définir l'écouteur.
 * @param {Function} callback - La fonction de rappel à exécuter lors de l'événement.
 */
export function setClickAndEnterListener(element, callback) {
    clickCallbacks.keydownCallback = function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            callback();
        }
    };
    element.addEventListener("click", callback);
    element.addEventListener("keydown", clickCallbacks.keydownCallback);
}

/**
 * Supprime des écouteurs pour les événements de clic et de touche Entrée.
 * @param {HTMLElement} element - L'élément sur lequel supprimer l'écouteur.
 * @param {Function} callback - La fonction de rappel à supprimer.
 */
export function removeClickAndEnterListener(element, callback) {
    element.removeEventListener("click", callback);
    element.removeEventListener("keydown", clickCallbacks.keydownCallback);
}

const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
export const logoLinkHref = isLocal ? "/" : "/Front-End-Fisheye/";

let focusAll = false;
/**
 * Gère la navigation par touches.
 * @param {KeyboardEvent} e - L'événement de touche.
 */
function handleKeyNav(e) {
    const tabIndexElements = document.querySelectorAll("*[tabindex]");
    const notChildrenOfAriaHiddenElements = focusAll
        ? Array.from(tabIndexElements).filter((element) => {
              let parent = element.parentElement;
              while (parent) {
                  if (parent.getAttribute("aria-hidden") === "true") {
                      return false;
                  }
                  parent = parent.parentElement;
              }
              return true;
          })
        : tabIndexElements;

    const focusableElements = Array.from(
        notChildrenOfAriaHiddenElements
    ).filter((element) => element.tabIndex >= 0);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
        focusableElements[focusableElements.length - 1];
    const currentFocusIndex = focusableElements.indexOf(document.activeElement);
    const nextFocusableElement = focusableElements[currentFocusIndex + 1];
    const previousFocusableElement = focusableElements[currentFocusIndex - 1];

    if (e.key === "Tab") {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
        } else {
            nextFocusableElement.focus();
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (
            document.activeElement === firstFocusableElement ||
            previousFocusableElement === undefined
        ) {
            lastFocusableElement.focus();
        } else {
            previousFocusableElement.focus();
        }
    }
}

/**
 * Piège le focus à dans une liste d'éléments spécifiques.
 * @param {string} preservedClass - La classe des éléments à préserver.
 */
export function trapFocus(preservedClass = null) {
    const focusableElements = document.querySelectorAll("*[tabindex]");
    if (preservedClass && preservedClass !== "all") {
        const { logoLink } = getPhotographerDOMElements();

        logoLink.removeAttribute("href");
        focusableElements.forEach((element) => {
            if (preservedClass && !element.classList.contains(preservedClass)) {
                element.tabIndex = -1;
            }
        });
        focusAll = false;
        document.addEventListener("keydown", handleKeyNav);
    } else {
        focusAll = true;
        document.addEventListener("keydown", handleKeyNav);
    }
}

/**
 * Rétablis la liste des éléments focusables et libère la navigation au clavier.
 * @param {HTMLElement} lastFocusedElement - Le dernier élément qui a reçu le focus avant le trap.
 */
export function untrapFocus(lastFocusedElement = null) {
    const focusableElements = document.querySelectorAll("*[tabindex]");
    const { logoLink } = getPhotographerDOMElements();
    logoLink.setAttribute("href", logoLinkHref);
    focusableElements.forEach((element) => (element.tabIndex = 0));
    document.removeEventListener("keydown", handleKeyNav);

    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}
