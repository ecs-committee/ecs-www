import ioredis from 'ioredis'

const redis = new ioredis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT || '6379', 10),
	password: process.env.REDIS_PASSWORD,
})

export default redis