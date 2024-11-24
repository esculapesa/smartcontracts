const WrappedNativeToken = artifacts.require("WrappedNativeToken");

module.exports = function (deployer) {
    deployer.deploy(WrappedNativeToken)
        .then(() => {
            console.log("WrappedNativeToken deployed to:", WrappedNativeToken.address);
        })
        .catch((error) => {
            console.error("Error deploying WrappedNativeToken:", error);
        });
};
