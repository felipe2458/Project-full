$(function(){
    const socket = io();

    socket.emit('player_connected_jogo_da_velha', username);

    socket.on('verificar_player_jdv', (data)=>{
        const header = $('header');

        header.append(`
            <div class="players-wraper">
            <div class="player">
                <div class="player-icon"></div><!--player-icon-->
                <div class="player-name">
                    <h1>${data}</h1> 
                </div><!--player-name-->
            </div><!--player-->
            `);
    });
})