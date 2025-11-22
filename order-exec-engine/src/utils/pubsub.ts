// very small in-memory pubsub used for demo; in prod use Redis pubsub
const subs = new Map<string, Set<(e:any)=>void>>();
export function publishOrderEvent(orderId:string, evt:any){
  const set = subs.get(orderId);
  if(set) for(const cb of set) cb(evt);
}
export function subscribeToOrder(orderId:string, cb:(e:any)=>void){
  let set = subs.get(orderId);
  if(!set){ set = new Set(); subs.set(orderId,set); }
  set.add(cb);
  return () => { set!.delete(cb); };
}