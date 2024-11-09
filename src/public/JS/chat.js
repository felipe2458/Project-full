$(function(){
    const form = $('form');
    const search = $('#search');
    const users_wraper = $('#users-wraper');

    search.on('input', ()=>{
        const users_filtered = usersList.filter((user)=>{
            return user.toLowerCase().includes(search.val().toLowerCase());
        });

        users_wraper.empty();

        if(search.val().trim() !== ''){
            users_filtered.forEach((user)=>{
                users_wraper.append(`<p class="user-procura" id="${user}">${user}</p>`);
            });

            const user_procura = $('.user-procura');

            user_procura.click(function(){
                const user = $(this).attr('id');

                search.val(user);
            });
        }
    });

    form.submit(function(e){
        const searchVal = search.val();

        if(searchVal.trim() !== ''){
            return true;
        }

        return e.preventDefault();
    });
});