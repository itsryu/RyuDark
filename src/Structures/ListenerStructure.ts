import { Awaitable, ClientEvents } from 'darkcord';
import { RyuDark } from '../RyuClient';

type EventOptions = {
    name: keyof ClientEvents;
    once: boolean;
};

abstract class eventData<T extends EventOptions> {
    name: T['name'];
    once: T['once'];

    constructor(options: T) {
        this.name = options.name; 
        this.once = options.once;
    } 
}

abstract class ListenerStructure<Client extends RyuDark, Data extends eventData<EventOptions>> {
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

export { ListenerStructure, eventData, EventOptions };
