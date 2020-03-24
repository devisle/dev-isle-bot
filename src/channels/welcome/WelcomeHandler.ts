import { Client, Message, PartialMessage, MessageReaction, TextChannel, Channel, User } from "discord.js";
import IChannel from "../IChannel";
import RoleService from "../../services/RoleService";

export default class WelcomeHandler implements IChannel {
    /**
     * The original client obj
     */
    public readonly CLIENT: Client;

    /**
     * A reference to the #welcome channel
     */
    private _welcomeChannel: TextChannel;

    /**
     * Last message sent in _welcomeChannel
     * // may possible replace this with a hardcoded message ID
     */
    private _lastMessageSent: Message;

    constructor(client: Client) {
        this.CLIENT = client;
    }

    /**
     * Sets up all events included
     */
    public setupEvents(): void {
        this.setupReadyEvents();
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
    }

    private setupReadyEvents(): void {
        this.CLIENT.on("ready", () => {
            // welcome 584307025354424340
            // test 691326089628221532

            // set channel reference
            this._welcomeChannel = this.CLIENT.channels.resolve("691326089628221532") as TextChannel;
            // grab last sent message (there will only be one obviously in the welcome channel)
            this._welcomeChannel.messages.fetch(this._welcomeChannel.lastMessageID).then(msg => {
                console.log(msg);
                this._lastMessageSent = msg;
            });
        });
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

The GitGub org URL: https://github.com/devisle

Thanks, Nate.

**Please enter your area(s) of expertise to continue**:
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
        this.CLIENT.on("messageReactionAdd", (msgReaction: MessageReaction, user: User) => {
            this.attemptToSetUsersRole(msgReaction, user);
        });
    }

    // checks the last message exists, if it does, proceed to attempt to set their role
    private attemptToSetUsersRole(msgReaction: MessageReaction, user: User): void {
        const channel = (msgReaction.message.channel) as TextChannel;
        // console.log(messageReaction.emoji);
        // ensure we've got the last message sent before allowing user to react
        if (this._lastMessageSent === undefined && channel === this._welcomeChannel) {
            msgReaction.remove();
        } else {
            msgReaction.message === this._lastMessageSent ? RoleService.setCorrectExpertiseRole(msgReaction, user, this.CLIENT)
            : console.log("give no role");
        }
    }

}
