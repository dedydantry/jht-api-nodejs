import Event from "../models/mongo/Events.mjs";
import { Validator } from "node-input-validator";
import { errorValidations } from "../helpers/index.mjs";
const EventOrderController = {
  async show(req, res) {
    try {
      const invoice = req.params.invoice;
      const event = await Event.findOne(
        { "participants.invoice": invoice },
        { "participants.$": 1 }
      );
      return res.send({
        status: true,
        message: event,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const validate = new Validator(req.body, {
        paid_at: "required",
        paid_by: "required",
        payment_payload: "required",
      });
      const matched = await validate.check();
      if (!matched) {
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });
      }

      const invoice = req.params.invoice;

      await Event.updateOne(
        { "participants.invoice": invoice },
        {
          $set: {
            "participants.$.paid_at": req.body.paid_at,
            "participants.$.paid_by": req.body.paid_by,
            "participants.$.payment_payload": req.body.payment_payload,
          },
        }
      );

      return res.send({
        status: true,
        message: req.body,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async invoice(req, res) {
    try {
      const validate = new Validator(req.body, {
        invoice_url: "required",
      });
      const matched = await validate.check();
      if (!matched) {
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });
      }

      const invoice = req.params.invoice;

      await Event.updateOne(
        { "participants.invoice": invoice },
        {
          $set: {
            "participants.$.invoice_url": req.body.invoice_url,
          },
        }
      );

      return res.send({
        status: true,
        message: req.body,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },
};

export default EventOrderController
