document.addEventListener('DOMContentLoaded', () => {
    const followerBtn = document.getElementById('follower-btn');
    const followingBtn = document.getElementById('following-btn');
    const followerContent = document.getElementById('follower-content');
    const followingContent = document.getElementById('following-content');
    const followerSearchInput = document.getElementById('follower-search-input');
    const followingSearchInput = document.getElementById('following-search-input');
    const followerSearchIcon = document.getElementById('follower-search-icon');
    const followingSearchIcon = document.getElementById('following-search-icon');

    const userId = sessionStorage.getItem('user_id');

    if(!userId || userId.trim() === '') {
        console.error('User ID not found in session storage');
        alert('Errore: ID utente non trovato');
        return;
    }
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

    const fetchFollowers = async (userId) => {
        try {
            const response = await fetch(`/user/${userId}/followers`);
            if (response.ok) {
                const data = await response.json();
                console.log("Followers Data", data);
                return data.followers;
            }
            console.error('Error in fetch response', response.statusText);
        } catch (error) {
            console.error('Error fetching followers', error);
        }
    };

    const fetchFollowing = async (userId) => {
        try {
            const response = await fetch(`/user/${userId}/following`);
            if (response.ok) {
                const data = await response.json();
                console.log("Following Data:", data);
                return data.following;
            }
            console.error('Error in fetch response:', response.statusText);
        } catch (error) {
            console.error('Error fetching following', error);
        }
    };

    const renderFollowers = (followers) => {
        const followerContent = document.getElementById('follower-content');
        followerContent.innerHTML = '';
        if (followers) {
            followers.forEach(follower => {
                const followerItem = document.createElement('div');
                followerItem.classList.add('follower-item');
                followerItem.dataset.userId = follower._id;
                const profileImage = follower.image_url ? follower.image_url : '/static/img/default-profile.jpg';
                followerItem.innerHTML = `
                    <img src="${profileImage}" alt="Profile Image" class="profilepic">
                    <span class="username">${follower.username}</span>
                    <button class="delete-btn" data-section="followers">Rimuovi</button>
                `;
                followerContent.appendChild(followerItem);
            });
        }
        addProfileRedirect();
    };

    const renderFollowing = (following) => {
        const followingContent = document.getElementById('following-content');
        followingContent.innerHTML = '';
        if (following) {
            following.forEach(user => {
                const followingItem = document.createElement('div');
                followingItem.classList.add('follower-item');
                followingItem.dataset.userId = user._id;
                const profileImage = user.image_url ? user.image_url : '/static/img/default-profile.jpg';
                followingItem.innerHTML = `
                    <img src="${profileImage}" alt="Profile Image" class="profilepic">
                    <span class="username">${user.username}</span>
                    <button class="delete-btn" data-section="following">Rimuovi</button>
                `;
                followingContent.appendChild(followingItem);
            });
        }
        addProfileRedirect();
    };

    followerBtn.addEventListener('click', async () => {
        const followers = await fetchFollowers(userId);
        renderFollowers(followers);
        followerContent.style.display = 'block';
        followingContent.style.display = 'none';
        followerBtn.classList.add('active');
        followingBtn.classList.remove('active');
    });

    followingBtn.addEventListener('click', async () => {
        const following = await fetchFollowing(userId);
        renderFollowing(following);
        followingContent.style.display = 'block';
        followerContent.style.display = 'none';
        followingBtn.classList.add('active');
        followerBtn.classList.remove('active');
    });

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const userId = e.target.closest('.follower-item').dataset.userId;
            const section = e.target.dataset.section;

            let url = '';
            if (section === 'followers') {
                url = `/remove-follower/${userId}`;
            }else if (section === 'following') {
                url = `/unfollow/${userId}`;
            }

            try {
                const response = await fetch(url, { method: 'POST' });
                if (response.ok) {
                    e.target.closest('.follower-item').remove();
                }
            } catch (error) {
                console.error('Error attempting to unfollow', error);
            }
        }
    });


    const addProfileRedirect = () => {
        document.querySelectorAll('.follower-item').forEach(item => {
            item.addEventListener('click', (event) => {
                if(event.target.classList.contains('delete-btn')) return;
                const userId = item.dataset.userId;
                window.location.href = `/profile/${userId}`;
            });
        });
    };
});