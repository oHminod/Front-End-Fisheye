/**
 * Récupère les données à partir d'un fichier JSON.
 * @returns {Promise<Object>} Les données récupérées.
 * @throws {Error} Si la requête HTTP échoue, une erreur est levée avec le statut et le texte de statut de la réponse.
 */
export async function fetchData() {
    const res = await fetch("data/photographers.json");
    if (!res.ok) {
        throw new Error(
            "HTTP error " + res.status + " (" + res.statusText + ")"
        );
    }
    const data = await res.json();

    return data;
}

const photographers = [];
const media = [];

/**
 * Récupère globalement les données si elles n'ont pas déjà été récupérées.
 */
export async function globallyFetchData() {
    if (!photographers.length || !media.length) {
        const data = await fetchData();
        photographers.push(...data.photographers);
        media.push(...data.media);
    }
    return { photographers, media };
}

/**
 * Trie les médias en fonction du filtre.
 * @param {string} filter - Le filtre à utiliser pour le tri.
 * @param {Object[]} media - Les médias à trier.
 * @returns {Object[]} Les médias triés.
 */
export function sortMedia(filter = "id", media) {
    return media.sort((a, b) => {
        if (filter === "likes") {
            return b[filter] - a[filter];
        }
        if (filter === "title") {
            return a[filter].localeCompare(b[filter]);
        }
        if (filter === "date") {
            return new Date(a[filter]) - new Date(b[filter]);
        }
        return a[filter] - b[filter];
    });
}
