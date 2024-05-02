import { displayMediaData } from "../pages/photographer.js";
import { globallyFetchData } from "./dataUtils.js";
import {
    getPhotographerDOMElements,
    setClickAndEnterListener,
    trapFocus,
    untrapFocus,
} from "./DOMUtils.js";

/**
 * Configure le menu de filtrage.
 */
export function setupFilterMenu() {
    const callbacks = {};
    const { customOptions, optionsTrigger, mainContent } =
        getPhotographerDOMElements();
    let lastFocusedElement;
    /**
     * Ferme le menu déroulant du filtre.
     */
    function closeFilterDropDown() {
        untrapFocus(lastFocusedElement);
        mainContent.setAttribute("aria-hidden", "false");
        customOptions.setAttribute("aria-hidden", "true");
        customOptions.classList.remove("flex");
        optionsTrigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("keydown", callbacks.handleEscClose);
        trapFocus("all");
    }
    setClickAndEnterListener(optionsTrigger, triggerFilterDropDown);

    /**
     * Déclenche le menu déroulant du filtre.
     */
    function triggerFilterDropDown() {
        const previouslySelectedOption = customOptions.querySelector(
            ".custom-option.selected"
        );
        lastFocusedElement = document.activeElement;
        trapFocus("custom-option");

        mainContent.setAttribute("aria-hidden", "true");
        customOptions.setAttribute("aria-hidden", "false");
        customOptions.classList.add("flex");
        optionsTrigger.setAttribute("aria-expanded", "true");
        callbacks.handleEscClose = (event) => {
            if (event.key === "Escape") {
                closeFilterDropDown();
                document.removeEventListener(
                    "keydown",
                    callbacks.handleEscClose
                );
            }
        };

        previouslySelectedOption.focus();
        document.addEventListener("keydown", callbacks.handleEscClose);

        function closefilterDropDownOnOutsideClick(event) {
            const isClickInsideDropdown = optionsTrigger.contains(event.target);
            if (!isClickInsideDropdown) {
                closeFilterDropDown();
                document.removeEventListener(
                    "click",
                    closefilterDropDownOnOutsideClick
                );
                mainContent.focus();
            }
        }
        document.addEventListener("click", closefilterDropDownOnOutsideClick);
    }

    /**
     * Sélectionne un filtre.
     * @param {HTMLElement} option - L'option de filtre à sélectionner.
     */
    async function selectFilter(option) {
        if (!option.classList.contains("selected")) {
            const previouslySelectedOption = customOptions.querySelector(
                ".custom-option.selected"
            );
            previouslySelectedOption.classList.remove("selected");
            previouslySelectedOption.id =
                previouslySelectedOption.getAttribute("data-value");
            previouslySelectedOption.setAttribute("aria-selected", "false");
            option.id = "currently_selected_option";
            option.classList.add("selected");
            option.setAttribute("aria-selected", "true");

            const { selectedOption, mediaSection } =
                getPhotographerDOMElements();
            selectedOption.textContent = option.textContent;
            selectedOption.setAttribute(
                "data-value",
                option.getAttribute("data-value")
            );
            mediaSection.remove();
            const { photographers, media } = await globallyFetchData();
            const searchParams = new URLSearchParams(window.location.search);
            const id = searchParams.get("id");
            const photographer = photographers.find(
                (photographer) => photographer.id == id
            );
            const photographerMedia = media.filter(
                (media) => media.photographerId == id
            );
            displayMediaData(
                photographerMedia,
                photographer,
                option.getAttribute("data-value")
            );
        }

        closeFilterDropDown();
    }

    // Ajoute des écouteurs d'événements à chaque option de filtre.
    document.querySelectorAll(".custom-option").forEach((option) => {
        setClickAndEnterListener(option, async () => {
            await selectFilter(option);
        });
    });
}
