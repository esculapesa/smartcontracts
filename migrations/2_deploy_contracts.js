const MyContract = artifacts.require("HetherMEXToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

