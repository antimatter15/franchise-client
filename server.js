var WebSocket = require('ws');
var port = parseInt('bat', 36); // 14645, as in batman (the movie franchise)
var wss = new WebSocket.Server({ port: port });
 
wss.on('connection', function connection(ws) {
	console.log('opened connection')
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		setTimeout(function(){
			ws.send(JSON.stringify({
				test: 'hello'
			}));
		}, 100)
	});
	ws.send(JSON.stringify({
		ready: true
	}));
});

console.log("listening on port " + port)