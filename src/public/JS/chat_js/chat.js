$(function(){
    const form = $('form');
    const search = $('#search');
    const users_wraper = $('#users-wraper');
    const container_users = $('.container-users');

    function getUsers(names, inputVal){
        const input_val = inputVal.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

        return names.filter(name => {
            const name_user = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return name_user.includes(input_val);
        });
    }

    search.on('input', ()=>{
        const users_filtered = getUsers(usersList, search.val());

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