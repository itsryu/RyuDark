import { RyuDark } from '../RyuClient';
import { CommandStructure, ListenerStructure } from '../Structures';
import { Constants, Interaction, CommandInteraction, ChatInputApplicationCommandInteractionData, ReplyableInteraction, MessagePostData } from 'darkcord';

export default class InteractionCreateListener extends ListenerStructure {
    constructor(client: RyuDark) {
        super(client, {
            name: Constants.Events.InteractionCreate
        });
    }

    async execute(interaction: Interaction) {
        try {
            if (interaction.isCommand()) {
                const args: string[] = [];
                const command = this.client.commands.get((interaction as CommandInteraction).commandName) as CommandStructure;

                ((interaction as CommandInteraction)?.data as ChatInputApplicationCommandInteractionData)?.options?.toArray().forEach((option) => {
                    if (option.value) {
                        args.push(option.value as string);
                    }
                });

                await (interaction as ReplyableInteraction).defer();

                const message = Object.assign(interaction, {
                    reply: async (content: MessagePostData) => await (interaction as ReplyableInteraction).createFollowUP(content),
                    edit: async (content: MessagePostData) => await (interaction as ReplyableInteraction).editOriginalReply(content),
                    delete: async () => await (interaction as ReplyableInteraction).deleteOriginalReply()
                });

                // Execução:
                const interactionExecute = new Promise((resolve, reject) => {
                    try {
                        resolve(command.execute({ message, args }));
                    } catch (err) {
                        reject(err);
                    }
                });

                interactionExecute.catch(async (err: Error) => {
                    this.client.logger.error(err.message, command.data.options.name);
                    this.client.logger.warn(err.stack as string, command.data.options.name);

                    return await interaction.reply( `${message.user}, ocorreu um erro ao executar o comando: \`${command.data.options.name}\`, os desenvolvedores já estão ciente do problema, tente novamente mais tarde.`);
                });
            }
        } catch (err) {
            return this.client.logger.error((err as Error).stack as string, InteractionCreateListener.name);
        }
    }
}