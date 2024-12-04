document.addEventListener('DOMContentLoaded', () => {
    const followerBtn = document.getElementById('follower-btn');
    const followingBtn = document.getElementById('following-btn');
    const followerContent = document.getElementById('follower-content');
    const followingContent = document.getElementById('following-content');
    const followerSearchInput = document.getElementById('follower-search-input');
    const followingSearchInput = document.getElementById('following-search-input');
    const followerSearchIcon = document.getElementById('follower-search-icon');
    const followingSearchIcon = document.getElementById('following-search-icon');
    const followerCount = document.getElementById('follower-count');
    const followingCount = document.getElementById('following-count');

    const updateFollowerCount = () => {
        const count = document.querySelectorAll('#follower-content .follower-item').length;
        followerCount.textContent = count;
    };

    const updateFollowingCount = () => {
        const count = document.querySelectorAll('#following-content .follower-item').length;
        followingCount.textContent = count;
    };

    const showConfirmationDialog = (message, onConfirm) => {
        const dialog = document.createElement('div');
        dialog.classList.add('confirmation-dialog');
        dialog.innerHTML = `
            <div>${message}</div>
            <button id="confirm-btn" class="confirm-btn"><i class="bi bi-check-circle"></i></button>
            <button id="cancel-btn" class="cancel-btn"><i class="bi bi-x-circle"></i></button>
        `;
        document.body.appendChild(dialog);

        document.getElementById('confirm-btn').addEventListener('click', () => {
            onConfirm();
            document.body.removeChild(dialog);
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    };

    followerBtn.addEventListener('click', () => {
        followerContent.style.display = 'block';
        followingContent.style.display = 'none';
        followerBtn.classList.add('active');
        followingBtn.classList.remove('active');
    });

    followingBtn.addEventListener('click', () => {
        followerContent.style.display = 'none';
        followingContent.style.display = 'block';
        followingBtn.classList.add('active');
        followerBtn.classList.remove('active');
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const followerItem = event.target.closest('.follower-item');
            const username = followerItem.querySelector('.username').textContent;
            const isFollower = followerItem.closest('#follower-content') !== null;
            const message = isFollower
                ? `Vuoi eliminare ${username} dai tuoi follower?`
                : `Sei sicuro di voler smettere di seguire ${username}?`;

            showConfirmationDialog(message, () => {
                followerItem.remove();
                updateFollowerCount();
                updateFollowingCount();
            });
        });
    });

    const searchFollowers = () => {
        const query = followerSearchInput.value.toLowerCase();
        document.querySelectorAll('#follower-content .follower-item').forEach(item => {
            const username = item.querySelector('.username').textContent.toLowerCase();
            item.style.display = username.includes(query) ? 'flex' : 'none';
        });
    };

    const searchFollowing = () => {
        const query = followingSearchInput.value.toLowerCase();
        document.querySelectorAll('#following-content .follower-item').forEach(item => {
            const username = item.querySelector('.username').textContent.toLowerCase();
            item.style.display = username.includes(query) ? 'flex' : 'none';
        });
    };

    followerSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchFollowers();
        }
    });

    followerSearchIcon.addEventListener('click', () => {
        searchFollowers();
    });

    followingSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchFollowing();
        }
    });

    followingSearchIcon.addEventListener('click', () => {
        searchFollowing();
    });

    // Initial count update
    updateFollowerCount();
    updateFollowingCount();
});
