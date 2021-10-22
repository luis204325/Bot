/**
 * Declaramos las diferentes constantes que utilizaremos para la ejecucion de codigo
 */
 const qrcode = require("qrcode-terminal");
 const { Client, MessageMedia } = require('whatsapp-web.js');
 const SESSION_FILE_PATH ="./session.json";
 const fs = require("fs");
 const chalk = require('chalk');
 const ora = require ('ora');
 const excel =  require ('exceljs');
 const { send } = require("process");
 const { brotliCompress } = require("zlib");
 const { NONAME } = require("dns");
 
 /**
  * Declaramos las diferentes variables globales que usaremos en las diferentes funciones. 
  */
 let client;
 let sessionData;
 
 /**
  * Esta funcion se utiliza cuando ya tenemos una sesion previamente iniciada. 
  */
 const withSession = () => {
     //Si existe cargamos el archivo con las credenciales
     const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
     sessionData = require(SESSION_FILE_PATH);
     spinner.start();
     client = new Client({
         session:sessionData
     });
 
     client.on('ready', () =>{
         console.log('cliente is ready!');
         spinner.stop();
         listenMessage();
     });
 
     client.on('auth_failure', () => {
         spinner.stop();
         console.log('** error de autenticacion vuelve a generar el qrcode');
     });
 
     client.initialize();
 
 }
 
 
 /**
  * Esta Funcion Genera el QRCODE *+*
  */
 const withOutSession = () =>{
 
     console.log('No tenemos session guardada');
     client = new Client();
     client.on('qr', qr => {
         qrcode.generate(qr, { small: true });
     });
 
     client.on('ready', () => {
         console.log('Client is ready!');
         listenMessage();
        // connectionReady();
     });
 
     client.on('auth_failure', () => {
         console.log('** Error de autentificacion vuelve a generar el QRCODE, por favor alimine el archivo de Session y ejecute de nuevo el programa. **');
     })
 
 
     client.on('authenticated', (session) => {
         // Guardamos credenciales de de session para usar luego
         sessionData = session;
         fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
             if (err) {
                 console.log(err);
             }
         });
     });
 
     client.initialize();
 }
 
 /**
  * Esta funcion se encarga de escuchar cada vez que un mensaje entra nuevo 
  */
 
 const listenMessage = () => {
     client.on('message', async (msg)=>{
         const { from, to, body } = msg;
         let respuestas = ['Gracias', 'gracias','Grazias', 'Grazhias', 'grazias', 'grazhias', 'graziahs', 'Graccias', 'graccias', 'Muchas', 'muchas', 'muchas grasias']
         let mensaje = body;
         //Mostramos el mensaje que nos llego por consola para poder controlar mejor el bot. 
         console.log(from, to, body);
      
         for(let i = 0 ; i < respuestas.length; i++){
             if(body == respuestas[i]){
                 mensaje = '4';
             }
         }
         
        
 
          /**
          * Interaccion del bot con el usuario. 
          */
         switch(mensaje){
             
             case '1':
                 sendMessage(from, 'Para poder descargar la app debes seguir el siguiente link, recuerda que esta app es de uso exclusivo para personal activo de Calvo 😉')
                 sendMessage(from, 'https://portalempleado.grupocalvo.com/')
                // sendMedia(from, 'estamos.jpg')
                // sendSticker(from, 'estamos.jpg')
             break;
 
             case '2':
                 sendMessage(from, 'Por favor comentale los problemas que tienes al departamento de recursos humanos ellos te orientaran de mejor manera como solventarlo 😁')
                 break;
 
             case '3':  
             sendMessage(from, 'Por favor completa el siguiente formulario 😀')    
             sendMessage(from, 'https://forms.office.com/Pages/ResponsePage.aspx?id=QIf61VDvOUOo5CTA52RSat_ns4z69GZOtgS5GJgZnZ1UOTdRVUMzMUpaNkJLWk1ZUjNQQUVOMzVLUy4u')
                 break;
 
             case '4': sendMessage(from, 'De nada! 😊, ten un Stiker de regalo!') 
                       sendSticker(from, 'STK-20210902-WA0006.webp')
             break;
 
             default:
                 sendMessage(from, `Hola! Gracias por comunicarte con nosotros, hemos actualizado este medio de contacto para poder ayudarte a realizar diferentes gestiones \
 por favor selecciona una opción de las siguientes y envíanos el número para poder ayudarte. 
  
 1-) Descargar CalvoApp. 
 2-) Problemas con CalvoApp.
 3-) Solicitud de ingreso.
                                     
 Recuerda responder este mensaje únicamente con el número de la solicitud que quieres realizar. 😀  `)
                                                                      
                                                                                         
                 break; 
         }
     });
 }
 
 const sendMessage = (to, message) => {
 
     client.sendMessage(to, message)
 }
 
 const sendMedia = (to, file) => {
     const mediaFile = MessageMedia.fromFilePath(`./mediased/${file}`);
     client.sendMessage(to, mediaFile); 
 }
 
 const saveHitorial = (number, message) => {
     const pathChat = `./chats/${number}.xlsx`
 }
 
 const sendSticker = async (to, file)=>{
     const mediaFile = MessageMedia.fromFilePath(`./mediased/${file}`);
     client.sendMessage(to, mediaFile, {sendMediaAsSticker: true}); 
 }
 
 (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
 
 
 