const BulkTransfer = artifacts.require("BulkTransfer");

module.exports = async function (deployer) {
    await deployer.deploy(BulkTransfer);
    console.log("Deployed BulkTransfer contract");
};
