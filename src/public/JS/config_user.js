$(function(){
    const form = $('#envi_photo_icon');

    form.submit(function(e){
        const file = $('input[name="photo_icon"]')[0];
        const errMsg = $('#err');

        if(file.files.length === 0){
            errMsg.css('display', 'inline');

            return e.preventDefault();
        }

        return true;
    });
});