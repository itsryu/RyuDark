import { Ryuzaki } from '../RyuzakiClient';
import { ListenerStructure, eventData } from '../Structures/ListenerStructure';
import { Constants } from 'darkcord';

export default class ReadyListener extends ListenerStructure<Ryuzaki, eventData<Constants.Events.Ready>> {
    constructor(client: Ryuzaki) {
        super(client, {
            name: Constants.Events.Ready,
            once: true
        });
    }

    execute() {
        try {
            this.client.logger.info(`${this.client.user?.username} has been loaded completely and it's in ${this.client.guilds.cache.size} guilds.`, 'Ready');
        } catch (err: Error | any) {
            this.client.logger.error(String(err.stack), ReadyListener.name);
        }
    }
}