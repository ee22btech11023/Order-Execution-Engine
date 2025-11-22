import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { publishOrderEvent } from '../utils/pubsub';
import { getBestQuoteAndExecute } from '../services/dexRouter';

const connection = new IORedis();
const worker = new Worker('orders', async job => {
  const order = job.data;
  publishOrderEvent(order.id, { status: 'pending' });
  publishOrderEvent(order.id, { status: 'routing' });
  try {
    const routing = await getBestQuoteAndExecute(order);
    publishOrderEvent(order.id, { status: 'submitted', txHash: routing.txHash });
    publishOrderEvent(order.id, { status: 'confirmed', txHash: routing.txHash, executedPrice: routing.executedPrice });
  } catch (err: any) {
    publishOrderEvent(order.id, { status: 'failed', error: err.message });
    throw err; // let BullMQ retry
  }
}, { connection, concurrency: 10 });

worker.on('failed', (job, err) => {
  console.error('Job failed', job.id, err?.message);
});

console.log('Worker started');