const app = () => {
    const socket = io('https://chat-rfv4.onrender.com');
    const msgInput = document.querySelector('.message-input');
    const msgsList = document.querySelector('.messages-list');
    const sendBtn = document.querySelector('.send-btn');
    const usernameInput = document.querySelector('.username-input');
    const messages = [];

    const getMessages = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/chat');
            renderMessages(data);
            data.forEach(message => messages.push(message));
        } catch(err) {
            console.error(err);
        }
    };

    getMessages();

    const handleSendMessage = (text) => {
        if (!text.trim()) {
            return;
        }

        const message = {
            username: usernameInput.value || 'Аноним',
            text,
            createdAt: new Date()
        };

        sendMessage(message);
        msgInput.value = '';
    };

    msgInput.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            handleSendMessage(e.target.value);
        }
    });

    sendBtn.addEventListener('click', () => handleSendMessage(msgInput.value));

    const renderMessages = (messagesToRender) => {
        let messagesHtml = '';

        messagesToRender.forEach((message) => {
            messagesHtml += `
            <li class='bg-dark p-2 rounded mb-2 d-flex justify-content-between message'>
                <div class='mr-2'>
                    <span class='text-info'>${message.username}</span>
                    <p class='text-light'>${message.text}</p>
                </div>
                <span class='text-muted text-right date'>
                    ${new Date(message.createdAt).toLocaleString('ru', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    })}
                </span>
            </li>
            `;
        });

        msgsList.innerHTML = messagesHtml;
    };

    const sendMessage = (message) => socket.emit('sendMessage', message);

    socket.on('recMessage', (message) => {
        messages.push(message);
        renderMessages(messages);
    });
};

app();
