import { CommandInteraction, Awaitable } from 'darkcord';
import { RyuDark } from '../RyuClient';

type commandRaw = {
    name: string;
    description: string;
    aliases: string[];
    config: {
        registerSlash: boolean,
        devOnly: boolean,
    };
}

abstract class CommandData {
    options: commandRaw;

    constructor(options: commandRaw) {
        this.options = options;
    }
}

abstract class CommandStructure<Client extends RyuDark, Data extends CommandData> {
    client: Client;
    data: Data;
    interaction?: CommandInteraction;

    constructor(client: Client, data: Data) {
        this.client = client;
        this.data = data;
    }

    execute(...args: any[]): Awaitable<any> {
        return { args };
    }
}

export { CommandStructure, CommandData };
