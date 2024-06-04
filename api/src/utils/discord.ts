import { REST, RESTGetAPIUserResult, Routes } from "discord.js";

export async function getDiscordId(
  accessToken: string,
): Promise<string> {
  const api = new REST({ version: '10', authPrefix: 'Bearer' }).setToken(accessToken);

  const user: RESTGetAPIUserResult = await (api.get(Routes.user()) as Promise<RESTGetAPIUserResult>);

  return user.id;
}