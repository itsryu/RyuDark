import { RyuDark } from '../RyuClient';
import { ListenerStructure, EventOptions } from '../Structures/ListenerStructure';
import { Constants } from 'darkcord';

export default class ReadyListener extends ListenerStructure<RyuDark, EventOptions> {
    constructor(client: RyuDark) {
        super(client, {
            name: Constants.Events.Ready,
            once: true
        });
    }

    execute() {
        try {
            this.client.logger.info(`${this.client.user?.username} has been loaded completely and it's in ${this.client.guilds.cache.size} guilds.`, 'Ready');
        } catch (err: unknown) {
            this.client.logger.error(String((err as Error).stack), ReadyListener.name);
        }
    }
}