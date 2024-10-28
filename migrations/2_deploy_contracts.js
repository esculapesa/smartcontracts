const MyContract = artifacts.require("HolonToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

