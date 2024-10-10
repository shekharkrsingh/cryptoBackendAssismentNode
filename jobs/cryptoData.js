const axios = require('axios');
const CryptoData = require("../model/CryptoData");

const { COINGECKO_API_URL, COINGECKO_API_ACCESS_KEY_TYPE, COINGECKO_API_ACCESS_KEY } = process.env;

const fetchAndStoreCryptoData = async () => {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    try {
        const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${coins.join(',')}&sparkline=false`;

        const options = {
            headers: {
                accept: 'application/json',
                [COINGECKO_API_ACCESS_KEY_TYPE]: COINGECKO_API_ACCESS_KEY
            }
        };

        const apiResponse = await axios.get(url, options);

        const cryptoData = apiResponse.data;

        for (const coin of cryptoData) {
            const { id, current_price, market_cap, price_change_percentage_24h } = coin;

            
            const newCryptoData = new CryptoData({
                coin: id,  
                price: current_price,   
                marketCap: market_cap, 
                change24h: price_change_percentage_24h, 
            });

            await newCryptoData.save(); 
        }

        console.log('Crypto data saved successfully!');
        
    } catch (error) {
        console.error('Error fetching or saving crypto data:', error);
    }
};

const cron = require('node-cron');
cron.schedule('0 */2 * * *', fetchAndStoreCryptoData);
fetchAndStoreCryptoData();
