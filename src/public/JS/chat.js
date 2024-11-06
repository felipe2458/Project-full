$(function(){
    const socket = io();

    socket.on('newMessage', (data)=>{
        $('#messages').append($('<li>').text(data.message));
    });

    $('#messageForm').on('submit', function (e) {
        e.preventDefault();
        const message = $('#messageInput').val();
        socket.emit('sendMessage', { message: message });
        $('#messageInput').val('');
    });
});