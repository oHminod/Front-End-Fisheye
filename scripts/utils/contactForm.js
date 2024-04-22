export function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    const close = document.getElementById("close-modal-btn");
    close.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

export function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    const close = document.getElementById("close-modal-btn");
    close.removeEventListener("click", () => {
        modal.style.display = "none";
    });
}
