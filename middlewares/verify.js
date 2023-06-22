const User = require('../models/User');

require('dotenv').config()

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/// request otp

module.exports.RequestVerification = async (req, res) => {
  try {
    client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
    .verifications
    .create({ to: `+${req.query.phone}`, channel: 'sms' })
    .then(verification => res.status(200).json({ otp: verification.sid }))
    .catch((err) => res.status(400).json(err));
  } catch (error) {
    
  }
}

/// verify otp

module.exports.Verify = async (req, res) => {
  const user = await User.findOne({ phone: req.params.phone })

  client.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      to: `+${req.query.phone}`,
      code: req.query.code,
    })

    .then(async (data) => {
      if (user) {
        user.updateOne({
          $set: {
            phone: `+${req.query.phone}`,
            ...user,
          },
        });
        res.status(200).json(user);
      } else {

      }

      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(err));
};
