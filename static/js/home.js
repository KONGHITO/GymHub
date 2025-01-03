document.addEventListener("DOMContentLoaded", loadPosts);
const userInfos = document.querySelectorAll(".user-info");

function loadPosts() {
    fetch('/api/home')
        .then(response => response.json())
        .then(data => {
            console.log('Post ricevuti:', data); // Debug
            const posts = data.posts;
            const currentUserId = data.currentUserId;
            const postsContainer = document.getElementById("posts-container");

            // Svuota il contenitore dei post prima di aggiungerne di nuovi
            postsContainer.innerHTML = "";

            posts.forEach(post => {
                console.log('Post:', post);
                console.log('Post.likes:', post.likes);
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
             addUserInfoListeners();
        })
        .catch(error => {
            console.error('Errore nel recupero dei post:', error.message);
        });
}


 function addUserInfoListeners() {
    const userInfos = document.querySelectorAll(".user-info");

    userInfos.forEach(userInfo => {
        userInfo.addEventListener('click', () => {
            const postContainer = userInfo.closest('.post'); // Trova il contenitore del post
            const userId = postContainer.dataset.userId;    // Ottieni l'ID utente
            if (userId) {
                window.location.href = `/profile/${userId}`;
            } else {
                console.error('ID utente non trovato!');
            }
        });
    });
}
function createPostElement(post, currentUserId) {
    const postDiv = document.createElement('div');
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    postDiv.classList.add('post');
    postDiv.dataset.userId = post.user_id;
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="user-info">
                <img src="${post.profile_image || '/static/img/default-profile.jpg'}" alt="Profilo" class="user-image">
                <p class="post-user">${post.username || 'Utente'}</p>
            </div>
            <p class="post-timestamp">${formatDate(new Date(post.date))}, ${formatTime(new Date(post.date))}</p>
        </div>
        <div class="post-description">
            <p>${post.content || ''}</p>
        </div>
        ${post.media ? `
        <div class="post-media">
            ${post.media.endsWith('.mp4') ? `<video src="${post.media}" controls></video>` : `<img src="${post.media}" alt="Contenuto multimediale">`}
        </div>` : ''}
        <div class="post-actions">
            <button 
                class="like-button ${likesArray.includes(currentUserId) ? 'active' : ''}" 
                data-post-id="${post._id}"
                onclick="toggleLike('${post._id}', '${currentUserId}')">
                <i class="bi bi-hand-thumbs-up"></i>
                 <span class="like-count">${post.likes || 0}</span>
            </button>

            <button class="comment-button" onclick="toggleComments(this)">
                <i class="bi bi-chat-dots"></i> Commenta
            </button>
            <button class="share-button">
                <i class="bi bi-share"></i> Condividi
            </button>
        </div>
        <div class="post-comments hidden">
            <div class="comment-form">
                <img src="${post.self_img}" alt="Profilo" class="user-image">
                <textarea placeholder="Scrivi un commento..." rows="1"></textarea>
                <button onclick="addComment(this, '${post._id}')">Commenta</button>
            </div>
            <div class="comments-list">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <img src="${comment.img_url}" alt="Profilo" class="user-image">
                        <div class="comment-content">
                            <p class="comment-user">${comment.username}</p>
                            <p>${comment.text}</p>
                            <p class="comment-timestamp">${formatDate(new Date(comment.date))}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return postDiv;
}


function toggleLike(postId, userId) {
    fetch(`/post/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.like_count !== undefined) {
            const likeButton = document.querySelector(`.like-button[data-post-id="${postId}"]`);
            if (likeButton) {
                likeButton.querySelector(".like-count").textContent = data.like_count;
                likeButton.classList.toggle("active", data.liked);
            }else {
                console.error('Pulsante like non trovato per il post ID:', postId);
            }
        }
    })
    .catch((error) => {
        console.error('Errore nella gestione del like:', error);
    });
}




function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("it-IT", options);
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function createPost(event) {
    event.preventDefault();

    const description = document.getElementById("post-description").value.trim();
    const fileInput = document.getElementById("media-file");
    const file = fileInput.files[0];

    if (!description && !file) {
        alert("Inserisci una descrizione o carica un file multimediale!");
        return;
    }

    const formData = new FormData();
    formData.append("text", description);
    if (file) {
        formData.append("media", file);
    }

    fetch("/post/create", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Post pubblicato con successo!");
                // Ricarica la pagina o aggiorna dinamicamente i post
                window.location.reload();
            } else {
                alert(data.error || "Errore durante la pubblicazione del post.");
            }
        })
        .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante la pubblicazione del post.");
        });
}


function previewFile() {
    const fileInput = document.getElementById("media-file");
    const previewContainer = document.getElementById("preview-container");
    const file = fileInput.files[0];

    if (file) {
        const fileURL = URL.createObjectURL(file);
        const fileType = file.type.split("/")[0];

        previewContainer.innerHTML = fileType === "image" ?
            `<img src="${fileURL}" alt="File selezionato" />` :
            `<video src="${fileURL}" controls></video>`;
        document.getElementById("file-preview").classList.remove("hidden");
        document.getElementById("create-post-container").classList.add("file-added");
    }
}

function removeFile() {
    document.getElementById("media-file").value = "";
    document.getElementById("preview-container").innerHTML = "";
    document.getElementById("file-preview").classList.add("hidden");
    document.getElementById("create-post-container").classList.remove("file-added");
}
/*
function toggleLike(button) {
    const likeCountSpan = button.querySelector(".like-count");
    let count = parseInt(likeCountSpan.textContent);
    button.classList.toggle("active");
    likeCountSpan.textContent = button.classList.contains("active") ? ++count : --count;
}
*/
function toggleComments(button) {
    const post = button.closest(".post");
    const commentsSection = post.querySelector(".post-comments");
    commentsSection.classList.toggle("hidden");
}
/*
function addComment(button) {
    const commentForm = button.closest(".comment-form");
    const textarea = commentForm.querySelector("textarea");
    const commentText = textarea.value.trim();

    if (!commentText) {
        alert("Scrivi un commento!");
        return;
    }

    const comment = document.createElement("div");
    comment.classList.add("comment");

    const userImage = commentForm.querySelector(".user-image").src;
    const userName = "NomeUtente"; // Replace with the actual user's name
    const commentContent = `
    <img src="${userImage}" alt="Profilo" class="user-image">
    <div class="comment-content">
      <p class="comment-user">${userName}</p>
      <p>${commentText}</p>
      <div class="comment-actions">
        <button class="like-button" onclick="toggleLike(this)">
          <i class="bi bi-hand-thumbs-up"></i>
          <span class="like-count">0</span>
        </button>
      </div>
    </div>`;
    comment.innerHTML = commentContent;

    const commentsList = commentForm.nextElementSibling;
    commentsList.appendChild(comment);

    textarea.value = "";
}*/

function addComment(button, postId) {
    const commentForm = button.closest(".comment-form");
    const textarea = commentForm.querySelector("textarea");
    const commentText = textarea.value.trim();

    if (!commentText) {
        alert("Scrivi un commento!");
        return;
    }

    fetch(`/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadPosts(); // Ricarica i post per aggiornare i commenti
        } else {
            alert("Errore nell'aggiunta del commento.");
        }
    })
    .catch(error => {
        console.error('Errore nel commento:', error);
    });

    textarea.value = ""; // Resetta l'input del commento
}


function createCommentElement(comment) {
    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
        <img src="/static/img/default-profile.jpg" alt="Profilo" class="user-image">
        <div class="comment-content">
            <p class="comment-user">${comment.username || "Anonimo"}</p>
            <p>${comment.text}</p>
        </div>
    `;
    return div;
}



$("form[name=create_post]").submit(function(e){
    var $form = $(this);
    var $error = $form.find(".error");
    var data = $form.serialize();

    $ajax({
        url:"/home/",
        type:"POST",
        data: data,
        dataType:"json",
        success: function(resp){
            console.log(resp);
        },
        error: function(resp){
            console.log(resp);
        }
    });

    e.preventDefault();
})