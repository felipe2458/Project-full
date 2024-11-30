$(function(){
    const photo_icon = $('#photo_icon'); 
    const form = $('#envi_photo_icon')[0];
    const button = $('input[type="submit"]');
    const personalized = $('#personalizado');
    const label = $('label[for="personalizado"]');
    const container_options = $('.container-options');

    label.click(()=>{
        personalized.is(':checked') ? container_options.css('display', 'none') : container_options.css('display', 'flex');
    });

    $('#envi_photo_icon').submit(function(e){
        e.preventDefault();
    });

    button.click(async function(){
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

        const background = $('input[name="background"]');
        let background_style = [];

        await background.each(function(){
            if($(this).is(':checked')){
                background_style = [];
                background_style.push($(this).attr('id'));
            }
        });

        let background_style_val = background_style.join().split('_')[2];

        $.ajax({
            url: 'configuracoes/background',
            type: 'POST',
            data: JSON.stringify({
                darkmode: darkmode,
                personalizedIsChecked: personalizado,
                personalized:  personalizado ? background_style_val : 'one',
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
