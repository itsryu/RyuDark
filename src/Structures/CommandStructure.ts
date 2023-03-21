import { CommandInteraction, Awaitable, Message } from 'darkcord';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { RyuDark } from '../RyuClient';

interface commandRawData extends RESTPostAPIChatInputApplicationCommandsJSONBody {
    aliases?: string[];
    config: {
        registerSlash?: boolean,
        devOnly?: boolean,
    };
}

interface CommandExecuteOptions {
    message?: Message | CommandInteraction;
    args?: string[];
    prefix?: string;
}
export abstract class CommandData {
    options: commandRawData;

    constructor(options: commandRawData) {
        this.options = options;
    }
}

export abstract class CommandStructure {
    readonly client: RyuDark;
    readonly data: CommandData;

    constructor(client: RyuDark, data: CommandData) {
        this.client = client;
        this.data = data;
    }

    abstract execute({ ...args }: CommandExecuteOptions): Awaitable<any>;
}