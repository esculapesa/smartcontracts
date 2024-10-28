const MyContract = artifacts.require("WrappedNT");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

