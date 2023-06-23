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
      .create({ to: `+91${req.params.phone}`, channel: 'sms' })
      .then(verification => res.status(200).json({ otp: verification.sid }))
      .catch((err) => res.status(400).json(err));
  } catch (error) {

  }
}

/// verify otp

module.exports.Verify = async (req, res) => {
  const user = await User.findOne({ phone: req.query.phone })

  client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks
    .create({ to: `+91${req.query.phone}`, code: req.query.code })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        if (user) {
          await User.updateOne({ phone: req.query.phone }, { $set: { VerifiedUser: true } })
          res.status(201).json({ message: "Verification Successfull " })
        }
        else {
          res.status(200).json({ message: "user doesn't exist" })

        }
      }
      else {
        res.status(200).json({ message: "Verification Failed " })
      }
    })
    .catch((err) => res.status(400).json(err));
};
