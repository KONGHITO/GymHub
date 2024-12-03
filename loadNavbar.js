class Navbar {
    constructor() {
        this.currentPage = '';
        this.init();
    }

    init() {
        const path = window.location.pathname;
        this.currentPage = path.split('/').pop().replace('.html', '').toLowerCase() || 'home';
        this.render();
        this.setupEventListeners();
        this.setActivePage(this.currentPage);
    }

    render() {
        const navbarHtml = `
            <header class="header">
                <div class="logo-container">
                    <img src="Gym-Hub 3.png" alt="Logo" class="logo">
                </div>
                <nav class="menu">
                    <a href="Home.html" data-page="home" class="${this.currentPage === 'home' ? 'active' : ''}">
                        <i class="bi bi-house"></i>
                    </a>
                    <a href="Search.html" data-page="search" class="${this.currentPage === 'search' ? 'active' : ''}">
                        <i class="bi bi-search"></i>
                    </a>
                    <a href="Map.html" data-page="map" class="${this.currentPage === 'map' ? 'active' : ''}">
                        <i class="bi bi-map"></i>
                    </a>
                    <a href="Friend.html" data-page="friend" class="${this.currentPage === 'friend' ? 'active' : ''}">
                        <i class="bi bi-people"></i>
                    </a>
                </nav>
                <div class="user-actions">
                    <a href="Messages.html" data-page="messages" class="${this.currentPage === 'messages' ? 'active' : ''}">
                        <i class="bi bi-envelope"></i>
                    </a>
                    <a href="Profile.html" class="${this.currentPage === 'profile' ? 'active' : ''}">
                        <img src="user-profile.jpg" alt="Profilo" class="user-image">
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

document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});
