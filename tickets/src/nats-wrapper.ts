import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // we see an error here! TS claims missing _client is not initialized
  // we don't want to do that here => add ?
  private _client?: Stan;

  // that defines the client property on the instance => see how this is gonna 
  // used in new.ts
  // this is a getter !!!!
  get client(){
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting!');
    }

    return this._client;
  }

  connect(clusterId:string,clientId:string,url:string){
    this._client = nats.connect(clusterId,clientId,{ url });

    return new Promise<void>((resolve,reject) => {
      this._client!.on('connect',() => {
        console.log('Connected to NATS')
        resolve();
      })
      this._client!.on('error', (err) => {
        reject(err);
      })
    })
  }
}

export const natsWrapper = new NatsWrapper();