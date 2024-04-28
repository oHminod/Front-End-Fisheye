import { displayModal } from "../utils/contactForm.js";
import {
    getPhotographerDOMElements,
    logoLinkHref,
    setClickAndEnterListener,
} from "../utils/DOMUtils.js";

export function photographerTemplate(photographer) {
    const { name, portrait, id, city, country, tagline, price } = photographer;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement("article");
        const link = document.createElement("button");
        link.setAttribute("title", name);
        link.setAttribute("aria-label", "Voir la page de " + name);
        link.setAttribute("tabindex", "0");
        setClickAndEnterListener(link, () => {
            window.location.href = logoLinkHref + `photographer.html?id=${id}`;
        });
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        img.setAttribute("alt", "image de " + name);
        const h2 = document.createElement("h2");
        h2.textContent = name;
        const h3 = document.createElement("h3");
        h3.textContent = `${city}, ${country}`;
        const p = document.createElement("p");
        p.textContent = tagline;
        const span = document.createElement("span");
        span.textContent = `${price}€/jour`;
        link.appendChild(img);
        link.appendChild(h2);
        article.appendChild(link);
        article.appendChild(h3);
        article.appendChild(p);
        article.appendChild(span);
        return article;
    }

    function getPhotographerInfoDOM() {
        const article = document.createElement("article");
        const infoDiv = document.createElement("div");
        const h1 = document.createElement("h1");
        h1.textContent = name;
        const h2 = document.createElement("h2");
        h2.textContent = `${city}, ${country}`;
        const p = document.createElement("p");
        p.textContent = tagline;

        const { mainSection, firstName, contactModal } =
            getPhotographerDOMElements();

        const contactButton = document.createElement("button");
        contactButton.textContent = `Contactez ${name}`;
        contactButton.setAttribute("title", `Contactez ${name}`);
        contactButton.setAttribute("aria-label", `Contactez ${name}`);
        contactButton.setAttribute("tabindex", "0");
        contactButton.setAttribute("class", "contact_button");
        setClickAndEnterListener(contactButton, () => {
            displayModal(name);
            mainSection.setAttribute("aria-hidden", "true");
            contactModal.setAttribute("aria-hidden", "false");
            firstName.focus();
        });

        const avatar = document.createElement("img");
        avatar.setAttribute("src", picture);
        avatar.setAttribute("alt", name);
        avatar.setAttribute("class", "avatar");

        infoDiv.appendChild(h1);
        infoDiv.appendChild(h2);
        infoDiv.appendChild(p);
        article.appendChild(infoDiv);
        article.appendChild(contactButton);
        article.appendChild(avatar);
        return article;
    }

    return {
        name,
        picture,
        getUserCardDOM,
        getPhotographerInfoDOM,
    };
}
