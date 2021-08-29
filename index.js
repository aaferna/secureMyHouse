require('dotenv').config();
const { DateTime } = require("luxon");
const { Telegraf } = require('telegraf')

const Gpio = require('onoff').Gpio;
const solar = require("solardb-core")
const path = require('path');
const express = require('express');
const exp = express();
exp.use(express.json())

const speeker = new Gpio(0, 'out');    // Pin de Speeker
const ledRojo = new Gpio(2, 'out');   // Led Rojo

speeker.writeSync(0);
ledRojo.writeSync(0);

let run = false

/*  Telegram Bot */

  let tetok = process.env.TELEGTOK
  let bot
  if(tetok){

    bot = new Telegraf(process.env.TELEGTOK)

    bot.catch((err, ctx) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    })
    bot.command('start', ({ reply }) => { 
          reply("Elija de la lista que comando iniciar")
    })
    bot.command('run', ({ reply }) => { 
        if(run === true){
            reply("Alarma ya iniciada")
        } else {
            run = true
            IniciarAl()
            reply("Iniciando Alarma")
        }
    })
    bot.command('status', ({ reply }) => { 
      if(run === true){
          reply("Alarma Activa")
      } else {
          reply("Alarma Apagada")
      }
    })
    bot.command('stop', ({ reply }) => { 
        if (run = true) {
          let sts = ApagarAl()
          if(sts === 1){
            reply("Alarma Apagada")
            run = false
          } else {
            reply("La alarma aun se esta Iniciando")
          }
        } else {
          reply("Alarma sin sonar")
        }
    })
    bot.command('getid', (ctx) => {
      console.log(ctx.message.chat.id)
    })

  } 

  const sendMSG = (msg) =>{
    if(tetok){
      bot.telegram.sendMessage(process.env.IDCHAT, msg)
    }
  }
    // bot.on('text', (ctx) => {
    //   return ctx.reply(`Message counter:${ctx.chat.id}`)
    // })


/*  Telegram Bot */


/* Registro de Actividad */

  let dayActive = ""
  let idLog = ""

  const registreActivityAlarm = (gpio = null, msg = null, device = null, state = null) =>{

    sendMSG(device+": "+msg)

      let r = solar.dbGetLatestFile("_ActivityAlarm_")
      let now = DateTime.local().setZone("America/Argentina/Buenos_Aires").c
      if(r.date != undefined && dayActive === "" && idLog === ""){
        if(parseInt(r.date[1]) === now.day){
          dayActive = now.day
          idLog = r.index
        } else {
          dayActive = now.day
        }
      }
      if(now.day === dayActive){ 
        solar.dbUpdate({state:state, "gpio": gpio, "msg": msg, device: device, "date": now }, idLog, "_ActivityAlarm_") 
      } else {
        dayActive = now.day
        idLog = solar.dbInsert({state:state, "gpio": gpio, "msg": msg, device: device, "date": now }, "_ActivityAlarm_").id
      }
      
  }

/* Registro de Actividad */


/* Activar Alarma */

  let actividadAlarma // proceso de la alarma
  let stoperAlarma // proceso de la alarma
  let sonarAlarma = false // estado de la alarma

  const sonarAlarmaAct = () => {

    if(sonarAlarma === false){

        let estadoDeBit = 0 // Estado de Beep 1/0
        sonarAlarma = true // Bloqueo reactivacion de alarma
        actividadAlarma = setInterval(() => {
            if(estadoDeBit === 0){
            speeker.writeSync(1)
            ledRojo.writeSync(1);
            estadoDeBit = 1
            } else {
            speeker.writeSync(0)
            ledRojo.writeSync(0);
            estadoDeBit = 0
            }
        }, 250);
        stoperAlarma = setTimeout(() => {
            speeker.writeSync(0);
            ledRojo.writeSync(0);
            clearTimeout(actividadAlarma)
            actAlarmstt = false
            alarmaSonando = false
        }, 3000); // Apago la alarma luego de 2 Min

    } else {
      console.log('ya esta sonando')
    }

  }

  const sonarAlarmaDes = () => {
    speeker.writeSync(0);
    ledRojo.writeSync(0);
    clearTimeout(actividadAlarma);
    clearInterval(stoperAlarma);
    sonarAlarma = false
  }

/* Activar Alarma */


/* Aviso Sonoro de Error */

  const Aviso = () => {
      let count = 0
      let act2 = 0
      let act = setInterval(() => {
          if(act2 === 0){
          speeker.writeSync(1)
          ledRojo.writeSync(1);
          act2 = 1
          } else {
          speeker.writeSync(0)
          ledRojo.writeSync(0);
          act2 = 0
          }
          if(count === 61){
          speeker.writeSync(0);
          clearTimeout(act)
          }
          count ++
      }, 150);
  }

/* Aviso Sonoro de Error */


  function initAlarm() {
      return new Promise(function(resolve, reject) {
          let count = 0
          let act2 = 0
          let act = setInterval(() => {
            if(act2 === 0){
              speeker.writeSync(1)
              ledRojo.writeSync(1);
              act2 = 1
            } else {
              speeker.writeSync(0)
              ledRojo.writeSync(0);
              act2 = 0
            }
            if(count === 60){
              speeker.writeSync(0);
              clearTimeout(act);
              timmerExpress();
            }
            count ++
          }, 300);
          const timmerExpress = () => {
            let count2= 0
            let act = setInterval(() => {
              if(act2 === 0){
                speeker.writeSync(1)
                ledRojo.writeSync(1);
                act2 = 1
              } else {
                speeker.writeSync(0)
                ledRojo.writeSync(0);
                act2 = 0
              }
              if(count2 === 120){
                speeker.writeSync(0);
                clearTimeout(act);
                resolve(true)
              }
              count2 ++
            }, 100);
          }
      })
  };


/* Lister GPIO */

  let pinArr = []
  const gpioListing = () => {
      let GPIO = solar.dbGetIndex("_GPIO_")
      for (let index = 0; index < GPIO.length; index++) {
          let pin = solar.dbGetData(GPIO[index], "_GPIO_").pop()
          if(pin.active === true){
              pinArr.push(pin)
          }
      }
      if(pinArr.length === 0){ Aviso() }
  }

/* Lister GPIO */

/* Logica */

let pin = []
const IniciarAl = () => {

    gpioListing()

    if(pinArr.length != 0){ 
      initAlarm().then( e => {
        for (let index = 0; index < pinArr.length; index++) {
          pin[pinArr[index].pin] = new Gpio(pinArr[index].pin, 'in', 'both'); 
          pin[pinArr[index].pin].watch((err, value) => {
              if (err) {  registreActivityAlarm(pinArr[index].pin, err, pinArr[index].name)} 
              else {
                if(value === 0){ 
                  registreActivityAlarm(pinArr[index].pin, "Sensor Abierto", pinArr[index].name, value)
                  sonarAlarmaAct()
                }
                if(value === 1){ 
                  registreActivityAlarm(pinArr[index].pin, "Sensor Cerrado", pinArr[index].name, value)
                  sonarAlarmaDes() 
                }
              }
          });
        }
      })
    }

}

const ApagarAl = () => {

  if(pin.length != 0){
    sonarAlarmaDes()
    for (let index = 0; index < pinArr.length; index++) {
      pin[pinArr[index].pin].unwatch()
    }
    pinArr = []
    return 1
  } else {
    return 0
  }
}

/* Logica */


/*  Express API */

  exp.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  exp.get('/start', function(req, res) {
    if(run === true){
      res.send({ status: 201, msg: "Alarma ya iniciada"})
    } else {
      run = true
      IniciarAl()
      sendMSG("Iniciando alarma por API")
      res.send({ status: 201, msg: "Iniciando Alarma"})
    }
  });

  exp.get('/stop', function(req, res) {
    if (run = true) {
      sendMSG("Apagando alarma por API")
      ApagarAl()
      run = false
      res.send({ status: 201, msg: "Alarma Apagada"})
    } else {
      res.send({ status: 201, msg: "Alarma sin sonar"})
    }
  });

  exp.listen("3000", () => {
    console.log(`Sirviendo http://localhost:3000`)
  })

/*  Express API */


if(tetok){
  bot.launch()
}
