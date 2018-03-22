# azx
Interactive cli helper for Azure CLI 2

Implements interactive flows for selecting data (just `show-tags` right now)


You'll need to have [`az`](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) installed in path

> There are som issues that needs to be solved here on windows  
> where I have to set the command to the absolute path...

## Install

```
$ npm i -g azx
```

## Usage

```
$ azx -h

  Usage: azx [command] [options]

  Interactive <az> helper

  Options:

    -v, --version       output the version number
    -d, --debug         verbose output
    -h, --help          output usage information

  Commands:

    set-subscription|s  select az subscription
    get-tags|gt         list tags for image in acr
```

### What it looks like
Select subscription  
![select subscription](./gifs/s-example.gif)

List tags in acr repository  
![select subscription](./gifs/gt-example.gif)


## Dependencies

 - [commander](https://www.npmjs.com/package/commander) - solution for building node.js cli
 - [inquirer](https://www.npmjs.com/package/inquirer) - interactive cli lists
 - [clui](https://www.npmjs.com/package/clui) - cli spinner

## Inspiration

 - https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
 - https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

## License

MIT @ https://tolu.mit-license.org/
