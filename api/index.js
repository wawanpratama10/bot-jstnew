var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1897712631:AAEWkDTJWz2_ywnXd7BrYfpXDLh22-kLjlA'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click  /predict to know about x y and z`
    );   
});



state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `input nilai x|y|z example 4|3|2`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x = s[0]
        y = s[1]
        z = s[2]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
        ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `nilai x yang diprediksi adalah ${jres[0]} volt`
            );   
            bot.sendMessage(
                msg.chat.id,
                `nilai y yang diprediksi adalah ${jres[1]} watt`
            );   
            bot.sendMessage(
                msg.chat.id,
                `nilai z yang diprediksi adalah ${jres[2]} watt
         );   
})
    }else{
        state = 0
    }
})



// routers
r.get('/prediction/:x/:y/:z', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x), // string to float
            parseFloat(req.params.y),
            parseFloat(req.params.z)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
