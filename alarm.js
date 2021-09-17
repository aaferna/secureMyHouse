const { DateTime } = require("luxon");
const helmet = require("helmet");
const Gpio = require('onoff').Gpio;
const solar = require("solardb-core")
const path = require('path');
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const exp = express();
exp.use(express.json())
exp.use(helmet())

const speeker = new Gpio(0, 'out');    // Pin de Speeker
const ledRojo = new Gpio(2, 'out');   // Led Rojo

speeker.writeSync(0);
ledRojo.writeSync(0);

let run = false
let startup = false

/* Registro de Actividad */

  const registreActivityAlarm = (gpio = null, msg = null, device = null, state = null) =>{

    let idLog = 0
    let now = DateTime.local().setZone("America/Argentina/Buenos_Aires").c
    let id = parseInt(solar.dbGetLatestFile("_ActivityAlarm_"))

      if(process.env.TELEGTOK){
        let data = JSON.stringify({
          "msg": device+" "+msg
        });
        let config = {
          method: 'post',
          url: 'http://raspberrypi:5247/sendmsg',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config).then((response) => {
          // console.log(JSON.stringify(response.data));
        }).catch((error) => {
          console.log(error);
        });
      }

      if(id != 0){
        let r = solar.dbGetData(id, "_ActivityAlarm_").pop()
        if(now.day == r.date.day){ idLog = id }
      }
        
      if(idLog != 0){ 
        solar.dbUpdate({state:state, "gpio": gpio, "msg": msg, device: device, "date": now }, idLog, "_ActivityAlarm_") 
      } else {
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
        }, 200);
        stoperAlarma = setTimeout(() => {
            speeker.writeSync(0);
            ledRojo.writeSync(0);
            clearTimeout(actividadAlarma)
            actAlarmstt = false
            alarmaSonando = false
        }, 120000); // Apago la alarma luego de 2 Min

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
        resolve(true)
        startup = false
          // let count = 0
          // let act2 = 0
          // let act = setInterval(() => {
          //   if(act2 === 0){
          //     speeker.writeSync(1)
          //     ledRojo.writeSync(1);
          //     act2 = 1
          //   } else {
          //     speeker.writeSync(0)
          //     ledRojo.writeSync(0);
          //     act2 = 0
          //   }
          //   if(count === 60){
          //     speeker.writeSync(0);
          //     clearTimeout(act);
          //     timmerExpress();
          //   }
          //   count ++
          // }, 300);
          // const timmerExpress = () => {
          //   let count2= 0
          //   let act = setInterval(() => {
          //     if(act2 === 0){
          //       speeker.writeSync(1)
          //       ledRojo.writeSync(1);
          //       act2 = 1
          //     } else {
          //       speeker.writeSync(0)
          //       ledRojo.writeSync(0);
          //       act2 = 0
          //     }
          //     if(count2 === 120){
          //       speeker.writeSync(0);
          //       clearTimeout(act);
          //       resolve(true)
          //       startup = false
          //     }
          //     count2 ++
          //   }, 100);
          // }

      })
  };

/* Aviso Sonoro de Error */

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
  let pinsts = []
  const IniciarAl = () => {

      gpioListing()

      if(pinArr.length != 0){ 
        initAlarm().then( e => {
          for (let index = 0; index < pinArr.length; index++) {
            pinsts[pinArr[index].pin] = false
            pin[pinArr[index].pin] = new Gpio(pinArr[index].pin, 'in', 'both'); 
            pin[pinArr[index].pin].watch((err, value) => {
                if (err) {  registreActivityAlarm(pinArr[index].pin, err, pinArr[index].name)} 
                else {
                  if(value === 0 && pinsts[pinArr[index].pin] === false){ 
                    registreActivityAlarm(pinArr[index].pin, "Sensor Abierto", pinArr[index].name, value)
                    sonarAlarmaAct()
                    pinsts[pinArr[index].pin] = true
                  }
                  if(value === 1 && pinsts[pinArr[index].pin] === true){ 
                    pinsts[pinArr[index].pin] = false
                    registreActivityAlarm(pinArr[index].pin, "Sensor Cerrado", pinArr[index].name, value)
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
      pinsts = []
      return 1
    } else {
      return 0
    }
  }

/* Logica */


/*  Express API */

  exp.get('/start', function(req, res) {

    if(run === true){
      res.send({ status: 201, msg: "Alarma ya iniciada"})
    } else {
      run = true
      startup = true
      IniciarAl()
      res.send({ status: 201, msg: "Iniciando Alarma"})
    }
  });

  exp.get('/stop', function(req, res) {

    if (run == true) {

      if(startup == true){
        res.send({ status: 201, msg: "Alarma aun Iniciando"})
      } else {
        ApagarAl()
        run = false
        res.send({ status: 201, msg: "Alarma Apagada"})
      }
     
    } else {
      res.send({ status: 201, msg: "Alarma sin iniciar"})
    }

  });
  
  exp.get('/status', function(req, res) {
    if (run === true) {
      if(sonarAlarma === true){
        res.send({ status: 201, msg: "Alarma Activa y Sonando"})
      } else {
        res.send({ status: 201, msg: "Alarma Activa"})
      }

    } else {
      res.send({ status: 201, msg: "Alarma Apagada"})
    }
  });

  exp.listen("4247", () => {
    console.log(`Servicio iniciado`)
  })

/*  Express API */
