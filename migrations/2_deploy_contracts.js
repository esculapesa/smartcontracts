const MyContract = artifacts.require("EsaCoinToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

