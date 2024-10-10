const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
const logFilePath = path.join(logDir, 'requests.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {recursive: true});
}

const logStream = fs.createWriteStream(logFilePath, {flags: 'a'});

const logger = (req, res, next) => {
    const {method, url, body, query, headers} = req;
    const timestamp = new Date().toISOString();
    const ip = req.ip;
    const statusCode = res.statusCode;
    const startTime = process.hrtime();

    res.on('finish', () => {
        const elapsedTime = process.hrtime(startTime);
        const responseTime = (elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6).toFixed(2);
        const logMessage = `[${timestamp}] ${method} request to ${url} from IP: ${ip} | Status: ${statusCode} | Response Time: ${responseTime}ms | User-Agent: ${headers['user-agent']} | Query: ${JSON.stringify(
            query
        )} | Body: ${JSON.stringify(body)}\n`;
        logStream.write(logMessage);
    });

    next();
};

module.exports = logger;
