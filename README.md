# Metabot

## CONTRIBUTING

PRs are enabled for the ```master``` branch. Commit your branch and make a PR into ```master``` for review.

## TESTING

Testing is done with ```ts-jest``` using the ```npm test``` script.

## DEVELOPMENT

### Local setup

The ```.devcontainer``` is used with the [Remote Development Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) (requires Docker). Reopening this folder in a container using the extension will install node and the node_modules into the container. Otherwise, the latest node 10+ should do.

This repository utilizes ```dotenv``` locally and as such requires a ```.env``` file with the following variables:

```none
DISCORD_BOT_TOKEN=<token string>
TWITCH_BOT_SECRET=<client secret>
TWITCH_BOT_CLIENT_ID=<client id>
TWITCH_BOT_USERNAME=<bot username>
TWITCH_BOT_TOKEN=<oauth:token>
TWITCH_BOT_CHANNELS=<comma,separated,channel,list>
```

Naturally, any of these secrets can be listed as environment variables on your executing node as well.

The Discord token can be found in the [Discord Developer Portal](https://discordapp.com/developers/applications) in the bot you've created under your application.

Twitch secret + client id can be found under the [Twitch Developer Console](https://dev.twitch.tv/console) under the bot you've created. Your oauth token must be generated under the bot account you will be logging in as, [here](https://twitchapps.com/tmi/).

### Adding new commands

Commands are called under ```lib.ts``` and defined in ```commands.ts```. Each command should have a corresponding entry in the ```COMMANDS.md``` file.
