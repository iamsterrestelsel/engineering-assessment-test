const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { EthMainnet, ContractAddress} = require(path.join(__dirname, '../config/constant.js'));
const { ethers } = require("ethers");

router.get('/', async (req, res, next) => {
    const UniSwapTokenABI = require(path.join(__dirname, '../contract/UniSwapTokenABI.json'));
    const provider = new ethers.JsonRpcProvider(EthMainnet);
    const contract = new ethers.Contract(ContractAddress, UniSwapTokenABI, provider);

    try {
        const [name, symbol, totalSupply, decimals, minter, mintingAllowedAfter] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.totalSupply(),
            contract.decimals(),
            contract.minter(),
            contract.mintingAllowedAfter()
        ]);

        console.log(`Name: ${name}\nSymbol: ${symbol}\nDecimals: ${decimals}\nTotal Supply: ${totalSupply}\nMinter: ${minter}\nMinting Allowed After: ${mintingAllowedAfter}`);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

module.exports = router;