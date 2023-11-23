import { Inject, Injectable } from '@nestjs/common'
import { ClientRedis } from '@nestjs/microservices'
import Redlock from 'redlock'

@Injectable()
export class RedisLockService {
	private redisLock: any
	constructor(@Inject('REDIS_CLIENT_SERVICE') private redisClient: ClientRedis) {}

	async onModuleInit() {
		try {
			const redis = await this.redisClient.createClient()
			this.redisLock = new Redlock([redis], { retryJitter: 200 })
		} catch (error) {}
	}

	async acquire(keys: string[], duration: number, settings?: any) {
		return await this.redisLock.acquire(keys, duration, settings)
	}
}
