const express = require('express');
const { Web3 } = require('web3');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the Ethereum network using Infura
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// USDT contract address
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// ERC20 ABI (simplified version, you might want to use the full ABI for complete functionality)
const erc20Abi = [
    // Only the balanceOf function is necessary for this example
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "type": "function"
    }
];

// Create contract instance
const usdtContract = new web3.eth.Contract(erc20Abi, usdtAddress);

// Route to get USDT balance
app.get('/api/usdt-balance/:address', async (req, res) => {
    const address = req.params.address;

    try {
        const balance = await usdtContract.methods.balanceOf(address).call();
        const formattedBalance = web3.utils.fromWei(balance, 'mwei'); // USDT has 6 decimal places
        res.json({
            address: address,
            balance: formattedBalance
        });
    } catch (error) {
        res.status(500).json({
            error: `Error fetching balance for ${address}: ${error.message}`
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
