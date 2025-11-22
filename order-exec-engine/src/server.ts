import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { v4 as uuid } from 'uuid';
import { enqueueOrder } from './queue/producer';
import { subscribeToOrder } from './utils/pubsub';

const fastify = Fastify({ logger: true });
await fastify.register(websocket as any);

fastify.post('/api/orders/execute', async (req, reply) => {
  const body = req.body as any || {};
  const orderId = uuid();
  const order = { id: orderId, ...body };
  // persist minimal order to DB (skipped in scaffold)
  await enqueueOrder(order);
  return reply.code(202).send({ orderId });
});

fastify.get('/ws/:orderId', { websocket: true }, (connection, req) => {
  const { orderId } = req.params as any;
  const sub = subscribeToOrder(orderId, (evt) => {
    connection.socket.send(JSON.stringify(evt));
  });
  connection.socket.on('close', () => sub());
});

await fastify.listen({ port: 3000 });
console.log('Server listening on http://localhost:3000');