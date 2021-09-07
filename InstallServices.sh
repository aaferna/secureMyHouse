#!/bin/bash
clear

touch /etc/systemd/system/bot.service
touch /etc/systemd/system/alarma.service


echo [Unit] >> /etc/systemd/system/bot.service
echo Description=Driver del Bot >> /etc/systemd/system/bot.service
echo After=network.target >> /etc/systemd/system/bot.service
echo  >> /etc/systemd/system/bot.service
echo [Service] >> /etc/systemd/system/bot.service
echo ExecStart=/usr/local/node/bin/node /home/pi/node/secureMyHouse/bot.js >> /etc/systemd/system/bot.service
echo Restart=always >> /etc/systemd/system/bot.service
echo SyslogIdentifier=bot >> /etc/systemd/system/bot.service
echo User=pi >> /etc/systemd/system/bot.service
echo Group=pi >> /etc/systemd/system/bot.service
echo WorkingDirectory=/home/pi/node/secureMyHouse >> /etc/systemd/system/bot.service
echo TimeoutStopSec=30 >> /etc/systemd/system/bot.service
echo  >> /etc/systemd/system/bot.service
echo [Install] >> /etc/systemd/system/bot.service
echo WantedBy=multi-user.target >> /etc/systemd/system/bot.service


echo [Unit] >> /etc/systemd/system/alarma.service
echo Description=Driver de Alarma >> /etc/systemd/system/alarma.service
echo After=network.target >> /etc/systemd/system/alarma.service
echo  >> /etc/systemd/system/alarma.service
echo [Service] >> /etc/systemd/system/alarma.service
echo ExecStart=/usr/local/node/bin/node /home/pi/node/secureMyHouse/alarm.js >> /etc/systemd/system/alarma.service
echo Restart=always >> /etc/systemd/system/alarma.service
echo SyslogIdentifier=bot >> /etc/systemd/system/alarma.service
echo User=pi >> /etc/systemd/system/alarma.service
echo Group=pi >> /etc/systemd/system/alarma.service
echo WorkingDirectory=/home/pi/node/secureMyHouse >> /etc/systemd/system/alarma.service
echo TimeoutStopSec=30 >> /etc/systemd/system/alarma.service
echo  >> /etc/systemd/system/alarma.service
echo [Install] >> /etc/systemd/system/alarma.service
echo WantedBy=multi-user.target >> /etc/systemd/system/alarma.service


echo "Recargando los Servicios"
systemctl daemon-reload

echo "Activando Servicio"
systemctl enable bot
systemctl enable alarma

echo "Iniciando Servicio"
systemctl start bot
systemctl start alarma

echo "Verificando Servicio"
systemctl status bot
systemctl status alarma