const Gpio = require('onoff').Gpio;
const c = require("loggering")
const { DateTime } = require("luxon");

const config = require('./ports.json');
const speeker = new Gpio(0, 'out');       // Pin de Speeker
const ledRojo = new Gpio(2, 'out');   // Led Rojo

speeker.writeSync(0);
ledRojo.writeSync(0);

const registreLog = (name, def) =>{
  let dir = "./"
  let date = DateTime.local().c;
  c.loggering(dir,'Alarma', JSON.stringify({"date": date, "name": name, "msg": def })+",", false)
}

// Activar Alarma

  let act
  let act2 = 0
  
  const activarAlarma = () => {
    act = setInterval(() => {
      if(act2 === 0){
        speeker.writeSync(1)
        ledRojo.writeSync(1);
        act2 = 1
      } else {
        speeker.writeSync(0)
        ledRojo.writeSync(0);
        act2 = 0
      }
    }, 250);
  }

  const apagarAlarma = () => {
    speeker.writeSync(0);
    ledRojo.writeSync(0);
    clearTimeout(act)
    act2 = 0
  }

// Activar Alarma


const IniciarAl = () =>{
  console.log('Alarma Activada')

  const gpio21 = new Gpio('20', 'in', 'both'); 
  gpio21.watch((err, value) => {
    console.log(value)
      if (err) {  registreLog("config.gpoi.p21.name", err) } 
      else {
        if(value === 0){ 
          registreLog("config.gpoi.p21.name", "Sensor Activo")
          activarAlarma() 
        }
        if(value === 1){ 
          registreLog("config.gpoi.p21.name", "Sensor Apagado")
          apagarAlarma() 
        }
      }
  });


}

IniciarAl()

// console.log(button.readSync())

  // setTimeout(IniciarAl, 3000)


  // const shh=()=>{
  //   button.unexport()
  //   console.log("shh")
  // }

  // setTimeout(shh, 10000)

  // let stopBlinking = false;

  //   // led.writeSync(0) // Enciendo led
  //   //  led.writeSync(1) // Apago led

  // // Toggle the state of the LED connected to GPIO17 every 200ms
  // const blinkLed = _ => {
  // if (stopBlinking) {
  //   // return 
  // }

  // bep.read()
  //   .then(value => bep.write(value ^ 1))
  //   .then(_ => setTimeout(blinkLed, 200))
  //   .catch(err => console.log(err));
  // };
