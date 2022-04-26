import EventOrders from "../models/mongo/EventOrder.mjs";
import { Validator } from "node-input-validator";
import { errorValidations } from "../helpers/index.mjs";
const EventOrderController = {
  async index(req, res) {
    try {
      const orders = await EventOrders.find({ event_id: req.params.id });
      return res.send({
        status: true,
        data: orders,
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
      const params = {
        paid_at: req.body.paid_at,
        paid_by: req.body.paid_by,
        payment_payload: req.body.payment_payload,
      };

      await EventOrders.updateOne(
        { invoice: invoice },
        { $set: params },
        { upsert: true }
      );

      return res.send({
        status: true,
        message: params,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },
};

export default EventOrderController;
