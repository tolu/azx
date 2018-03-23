const program = require('commander');
// @ts-ignore
const version = require('../package.json').version;
const {
  setSubscriptionAction,
  getTagsAction,
  runCommandAction
} = require('./actions');

program.name('azx');

program
  .version(version, '-v, --version')
  .usage('[command] [options]')
  .description('Interactive <az> helper');

program
  .command('set-subscription')
  .description('select az subscription')
  .alias('s')
  .action(setSubscriptionAction);

program
  .command('get-tags')
  .description('list tags for image in acr')
  .alias('gt')
  .action(getTagsAction);

program
  .command('interactive')
  .description('select from available commands interactively')
  .alias('i')
  .action(() => runCommandAction(program));

program.parse(process.argv);

// Default to showing help
if (program.args.length === 0) {
  program.help();
}
