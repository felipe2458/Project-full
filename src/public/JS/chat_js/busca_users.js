$(function(){
    const users = $('input[name="add_friend"]');

    users.click(async function(){
        const user = await $(this).val();
        const label = $(`label[for="user_${user}"]`);

        if(label.text() === 'adicionar'){
            label.text('remover');
        }else{
            label.text('adicionar');
        }

        await $.ajax({
            url: 'add-friend',
            method: 'POST',
            data: { user_friend: user },
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.error(errorThrown);
            alert('Ouve um erro ao adicionar o usuário a sua lista de amigos! tente novamente.');
        });
    });
});