$(function(){
    const photo_icon = $('#photo_icon'); 
    const form = $('#envi_photo_icon')[0];
    const button = $('input[type="submit"]');

    $('#envi_photo_icon').submit(function(e){
        e.preventDefault();
    });

    button.click(function(){
        if(photo_icon[0].files.length > 0){
            const formData = new FormData(form);

            $.ajax({
                url: 'configuracoes/upload-icon',
                type: 'POST',
                data: formData,
                processData: false,  
                contentType: false,
                success: function(data){
                    alert('O foto pode demorar alguns segundos para ser aparecer!');
                },
                error: function(err) {
                    console.error('Erro no envio:', err);
                }
            });
        }

        const darkmode = $('#darkmode').is(':checked');
        const personalizado = $('#personalizado').is(':checked');

        $.ajax({
            url: 'configuracoes/background',
            type: 'POST',
            data: JSON.stringify({
                darkmode: darkmode,
                personalizado: personalizado,
            }),
            contentType: 'application/json',
            success: function(data){
                window.location.reload();
            },
            error: function(err) {
                console.error('Erro no envio:', err);
            }
        });
    });
});
