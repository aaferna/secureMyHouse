const express = require('express');
const config = require('./ports.json');
const alarm = require('./modules/alarm');
const path = require('path');
const solar = require("solardb-core")



const app = express();

let run = false

app.use(express.json())

app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname, '/public/index.html'));


});

app.get('/start', function(req, res) {

  if(run === true){
    res.send({ status: 201, msg: "Alarma ya iniciada"})
  } else {
    run = true
    alarm.IniciarAl()
    res.send({ status: 201, msg: "Iniciando Alarma"})
  }

});

app.get('/stop', function(req, res) {

  if (run = true) {
    alarm.ApagarAl()
    run = false
    res.send({ status: 201, msg: "Alarma Apagada"})
  } else {
    res.send({ status: 201, msg: "Alarma sin sonar"})
  }
 
 
});

app.listen("3000", () => {
  console.log(`Sirviendo http://localhost:3000`)
})