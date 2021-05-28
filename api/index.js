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
        click /menu to main menu`
    );   
});

bot.onText(/\/menu/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `this is your main menu`
    );   
});

state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai i|v contohnya 9|9`
    );  
    state = 1;
});

bot.on('message'), (msg) => {
    if(state == 1){
        console.log(msg.text);
        s = msg.text.split("|");
        i = s[0]
        v = s[1]
        model.predict(
        [
            parseFloat(s[0]), // string to float
            parseFloat(s[1])
        ]
    ).then((jres)=>{
        bot.sendMessage(
            msg.chat.id,
            `nilai v yang diprediksi adalah $(jres[0]} volt`
        );   
        bot.sendMessage(
            msg.chat.id,
            `nilai v yang diprediksi adalah $(jres[1]} volt`
    );   
    })
    }else{
        state = 0
})

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
