$(function(){
    const form = $('form');
    const users = $('input[name="add_friend"]');

    users.click(function(){
        const user = $(this).val();

        $.ajax({
            url: 'add-friend',
            method: 'POST',
            data: { user_friend: user },
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.error(errorThrown);
            alert('Ouve um erro ao adicionar o usuário a sua lista de amigos! tente novamente.');
        });
    });

    form.submit(function(e){
        e.preventDefault();
    });
});