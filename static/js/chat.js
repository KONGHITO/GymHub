document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const backArrow = document.getElementById('back-arrow');

    // `chatId` viene passato dal template
    // Non serve più estrarlo dall'URL
    console.log("Chat ID:", chatId);

    // Caricamento dei messaggi
    async function loadMessages() {
        try {
            const response = await fetch(`/chat/${chatId}/messages`);
            if(!response.ok) {
                throw new Error(`Errore ${response.status}: ${response.statusText}`);
            }
            const messages = await response.json();
            chatMessages.innerHTML = ''; // Svuota i messaggi

            messages.forEach(message => {
                const messageElement = document.createElement('div');
                const isUserMessage = message.sender_id === currentUserId;

                messageElement.classList.add('message', isUserMessage ? 'user' : 'other');
                messageElement.innerHTML = `
                    <div class="message-content">${message.text}</div>
                    <div class="message-time">${message.date}</div>
                `;
                chatMessages.appendChild(messageElement);
            });

            // Scrolla verso l'ultimo messaggio
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Errore nel caricamento dei messaggi:', error);
        }
    }

    // Invio messaggi
    // Invio messaggi
async function sendMessage() {
    const messageText = chatInput.value.trim();
    if (!messageText) return; // Non inviare messaggi vuoti

    try {
        const formData = new FormData();
        formData.append('chat_id', chatId); // `chatId` è definito nel template
        formData.append('text', messageText); // Aggiungi il testo del messaggio

        const response = await fetch('/message/send', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }

        chatInput.value = ''; // Svuota il campo di input
        loadMessages(); // Ricarica i messaggi dopo l'invio
    } catch (error) {
        console.error('Errore nell\'invio del messaggio:', error);
    }
}

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

    // Pulsante per inviare messaggi
    sendButton.addEventListener('click', sendMessage);

    // Pulsante per tornare indietro
    backArrow.addEventListener('click', () => {
        window.location.href = '/<user_id>/messages';
    });

    // Carica i messaggi all'inizio
    loadMessages();

    // Aggiorna i messaggi periodicamente (ad esempio, ogni 5 secondi)
    setInterval(loadMessages, 20000);
});
