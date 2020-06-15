import {
  Client,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";
import CodeHelpHandler from "./channels/code-help/CodeHelpHandler";
import WelcomeHandler from "./channels/welcome/WelcomeHandler";

class Bot {
  /**
   * The base Discord.js client
   */
  private readonly _client: Client = new Client();
  /**
   * An array that contains a collection of welcome messages
   */
  private readonly _welcomeMessageArr: string[][];

  constructor() {
    dotenv.config();

    this._welcomeMessageArr = [
      ["Welcome to Dev Isle ", "name"],
      [
        "We have a developer and their name is ",
        "name",
        " give them a warm welcome!",
      ],
      ["name", " has landed, they're gonna fook sheit up!"],
      [
        "Why did the chicken cross the road? To see",
        "name",
        " join the server :P",
      ],
      ["Get ready because ", "name", " is here"],
    ];

    /**
     * Welcome message
     */
    this._client.on(
      "guildMemberAdd",
      async (member: GuildMember | PartialGuildMember) => {
        console.log(`Welcome to Dev Isle ${member.displayName}!`);
        ((await this._client.channels.resolve(
          "557983656908685325"
        )) as TextChannel).send(
          this.selectRandomWelcomeMessage(member.displayName)
        );
      }
    );

    /**
     * Setup channel handlers
     */
    new CodeHelpHandler(this._client).setupEvents();
    new WelcomeHandler(this._client).setupEvents();
    this._client.login(process.env.BOT_TOKEN);
  }

  /**
   * Selects a random welcome message from the message array field
   * and injects the users name into the message, finally returning the flattened string array
   */
  private selectRandomWelcomeMessage(username: string): string {
    const messageIndex =
      Math.ceil(Math.random() * this._welcomeMessageArr.length) - 1;
    const message = this._welcomeMessageArr[messageIndex];
    const nameIndex = message.findIndex((value) => {
      return value === "name";
    });

    message[nameIndex] = username;
    return message.join("");
  }
}

new Bot();
