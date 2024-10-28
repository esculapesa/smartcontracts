const MyContract = artifacts.require("WrappedNativeToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

