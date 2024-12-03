document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const messagePreviews = document.querySelectorAll('.message-preview');

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

    messagePreviews.forEach(preview => {
        preview.addEventListener('click', () => {
            const username = preview.querySelector('.username').textContent;
            window.location.href = `Chat.html?user=${username}`;
        });
    });
});
