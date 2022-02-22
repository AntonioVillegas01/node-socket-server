const express = require("express");
const cors = require("cors");
const {socketsController} = require("../sockets/sockets.controller");
require('dotenv').config()

class Server{

    constructor() {
        this.app  = express()
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {}


        //Middlewares
        this.middlewares();

        // Rutas de la app
        this.routes();

        // Sockets
        this.sockets();
    }




    middlewares(){
        // CORS
        this.app.use(cors())

        // Directorio publico
        this.app.use(express.static('public'))


    }

    routes() {
  //      this.app.use(this.paths.auth, require('../routes/auth.routes'))

    }

    sockets() {
        this.io.on('connection',socketsController);
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log(`Escuchando en puerto ${this.port}`)
        })
    }
}

module.exports = Server