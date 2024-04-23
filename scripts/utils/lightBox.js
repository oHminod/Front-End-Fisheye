const lightBox = document.getElementById("lightbox");
const lightboxBackground = document.getElementById("lightbox_background");
const lightboxContent = document.getElementById("lightbox_content");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");

export function displayLightbox(media, index) {
    const previousIndex = index - 1 < 0 ? media.length - 1 : index - 1;
    const nextIndex = index + 1 >= media.length ? 0 : index + 1;
    console.log(media, index);
    lightBox.style.display = "flex";
    lightboxBackground.addEventListener("click", closeLightbox);
    closeLightboxBtn.addEventListener("click", closeLightbox);
    closeLightboxBtn.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            closeLightbox(media, previousIndex, nextIndex);
        }
    });
    const previousBtn = document.createElement("button");
    previousBtn.classList.add("previous-btn");
    previousBtn.setAttribute("aria-label", "Image précédente");
    previousBtn.setAttribute("tabindex", "0");
    previousBtn.innerText = "<";
    previousBtn.addEventListener("click", () => {
        removeLighboxContent(media, previousIndex, nextIndex);
        displayLightbox(media, previousIndex);
    });
    previousBtn.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            removeLighboxContent(media, previousIndex, nextIndex);
            displayLightbox(media, previousIndex);
        }
    });
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("next-btn");
    nextBtn.setAttribute("aria-label", "Image suivante");
    nextBtn.setAttribute("tabindex", "0");
    nextBtn.innerText = ">";
    nextBtn.addEventListener("click", () => {
        removeLighboxContent(media, previousIndex, nextIndex);
        displayLightbox(media, nextIndex);
    });
    nextBtn.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            removeLighboxContent(media, previousIndex, nextIndex);
            displayLightbox(media, nextIndex);
        }
    });

    if (media[index].image) {
        const image = document.createElement("img");
        image.setAttribute("src", `assets/media/${media[index].image}`);
        image.setAttribute("alt", media[index].title);
        const imageTitle = document.createElement("h2");
        imageTitle.textContent = media[index].title;
        lightboxContent.appendChild(image);
        lightboxContent.appendChild(imageTitle);
    } else if (media[index].video) {
        const video = document.createElement("video");
        video.setAttribute("src", `assets/media/${media[index].video}`);
        video.setAttribute(
            "poster",
            `assets/media/poster/${media[index].video.slice(0, -4)}.jpg`
        );
        video.setAttribute("alt", media[index].title);
        video.setAttribute("controls", true);
        const videoTitle = document.createElement("h2");
        videoTitle.textContent = media[index].title;
        lightboxContent.appendChild(video);
        lightboxContent.appendChild(videoTitle);
    }

    lightboxContent.appendChild(previousBtn);
    lightboxContent.appendChild(nextBtn);
}

function removeLighboxContent(media, previousIndex, nextIndex) {
    const previousBtn = document.querySelector(".previous-btn");
    const nextBtn = document.querySelector(".next-btn");
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            closeLightbox();
        }
    });
    previousBtn.removeEventListener("click", () => {
        removeLighboxContent();
        displayLightbox(media, previousIndex);
    });
    nextBtn.removeEventListener("click", () => {
        removeLighboxContent();
        displayLightbox(media, nextIndex);
    });
    lightboxContent.innerHTML = "";
}

export function closeLightbox(media, previousIndex, nextIndex) {
    const previousBtn = document.querySelector(".previous-btn");
    const nextBtn = document.querySelector(".next-btn");
    lightBox.style.display = "none";
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            closeLightbox();
        }
    });
    previousBtn.removeEventListener("click", () => {
        removeLighboxContent();
        displayLightbox(media, previousIndex);
    });
    nextBtn.removeEventListener("click", () => {
        removeLighboxContent();
        displayLightbox(media, nextIndex);
    });
    lightboxContent.innerHTML = "";

    // modalBackground.removeEventListener("click", closeModal);
    // close.removeEventListener("click", closeModal);
    // close.removeEventListener("keydown", function (event) {
    //     if (event.key === "Enter") {
    //         closeModal();
    //     }
    // });
    // form.removeEventListener("submit", submitForm);
}
