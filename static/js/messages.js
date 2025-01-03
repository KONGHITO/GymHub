/*
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const messagesContainer = document.querySelector('.messages-container');

    // Caricamento iniziale delle chat attive
    async function loadChats() {
        try {
            const response = await fetch('/chats'); // Ottieni le chat attive
            const chats = await response.json();
            messagesContainer.innerHTML = ''; // Svuota il contenitore

            chats.forEach(chat => {
                const chatElement = document.createElement('div');
                chatElement.classList.add('message-preview');
                chatElement.innerHTML = `
                    <img src="${chat.profile_image}" alt="Profile Image" class="profile-image">
                    <div class="message-info">
                        <p class="username">${chat.username}</p>
                        <p class="last-message">${chat.last_message}</p>
                    </div>
                `;
                chatElement.addEventListener('click', () => openChat(chat.chat_id, chat.user_id));
                messagesContainer.appendChild(chatElement);
            });
        } catch (error) {
            console.error('Errore nel caricamento delle chat:', error);
        }
    }

    // Creazione di una nuova chat o apertura di una chat esistente
    async function openChat(chatId, userId) {
        if (!chatId) {
            // Crea una nuova chat
            const response = await fetch('/chat/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ other_user_id: userId })
            });

            const result = await response.json();
            if (response.ok) {
                chatId = result.chat_id;
            } else {
                alert('Errore nella creazione della chat');
                return;
            }
        }

        // Reindirizza alla pagina della chat
        window.location.href = `/chat/${chatId}`;
    }

    // Funzionalità di ricerca
    async function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        try {
            const response = await fetch(`/searchchat?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            messagesContainer.innerHTML = ''; // Svuota il contenitore

            results.forEach(user => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('message-preview');
                resultElement.innerHTML = `
                    <img src="${user.profile_image}" alt="Profile Image" class="profile-image">
                    <div class="message-info">
                        <p class="username">${user.username}</p>
                        <p class="last-message">Inizia una nuova chat</p>
                    </div>
                `;
                resultElement.addEventListener('click', () => openChat(null, user.user_id));
                messagesContainer.appendChild(resultElement);
            });
        } catch (error) {
            console.error('Errore nella ricerca:', error);
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    loadChats();
});
*/


/*
document.getElementById("search-button").addEventListener("click", async () => {
    const query = document.getElementById("search-input").value.trim();

    if (!query) {
        alert("Inserisci una query di ricerca.");
        return;
    }

    try {
        const response = await fetch(`/search_chat?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Errore nella ricerca.");
        }

        const results = await response.json();

        const messagesContainer = document.getElementById("messages-container");
        messagesContainer.innerHTML = "";

        if (results.length === 0) {
            messagesContainer.innerHTML = "<p>Nessun risultato trovato.</p>";
            return;
        }

        results.forEach(user => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";

    userCard.innerHTML = `
        <img src="${user.image_url}" alt="Profile Image" class="profile-image">
        <div class="chat-details">
            <p class="username">${user.username}</p>
            <p class="last-message">${user.last_message}</p>
        </div>
    `;

    // Aggiungi evento click per aprire la chat
    userCard.addEventListener('click', () => {
        window.location.href = `/chat/${user.user_id}`;
    });

    messagesContainer.appendChild(userCard);
});
    } catch (error) {
        console.error("Errore durante la ricerca:", error);
        alert("Si è verificato un errore durante la ricerca.");
    }
});

document.getElementById("search-input").addEventListener("keypress", event => {
    if (event.key === "Enter") {
        document.getElementById("search-button").click();
    }
});
*/
/*
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById("messages-container");

    function loadChats(chats) {
        if (chats.length === 0) {
            messagesContainer.innerHTML = "<p>Nessuna chat attiva trovata.</p>";
            return;
        }

        chats.forEach(chat => {
            const chatElement = document.createElement("div");
            chatElement.className = "user-card";

            chatElement.innerHTML = `
                <img src="${chat.profile_image}" alt="Profile Image" class="profile-image">
                <div class="chat-details">
                    <p class="username">${chat.username}</p>
                    <p class="last-message">${chat.last_message}</p>
                </div>
            `;

            chatElement.addEventListener("click", () => {
                window.location.href = `/chat/${chat.chat_id}`;
            });

            messagesContainer.appendChild(chatElement);
        });
    }

    loadChats(chats);
});
*/

document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById("messages-container");

    // Carica le chat attive al caricamento della pagina
    function loadChats(chats) {
        messagesContainer.innerHTML = ""; // Pulisce il contenitore

        if (chats.length === 0) {
            messagesContainer.innerHTML = "<p>Nessuna chat attiva trovata.</p>";
            return;
        }

        chats.forEach(chat => {
            const chatElement = document.createElement("div");
            chatElement.className = "user-card";

            chatElement.innerHTML = `
                <img src="${chat.profile_image}" alt="Profile Image" class="profile-image">
                <div class="chat-details">
                    <p class="username">${chat.username}</p>
                    <p class="last-message">${chat.last_message}</p>
                </div>
            `;

            chatElement.addEventListener("click", () => {
                window.location.href = `/chat/${chat.user_id}`;
            });

            messagesContainer.appendChild(chatElement);
        });
    }

    // Funzione per la ricerca tra gli utenti che segui
    async function searchChats(query) {
        try {
            const response = await fetch(`/search_chat?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Errore nella ricerca.");
            }

            const results = await response.json();
            messagesContainer.innerHTML = "";

            if (results.length === 0) {
                messagesContainer.innerHTML = "<p>Nessun risultato trovato.</p>";
                return;
            }

            results.forEach(user => {
                const userCard = document.createElement("div");
                userCard.className = "user-card";

                userCard.innerHTML = `
                    <img src="${user.image_url}" alt="Profile Image" class="profile-image">
                    <div class="chat-details">
                        <p class="username">${user.username}</p>
                        <p class="last-message">${user.last_message}</p>
                    </div>
                `;

                userCard.addEventListener('click', () => {
                    window.location.href = `/chat/${user.user_id}`;
                });

                messagesContainer.appendChild(userCard);
            });
        } catch (error) {
            console.error("Errore durante la ricerca:", error);
            alert("Si è verificato un errore durante la ricerca.");
        }
    }

    // Event Listener per la barra di ricerca
    document.getElementById("search-button").addEventListener("click", () => {
        const query = document.getElementById("search-input").value.trim();

        if (!query) {
            alert("Inserisci una query di ricerca.");
            return;
        }

        searchChats(query);
    });

    document.getElementById("search-input").addEventListener("keypress", event => {
        if (event.key === "Enter") {
            document.getElementById("search-button").click();
        }
    });

    // Carica le chat iniziali (passa i dati delle chat tramite una variabile globale "chats")
    loadChats(chats);
});
