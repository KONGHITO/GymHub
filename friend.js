document.addEventListener('DOMContentLoaded', () => {
    const followerBtn = document.getElementById('follower-btn');
    const followingBtn = document.getElementById('following-btn');
    const followerContent = document.getElementById('follower-content');
    const followingContent = document.getElementById('following-content');
    const followerSearchInput = document.getElementById('follower-search-input');
    const followingSearchInput = document.getElementById('following-search-input');
    const followerSearchIcon = document.getElementById('follower-search-icon');
    const followingSearchIcon = document.getElementById('following-search-icon');

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
            followerItem.remove();
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
});
