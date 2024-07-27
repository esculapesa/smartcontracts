const MyContract = artifacts.require("HolopediaToken");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};

