const MyContract = artifacts.require("HetherToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

