const EsaCoinToken = artifacts.require("EsaCoinToken");

const tokens = [
    { name: "EsaCoin", symbol: "ESA", initialSupply: "210000000" },
    { name: "Holon", symbol: "HNS", initialSupply: "210000000" },
    { name: "Int", symbol: "INT", initialSupply: "210000000" },
    { name: "Infare", symbol: "IFE", initialSupply: "210000000" },
    { name: "Esculap", symbol: "ESA", initialSupply: "210000000" },
    { name: "Holopedia", symbol: "HPA", initialSupply: "210000000" },
    { name: "Hether", symbol: "HTR", initialSupply: "210000000" },
    { name: "Hether MEX", symbol: "HTM", initialSupply: "210000000" }
];

module.exports = async function (deployer) {
    for (const token of tokens) {
        await deployer.deploy(EsaCoinToken, token.name, token.symbol, web3.utils.toWei(token.initialSupply, "ether"));
        const deployedToken = await EsaCoinToken.deployed();
        console.log(`Deployed ${token.name} with symbol ${token.symbol} and supply ${token.initialSupply}`);
    }
};
