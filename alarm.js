require('dotenv').config();

const { DateTime } = require("luxon");
const solar = require("solardb-core")
const { Telegraf } = require('telegraf')

const Gpio = require('onoff').Gpio;
const speeker = new Gpio(0, 'out');    // Pin de Speeker
const ledRojo = new Gpio(2, 'out');   // Led Rojo

speeker.writeSync(0);
ledRojo.writeSync(0);


/* Registro de Actividad */

  let dayActive = ""
  let idLog = ""

  const registreActivityAlarm = (gpio = null, msg = null, device = null, state = null) =>{

    sendMsg(msg +" en "+ device)

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
    sonarAlarmaDes()
    for (let index = 0; index < pinArr.length; index++) {
      pin[pinArr[index].pin].unwatch()
    }
    pinArr = []
}

/* Logica */

// Exporto Modulos \\
 
// exports.sonarAlarmaAct = sonarAlarmaAct;
// exports.sonarAlarmaDes = sonarAlarmaDes;
// exports.Aviso = Aviso;
// exports.IniciarAl = IniciarAl;
// exports.ApagarAl = ApagarAl;
