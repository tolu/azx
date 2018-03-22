const {platform} = require('os');
const path = require('path');
const {spawn, spawnSync} = require('child_process');

let cmd = 'az';
if (platform() === 'win32') {
  // HACK: must figure out why it does not work to run az when in path...
  // fails in git bash AND regular cmd
  cmd = path.join('c:', 'Program Files (x86)', 'Microsoft SDKs', 'Azure', 'CLI2', 'wbin', 'az.cmd');
} else if (!spawnSync('which', ['az'])) {
  throw new Error('Could not found "az" in path...');
}

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

function execFn(args) {
  let response = '';
  return new Promise((resolve, reject) => {
    // Console.log(`Spawn: "az ${args.join(' ')}"`)
    const p = spawn(cmd, args);
    p.stderr.on('data', reject);
    p.stdout.on('data', data => {
      response += data;
    });
    p.on('close', () => resolve(response.trim()));
  });
}

module.exports = {
  getSubscriptions,
  setSubscription,
  getContainerRegistries,
  getRegistryRepositories,
  getRepositoryTags
};
