# Order Exec Engine (No Docker)

This version runs entirely on your machine with no Docker or external services.

Prereqs: Node.js >= 18, npm.

1. Create project folder and paste files from this scaffold.
2. Run `npm install`.
3. Start server: `npm run dev` (listens on http://localhost:3000).
4. Worker is integrated into the in-memory queue; you can also start `npm run worker` for a separate process (not required).

Submit an order (terminal):
curl -s -X POST http://localhost:3000/api/orders/execute -H "Content-Type: application/json" -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1}' | jq


Connect with WebSocket to watch updates (replace ORDER_ID):
wscat -c ws://localhost:3000/ws/ORDER_ID
Expected WS messages:
- {status: 'pending'}
- {status: 'routing'}
- {status: 'submitted', txHash}
- {status: 'confirmed', txHash, executedPrice}

Order history is appended to `order_history.json` in project root for post-mortem.

Reference to original brief (local): `/mnt/data/Backend Task 2_ Order Execution Engine.pdf`.
