$(function(){
    const socket = io();

    socket.emit('player_connected_jogo_da_velha', username);
    console.log('Ola mundo!')
})