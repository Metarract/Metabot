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
BOT_TOKEN=insertTokenStringHere
```

This token can be found in the [Discord developer portal](https://discordapp.com/developers/applications) in the bot you've created under your application. Alternatively, setting it as an environment variable will also work.

### Adding new commands

Commands are listed under the ```commands.ts```. Each command should have a value in the enum and a corresponding entry in the ```commandDescriptions``` variable. Entries are formatted thus:

```javascript
commandName: {
  '': '# Description for running the command with no parameters'
  'other parameters': '# Description of command with provided parameters'
}
```

\# provides some nice color formatting for clarity.
