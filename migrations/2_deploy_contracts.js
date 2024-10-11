const MyContract = artifacts.require("HashedTimelock");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

