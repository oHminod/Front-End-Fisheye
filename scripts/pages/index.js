import { photographerTemplate } from "../templates/photographer";

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
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
