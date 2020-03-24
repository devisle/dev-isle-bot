import { Client, Message, PartialMessage, MessageReaction, User, GuildMember } from "discord.js";
/**
 * Novice Contributor
 * 691342664062337094
 *
 * 691422001146888232
 * Beginner Contributor
 *
 * Competent Contributor
 * 691421991256719482
 *
 * Proficient Contributor
 * 691425432368709682
 *
 * Expert Contributor
 * 691425440421642310
 *
 * ------------------------
 *
 * Front-End
 * 606176637544824853 role
 * 691650017936670750 icon
 *
 * Back-End
 * 606176851706249217 role
 * 691650381842743326 icon
 *
 * DevOps
 * 606176895071027200 role
 * 691650936040325130 icon
 *
 * UI/UX
 * 606176959105597440 role
 * 691650966503686165 icon
 */
export default class RoleService {

    public static setCorrectContributorRole(
        dbUser: { _id: string, userID: string, rolePoints: number },
        message: Message | PartialMessage): void {
        const points = dbUser.rolePoints;
        switch (true) {
            case (points <= 10):
                message.member.roles.add("691422001146888232");
                break;
            case (points <= 30):
                message.member.roles.remove("691422001146888232");
                message.member.roles.add("691342664062337094");
                break;
            case (points <= 60):
                message.member.roles.remove("691342664062337094");
                message.member.roles.add("691421991256719482");
                break;
            case (points <= 100):
                message.member.roles.remove("691421991256719482");
                message.member.roles.add("691425432368709682");
                break;
            case (points <= 150):
                message.member.roles.remove("691425432368709682");
                message.member.roles.add("691342664062337094");
                break;
            case (points <= 210):
                message.member.roles.remove("691342664062337094");
                message.member.roles.add("691425440421642310");
                break;

        }
    }

    public static setCorrectExpertiseRole(msgReaction: MessageReaction, user: User, client: Client, addOrRemove: string): void {
        const guildUser: GuildMember = client.guilds.cache.last(1)[0].member(user.id);

        switch (msgReaction.emoji.id) {
            // fe
            case "691650017936670750":
                addOrRemove === "add" ?
                    guildUser.roles.add("606176637544824853")
                :
                    guildUser.roles.remove("606176637544824853");
                break;
            // be
            case "691650381842743326":
                addOrRemove === "add" ?
                    guildUser.roles.add("606176851706249217")
                :
                    guildUser.roles.remove("606176851706249217");
                break;
            // de
            case "691650936040325130":
                addOrRemove === "add" ?
                    guildUser.roles.add("606176895071027200")
                :
                    guildUser.roles.remove("606176895071027200");
                break;
            // ui
            case "691650966503686165":
                addOrRemove === "add" ?
                    guildUser.roles.add("606176959105597440")
                :
                    guildUser.roles.remove("606176959105597440");
                break;

        }
    }

}
