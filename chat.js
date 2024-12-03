document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    const chatHeaderText = document.getElementById('chat-header-text');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const backArrow = document.getElementById('back-arrow');
    const profileImage = document.getElementById('profile-image');
    const fileInput = document.getElementById('file-input');
    const fileButton = document.getElementById('file-button');
    const filePreviewContainer = document.getElementById('file-preview-container');
    const filePreview = document.getElementById('file-preview');
    const sendFileButton = document.getElementById('send-file-button');
    const deleteFileButton = document.getElementById('delete-file-button');
    let selectedFile = null;

    chatHeaderText.textContent = `Chat with ${user}`;
    profileImage.src = `${user}.jpg`; // Assuming profile images are named after the username

    // Example messages
    const messages = [
        { sender: 'user', text: 'Hello!', time: '10:00' },
        { sender: 'other', text: 'Hi there!', time: '10:01' },
        { sender: 'user', text: 'How are you?', time: '10:02' },
        { sender: 'other', text: 'I\'m good, thanks!', time: '10:03' }
    ];

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.sender);
        messageElement.innerHTML = `<span>${message.text}</span><span class="message-time">${message.time}</span>`;
        chatMessages.prepend(messageElement);
    });

    sendButton.addEventListener('click', () => {
        const messageText = chatInput.value;
        if (messageText.trim() !== '') {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user');
            messageElement.innerHTML = `<span>${messageText}</span><span class="message-time">${currentTime}</span>`;
            chatMessages.prepend(messageElement);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    backArrow.addEventListener('click', () => {
        window.location.href = 'messages.html';
    });

    fileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreview.src = e.target.result;
                filePreviewContainer.style.display = 'flex';
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    sendFileButton.addEventListener('click', () => {
        if (selectedFile) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user');

            if (selectedFile.type.startsWith('image/')) {
                messageElement.innerHTML = `<span><img src="${filePreview.src}" alt="${selectedFile.name}" class="chat-media"></span><span class="message-time">${currentTime}</span>`;
            } else if (selectedFile.type.startsWith('video/')) {
                messageElement.innerHTML = `<span><video controls class="chat-media"><source src="${filePreview.src}" type="${selectedFile.type}">Your browser does not support the video tag.</video></span><span class="message-time">${currentTime}</span>`;
            } else {
                messageElement.innerHTML = `<span><a href="${filePreview.src}" target="_blank">${selectedFile.name}</a></span><span class="message-time">${currentTime}</span>`;
            }

            chatMessages.prepend(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            filePreviewContainer.style.display = 'none';
            fileInput.value = '';
            selectedFile = null;
        }
    });

    deleteFileButton.addEventListener('click', () => {
        filePreviewContainer.style.display = 'none';
        fileInput.value = '';
        selectedFile = null;
    });
});
