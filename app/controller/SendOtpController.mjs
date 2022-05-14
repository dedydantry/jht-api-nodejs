import initMB from "messagebird";

const SendOtpController = {
  async index(req, res) {
    try {
      const Messagebird = initMB(process.env.MESSAGE_BIRD_KEY);
      const Phone_number = req.query.phone_number;

      const RANDOM_NUMBER = Math.floor(1000 + Math.random() * 9000);

      const params = {
        originator: "caribarang",
        recipients: [Phone_number],
        body: `kode otp anda adalah ${RANDOM_NUMBER} `,
      };

      Messagebird.messages.create(params, function (err, response) {
        if (err) {
          return res.send({
            status: false,
            message: err.errors[0].description,
          });
        }

        return res.send({
          status: true,
          otp: RANDOM_NUMBER,
          message: response,
        });
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },
};

export default SendOtpController;
