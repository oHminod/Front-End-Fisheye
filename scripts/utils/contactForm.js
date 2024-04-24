const modal = document.getElementById("contact_modal");
const modalBackground = document.getElementById("modal_background");
const close = document.getElementById("close-modal-btn");
const form = document.getElementById("modal_form");
const mainContent = document.getElementById("main");

export function displayModal(name) {
    modal.style.display = "flex";
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const submit = document.getElementById("submit");
    firstname.setAttribute("tabindex", "0");
    lastname.setAttribute("tabindex", "0");
    email.setAttribute("tabindex", "0");
    message.setAttribute("tabindex", "0");
    submit.setAttribute("tabindex", "0");
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
    mainContent.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-hidden", "true");
}

function submitForm(e) {
    e.preventDefault();
    const submittedForm = e.target;
    const formData = new FormData(submittedForm);
    const data = Object.fromEntries(formData);
    console.log(data);
}
