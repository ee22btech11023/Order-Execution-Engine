import { Queue } from 'bullmq';
import IORedis from 'ioredis';
const connection = new IORedis();
const orderQueue = new Queue('orders', { connection });

export async function enqueueOrder(order: any) {
  await orderQueue.add('execute', order, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 500 }
  });
}