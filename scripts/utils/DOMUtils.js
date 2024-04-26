export function getPhotographerDOMElements() {
    const photographerHeader = document.querySelector(".photograph-header");
    const mainSection = document.getElementById("main");
    const infoCard = document.getElementById("info_card");
    const customOptions = document.getElementById("custom_options");
    const mainContent = document.getElementById("main");
    const selectedOption = document.getElementById("selected_option");
    const mediaSection = document.querySelector(".media_section");
    const lightBox = document.getElementById("lightbox");
    const firstName = document.getElementById("firstname");
    const contactModal = document.getElementById("contact_modal");

    return {
        photographerHeader,
        mainSection,
        infoCard,
        customOptions,
        mainContent,
        selectedOption,
        mediaSection,
        lightBox,
        firstName,
        contactModal,
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
