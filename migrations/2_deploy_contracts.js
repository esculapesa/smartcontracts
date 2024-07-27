const MyContract = artifacts.require("InfareToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

