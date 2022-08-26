const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'] );

    // verificar autenticacion
    if (!valido) return client.disconnect();

    // Cliente autenticado
    usuarioConectado(uid);
    
    // Ingresar al usuario a ua sala en particular
    // sala global, client.id, asdjfa2323jl323rj34388988
    client.join(uid);

    // Esuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        
        await grabarMensaje( payload );
        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', (payload) => {
    //     io.emit('mensaje', {admin: 'Nuevo mensaje'});
    // });

 })
