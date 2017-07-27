const { Client } = require('pg')

let client;

module.exports = async function handle(message, reply = res=>res){
	const {action, id} = message

	if(action === 'open'){
		const {credentials} = message

		client = new Client(credentials)

		try {
			await new Promise((resolve, reject) => client.connect(err => err ? reject() : resolve()))
		} catch(e) {
			return reply({ready: false, error: e})
		}

		return reply({ready: true})
	} else if(action === 'exec'){
		const {sql} = message

		try {
			const results = await client.query(sql)
			return reply({results})
		} catch (e) {
			console.log(e)
			return reply({error: e.stack.split('\n')[0]})
		}

	}
}