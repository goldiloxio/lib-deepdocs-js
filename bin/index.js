#!/usr/bin/env node

const yargs = require('yargs');
const commands = require('../lib/commands').default;
const version = require('../package').version;

const usageMsg = `Usage:
  # generate markdown documentation for every folder level that contains comments-doc
  $0 build --path ./src`;

const argv = yargs
  .command(commands.build)
  .fail((msg, error) => {
    if (error) {
      throw error;
    } else {
      console.error(msg); // eslint-disable-line no-console
      return yargs.exit(1);
    }
  })
  .version(() => version)
  .usage(usageMsg)
  .recommendCommands()
  .help().argv;

if (!argv) {
  yargs.showHelp('error');
  process.exit(1);
}
