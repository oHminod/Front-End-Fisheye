const modal = document.getElementById("contact_modal");
const modalBackground = document.getElementById("modal_background");
const close = document.getElementById("close-modal-btn");
const form = document.getElementById("modal_form");

export function displayModal(name) {
    modal.style.display = "flex";
    const photographerName = document.getElementById("photographer_name");
    photographerName.textContent = name;
    close.setAttribute("tabindex", "0");
    close.setAttribute("aria-label", "Fermer la fenêtre modale");
    modalBackground.addEventListener("click", closeModal);
    close.addEventListener("click", closeModal);
    close.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            closeModal();
        }
    });
    form.addEventListener("submit", submitForm);
}

export function closeModal() {
    modal.style.display = "none";
    modalBackground.removeEventListener("click", closeModal);
    close.removeEventListener("click", closeModal);
    close.removeEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            closeModal();
        }
    });
    form.removeEventListener("submit", submitForm);
}

function submitForm(e) {
    e.preventDefault();
    const submittedForm = e.target;
    const formData = new FormData(submittedForm);
    const data = Object.fromEntries(formData);
    console.log(data);
}
