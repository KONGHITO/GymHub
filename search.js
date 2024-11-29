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
            deleteButton.addEventListener('click', () => {
                searches.splice(searches.length - 1 - index, 1);
                localStorage.setItem('searches', JSON.stringify(searches));
                renderSearches();
            });
            li.appendChild(deleteButton);
            historyList.appendChild(li);
        });
        searchHistory.classList.toggle('hidden', searches.length === 0);
    };

    const performSearch = () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searches.push(searchTerm);
            localStorage.setItem('searches', JSON.stringify(searches));
            renderSearches();
            searchInput.value = '';
        }
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
