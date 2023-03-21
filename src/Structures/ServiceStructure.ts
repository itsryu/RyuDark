import { RyuDark } from '../RyuClient';

interface serviceData {
    name: string;
    initialize: boolean;
    amount?: number;
    interval?: number;
    wait?: number;
}

export abstract class ServiceStructure {
    client: RyuDark;
    options: serviceData;

    constructor(client: RyuDark, options: serviceData) {
        this.client = client;
        this.options = options;
    }

    abstract serviceExecute(...args: any[]): Promise<void> | void;
}