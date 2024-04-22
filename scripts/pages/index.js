import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {
    const data = await fetchData();
    return { photographers: data.photographers };
}

export async function fetchData() {
    const res = await fetch("/data/photographers.json");
    const data = await res.json();
    return data;
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(
        ".photographer_section"
    );

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection && photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
