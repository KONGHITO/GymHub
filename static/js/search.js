document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchHistory = document.getElementById('search-history');
    const historyList = document.getElementById('history-list');

    let searches = JSON.parse(localStorage.getItem('searches')) || [];

    const renderSearches = () => {
        historyList.innerHTML = '';
        searches.slice().reverse().forEach((search, index) => {
            const li = document.createElement('li');
            li.textContent = search;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            li.addEventListener('click', () => {
                searchInput.value = search;
                performSearch();
            });
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                searches.splice(searches.length - 1 - index, 1);
                localStorage.setItem('searches', JSON.stringify(searches));

                renderSearches();
            });
            li.appendChild(deleteButton);
            historyList.appendChild(li);
        });
        searchHistory.classList.toggle('hidden', searches.length === 0);
    };

    const performSearch = async() =>{
        const searchTerm = searchInput.value.trim();
        if (searchTerm){
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('errore durante la ricerca');
                }

                const users = await response.json();
                displayResults(users);
                if (!searches.includes(searchTerm)){
                    searches.push(searchTerm);
                    localStorage.setItem('searches', JSON.stringify(searches));
                    renderSearches();
                }
            } catch (error){
                console.error(error);
                alert('Si è verificato un errore durante la ricerca');
            }
            searchInput.value='';
        }
    };

  const displayResults = (users) => {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';

    if (users.length > 0) {
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.classList.add('user-item');

            // Crea l'elemento immagine
            const profileImage = document.createElement('img');
            profileImage.src = user.profile_image;
            profileImage.alt = `${user.username}'s profile picture`;
            profileImage.classList.add('profile-image');

            // Crea l'elemento testo per il nome utente
            const usernameText = document.createElement('span');
            usernameText.textContent = user.username;

            // Aggiungi immagine e testo all'elemento utente
            userItem.appendChild(profileImage);
            userItem.appendChild(usernameText);

            // Aggiungi un'azione (es. cliccare per vedere il profilo)
            userItem.addEventListener('click', () => {
                window.location.href = `/profile/${user.id}`;
            });

            resultsContainer.appendChild(userItem);
        });
    } else {
        resultsContainer.textContent = 'Nessun risultato trovato.';
    }

    // Aggiungi i risultati al DOM
    const main = document.querySelector('main');
    const oldResults = document.getElementById('search-results');
    if (oldResults) {
        oldResults.remove();
    }
    main.appendChild(resultsContainer);
};



    searchIcon.addEventListener('click', performSearch);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }
    });

    searchInput.addEventListener('focus', () => {
        searchHistory.classList.toggle('hidden', searches.length === 0);
    });

    renderSearches();







});


