import { RyuDark } from '../RyuClient';
import { ModuleStructure, ServiceStructure } from '../Structures/';
import { readdirSync } from 'fs';
import { join } from 'path';

export default class Services extends ModuleStructure {
    constructor(client: RyuDark) {
        super(client);
    }

    async execute() {
        const serviceFolder = readdirSync(join(__dirname, 'Modules')).filter((file) => file.endsWith('.js'));

        const services = serviceFolder.map(async (file) => {
            const { default: serviceClass }: { default: new (client: RyuDark) => ServiceStructure } = await import(join( __dirname, 'Modules', file));
            const service = new serviceClass(this.client);

            if (service.options.name) {
                this.client.services.set(service.options.name, service);

                if (service.options.initialize) {
                    this.client.utils.executeService(service);
                }
            }
        });

        await Promise.allSettled(services);
        this.client.logger.info(`${services.length} módulos carregados com sucesso.`, 'Módulos');
    }
}