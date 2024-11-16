$(function(){
    const form = $('form');
    const search = $('#search');
    const users_wraper = $('#users-wraper');
    const container_users = $('.container-users');

    search.on('input', ()=>{
        const users_filtered = usersList.filter((user)=>{
            return user.toLowerCase().includes(search.val().toLowerCase());
        });

        users_wraper.empty();

        if(search.val().trim() !== ''){
            users_filtered.forEach((user)=>{
                users_wraper.append(`<div class="user-procura" id="${user}"><a href="buscar-user?username=${user}">${user}</a></div>`);
            });

            container_users.addClass('active');
            return;
        }

        container_users.removeClass('active');
    });

    form.submit(function(e){
        const searchVal = search.val();

        if(searchVal.trim() !== ''){
            return true;
        }

        return e.preventDefault();
    });
});