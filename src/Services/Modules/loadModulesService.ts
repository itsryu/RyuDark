import { RyuDark } from '../../RyuClient';
import { ListenerStructure, CommandStructure, ServiceStructure } from '../../Structures';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export default class loadModulesService extends ServiceStructure {
    constructor(client: RyuDark) {
        super(client, {
            name: 'loadModules',
            initialize: true
        });
    }

    async serviceExecute() {
        await this.loadEvents(); // Carregar os módulos de eventos;
        await this.loadCommands(); // Carregar os módulos de comandos;
    }

    private async loadCommands(): Promise<void> {
        const commandFolders = readdirSync(join(__dirname, '../../Commands'));

        const commands = commandFolders.map(async (folder) => {
            const commandFiles = (await readdirSync(join(__dirname, '../../Commands/', folder))).filter((file) => file.endsWith('.js'));

            const folderCommands = await Promise.all(
                commandFiles.map(async (file) => {
                    try {
                        const { default: CommandClass }: { default: new (client: RyuDark) => CommandStructure } = await import(join(__dirname, '../../Commands', folder, file));
                        const command = new CommandClass(this.client);

                        this.client.commands.set(command.data.options.name, command);
                    } catch (err) {
                        return this.client.logger.error(`Erro ao carregar o comando ${file}: ${(err as Error).stack}`, loadModulesService.name);
                    }
                })
            );

            return folderCommands;
        });

        await Promise.allSettled(commands);
        this.client.logger.info(`${commands.length} comandos carregados com sucesso.`, 'Comandos');
    }

    private async loadEvents(): Promise<void> {
        const eventFiles = readdirSync(join(__dirname, '../../Listeners/')).filter((file) => file.endsWith('.js'));

        const events = eventFiles.map(async (file) => {
            try {
                const { default: EventClass }: { default: new (client: RyuDark) => ListenerStructure } = await import(join(__dirname, '../../Listeners/', file));
                const event = new EventClass(this.client);

                event.options.once ?
                    this.client.once(event.options.name, (...args) => event.execute(...args)) :
                    this.client.on(event.options.name, (...args) => event.execute(...args));
                    
            } catch (err) {
                return this.client.logger.error(`Erro ao carregar o evento ${file}: ${(err as Error).stack}`, loadModulesService.name);
            }
        });

        await Promise.allSettled(events);
        return this.client.logger.info(`${events.length} eventos carregados com sucesso.`, 'Eventos');
    }
}