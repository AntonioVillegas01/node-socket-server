const TicketControllModel = require("../models/ticket-controll.model");

const ticketControl = new TicketControllModel()


const socketsController= (socket) => {

    socket.emit('ulitmo-ticket',ticketControl.ultimo)
    socket.emit('estado-actual', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.tickets.length)



    socket.on('siguiente-ticket', (payload, callback)=> {
        const siguiente = ticketControl.siguienteTicket();
        callback(siguiente)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
    })

    socket.on('atender-ticket', ({escritorio}, callback)=> {
        if(!escritorio){
           return callback({
               ok:false,
               msg:'El escritorio es obligatorio'
           })
        }
        const ticket = ticketControl.atenderTicket(escritorio)

        // notificar cambio en los ultimos 4 a todas las pantallas
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)

        if(!ticket){
            callback({
                ok:false,
                msg: 'No hay tickets pendientes'
            })
        }else{
            callback({
                ok:true,
                ticket
            })
        }
    })
}

module.exports={
    socketsController
}