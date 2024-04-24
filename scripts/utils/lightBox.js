const lightBox = document.getElementById("lightbox");
const lightboxBackground = document.getElementById("lightbox_background");
const lightboxContent = document.getElementById("lightbox_content");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");
const mainContent = document.getElementById("main");

const callbacks = {};

export function displayLightbox(media, index) {
    const previousIndex = index - 1 < 0 ? media.length - 1 : index - 1;
    const nextIndex = index + 1 >= media.length ? 0 : index + 1;

    lightBox.style.display = "flex";
    lightboxBackground.addEventListener("click", closeLightbox);
    closeLightboxBtn.addEventListener("click", closeLightbox);
    callbacks.handleClose = (event) => {
        if (event.key === "Enter") {
            closeLightbox();
        }
    };
    callbacks.handleEscapeClose = (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    };

    closeLightboxBtn.addEventListener("keydown", callbacks.handleClose);
    document.addEventListener("keydown", callbacks.handleEscapeClose);
    const previousBtn = document.createElement("button");
    previousBtn.classList.add("previous-btn");
    previousBtn.setAttribute("aria-label", "Image précédente");
    previousBtn.setAttribute("tabindex", "0");
    previousBtn.innerText = "<";
    callbacks.handlePrevious = () => {
        removeLighboxContent();
        displayLightbox(media, previousIndex);
    };
    previousBtn.addEventListener("click", callbacks.handlePrevious);
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("next-btn");
    nextBtn.setAttribute("aria-label", "Image suivante");
    nextBtn.setAttribute("tabindex", "0");
    nextBtn.innerText = ">";
    callbacks.handleNext = () => {
        removeLighboxContent();
        displayLightbox(media, nextIndex);
    };
    nextBtn.addEventListener("click", callbacks.handleNext);
    document.removeEventListener("keydown", callbacks.handleArrowLeft);
    document.removeEventListener("keydown", callbacks.handleArrowRight);
    callbacks.handleArrowLeft = (event) => {
        if (event.key === "ArrowLeft") {
            removeLighboxContent();
            displayLightbox(media, previousIndex);
        }
    };
    callbacks.handleArrowRight = (event) => {
        if (event.key === "ArrowRight") {
            removeLighboxContent();
            displayLightbox(media, nextIndex);
        }
    };
    document.addEventListener("keydown", callbacks.handleArrowLeft);
    document.addEventListener("keydown", callbacks.handleArrowRight);

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
    nextBtn.focus();
}

function removeLighboxContent() {
    const previousBtn = document.querySelector(".previous-btn");
    const nextBtn = document.querySelector(".next-btn");
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", callbacks.handleClose);
    previousBtn.removeEventListener("click", callbacks.handlePrevious);
    nextBtn.removeEventListener("click", callbacks.handleNext);
    lightboxContent.innerHTML = "";
}

export function closeLightbox() {
    lightBox.style.display = "none";
    lightboxBackground.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("click", closeLightbox);
    closeLightboxBtn.removeEventListener("keydown", callbacks.handleClose);
    lightboxContent.innerHTML = "";

    mainContent.setAttribute("aria-hidden", "false");
    lightBox.setAttribute("aria-hidden", "true");
}
