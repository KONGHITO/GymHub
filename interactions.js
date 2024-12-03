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

    const postContainer = document.createElement("div");
    postContainer.classList.add("post");

    const now = new Date();
    const postHeader = `
    <div class="post-header">
      <div class="user-info">
        <img src="user-profile.jpg" alt="Profilo" class="user-image">
        <p class="post-user">ProfiloUtente</p>
      </div>
      <p class="post-timestamp">${formatDate(now)}, ${formatTime(now)}</p>
    </div>`;
    postContainer.innerHTML = postHeader;

    if (description) {
        const postDescription = `<div class="post-description"><p>${description}</p></div>`;
        postContainer.innerHTML += postDescription;
    }

    if (file) {
        const fileURL = URL.createObjectURL(file);
        const postMedia = file.type.startsWith("image/") ?
            `<div class="post-media"><img src="${fileURL}" alt="Contenuto multimediale"></div>` :
            `<div class="post-media"><video src="${fileURL}" controls></video></div>`;
        postContainer.innerHTML += postMedia;
    }

    const postActions = `
    <div class="post-actions">
      <button class="like-button" onclick="toggleLike(this)">
        <i class="bi bi-hand-thumbs-up"></i>
        <span class="like-count">0</span>
      </button>
      <button class="comment-button" onclick="toggleComments(this)">
        <i class="bi bi-chat-dots"></i> Commenta
      </button>
      <button class="share-button">
        <i class="bi bi-share"></i> Condividi
      </button>
    </div>`;
    postContainer.innerHTML += postActions;

    document.getElementById("posts-container").prepend(postContainer);
    document.getElementById("create-post-form").reset();
    removeFile();
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

function toggleLike(button) {
    const likeCountSpan = button.querySelector(".like-count");
    let count = parseInt(likeCountSpan.textContent);
    button.classList.toggle("active");
    likeCountSpan.textContent = button.classList.contains("active") ? ++count : --count;
}

function toggleComments(button) {
    const post = button.closest(".post");
    const commentsSection = post.querySelector(".post-comments");
    commentsSection.classList.toggle("hidden");
}
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
}
