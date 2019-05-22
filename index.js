var socket = require('socket.io'), http = require('http'),
server = http.createServer(), socket = socket.listen(server);
var mysql=require('mysql');

var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'ecounselling'
})

socket.on('connection', function(connection) {
    console.log('User Connected');
    console.log(connection.id);
    con.connect(function() {
        con.query("UPDATE users SET socket_id = '"+connection.id+"' WHERE name = 'user'", function(result) {
            console.log(result);
        });
    });

    connection.on('message', function(data) {
        console.log("Saving the Chat message in database...");
        console.log(data);
        con.connect(function() {
            con.query("INSERT INTO chat(sender, receiver, message) VALUES('"+data.sender+"','"+data.reciever+"','"+data.message+"')", function(result) {
                console.log(result);
            });
        });
        //socket.to('uTMp6y0U4Uo1zHUnAAAB').emit('message', data.message);
        socket.emit('message', {message: data.message, sender: data.sender, receiver: data.receiver});
    });

    socket.on('add-message', (message) => {
        io.emit('message', {text: message.text, from: socket.sender, created: new Date()});
    });

    socket.on('disconnect', function(){
        io.emit('users-changed', {user: socket.nickname, event: 'left'});
        console.log('User Disconnected');
    });
});

server.listen(3000, function(){
    console.log('Server started');
});