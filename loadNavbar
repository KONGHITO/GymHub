// navbar.js
class Navbar {
    constructor() {
        this.currentPage = '';
        this.init();
    }

    init() {
        // Ottiene il nome della pagina corrente dall'URL
        const path = window.location.pathname;
        this.currentPage = path.split('/').pop().replace('.html', '').toLowerCase() || 'home';
        this.render();
        this.setupEventListeners();
        // Imposta lo stato attivo iniziale
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
                    <a href="#"><i class="bi bi-envelope"></i></a>
                    <a href="#"><i class="bi bi-person"></i></a>
                </div>
            </header>
        `;
        document.getElementById('navbar-container').innerHTML = navbarHtml;
    }

    setActivePage(page) {
        // Rimuove la classe active da tutti i link
        const links = document.querySelectorAll('.menu a');
        links.forEach(link => link.classList.remove('active'));

        // Aggiunge la classe active al link corrispondente alla pagina
        const activeLink = document.querySelector(`.menu a[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Salva la pagina attiva nel localStorage
        localStorage.setItem('activePage', page);
    }

    setupEventListeners() {
        const menuItems = document.querySelectorAll('.menu a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.getAttribute('data-page');
                this.setActivePage(page);
            });
        });

        // Ripristina lo stato attivo dal localStorage
        const savedPage = localStorage.getItem('activePage');
        if (savedPage) {
            this.setActivePage(savedPage);
        }
    }
}

// Inizializza la navbar quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});
