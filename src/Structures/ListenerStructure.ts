import { Awaitable, ClientEvents } from 'darkcord';
import { Ryuzaki } from '../RyuzakiClient';

abstract class eventData<T extends keyof ClientEvents> {
    name: T;
    once: boolean;

    constructor(name: T) {
        this.name = name; 
        this.once = false;
    } 
}

abstract class ListenerStructure<Client extends Ryuzaki, Data extends eventData<any>> {
    client: Client;
    options: Data;

    constructor(client: Client, options: Data) {
        this.client = client;
        this.options = options;
    }

    execute(...args: any[]): Awaitable<any> {
        return { args };
    }
}

export { ListenerStructure, eventData };
