const { Client } = require('pg')
const credentials = require('./credentials.js')

let client;

module.exports = async function handle(message){
	const {action, id} = message

	if(action === 'open') {
		const {credentials} = message

		client = new Client(credentials)

		try {
			await new Promise((resolve, reject) => client.connect(err => err ? reject(err.message) : resolve()))
		} catch(e) {
			return {ready: false, error: e}
		}

		return {ready: true}
	} else if(action === 'exec') {
		const {sql} = message

		try {
			const results = await client.query(sql)
			return {results}
		} catch (e) {
			console.log(e)
			return {error: e.stack.split('\n')[0]}
		}

	} else if(action == 'get_credentials') {

		return credentials

	}
}