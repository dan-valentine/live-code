const express = require('express'),
    bodyParser = require('body-parser'),
    codeCtrl = require('./controller/codeCtrl');
    port = 4000,
    app = express(),
    Docker = require('./classes/Docker'),
    socket = require('socket.io');
    
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../src/`));

app.post('/api/new', codeCtrl.new);


const io = socket(app.listen(port, ()=>{
    console.log(`yo what up i'm listening on port ${port}`)
}))

io.on('connection', socket => {
    console.log('connected to sockets');

    socket.on('joinRoom', data => {
        console.log('Room joined', data.room)
        socket.join(data.room);
        io.to(data.room).emit('roomJoined');
      })
      socket.on('changeCode', data => {
        console.log(data.code)
        io.to(data.room).emit('changeCode', data.code);
    })

    socket.on('compile', data => {
        io.to(data.room).emit('compiling', {compiling: true});
        const {room, type, code} = data
        console.log(code, room, type)
        const myDocker = new Docker(room, io, type, code);
        myDocker.run()

    })
})