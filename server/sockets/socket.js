const {
    io
} = require('../server');
const {
    Usuarios
} = require('../classes/usuarios')
const usuarios = new Usuarios();
const {
    crearMensaje
} = require('../utilidades/utilidades')
io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }
        client.join(data.sala);
        usuarios.agregarPersona(client.id, data.nombre, data.sala)
        
        client.broadcast.to(data.para).emit('listaPersona', usuarios.getPersonasPorSala(data.sala))
        callback(usuarios.getPersonasPorSala(data.sala));


    })
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala))
    })

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)
        console.log(persona);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    })

});