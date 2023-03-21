import { Client, ClientOptions, Cache } from 'darkcord';
import { CommandStructure, ServiceStructure } from './Structures';
import { Logger, Utils } from './Utils/utils';
export class RyuDark extends Client {
    readonly logger: Logger;
    readonly utils: Utils;
    readonly commands: Cache<CommandStructure>;
    readonly services: Cache<ServiceStructure>;
    readonly developers: ReadonlyArray<string>;

    constructor(token: string, options: ClientOptions) {
        super(token, options);

        this.commands = new Cache();
        this.services = new Cache();
        this.logger = new Logger();
        this.utils = new Utils();
        this.developers = Object.freeze(['1059915193309737030']); // Seu ID, ou de outros desenvolvedores;
    }

    async initialize(): Promise<void> {
        await super.connect(); // Estabelecer conexão com o gateway;
        await this.clientManager(); // Carrega todos os módulos do Client;

        process.on('uncaughtException', (err: Error) => this.logger.error(err.stack as string));
        process.on('unhandledRejection', (err: Error) => this.logger.error(err.stack as string));
    }

    private async clientManager(): Promise<void> {
        const { default: servicesIndex } = await import('./Services/index');
        new servicesIndex(this).execute();
    }
}