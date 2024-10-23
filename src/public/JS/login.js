$(function(){
    const username = $('input[name="name_login"]');
    const password = $('input[name="password_login"]');

    let enviUser = false;
    let enviPass = false;

    const funcCamp = {
        campos: function(input){
            if(input.val().trim() === ''){
                if(input.attr('id') === 'name_login'){
                    enviUser = false
                }else{
                    enviPass = false;
                }
            }else{
                if(input.attr('id') === 'name_login'){
                    enviUser = true;
                }else{
                    enviPass = true;
                }
            }
        },
        label: function(input){
            const label = $('#' + input.attr('id') + '_label');

            input.focus(()=>{
                label.addClass('label-active');
            }).blur(()=>{
                if(input.val().trim().length === 0){
                    label.removeClass('label-active');
                    input.val('');
                }
            });
        }
    }

    funcCamp.label(username);
    funcCamp.label(password);

    username.on('input', function(){
        funcCamp.campos($(this));

        if($(this).val().trim().length > 0){
            $('.erro-msg').eq(0).css('opacity', '0');
        }
    });

    password.on('input', function(){
        funcCamp.campos($(this));

        if($(this).val().trim().length > 0){
            $('.erro-msg').eq(1).css('opacity', '0');
        }
    });

    const action = $('input[name="action_login"]');

    action.click(function(e){
        if(enviUser && enviPass){
            return true;
        }else{
            if(username.val().trim().length === 0){
                $('.erro-msg').eq(0).css('opacity', '1');
            }

            if(password.val().trim().length === 0){
                $('.erro-msg').eq(1).css('opacity', '1');
            }

            e.preventDefault();
        }
    });
});