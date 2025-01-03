async function getSessionUserId() {
    try {
        const response = await fetch('/api/session-user');
        if (response.ok) {
            const data = await response.json();
            return data.user_id;
        } else {
            console.error('Errore nel recupero dell\'ID utente');
            return null;
        }
    } catch (error) {
        console.error('Errore nella richiesta al server:', error);
        return null;
    }
}




class Navbar {
    constructor(userId) {
        this.userId= userId;
        this.currentPage = '';
        this.init();
    }

    async init() {
        const path = window.location.pathname;
        this.currentPage = path.split('/').pop().replace('.html', '').toLowerCase() || 'home';

        const profileImageUrl = await this.getUserProfileImage();
        this.render(profileImageUrl);
        this.setupEventListeners();
        this.setActivePage(this.currentPage);
        this.updateProfileImageInPost(profileImageUrl);
    }

    updateProfileImageInPost(profileImageUrl) {
    const postProfileImage = document.querySelector('#create-post-container .user-profile img');
    if (postProfileImage) {
        postProfileImage.src = profileImageUrl;
    }
}

    async getUserProfileImage() {
        try {
            const response = await fetch('/api/user-profile');
            if (response.ok) {
                const data = await response.json();
                return data.profile_image;
            }
        } catch (error) {
            console.error('Errore durante il caricamento dell\'immagine di profilo:', error);
        }
        return '/static/img/default-profile.jpg'; // Immagine di default in caso di errore
    }

    render(profileImageUrl) {
        const navbarHtml = `
            <header class="header">
                <div class="logo-container">
                    <img src="/static/img/Gym-Hub 3.png" alt="Logo" class="logo">
                </div>
                <nav class="menu">
                    <a href="/home/" data-page="home" class="${this.currentPage === 'home' ? 'active' : ''}">
                        <i class="bi bi-house"></i>
                    </a>
                    <a href="/search_page" data-page="search" class="${this.currentPage === 'search' ? 'active' : ''}">
                        <i class="bi bi-search"></i>
                    </a>
                    <a href="/explore" data-page="map" class="${this.currentPage === 'map' ? 'active' : ''}">
                        <i class="bi bi-map"></i>
                    </a>
                    <a href="/user/${this.userId}" data-page="friend" class="${this.currentPage === 'friend' ? 'active' : ''}">
                        <i class="bi bi-people"></i>
                    </a>
                </nav>
                <div class="user-actions">
                    <a href="/<user_id>/messages" data-page="messages" class="${this.currentPage === 'messages' ? 'active' : ''}">
                        <i class="bi bi-envelope"></i>
                    </a>
                    <a href="/user/profile" data-page="profile" class="${this.currentPage === 'profile' ? 'active' : ''}">
                        <img src="${profileImageUrl}" alt="Profilo" class="user-image">
                    </a>
                </div>
            </header>
        `;
        document.getElementById('navbar-container').innerHTML = navbarHtml;
    }

    setActivePage(page) {
        const links = document.querySelectorAll('.menu a, .user-actions a');
        links.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`.menu a[data-page="${page}"], .user-actions a[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        localStorage.setItem('activePage', page);
    }

    setupEventListeners() {
        const menuItems = document.querySelectorAll('.menu a, .user-actions a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.getAttribute('data-page') || item.getAttribute('href').replace('.html', '').toLowerCase();
                this.setActivePage(page);
            });
        });

        const savedPage = localStorage.getItem('activePage');
        if (savedPage) {
            this.setActivePage(savedPage);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const userId = await getSessionUserId();
    if (userId) {
        sessionStorage.setItem('user_id', userId); // Salva l'ID utente in sessionStorage
        new Navbar(userId);
    } else {
        console.error('Impossibile caricare l\'ID utente');
    }
});