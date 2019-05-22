var socket = require('socket.io'), http = require('http'),
server = http.createServer(), socket = socket.listen(server);
var mysql=require('mysql');
var io=require('socket.io')(http);

var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'ecounselling',
});

let usersocket='';
socket.on('connection',(socket)=>{
    console.log('connected');
    socket.on('message', function(data) {
        con.connect(function() {
            con.query("UPDATE users SET socket_id = '"+socket.id+"' WHERE name = '"+data.sender+"'", function(err,result) {
                console.log(result);
            }); 
        });

        console.log("Saving the Chat message in database...");
        console.log(data);
        con.connect(function() {
            con.query("INSERT INTO chatinfo(sender, reciever, message) VALUES('"+data.sender+"','"+data.reciever+"','"+data.message+"')", function(err,result) {
                console.log("inserted");
            });
        });

        con.connect(function() {
            con.query("SELECT socket_id FROM users WHERE name='"+data.reciever+"'",function(err,result){
                var socketid=JSON.stringify(result);
                var sok=JSON.parse(socketid);
                usersocket=sok[0].socket_id;
                this.usersocket=`${usersocket}`;
                console.log(`${usersocket}`); 
        
                `${usersocket}`.emit('message', {message: data.message, sender: data.sender, receiver: data.receiver});     
            });
        });       
    });
});

server.listen(3000, function() {
    console.log('Server started');
});