const EsaCoinToken = artifacts.require("EsaCoinToken");

const tokens = [
    { name: "TestToken", symbol: "TTN", initialSupply: "210000000" },
    { name: "testSecondToken", symbol: "TT2", initialSupply: "210000000" }
];

module.exports = async function (deployer) {
    for (const token of tokens) {
        await deployer.deploy(EsaCoinToken, token.name, token.symbol, web3.utils.toWei(token.initialSupply, "ether"));
        const deployedToken = await EsaCoinToken.deployed();
        console.log(`Deployed ${token.name} with symbol ${token.symbol} and supply ${token.initialSupply}`);
    }
};
