const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    networks: {
        dev: {
            provider: () => new HDWalletProvider(process.env.mnemonic, `http://65.108.151.70:8545`),
            port: 8545,            // The port your node is listening on, typically 8545 for HTTP connections
            network_id: "83278",       // Match any network id or specify if known
            from: process.env.address, // Specify the default account to use for transactions if desired
            gas: 5500000,          // Optionally specify gas limits
            gasPrice: 10000000000  // Optionally specify gas price
        },
    },
    compilers: {
        solc: {
            version: "^0.8.0", // Or any other version that's appropriate
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "istanbul" // Or "petersburg" if "istanbul" isn't supported
            }
        }
    }
};
