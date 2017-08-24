const {Client: PostgresClient} = require('pg')
const BigQueryClient = require('@google-cloud/bigquery')
const tmp = require('tmp')
const fs = require('fs')

const credentials = require('./credentials.js')


const localCtx = {}
module.exports = async function response(message, ctx=localCtx){
	const {action, id} = message

	try {

		if(action === 'open') {
			const {credentials, db} = message

			// client = new Client(credentials)
			let createClient = 
				  db === 'postgres' ? createPostgresClient
				: db === 'bigquery' ? createBigQueryClient
				: () => {throw new Error('database ' + db + ' not recognized')}

			ctx.client = await createClient(credentials)
			return {ready: true}

		} else if(action === 'exec') {
			const {sql} = message

			const results = await ctx.client.query(sql)
			return {results}

		} else if(action === 'close') {
			await ctx.client.close()

			return {closed: true}

		} else if(action == 'get_credentials') {

			return credentials

		}

	} catch(e) {
		console.log(e)
		return {error: e.stack.split('\n')[0]}
	}
}


async function createPostgresClient(credentials){
	const client = new PostgresClient(credentials)
	await client.connect()
	return {
		async query(sql){
			const results = await client.query({
				text: sql,
				rowMode: 'array'
			})
			if(results.rows.length > 10000)
				throw new Error('Too many result rows to serialize: Try using a LIMIT statement.')
			return results
		},
		close: client.end.bind(client)
	}
}

function createBigQueryClient(credentials){
	if(credentials.keyFile){
		const {name, data} = credentials.keyFile

		const {name: keyFilename, fd} = tmp.fileSync({postfix: name})
		fs.writeFileSync(fd, Buffer.from(data, 'hex'))

		credentials.keyFilename = keyFilename
	}
	console.log(credentials)
	const client = new BigQueryClient(credentials)
	return {
		query: sql => client.query({query: sql}),
		close(){ console.log('no bigquery close method') }
	}
}