const contracts = ["HolonToken", "INTToken", "InfareToken", "EsculapToken", "EsaCoinToken", "HolopediaToken", "HetherToken", "HetherMEXToken"];

module.exports = async function (deployer) {
    for (const contractName of contracts) {
        const Contract = artifacts.require(contractName);
        await deployer.deploy(Contract);
    }
};