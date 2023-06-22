require('dotenv').config()

const apiKey = process.env.API_KEY;

module.exports.apiKeyMiddleware = (req, res, cb) => {
    const apiKeyHeader = req.headers['apikey'];
    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
      return res.status(401).json({error : 'Unauthorized'});
    }
    else {
      cb()
    }
  };
  