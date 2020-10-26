# Command List

## Shared Commands

- `!about`
  - Gives a brief description of the bot
- `!help`
  - Links this page
- `!roll #d# + # (et al)`
  - will roll a number of dice (`#d`) of type (`d#`) and add any flat numbers in addition (`+ #`)
  - e.g.:
      - `2d3+5d8+1+3 Result: 33`

## Discord Commands

## Twitch Commands

- `!quote`
  - returns a random quote from the quote database
  - optionally, you can specify a number to retrieve a specific quote
    - e.g. `!quote 10`

## Custom Commands

- Custom commands will be shared between Discord and Twitch
- Cannot overwrite built-in commands
- They are formatted with a simple ```command -> response```
- Adding:
  - ```!<command> add <response>```
- Updating:
  - ```!<command> update <response>```
- Deleting:
  - ```!<command> delete```
- Calling:
  - ```!<command>```
- e.g.:
  - ```!hello add konnichiwa```
  - ```!hello update olleh!```
  - ```!hello delete```

