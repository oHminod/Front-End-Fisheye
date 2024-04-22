export function mediaTemplate(media) {
    const {
        id: mediaId,
        photographerId,
        image,
        video,
        likes,
        date,
        price: mediaPrice,
        title,
    } = media;

    function getMediaCardDOM() {
        const article = document.createElement("article");
        article.setAttribute("class", "media-card");
        article.id = mediaId;
        article.setAttribute("data-photographer-id", photographerId);
        article.setAttribute("data-date", date);
        article.setAttribute("data-price", mediaPrice);

        if (image) {
            const img = document.createElement("img");
            img.setAttribute("src", `assets/media/${image}`);
            img.setAttribute("alt", title);
            article.appendChild(img);
        } else if (video) {
            const videoElement = document.createElement("video");
            videoElement.setAttribute("src", `assets/media/${video}`);
            videoElement.setAttribute("alt", title);
            article.appendChild(videoElement);
        }

        const cartouche = document.createElement("div");
        cartouche.setAttribute("class", "cartouche");
        const h2 = document.createElement("h2");
        h2.textContent = title;
        const itemLikes = document.createElement("p");
        itemLikes.textContent = likes;
        cartouche.appendChild(h2);
        cartouche.appendChild(itemLikes);

        article.appendChild(cartouche);
        return article;
    }

    return {
        getMediaCardDOM,
    };
}