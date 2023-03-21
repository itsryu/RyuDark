import { Awaitable, ClientEvents } from 'darkcord';
import { RyuDark } from '../RyuClient';

type EventOptions = {
    name: keyof ClientEvents;
    once?: boolean;
};
export abstract class ListenerStructure {
    readonly client: RyuDark;
    readonly options: EventOptions;

    constructor(client: RyuDark, options: EventOptions) {
        this.client = client;
        this.options = options;
    }

    abstract execute(...args: ClientEvents[keyof ClientEvents]): Awaitable<void> | void;
}
