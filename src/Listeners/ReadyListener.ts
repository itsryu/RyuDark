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
            const commands = this.client.commands.filter((commands) => commands.data && commands.data.options.config.registerSlash === true); // Filtrando apenas por comandso que devem ser registrados.
            const commandsArray =  Array.from(commands.values(), (command) => ({
                name: command.data.options.name,
                description: command.data.options.description,
                options: command.data.options.options
            }));

            const registeredCommands = await this.client.application?.bulkOverwriteCommands(commandsArray); // Registrando todos os comandos :)
            this.client.logger.info(`${registeredCommands?.length ?? 0} comandos de barra (/) registrados com sucesso.`, 'Slash');
            return this.client.logger.info(`${this.client.user?.username} has been loaded completely and it's in ${this.client.guilds.cache.size} guilds.`, 'Ready');
        } catch (err) {
            return this.client.logger.error((err as Error).stack as string, ReadyListener.name);
        }
    }
}