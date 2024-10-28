const MyContract = artifacts.require("GLDToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

