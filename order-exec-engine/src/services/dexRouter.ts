import { MockDex } from './mockDex';

export async function getBestQuoteAndExecute(order:any){
  const [r, m] = await Promise.all([
    MockDex.getRaydiumQuote(order.tokenIn, order.tokenOut, order.amount),
    MockDex.getMeteoraQuote(order.tokenIn, order.tokenOut, order.amount),
  ]);
  const chosen = r.price <= m.price ? r : m;
  console.info(`Routing decision for ${order.id}: ray=${r.price.toFixed(6)} meta=${m.price.toFixed(6)} -> chose ${chosen.dex}`);
  const exec = await MockDex.executeSwap(chosen.dex, order);
  return { ...exec, dex: chosen.dex };
}