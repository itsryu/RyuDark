import { RyuDark } from '../RyuClient';
import { ListenerStructure, CommandStructure } from '../Structures';
import { Constants, Message } from 'darkcord';

export default class MessageCreateListener extends ListenerStructure {
    constructor(client: RyuDark) {
        super(client, {
            name: Constants.Events.MessageCreate
        });
    }

    async execute(message: Message): Promise<any> {
        try {
            if (message.user.bot) return;

            if (message.content.match(this.client.utils.GetMention(this.client.user?.id as string))) {
                return message.reply(`Oi ${message.user}, o meu nome é ${this.client.user?.username}!`);
            }

            const prefix = process.env.PREFIX ?? 'r.';

            if (message.content.startsWith(prefix)) {
                const [name, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
                const command = this.client.commands.get(name) as CommandStructure || this.client.commands.find((command: CommandStructure) => command.data.options.aliases ? command.data.options.aliases && command.data.options.aliases.includes(name) : false);

                if (!command) {
                    return message.reply(`${message.user}, o comando: \`${name}\` não existe. Tente outro nome.`);
                }

                if (command.data.options.config.devOnly && !this.client.developers.some((id) => [id].includes(message.user.id))) {
                    return message.reply(`${message.user}, este comando \`${command.data.options.name}\` só pode ser executado pelos desenvolvedores do BOT.`);
                }

                await message.channel?.sendTyping();

                // Execução:
                const commandExecute = new Promise((resolve, reject) => {
                    try {
                        resolve(command.execute({ message, args, prefix }));
                    } catch (err) {
                        reject(err);
                    }
                });

                commandExecute.catch((err: Error) => {
                    this.client.logger.error(err.message, command.data.options.name);
                    this.client.logger.warn(err.stack as string, command.data.options.name);

                    return message.reply(`${message.user}, ocorreu um erro ao executar o comando: \`${command.data.options.name}\`, os desenvolvedores já estão ciente do problema, tente novamente mais tarde.`);
                });
            }
        } catch (err) {
            this.client.logger.error((err as Error).stack as string, MessageCreateListener.name);
        }
    }
}