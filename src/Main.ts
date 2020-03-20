import { Client, Message, PartialMessage, TextChannel, Channel }  from "discord.js";
import dotenv from "dotenv";

class Main {
    private readonly _client = new Client();

    constructor() {
        dotenv.config();
        this._client.on("ready", () => {
            console.log(`Logged in as: ${this._client.user?.tag}`);

            /**
             * Message timers
             */
            // code-help
            this.createHourlyMessageLoop(this._client.channels.cache.get("624309965934428180"),
            "Remember to *ask* questions, there's no need to ask to ask! :smile:");

        });

        this._client.on("message", (msg => {
        }));

        this._client.login(process.env.BOT_TOKEN);
    }

    /**
     * Checks if the msg begins with "!"
     * @param msg Any message typed by a user in any channel
     */
    private checkMessageIsACommand(msg: Message | PartialMessage): Boolean {
        if (msg.content[0] === "!") {
            return true;
        }
        return false;
    }
    /**
     * Gets the channel name of a users typed message
     * @param msg Any message typed by a user in any channel
     */
    private getChannelName(msg: Message | PartialMessage): String {
        return (msg.channel as TextChannel).name;
    }

    /**
     * Creates a message loop to be run every hour at XX:00:00
     * @param channel the channel to send the message in - please only pass TextChannels
     * @param msg the message text to send
     */
    private createHourlyMessageLoop(channel: Channel, msg: String): void {
        const d = new Date();
        setInterval(() => {
            if ((channel as TextChannel).lastMessage?.content !== msg && d.getMinutes() === 0o0 && d.getSeconds() === 0o0) {
                (channel as TextChannel).send(msg);
            }
        }, 60000);
    }
}

new Main();


