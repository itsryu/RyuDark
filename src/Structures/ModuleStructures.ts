import { RyuDark } from '../RyuClient';

export abstract class ModuleStructure {
    client: RyuDark;

    constructor(client: RyuDark) {
        this.client = client;
    }

    abstract execute(...args: any[]): Promise<void> | void;
}