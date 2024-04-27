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

export function setClickAndEnterListener(element, callback) {
    element.addEventListener("click", callback);
    element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            callback();
        }
    });
}

let logoLinkHref;
export function trapFocus(
    callbacks,
    preservedId = null,
    preservedClass = null
) {
    const focusableElements = document.querySelectorAll("*[tabindex]");
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

    callbacks.handleTabKey = (e) => {
        if (e.key === "Tab" || e.keyCode === 9) {
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
    };
    document.addEventListener("keydown", callbacks.handleTabKey);
    const { logoLink } = getPhotographerDOMElements();
    logoLinkHref = logoLink.getAttribute("href");
    logoLink.removeAttribute("href");
    focusableElements.forEach((element) => {
        if (
            (preservedId && element.id !== preservedId) ||
            (preservedClass && !element.classList.contains(preservedClass))
        ) {
            element.tabIndex = -1;
        }
    });
}

export function untrapFocus(callbacks, lastFocusedElement) {
    document.removeEventListener("keydown", callbacks.handleTabKey);
    const focusableElements = document.querySelectorAll("*[tabindex]");
    focusableElements.forEach((element) => (element.tabIndex = 0));
    const { logoLink } = getPhotographerDOMElements();
    logoLink.setAttribute("href", logoLinkHref);
    lastFocusedElement.focus();
    lastFocusedElement = null;
}
