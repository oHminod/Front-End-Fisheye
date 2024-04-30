import {
    getPhotographerDOMElements,
    trapFocus,
    untrapFocus,
} from "./DOMUtils.js";

const contactModal = document.getElementById("contact_modal");
const modalBackground = document.getElementById("modal_background");
const closeModalBtn = document.getElementById("close-modal-btn");
const form = document.getElementById("modal_form");
const mainContent = document.getElementById("main");

const callbacks = {};
let lastFocusedElement;

/**
 * Affiche la fenêtre modale de contact.
 * @param {string} name - Le nom du photographe.
 */
export function displayModal(name) {
    if (!lastFocusedElement) {
        lastFocusedElement = document.activeElement;
    }
    trapFocus("preserve-contact-element");
    contactModal.style.display = "flex";

    closeModalBtn.setAttribute("aria-label", "Fermer la fenêtre modale");
    mainContent.setAttribute("aria-hidden", "true");
    contactModal.setAttribute("aria-hidden", "false");

    callbacks.handleClose = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            closeModal();
        }
    };
    callbacks.handleCloseEsc = (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    };

    const { photographerName } = getPhotographerDOMElements();
    photographerName.textContent = name;

    modalBackground.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("keydown", callbacks.handleClose);
    document.addEventListener("keydown", callbacks.handleCloseEsc);
    form.addEventListener("submit", submitForm);
}

/**
 * Ferme la fenêtre modale de contact.
 */
export function closeModal() {
    contactModal.style.display = "none";
    modalBackground.removeEventListener("click", closeModal);
    closeModalBtn.removeEventListener("click", closeModal);
    closeModalBtn.removeEventListener("keydown", callbacks.handleClose);
    document.removeEventListener("keydown", callbacks.handleCloseEsc);
    form.removeEventListener("submit", submitForm);
    mainContent.setAttribute("aria-hidden", "false");
    contactModal.setAttribute("aria-hidden", "true");

    untrapFocus(lastFocusedElement);
    trapFocus("all");
}

/**
 * Soumet le formulaire de contact et affiche les données soumises dans la console.
 * @param {Event} e - L'événement de soumission du formulaire.
 */
function submitForm(e) {
    e.preventDefault();
    const submittedForm = e.target;
    const formData = new FormData(submittedForm);
    const data = Object.fromEntries(formData);
    console.log("contenu du formulaire :", data);
}
