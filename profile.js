document.addEventListener('DOMContentLoaded', () => {
    const changeImageButton = document.getElementById('change-image-button');
    const uploadImageInput = document.getElementById('upload-image');
    const profileImage = document.getElementById('profile-image');
    const imageActionButtons = document.getElementById('image-action-buttons');
    const confirmImageButton = document.getElementById('confirm-image-button');
    const deleteImageButton = document.getElementById('delete-image-button');
    const editDescriptionButton = document.getElementById('edit-description-button');
    const confirmDescriptionButton = document.getElementById('confirm-description-button');
    const profileDescription = document.getElementById('profile-description');
    const logoutButton = document.getElementById('logout-button');

    changeImageButton.addEventListener('click', () => {
        uploadImageInput.click();
    });

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                imageActionButtons.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });

    confirmImageButton.addEventListener('click', () => {
        // Logic to save the new profile image
        imageActionButtons.style.display = 'none';
    });

    deleteImageButton.addEventListener('click', () => {
        profileImage.src = 'default-profile.jpg';
        uploadImageInput.value = '';
        imageActionButtons.style.display = 'none';
    });

    editDescriptionButton.addEventListener('click', () => {
        profileDescription.removeAttribute('readonly');
        editDescriptionButton.style.display = 'none';
        confirmDescriptionButton.style.display = 'inline-block';
    });

    confirmDescriptionButton.addEventListener('click', () => {
        profileDescription.setAttribute('readonly', 'readonly');
        const description = profileDescription.value;
        // Save the description to the server or local storage
        confirmDescriptionButton.style.display = 'none';
        editDescriptionButton.style.display = 'inline-block';
    });

    logoutButton.addEventListener('click', () => {
        // Create the confirmation dialog
        const confirmationDialog = document.createElement('div');
        confirmationDialog.classList.add('confirmation-dialog');

        // Create the message
        const message = document.createElement('p');
        message.textContent = 'Vuoi veramente effettuare il logout?';
        confirmationDialog.appendChild(message);

        // Create the "Si" button
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Si';
        yesButton.addEventListener('click', () => {
            // Handle the logout logic here
            document.body.removeChild(confirmationDialog);
        });
        confirmationDialog.appendChild(yesButton);

        // Create the "No" button
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            document.body.removeChild(confirmationDialog);
        });
        confirmationDialog.appendChild(noButton);

        // Append the dialog to the body
        document.body.appendChild(confirmationDialog);
    });
});
