var Manage = artifacts.require("./Manage.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Manage);
};
