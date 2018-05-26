var socket = io();
var paramns = new URLSearchParams(window.location.search)
if(!paramns.has('nombre')|| !paramns.has('sala')){
    window.location='index.html';
    throw new Error('El nombre es necesario y Sala son Necesarios')
}
var usuario={
    nombre:paramns.get('nombre'),
    sala:paramns.get('sala')
}
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat',usuario,function(resp){
        console.log(resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/* socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usarios
//cuadno un usaurio entra o sale del chat

socket.on('listaPersona', function(mensaje) {

    console.log('Personas:', mensaje);

});
socket.on('mensajePrivado',function(mensaje){
    console.log(mensaje);
})