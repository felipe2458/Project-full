const background_bg = require('./bgnd.json');

function isDarkMode(user, page){
    let background_val;
    const style = 'style_' + user.background[0].darkmode.style;

    if(user.background[0].darkmode.isChecked){
        background_val = background_bg.darkmode[page][style];
    }else{
        background_val = background_bg.lightmode[page][style];
    }

    return background_val;
}

module.exports = isDarkMode;