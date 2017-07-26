#!/usr/bin/env node

const WebSocket = require('ws');
const port = parseInt('bat', 36); // 14645, as in batman (the movie franchise)

const handle = require('./rpc.js')
const creds = require('./credentials.js')

const wss = new WebSocket.Server({ port });
console.log("listening on port", port)

wss.on('connection', ws => {
	console.log('opened connection')

	ws.send(JSON.stringify(creds))
	
	ws.on('message', message => {
		console.log('received:', message);

		message = JSON.parse(message)
		const {id} = message

		handle(message, res => ws.send(JSON.stringify(Object.assign({id}, res))))

	})
})