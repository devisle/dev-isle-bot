import { Client, Message, PartialMessage, MessageReaction, TextChannel, Emoji } from "discord.js";
import IChannel from "../IChannel";
import { checkMessageIsACommand } from "../../utils";

export default class WelcomeHandler implements IChannel {
    /**
     * The original client obj
     */
    public readonly CLIENT: Client;

    constructor(client: Client) {
        this.CLIENT = client;
    }

    /**
     * Sets up all events included
     */
    public setupEvents(): void {
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
    }

    /**
     * Sets up the message events
     */
    private setupMessageEvents(): void {
        this.CLIENT.on("message", ((msg: Message | PartialMessage) => {
            this.createReactaroleMessage(msg);
        }));
    }

    // just wanna note, I'm aware this only works in the welcome channel now. But it saves us
    // effort having to track the message ID's in the db lol or the app itself as say a config var
    // tTODO: create a full command line based solution
    private createReactaroleMessage(message: Message | PartialMessage) {
        if ((message.channel as TextChannel).name === "test" && message.content.substring(0, 11) === "!createrar") {
            const fe = this.CLIENT.emojis.cache.get("691650017936670750").toString();
            const be = this.CLIENT.emojis.cache.get("691650381842743326").toString();
            const de = this.CLIENT.emojis.cache.get("691650936040325130").toString();
            const ui = this.CLIENT.emojis.cache.get("691650966503686165").toString();
            message.channel.send(`
**Introduction**: ${"\r"}
Dev Isle is a community which works on small open source projects. We have found that this experience is invaluable no matter
how small your contributions are. In return for helping out, you will be able to have your name go on NPM and add this experience
on LinkedIn. For people actively searching for developer roles, open source contributions are highly esteemed and will separate you
out from the majority of newcomers and even some more experienced developers! So get involved, get started and feel free to ask for help.

Thanks, Nate.

**Please enter your area(s) of expertise**:
................................................

        ${fe} - Front-End

        ${be} - Back-End

        ${de} - DevOps

        ${ui} - UI/UX

................................................
            `).then(async msg => {
                // better way to do this...?
                await msg.react("691650017936670750");
                await msg.react("691650381842743326");
                await msg.react("691650936040325130");
                await msg.react("691650966503686165");
            });

        }


    }

    /**
     * Sets up the messageReactionAddEvents
     */
    private setupMessageReactionAddEvents(): void {
        this.CLIENT.on("messageReactionAdd", (messageReaction: MessageReaction) => {
            console.log(messageReaction.emoji);
        });
    }


}
