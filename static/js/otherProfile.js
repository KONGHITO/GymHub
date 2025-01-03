document.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.getElementById('profile-image');
    const profileDescription = document.getElementById('profile-description');
    const defaultImageUrl = '/static/img/default-profile.jpg';
    const followButton = document.getElementById('follow-button');
    const unfollowButton = document.getElementById('unfollow-btn');
    const followUnfollowContainer = document.getElementById('follow-unfollow-container');

    if (!profileImage.src || profileImage.src.endsWith('default-profile.jpg')) {
        profileImage.src = defaultImageUrl;
    }

    function updateFollowUnfollowButtons(is_following, userId) {
        followUnfollowContainer.innerHTML = is_following
        ?`<button id="unfollow-btn"  class="unfollow-button" data-user-id="${userId}">Unfollow</button>`
        : `<button id="follow-button" class="follow-button" data-user-id="${userId}">Follow</button>`;

        const newFollowButton = document.getElementById('follow-button');
        const newUnfollowButton = document.getElementById('unfollow-btn');

        if (newFollowButton) {
            newFollowButton.addEventListener('click', () => handleFollow(newFollowButton.dataset.userId));
        }

        if (newUnfollowButton) {
            newUnfollowButton.addEventListener('click', () => handleUnfollow(newUnfollowButton.dataset.userId));
        }
    }

    function handleFollow(userId) {
        console.log("Bottone Follow cliccato");
        fetch(`/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Follow effettuato!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    updateFollowUnfollowButtons(true, userId);
                });
            } else {
                console.error('Errore nel seguire l\'utente:', data.error);
                alert('Errore nel seguire l\'utente: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Errore durante il follow:', error);
            alert('Errore di rete o risposta non valida.');
        });
    }

    function handleUnfollow(userId) {
        console.log("Bottone Unfollow cliccato");
        fetch(`/unfollow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Unfollow effettuato :c',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    updateFollowUnfollowButtons(false, userId);
                });
            } else {
                console.error('Errore durante l\'unfollow dell\'utente:', data.error);
                alert('Errore durante l\'unfollow dell\'utente.');
            }
        })
        .catch(error => {
            console.error('Errore di rete:', error);
            alert('Errore durante l\'unfollow dell\'utente.');
        });
    }
 if (followButton) {
        followButton.addEventListener('click', () => handleFollow(followButton.dataset.userId));
    }

    if (unfollowButton) {
        unfollowButton.addEventListener('click', () => handleUnfollow(unfollowButton.dataset.userId));
    }


});


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

