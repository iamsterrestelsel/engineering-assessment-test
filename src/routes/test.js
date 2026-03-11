const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { EthMainnet, ContractAddress} = require(path.join(__dirname, '../config/constant.js'));
const { ethers } = require("ethers");

router.get('/', async (req, res, next) => {
    if (!EthMainnet || !ContractAddress) {
        return res.status(500).json({ error: 'Missing required constants' });
    }
    if (!EthMainnet.startsWith('http')) {
        return res.status(500).json({ error: 'Invalid RPC provider URL' });
    }
    if (!ethers.utils.isAddress(ContractAddress)) {
        return res.status(400).json({ error: 'Invalid contract address' });
    }

    const abiPath = path.join(__dirname, '../contract/UniSwapTokenABI.json');
    if (!fs.existsSync(abiPath)) {
        return res.status(500).json({ error: 'ABI file not found' });   
    }

    const UniSwapTokenABI = require(abiPath);
    if (!Array.isArray(UniSwapTokenABI) || UniSwapTokenABI.length === 0) {
        return res.status(500).json({ error: 'Invalid or empty ABI' });
    }

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