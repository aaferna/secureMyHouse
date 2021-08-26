const Gpio = require('onoff').Gpio;
const c = require("loggering")
const { DateTime } = require("luxon");

const config = require('./ports.json');

const speeker = new Gpio(0, 'out');    // Pin de Speeker
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


  // No Device Active

  const Aviso = () => {
    let count = 0
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
      if(count === 10){
        speeker.writeSync(0);
        clearTimeout(act)
      }
      count ++
    }, 150);
  }

// No Device Active

  function initAlarm() {
    return new Promise(function(resolve, reject) {
        let count = 0
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
        }, 400);
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


// Logica de la Alarma

const IniciarAl = () =>{

  let active = 0
  for (let id in config.gpoi) {
    if(config.gpoi[id].active === true){
      active ++
    }
  }

  if( active > 0){

    initAlarm().then((x) => {

      if(config.gpoi.p8.active === true){
        const gpio8 = new Gpio('8', 'in', 'both'); 
        gpio8.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p9.active === true){
        const gpio9 = new Gpio('9', 'in', 'both'); 
        gpio9.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p9.active === true){
        const gpio9 = new Gpio('9', 'in', 'both'); 
        gpio9.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p10.active === true){
        const gpio10 = new Gpio('10', 'in', 'both'); 
        gpio10.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p11.active === true){
        const gpio11 = new Gpio('11', 'in', 'both'); 
        gpio11.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p12.active === true){
        const gpio12 = new Gpio('12', 'in', 'both'); 
        gpio12.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p13.active === true){
        const gpio13 = new Gpio('13', 'in', 'both'); 
        gpio13.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p16.active === true){
        const gpio16 = new Gpio('16', 'in', 'both'); 
        gpio16.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p17.active === true){
        const gpio17 = new Gpio('17', 'in', 'both'); 
        gpio17.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p18.active === true){
        const gpio18 = new Gpio('18', 'in', 'both'); 
        gpio18.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p19.active === true){
        const gpio19 = new Gpio('19', 'in', 'both'); 
        gpio19.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p20.active === true){
        const gpio20 = new Gpio('20', 'in', 'both'); 
        gpio20.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p21.active === true){
        const gpio21 = new Gpio('21', 'in', 'both'); 
        gpio21.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p22.active === true){
        const gpio22 = new Gpio('22', 'in', 'both'); 
        gpio22.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p23.active === true){
        const gpio23 = new Gpio('23', 'in', 'both'); 
        gpio23.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p24.active === true){
        const gpio24 = new Gpio('24', 'in', 'both'); 
        gpio24.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p25.active === true){
        const gpio25 = new Gpio('25', 'in', 'both'); 
        gpio25.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p26.active === true){
        const gpio26 = new Gpio('26', 'in', 'both'); 
        gpio26.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else if(config.gpoi.p27.active === true){
        const gpio27 = new Gpio('27', 'in', 'both'); 
        gpio27.watch((err, value) => {
          console.log(value)
            if (err) {  registreLog(config.gpoi.p21.name, err) } 
            else {
              if(value === 0){ 
                registreLog(config.gpoi.p21.name, "Sensor Activo")
                activarAlarma() 
              }
              if(value === 1){ 
                registreLog(config.gpoi.p21.name, "Sensor Apagado")
                apagarAlarma() 
              }
            }
        });
      } else { Aviso() }

    })

  } else { Aviso() }

}

IniciarAl()

