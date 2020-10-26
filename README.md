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
TWITCH_BOT_USERNAME=<twitch user>
TWITCH_BOT_TOKEN=oauth:<oauth token>
TWITCH_BOT_CHANNELS=<comma,separated,channel,list>
```

This token can be found in the [Discord developer portal](https://discordapp.com/developers/applications) in the bot you've created under your application. Alternatively, setting it as an environment variable will also work.

### Adding new commands

Commands are called under ```lib.ts``` and defined in ```commands.ts```. Each command should have a corresponding entry in the ```COMMANDS.md``` file.
