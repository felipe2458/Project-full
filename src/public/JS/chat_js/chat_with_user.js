$(function(){
    const socket = io();

    function scrollToBottom(){
        const messageContainer = document.querySelector('.container-message');
        if(messageContainer){
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }

    const voiceMessage = $('.message-voice');

    let midia;
    let start_voice = false;
    const container_audio = $('.container-audio');

    voiceMessage.click((e) =>{
        $('input[type="text"]').attr('disabled', true);
        $('input[type="text"]').val("");

        if(container_audio.is(':empty')){
            $('.circle-red').css('display', 'block');
            $('.icone-mic').css('display', 'none');
        }

        if(container_audio.is(':empty')){
            if(typeof MediaRecorder === 'undefined'){
                alert('Seu navegador não suporta gravação de áudio');
                return;
            }

            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream =>{
                if(midia && midia.state !== "inactive"){
                    midia.stop();
                }

                midia = new MediaRecorder(stream);

                let chunks = [];

                midia.ondataavailable = function(e){
                    chunks.push(e.data);
                };

                midia.onstop = () =>{
                    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                    const contentType = blob.type;
                    const reader = new FileReader();

                    reader.readAsDataURL(blob);
                    reader.onloadend = ()=>{
                        const audio = document.createElement('audio');
                        audio.src = reader.result;
                        audio.controls = true;
                        container_audio.empty();
                        container_audio.css('display', 'flex');
                        container_audio.append(audio);
                        $('.circle-red').css('display', 'none');
                        $('.icone-mic').css('display', 'block');

                        $('#form').one('submit', e => {
                            const now = new Date();
                            const hours = now.getHours().toString().padStart(2, '0');
                            const minutes = now.getMinutes().toString().padStart(2, '0');
                            const day = now.toISOString().split('T')[0]; 
                            const time = hours + ':' + minutes;

                            const message_voice = {
                                data: reader.result,
                                contentType
                            };

                            container_audio.empty();
                            container_audio.css('display', 'none');
                            $('input[type="text"]').attr('disabled', false);

                            socket.emit('send_message', { username, friend, message, message_voice, time, day });

                            scrollToBottom();
                            e.preventDefault();
                        });
                        
                    }
                };

                if(!start_voice){
                    start_voice = true;
                    midia.start();
                }else{
                    start_voice = false;
                    midia.stop();
                }
            }).catch(err =>{
                console.error(err);
                alert('Permita o uso do microfone para enviar mensagens de voz');
            });
        }
    });


    $('#form').submit((e)=>{
        const message = $('#message').val();
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.toISOString().split('T')[0]; 

        const time = hours + ':' + minutes;

        if(message.trim() !== ''){
            socket.emit('send_message', { username, friend, message, message_voice: '', time, day });
            $('#message').val('');
        }

        e.preventDefault();
    });

    socket.on('receive_message', (data)=>{
        const isOwnMessage = data.username === username;
        const messageClass = isOwnMessage ? 'own-message' : 'other-message';
        const message = data.message.length > 0 ? data.message  : '';
        const message_voice = data.message_voice.data ? data.message_voice.data : '';

        const users_chat_name = [data.username, data.friend];

        if(users_chat.sort().toString() != users_chat_name.sort().toString()){
            window.location.reload();
        }

        if(users_chat.sort().toString() === users_chat_name.sort().toString()){
            if(message_voice.length > 0){
                $('.message-wraper').append(`
                    <div class="message ${messageClass}">
                        <audio controls class="message-envi-voice" src="${message_voice}"></audio>
                        <div class="container-hours"><p>${data.time}</p></div>
                        <div class="visualizado"></div>
                    </div>
                `);
            }else{
                $('.message-wraper').append(`
                    <div class="message ${messageClass}">
                        <p>${message}</p>
                        <div class="container-hours"><p>${data.time}</p></div>
                        <div class="visualizado"></div>
                    </div>
                `);
            }

            scrollToBottom();
        }
    });

    scrollToBottom();
});