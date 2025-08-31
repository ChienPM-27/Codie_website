import { LRUCache } from "lru-cache"

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export class RateLimit {
  private cache: LRUCache<string, number>
  private interval: number

  constructor(options: Options = {}) {
    this.interval = options.interval ?? 60000 // 1 minute default
    this.cache = new LRUCache({
      max: options.uniqueTokenPerInterval ?? 500,
      ttl: this.interval,
    })
  }

  async limit(identifier: string, limit = 10) {
    const tokenCount = (this.cache.get(identifier) as number) || 0

    if (tokenCount >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(Date.now() + this.interval),
      }
    }

    this.cache.set(identifier, tokenCount + 1)

    return {
      success: true,
      limit,
      remaining: limit - tokenCount - 1,
      reset: new Date(Date.now() + this.interval),
    }
  }
}

// Default rate limiter instance
export const rateLimit = new RateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
})

// Specific rate limiters for different endpoints
export const authRateLimit = new RateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 100,
})

export const uploadRateLimit = new RateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50,
})
