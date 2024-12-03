document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const messages = document.querySelectorAll('.message-preview');

        messages.forEach(message => {
            const username = message.querySelector('.username').textContent.toLowerCase();
            if (username.includes(searchTerm)) {
                message.style.display = 'flex';
            } else {
                message.style.display = 'none';
            }
        });

        // Svuota il campo di input dopo la ricerca
        searchInput.value = '';
    };

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});

document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const messages = document.querySelectorAll('.message-preview');

    messages.forEach(message => {
        const username = message.querySelector('.username').textContent.toLowerCase();
        if (username.includes(searchTerm)) {
            message.style.display = 'flex';
        } else {
            message.style.display = 'none';
        }
    });
});
