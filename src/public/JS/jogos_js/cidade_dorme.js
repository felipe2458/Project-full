$(function(){
    const socket = io();

    socket.emit('player_connected', username);

    socket.on('verificar_player', (data)=>{
        const container_users = $('.container-users');

        $('.user-wraper').each(function(){
            const id = $(this).attr('id').replace('user_', '');
            if(!data.includes(id)){
                $(this).remove();
            }
        });

        data.forEach(player =>{
            if($(`#user_${player}`).length === 0){
                const user_icon_data = users_icons.find(icon => icon.name === player);
                const iconUrl = user_icon_data ? user_icon_data.icon : '/public/user_icons/iconDefault/icon-padrão.webp';

                container_users.append(`
                    <div class="user-wraper" id="user_${player}">
                        <div class="user-icon-wraper">
                            <div class="user-icon" style="background-image: url(${iconUrl});"></div>
                        </div><!-- user-icon-wraper -->
                        <div class="user-name">
                            <h3>${player}</h3>
                        </div><!-- user-name -->
                    </div><!-- user-wraper -->
                `);
            }
        });
    });
});