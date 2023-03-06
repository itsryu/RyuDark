import { Client, ClientOptions, Cache } from 'darkcord'; // BIBLIOTECA EM CONSTANTE ATUALIZAÇÃO!
import { ListenerStructure, CommandStructure, CommandData, EventOptions } from './Structures';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Logger, Utils } from './Utils/utils';

export class RyuDark extends Client {
    logger: Logger;
    utils: Utils;
    commands: Cache<CommandStructure<RyuDark, CommandData>>;
    developers: string[];

    constructor(token: string, options: ClientOptions) {
        super(token, options);

        this.commands = new Cache();
        this.logger = new Logger();
        this.utils = new Utils();
        this.developers = ['1059915193309737030']; // Seu ID, ou de outros desenvolvedores;
    }

    async initialize() {
        this.loadCommands(this); // Carregar os módulos de comandos;
        this.loadEvents(this); // Carregar os módulos de eventos;
        await super.connect(); // Estabelecer conexão com o gateway;

        process.on('uncaughtException', (err: Error) => this.logger.error((err as Error).message));
        process.on('unhandledRejection', (err: Error) => this.logger.error((err as Error).message));
    }

    async loadCommands(client: RyuDark) {
        const commandFolders = await readdirSync(join(__dirname, 'Commands'));

        const commands = await Promise.all(
            commandFolders.map(async (folder) => {
                const commandFiles = (await readdirSync(join(__dirname, 'Commands', folder)))
                    .filter((file) => file.endsWith('.js'));

                const folderCommands = await Promise.all(
                    commandFiles.map(async (command) => {
                        try {
                            const { default: CommandClass }: { default: new (client: RyuDark) => CommandStructure<RyuDark, CommandData> } = await import(join(__dirname, 'Commands', folder, command));
                            const cmd = new CommandClass(client);

                            client.commands.set(cmd.data.options.name, cmd);
                            return cmd;
                        } catch (err) {
                            return client.logger.error(`Erro ao carregar o comando ${command}: ${(err as Error).stack}`);
                        }
                    })
                );

                return folderCommands;
            })
        ).then((commands) => commands.flat());

        client.logger.info(`${commands.length} comandos carregados com sucesso.`, 'Comandos');
    }


    async loadEvents(client: RyuDark) {
        const eventFiles = readdirSync(join(__dirname, 'Listeners')).filter((file) => file.endsWith('.js'));
        const promises = eventFiles.map(async (file) => {

            const { default: EventClass }: { default: new (client: RyuDark) => ListenerStructure<RyuDark, EventOptions> } = await import(join(__dirname, 'Listeners', file));
            const event = new EventClass(client);

            if (event.options.once) {
                client.once(event.options.name, (...args: any[]) => event.execute(...args));
            } else {
                client.on(event.options.name, (...args: any[]) => event.execute(...args));
            }
        });

        await Promise.allSettled(promises);
        client.logger.info('Events loaded successfully.', 'Events');
    }
}
