const MyContract = artifacts.require("INTToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

