const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Sleeping with sirens'));
bands.addBand( new Band('Linking park'));
bands.addBand( new Band('Warcry'));


//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    // client.on('emitir-mensaje', (payload) => {
    //     // io.emit('nuevo-mensaje', payload); //emite a todos!
    //     console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitio
    // });
})
