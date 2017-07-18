#!/usr/bin/env node

const WebSocket = require('ws');
const port = parseInt('bat', 36); // 14645, as in batman (the movie franchise)

const { Client } = require('pg')

const wss = new WebSocket.Server({ port: port });

wss.on('connection', ws => {
	console.log('opened connection')
	
	ws.on('message', async message => {
		console.log('received:', message);


		message = JSON.parse(message)

		const {action, id} = message
		const reply = msg => ws.send(JSON.stringify(Object.assign({id}, msg)))

		if(action === 'open'){
			const {credentials} = message

			ws.client = new Client(credentials)

			try {
				await new Promise((resolve, reject) => ws.client.connect(err => err ? reject() : resolve()))
			} catch(e) {
				return reply({ready: false, error: e})
			}

			reply({ready: true})
		} else if(action === 'exec'){
			const {sql} = message

			const results = await ws.client.query(sql)

			reply({results})
		}

	})
})



async () => {

	await client.connect()
	// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
	// console.log(res.rows[0].message) // Hello world!
	// await client.end()


	console.log("listening on port " + port)	
}