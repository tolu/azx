const {prompt} = require('inquirer');
const {desc: sortTags} = require('semver-sort');
const {
  showLoader,
  hideLoader
} = require('./loading');
const az = require('./az');

const setSubscriptionAction = async () => {
  showLoader('Fetching subscriptions...');
  const subscriptions = await az.getSubscriptions();
  hideLoader();
  prompt([{
    type: 'list',
    name: 'id',
    message: `Select az subscription`,
    choices: subscriptions,
    default: subscriptions.indexOf(subscriptions.find(s => s.isDefault))
  }])
    .then(({id}) => az.setSubscription(subscriptions.find(s => s.id === id)));
};

const getTagsAction = async () => {
  const state = {
    registry: null,
    repository: null
  };
  showLoader('Fetching acr registries...');
  const registries = await az.getContainerRegistries();
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
  const repositories = await az.getRegistryRepositories(state.registry.name);
  hideLoader();
  const {value} = await prompt([{
    type: 'list',
    name: 'value',
    message: `Select az registry`,
    choices: repositories
  }]);
  state.repository = value;

  showLoader('Fetching tags...');
  const tags = await az.getRepositoryTags(state.registry.name, state.repository);
  hideLoader();
  console.log(sortTags(tags));
};

/**
 * Select from available commands interactively
 */
const runCommandAction = async program => {
  const commands = program.commands
    .filter(c => c._name !== 'interactive') // Avoid recursion on this command
    .map(c => ({
      name: c._name,
      value: `command:${c._name}`
    }));
  const {command} = await prompt([{
    type: 'list',
    name: 'command',
    message: `Select command`,
    choices: commands
  }]);
  program.emit(command);
};

module.exports = {
  setSubscriptionAction,
  getTagsAction,
  runCommandAction
};
