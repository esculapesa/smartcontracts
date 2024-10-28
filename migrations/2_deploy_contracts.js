const MyContract = artifacts.require("WrappedNAT");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

