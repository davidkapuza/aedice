import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL!, {
  enableAutoPipelining: true,
});

export default client;

