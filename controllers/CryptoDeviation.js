const CryptoData = require("../model/CryptoData");

exports.cryptoDeveiation = async (req, res) => {
    const {coin} = req.body;

    if (!coin) {
        return res
            .status(400)
            .json({error: 'Coin parameter is required'});
    }

    if (["bitcoin", "matic-network", "ethereum"].includes(coin)) {
        try {
            const records = await CryptoData
                .find({coin})
                .sort({timestamp: -1})
                .limit(100);

            const prices = records.map(record => record.price);

            if (prices.length === 0) {
                return res
                    .status(404)
                    .json({error: 'No records found for this coin'});
            }

            const deviation = calculateStandardDeviation(prices);

            return res.json({
                deviation: parseFloat(deviation.toFixed(2))
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            return res
                .status(500)
                .json({error: 'Internal server error'});
        }
    } else {
        return res
            .status(404)
            .json(
                {success: false, message: `The coin '${coin}' is not supported. Please use 'bitcoin', 'matic-network', or 'ethereum'.`}
            );
    }

}

const calculateStandardDeviation = (prices) => {
    const n = prices.length;
    const mean = prices.reduce((sum, price) => sum + price, 0) / n;

    const variance = prices.reduce(
        (sum, price) => sum + Math.pow(price - mean, 2),
        0
    ) / n;

    return Math.sqrt(variance);
};