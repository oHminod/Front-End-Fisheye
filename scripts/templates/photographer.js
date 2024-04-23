import { displayModal } from "../utils/contactForm.js";

export function photographerTemplate(photographer) {
    const { name, portrait, id, city, country, tagline, price } = photographer;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement("article");
        const link = document.createElement("a");
        link.setAttribute("href", `photographer.html?id=${id}`);
        link.setAttribute("aria-label", `Voir la page de ${name}`);
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
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

        const contactButton = document.createElement("button");
        contactButton.textContent = "Contactez-moi";
        contactButton.setAttribute("aria-label", `Contactez ${name}`);
        contactButton.setAttribute("class", "contact_button");
        contactButton.addEventListener("click", () => {
            displayModal(name);
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
