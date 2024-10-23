$(function(){
    const name = $('#name');
    const password = $('#password');
    const password_confirm = $('#password-confirm');
    const root = $(':root');
    let enviUser = false;
    let enviPass = false;
    let enviPassConfirm = false;

    function focusInput(input){
        const labelID = input.attr('id') + '-label';
        const label = $('#' + labelID);

        if(input.val().trim().length > 0){
            label.addClass('focus-input');
        }else{
            label.removeClass('focus-input');
            input.val('');
        }
    }

    const validateForm = {
        username: function(){
            const nameVal = name.val().trim();
            const errorMsg = $('.erro-msg').eq(0);

            if(nameVal.length === 0){
                root.css('--box-shadow-color-input_one', '#8f8f8f');
                errorMsg.text('');
                enviUser = false;
            }else if(nameVal.length > 0 && nameVal.length < 10){
                errorMsg.text('O nome tem que ter entre 10 e 100 caracteres.');
                root.css('--box-shadow-color-input_one', '#a10000');
            }else if(nameVal.length > 100){
                errorMsg.text('O nome tem que ter entre 10 e 100 caracteres.');
                root.css('--box-shadow-color-input_one', '#a10000');
            }else if(nameVal.length < 100 && nameVal.length > 10){
                errorMsg.text('');
                root.css('--box-shadow-color-input_one', '#00e000');
                enviUser = true;
            }
        },
        password: function(){
            const passVal = password.val().trim();
            const passConfirmVal = password_confirm.val().trim();
            const errorMsg = $('.erro-msg').eq(1);
            const errorMsgConfirm = $('.erro-msg').eq(2);

            if(passVal.length === 0){
                root.css('--box-shadow-color-input_two', '#8f8f8f');
                errorMsg.text('');
                enviPass = false;
            }else if(passVal.length > 0 && passVal.length < 8){
                errorMsg.text('A senha tem que ter entre 8 e 50 caracteres.');
                root.css('--box-shadow-color-input_two', '#a10000');
            }else if(passVal.length > 50){
                errorMsg.text('O nome tem que ter entre 8 e 50 caracteres.');
                root.css('--box-shadow-color-input_two', '#a10000');
            }else if(passConfirmVal !== passVal){
                errorMsg.text('As senhas não coincidem.');
                errorMsgConfirm.text('As senhas não coincidem.');
                root.css('--box-shadow-color-input_two', '#a10000');
                root.css('--box-shadow-color-input_three', '#a10000');
                enviPass = false;
                enviPassConfirm = false;
            }else if(passConfirmVal === passVal && passVal.length < 8 && passVal.length > 0){
                root.css('--box-shadow-color-input_two', '#a10000');
                root.css('--box-shadow-color-input_three', '#a10000');
                errorMsg.text('A senha tem que ter entre 8 e 50 caracteres.');
                errorMsgConfirm.text('A seha tem que ter entre 8 e 50 caracteres.');
                enviPass = false;
                enviPassConfirm = false;
            }else if(passVal.length < 50 && passVal.length > 8){
                errorMsg.text('');
                root.css('--box-shadow-color-input_two', '#00e000');
                enviPass = true;
            }
        },
        password_confirm: function(){
            const passVal = password.val().trim();
            const passConfirmVal = password_confirm.val().trim();
            const errorMsgPass = $('.erro-msg').eq(1);
            const errorMsgPassConfirm = $('.erro-msg').eq(2);

            if(passVal.length === 0 && passConfirmVal.length === 0){
                root.css('--box-shadow-color-input_two', '#8f8f8f');
                root.css('--box-shadow-color-input_three', '#8f8f8f');
                errorMsgPass.text('');
                errorMsgPassConfirm.text('');
                enviPass = false;
                enviPassConfirm = false;
            }else if(passConfirmVal !== passVal){
                root.css('--box-shadow-color-input_two', '#a10000');
                root.css('--box-shadow-color-input_three', '#a10000');
                if(passVal.length > 8){
                    errorMsgPass.text('As senhas não coincidem.');
                }else{
                    errorMsgPass.text('A senha tem que ter entre 8 e 50 caracteres.');
                }
                errorMsgPassConfirm.text('As senhas não coincidem.');
                enviPass = false;
                enviPassConfirm = false;
            }else if(passConfirmVal === passVal && passVal.length < 8 && passVal.length > 0){
                root.css('--box-shadow-color-input_two', '#a10000');
                root.css('--box-shadow-color-input_three', '#a10000');
                errorMsgPass.text('A senha tem que ter entre 8 e 50 caracteres.');
                errorMsgPassConfirm.text('A seha tem que ter entre 8 e 50 caracteres.');
                enviPass = false;
                enviPassConfirm = false;
            }else{
                root.css('--box-shadow-color-input_two', '#00e000');
                root.css('--box-shadow-color-input_three', '#00e000');
                errorMsgPass.text('');
                errorMsgPassConfirm.text('');
                enviPass = true;
                enviPassConfirm = true;
            }
        },
        formValid: function(input){
            const errorMsg = $('.erro-msg');

            if(input.val().trim() === ''){
                if(input.attr('id') === 'name'){
                    errorMsg.eq(0).text('O campo não pode estar vazio.');
                    root.css('--box-shadow-color-input_one', '#a10000');
                }else if(input.attr('id') === 'password'){
                    errorMsg.eq(1).text('O campo não pode estar vazio.');
                    root.css('--box-shadow-color-input_two', '#a10000');
                }else if(password.val().trim() === ''){
                    errorMsg.eq(2).text('O campo não pode estar vazio.');
                    root.css('--box-shadow-color-input_three', '#a10000');
                }
            }
        }
    }

    function viewPassword(pass){
        const passIcon = $('#' + pass.attr('id') + '-icon');

        passIcon.click(function(){
            pass.attr('type', pass.attr('type') === 'password' ? 'text' : 'password');

            passIcon.toggleClass('view-password');
        });
    }

    viewPassword(password);
    viewPassword(password_confirm);

    $(name).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });

    $(password).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });

    $(password_confirm).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });

    $(name).on('input', function(){
        validateForm.username();
    });

    $(password).on('input', function(){
        validateForm.password();
        validateForm.password_confirm();
    });

    $(password_confirm).on('input', async function(){
        validateForm.password();
        validateForm.password_confirm();
    });

    const action = $('input[name="action"]');

    action.click(function(e){
        if(enviUser && enviPass && enviPassConfirm){
            return true;
        }else{
            e.preventDefault();
            validateForm.formValid(name);
            validateForm.formValid(password);
            validateForm.formValid(password_confirm);
            return false;
        }
    });
});