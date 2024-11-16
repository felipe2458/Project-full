$(function(){
    const socket = io();

    function scrollToBottom() {
        const messageContainer = document.querySelector('.container-message');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }

    $('#button').click((e)=>{
        const message = $('#message').val();
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.toISOString().split('T')[0];

        const time = hours + ':' + minutes;

        if(message.trim() !== ''){
            socket.emit('send_message', { username, friend, message, time, day });
            $('#message').val('');

            return true;
        }

        e.preventDefault();
    });

    socket.on('receive_message', (data)=>{
        const isOwnMessage = data.username === username;
        const messageClass = isOwnMessage ? 'own-message' : 'other-message';

        const users_chat_name = [data.username, data.friend];

        if(users_chat.sort().toString() != users_chat_name.sort().toString()){
            window.location.reload();
        }

        if(users_chat.sort().toString() === users_chat_name.sort().toString()){
            $('.message-wraper').append(`
                <div class="message ${messageClass}"><p>${data.message}</p></div>
            `);

            scrollToBottom();
        }
    });

    scrollToBottom();
});