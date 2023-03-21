import { ListenerStructure } from '../Structures';
import { RyuDark } from '../RyuClient';
import { Constants } from 'darkcord';
export default class ReadyListener extends ListenerStructure {
    constructor(client: RyuDark) {
        super(client, {
            name: Constants.Events.Ready,
            once: true
        });
    }

    async execute() {
        try {
            const commandsArray = Array.from(this.client.commands.values(), (command) => ({
                name: command.data.options.name,
                description: command.data.options.description,
                options: command.data.options.options
            }));

            await this.client.application?.bulkOverwriteCommands(commandsArray);

            return this.client.logger.info(`${this.client.user?.username} has been loaded completely and it's in ${this.client.guilds.cache.size} guilds.`, 'Ready');
        } catch (err: any) {
            return this.client.logger.error(err.stack, ReadyListener.name);
        }
    }
}