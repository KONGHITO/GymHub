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
    const defaultImageUrl = '/static/img/default-profile.jpg';
    const followButton = document.getElementById('follow-button');
    const unfollowButton = document.getElementById('unfollow-button');
    changeImageButton.addEventListener('click', () => {
        uploadImageInput.click();
    });

    if (!profileImage.src || profileImage.src.endsWith('default-profile.jpg')) {
        profileImage.src = defaultImageUrl;
    }

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
        profileImage.src = defaultImageUrl;
        uploadImageInput.value = '';
        imageActionButtons.style.display = 'none';
        fetch('/user/delete_profile_image', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert('Errore durante l\'eliminazione dell\'immagine.');
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Errore di rete:', error);
            alert('Errore durante l\'eliminazione dell\'immagine.');
        });
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
            fetch('/user/signout',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.success){
                    window.location.href='/';
                } else{
                    console.error(data.message);
                    alert('Errore durante il logout: ' + data.message);
                }
            })
                .catch(error=> {
                    console.error('Errore di rete', error);
                    alert('Si è verificato un errore durante il logout. ');
                });

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



    confirmImageButton.addEventListener('click', () => {
    const file = uploadImageInput.files[0];
    if (!file) {
        alert("Seleziona un'immagine prima di confermare.");
        return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    fetch('/user/upload_profile_image', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            profileImage.src = data.image_url; // Aggiorna l'immagine di profilo
            imageActionButtons.style.display = 'none';
        } else {
            console.error(data.error);
            alert("Errore durante il caricamento dell'immagine: " + data.error);
        }
    })
    .catch(error => {
        console.error("Errore di rete:", error);
        alert("Errore durante il caricamento dell'immagine.");
    });
});

if (followButton) {
    followButton.addEventListener('click', () => {
        console.log("Bottone Follow cliccato");
        const userId = followButton.dataset.userId; // Assumendo che userId sia memorizzato come dataset
        fetch(`/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Ora stai seguendo questo utente.');
                followButton.style.display = 'none';
                unfollowButton.style.display = 'inline-block';
            } else {
                alert('Errore nel seguire l\'utente: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Errore durante il follow:', error);
            alert('Errore di rete.');
        });
    });
}


if(unfollowButton) {
    unfollowButton.addEventListener('click', () => {
        const userId = unfollowButton.dataset.userId;
        fetch(`/unfollow/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    unfollowButton.style.display = 'none';
                    followButton.style.display = 'inline-block';
                } else {
                    alert('Errore durante l\'unfollow dell\'utente.');
                    console.error(data.error);
                }
            })
            .catch(error => {
                console.error('Errore di rete:', error);
                alert('Errore durante l\'unfollow dell\'utente.');
            });
    });

}

});







// Caricamento dei post dal backend
    fetch('/api/posts') // Rotta da creare per recuperare i post
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('posts-container');
            data.posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <p>${post.text}</p>
                    ${post.media ? `<img src="${post.media}" alt="Media del post" style="max-width: 100%;">` : ''}
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Errore nel caricamento dei post:', error));





// Gestione apertura e chiusura del dots menu
document.addEventListener('DOMContentLoaded', () => {
    const postMenus = document.querySelectorAll('.post-menu-icon');

    postMenus.forEach(menuIcon => {
        menuIcon.addEventListener('click', (e) => {
            const menu = e.target.nextElementSibling;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('post-menu-icon') && !e.target.closest('.post-menu')) {
            document.querySelectorAll('.post-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});

// Funzione elimina post
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-post')) {
        const postId = e.target.dataset.id;

        if (confirm('Sei sicuro di voler eliminare questo post?')) {
            fetch(`/post/delete/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Post eliminato con successo.');
                    e.target.closest('.post').remove();
                } else {
                    alert('Errore durante l\'eliminazione del post.');
                }
            })
            .catch(error => console.error('Errore:', error));
        }
    }
});


// Funzione modifica post
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-post')) {
        const postId = e.target.dataset.id;
        const postContainer = e.target.closest('.post');
        const postText = postContainer.querySelector('p').textContent;

        const newText = prompt('Modifica il testo del post:', postText);
        if (newText !== null) {
            fetch(`/post/edit/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Post modificato con successo.');
                    postContainer.querySelector('p').textContent = newText;
                } else {
                    alert('Errore durante la modifica del post.');
                }
            })
            .catch(error => console.error('Errore:', error));
        }
    }
});



