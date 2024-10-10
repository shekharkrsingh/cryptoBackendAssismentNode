const {default: axios} = require("axios");

const {COINGECKO_API_URL, COINGECKO_API_ACCESS_KEY_TYPE, COINGECKO_API_ACCESS_KEY} = process.env;

exports.status = async (req, res) => {
    const coin = req.body.coin;

    if (!coin) {
        return res
            .status(400)
            .json(
                {success: false, message: "Please provide a coin name in the request body."}
            );
    }

    const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${coin}&sparkline=false`;
    const options = {
        headers: {
            accept: 'application/json',
            [COINGECKO_API_ACCESS_KEY_TYPE]: COINGECKO_API_ACCESS_KEY
        }
    };

    if (["bitcoin", "matic-network", "ethereum"].includes(coin)) {
        try {
            const apiResponse = await axios.get(url, options);
            
            const data = {
                price: apiResponse.data[0].current_price,
                marketCap: apiResponse.data[0].market_cap,
                "24hChange": apiResponse.data[0].price_change_percentage_24h
            };
            
            return res
                .status(200)
                .json(
                    {
                        data, 
                    }
                );
        } catch (error) {
            console.error('Error fetching data from CoinGecko:', error);
            return res
                .status(500)
                .json(
                    {
                        success: false, 
                        message: "There was an issue connecting to the CoinGecko API. Please try again later."
                    }
                );
        }
    } else {
        return res
            .status(404)
            .json(
                {
                    success: false, 
                    message: `The coin '${coin}' is not supported. Please use 'bitcoin', 'matic-network', or 'ethereum'.`
                }
            );
    }
};
