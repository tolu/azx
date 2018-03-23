const execa = require('execa');

const setSubscription = async subscription => {
  await execFn(['account', 'set', '-s', subscription.id]);
  console.log('Subscription set to', subscription.id);
};

const getSubscriptions = async () => {
  const stdout = await execFn(['account', 'list']);
  const json = JSON.parse(stdout);
  return json.map(s => ({
    name: `${s.name} (${s.user.name})`,
    value: s.id,
    id: s.id,
    isDefault: s.isDefault
  }));
};

/**
 * @returns {Promise<{name: string, value: string}[]>}
 */
const getContainerRegistries = async () => {
  const stdout = await execFn(['acr', 'list']);
  const json = JSON.parse(stdout);
  return json.map(s => ({
    name: s.name,
    value: s.resourceGroup
  }));
};

/**
 * @param {string} acrName
 * @returns {Promise<string[]>}
 */
const getRegistryRepositories = async acrName => {
  const stdout = await execFn(['acr', 'repository', 'list', '-n', acrName]);
  return JSON.parse(stdout);
};

/**
 * @param {string} acrName
 * @param {string} repository
 * @returns {Promise<string[]>}
 */
const getRepositoryTags = async (acrName, repository) => {
  const stdout = await execFn(['acr', 'repository', 'show-tags', '-n', acrName, '--repository', repository]);
  return JSON.parse(stdout);
};

const command = process.platform.startsWith('win') ? 'az.cmd' : 'az';
async function execFn(args) {
  return await execa.stdout(command, args);
}

module.exports = {
  getSubscriptions,
  setSubscription,
  getContainerRegistries,
  getRegistryRepositories,
  getRepositoryTags
};
