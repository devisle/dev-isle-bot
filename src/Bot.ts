import { Client, GuildMember, PartialGuildMember } from "discord.js";
import dotenv from "dotenv";
import CodeHelpHandler from "./channels/code-help/CodeHelpHandler";

class Bot {
    /**
     * The base Discord.js client
     */
    private readonly _client: Client = new Client();

    constructor() {
        dotenv.config();
        /**
         * Welcome message
         */
        this._client.on("guildMemberAdd", (member: GuildMember | PartialGuildMember) => {
            console.log(`Welcome to Dev Isle ${member.displayName}!`);
        });
        /**
         * Setup channel handlers
         */
        new CodeHelpHandler(this._client);
        this._client.login(process.env.BOT_TOKEN);
    }

}

new Bot();


