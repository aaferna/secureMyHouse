require('dotenv').config();
const axios = require('axios');

let tetok = process.env.TELEGTOK
let bot
if(tetok){

  const express = require('express');
  const { Telegraf } = require('telegraf')
  const exp = express();
  exp.use(express.json())


  bot = new Telegraf(process.env.TELEGTOK)

  bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })

  // bot.command('start', ({ reply }) => { 
  //       reply("Elija de la lista que comando iniciar")
  // })

  bot.command('start', ctrx => { 

    ctrx.reply('Un momento');  

    axios({
      method: 'get',
      url: 'http://raspberrypi:4247/start'
    })
    .then((response) => { ctrx.reply(response.data.msg); })
    .catch((error) => { ctrx.reply(error.code); });

  })

  bot.command('silent', ctrx => { 

    ctrx.reply('Un momento');  

    axios({
      method: 'get',
      url: 'http://raspberrypi:4247/startsilent'
    })
    .then((response) => { ctrx.reply(response.data.msg); })
    .catch((error) => { ctrx.reply(error.code); });

  })

  bot.command('status', ctrx => { 

    ctrx.reply('Un momento');    

    axios({
      method: 'get',
      url: 'http://raspberrypi:4247/status'
    })
    .then((response) => { ctrx.reply(response.data.msg); })
    .catch((error) => { ctrx.reply(error.code); });

  })

  bot.command('stop', ctrx => { 

    ctrx.reply('Un momento');  

    axios({
      method: 'get',
      url: 'http://raspberrypi:4247/stop'
    })
    .then((response) => { ctrx.reply(response.data.msg); })
    .catch((error) => { ctrx.reply(error.code); });

  })

  bot.command('chatIDclog', (ctx) => {
    console.log(ctx.message.chat.id)
  })

  bot.launch()

  exp.post('/sendmsg', function(req, res) {
    res.send({ status: 200})
    bot.telegram.sendMessage(process.env.IDCHAT, req.body.msg)
  });

  exp.listen("5247", () => {
    bot.telegram.sendMessage(process.env.IDCHAT, 'Servidor del Bot inicializado')
    console.log(`Servicio iniciado`)
  })
  
} 
