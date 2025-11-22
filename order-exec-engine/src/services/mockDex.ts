export async function sleep(ms: number){ return new Promise(r => setTimeout(r, ms)); }

export const MockDex = {
  async getRaydiumQuote(tokenIn:any, tokenOut:any, amount:number){
    await sleep(200 + Math.random()*200);
    const price = 1.0 * (0.98 + Math.random()*0.04);
    return { dex: 'raydium', price, fee: 0.003 };
  },
  async getMeteoraQuote(tokenIn:any, tokenOut:any, amount:number){
    await sleep(200 + Math.random()*200);
    const price = 1.0 * (0.97 + Math.random()*0.05);
    return { dex: 'meteora', price, fee: 0.002 };
  },
  async executeSwap(dex:string, order:any){
    await sleep(1000 + Math.random()*1000);
    return { txHash: `MOCK_${Date.now().toString(36)}`, executedPrice: (0.99 + Math.random()*0.02) };
  }
};