const path = require('path')
const fs = require('fs')

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControllModel {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init()
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        const {hoy, tickets, ultimos4, ultimo} = require('../db/data.json')

        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4
        }else{
            // Es otro dia
            this.guardarDB()
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson) )
    }

    siguienteTicket(){
        this.ultimo += 1
        const ticket = new Ticket(this.ultimo, null)
        this.tickets.push(ticket);
        console.log(ticket)

        this.guardarDB();
        return `Ticket:  ${ticket.numero}`
    }

    atenderTicket(escritorio){

        // no tenemos tickets
        if(this.tickets.length === 0){
            return null
        }

        const ticket = this.tickets.shift() // shift remueve el primer elemento y lo retorna
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket) // unshift agrega un elemento nuevo al inicio
        if (this.ultimos4.length > 4){
            /*
            elimina la ultima posicion del arreglo y remueve un solo item
            * */
            this.ultimos4.splice(-1, 1)
        }
        this.guardarDB()

        return ticket;

    }

}


module.exports = TicketControllModel