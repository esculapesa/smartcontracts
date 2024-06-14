const MyContract = artifacts.require("MyContract");

module.exports = async function(deployer) {
    try {
        await deployer.deploy(MyContract, param1, param2); // Replace `param1`, `param2` with actual values
        const myContractInstance = await MyContract.deployed();
        console.log('MyContract deployed at address:', myContractInstance.address);
    } catch (error) {
        console.error("Error deploying MyContract:", error);
    }
};

