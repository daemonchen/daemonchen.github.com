//var store = require('./store');
var connect = require("connect")
var clientName = '';
var app=connect()
.use(connect.logger())
.use(connect.static(__dirname+"/"))
.listen(8081);
/*var app = require('http').createServer(function (req, res) {
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Server ERR');
		}
		res.writeHead(200);
		res.end(data);
		//clientName=req;
	});
});*/
/*var io = require('socket.io').listen(app);
var fs = require('fs');

io.sockets.on('connection', function (socket) {
	clientName = JSON.stringify(socket[1]);
	var clientIp = socket.handshake.address;
	socket.on('client', function (data) {
		store({
			ip: clientIp.address + ':' + clientIp.port,
			userName: data['userName'],
			chat: data['chat'].toString()
		}); //store the chat
		socket.emit('server', {
			ip: clientIp.address + ':' + clientIp.port,
			userName: data['userName'],
			chat: data['chat']
		});
		socket.broadcast.emit('broadcast', {
			ip: clientIp.address + ':' + clientIp.port,
			userName: data['userName'],
			chat: data['chat']
		});
	});
});*/