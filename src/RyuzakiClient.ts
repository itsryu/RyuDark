import { Client, ClientOptions, ClientEvents, Cache } from 'darkcord'; // BIBLIOTECA EM CONSTANTE ATUALIZAÇÃO!
import { ListenerStructure, CommandStructure, CommandData } from './Structures';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Logger, Utils } from './Utils/utils';

export class Ryuzaki extends Client {
    logger: Logger;
    utils: Utils;
    commands: Cache<CommandStructure<Ryuzaki, CommandData>>;
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

    async loadCommands(client: Ryuzaki) {
        const commandFiles: string[] = [];
        const commandFolders = await readdirSync(join(__dirname, 'Commands'));

        for (const folder of commandFolders) {
            const files = await readdirSync(join(__dirname, 'Commands', folder));
            commandFiles.push(...files.filter((file) => file.endsWith('.js')));
        }

        const commands = await Promise.all(
            commandFiles.map(async (command) => {
                try {
                    const { default: CommandClass }: { default: new (client: Ryuzaki) => CommandStructure<Ryuzaki, CommandData> } = await import(`./Commands/${commandFolders}/${command}`);
                    const cmd = new CommandClass(client);

                    client.commands.set(cmd.data.options.name, cmd);
                } catch (err) {
                    return client.logger.error(`Erro ao carregar o comando ${command}: ${(err as Error).stack}`);
                }
            })
        );

        client.logger.info(`${commands.length} commands loaded successfully.`, 'Commands');
    }


    async loadEvents(client: Ryuzaki) {
        type EventOptions = {
            name: keyof ClientEvents;
            once: boolean;
        };

        const eventFiles = readdirSync(join(__dirname, 'Listeners')).filter((file) => file.endsWith('.js'));
        const promises = eventFiles.map(async (file) => {

            const { default: EventClass }: { default: new (client: Ryuzaki) => ListenerStructure<Ryuzaki, EventOptions> } = await import(join(__dirname, 'Listeners', file));
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
