#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');
const {desc: sortTags} = require('semver-sort');
const {
  showLoader,
  hideLoader
} = require('./loading');
const {
  getSubscriptions,
  setSubscription,
  getContainerRegistries,
  getRegistryRepositories,
  getRepositoryTags
} = require('./az');
// @ts-ignore
const version = require('./package.json').version;

program.name('azx');

program
  .version(version, '-v, --version')
  .usage('[command] [options]')
  .description('Interactive <az> helper');

program
  .command('set-subscription')
  .description('select az subscription')
  .alias('s')
  .action(async () => {
    showLoader('Fetching subscriptions...');
    const subscriptions = await getSubscriptions();
    hideLoader();
    prompt([{
      type: 'list',
      name: 'id',
      message: `Select az subscription`,
      choices: subscriptions,
      default: subscriptions.indexOf(subscriptions.find(s => s.isDefault))
    }])
      .then(({id}) => setSubscription(subscriptions.find(s => s.id === id)));
  });

program
  .command('get-tags')
  .description('list tags for image in acr')
  .alias('gt')
  .action(async () => {
    const state = {
      registry: null,
      repository: null
    };
    showLoader('Fetching acr registries...');
    const registries = await getContainerRegistries();
    hideLoader();
    // Auto-select if only one available
    if (registries.length > 1) {
      const {value} = await prompt([{
        type: 'list',
        name: 'value',
        message: `Select az registry`,
        choices: registries
      }]);
      state.registry = registries.find(r => r.value === value);
    } else {
      console.log('Auto selected registry...');
      state.registry = registries[0];
    }
    showLoader('Fetching acr repositories...');
    const repositories = await getRegistryRepositories(state.registry.name);
    hideLoader();
    const {value} = await prompt([{
      type: 'list',
      name: 'value',
      message: `Select az registry`,
      choices: repositories
    }]);
    state.repository = value;

    showLoader('Fetching tags...');
    const tags = await getRepositoryTags(state.registry.name, state.repository);
    hideLoader();
    console.log(sortTags(tags));
  });

program.parse(process.argv);

// Default to showing help
if (program.args.length === 0) {
  program.help();
}
