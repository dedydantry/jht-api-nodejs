import Event from "../models/mongo/Events.mjs";
import { Validator } from "node-input-validator";
import { errorValidations } from "../helpers/index.mjs";
import { format } from "date-fns";

const EventController = {
  async index(req, res) {
    const events = await Event.find({}).sort({ created_at: -1 });
    res.send({
      status: true,
      data: events
    });
  },

  async store(req, res) {
    try {
      const validate = new Validator(req.body, {
        name: "required",
        cover: "required",
        expired_at: "required",
        price: "required",
        schedules: "required",
      });
      const matched = await validate.check();
      if (!matched)
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });
      const params = {
        name: req.body.name,
        slug: req.body.name
          .toLowerCase()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-"),
        cover: req.body.cover,
        expired_at: req.body.expired_at,
        price: req.body.price,
        status: req.body.status,
        schedules: req.body.schedules,
      };

      const events = new Event(params);
      events.save();

      res.send({
        status: true,
        message: events,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const validate = new Validator(req.body, {
        name: "required",
        cover: "required",
        expired_at: "required",
        price: "required",
        schedules: "required",
      });
      const matched = await validate.check();
      if (!matched)
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });

      const params = {
        name: req.body.name,
        slug: req.body.name
          .toLowerCase()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-"),
        cover: req.body.cover,
        expired_at: req.body.expired_at,
        price: req.body.price,
        status: req.body.status,
        schedules: req.body.schedules,
      };

      await Event.updateOne({ _id: req.params.id }, params, { upsert: true });
      res.send({
        status: true,
        message: params,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async destroy(req, res) {
    try {
      await Event.deleteOne({ _id: req.params.id });
      res.send({
        status: true,
        message: "Event has deleted",
      });
    } catch (error) {
      res.send({
        status: true,
        message: error.message,
      });
    }
  },

  async show(req, res) {
    try {
      const event = await Event.findOne(
        { slug: req.params.slug },
        { _id: 1, name: 1, slug: 1, price: 1, schedules: 1 }
      );
      if (!event)
        return res.send({
          status: false,
          message: "Invaid event",
        });
      res.send({
        status: true,
        message: event,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async detail(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event)
        return res.send({
          status: false,
          message: "Invaid event",
        });
      res.send({
        status: true,
        message: event,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async invoice(req, res) {
    try {
      const validate = new Validator(req.body, {
        name: "required",
        email: "required",
        phone: "required",
        participants: "required",
        event: "required",
        schedule: "required",
      });

      const matched = await validate.check();
      if (!matched)
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });
      const event = await Event.findOne({ slug: req.body.event });
      if (!event)
        return res.send({
          status: false,
          message: "Invalid event",
        });

      const params = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        schedule: req.body.schedule,
        participants: req.body.participants,
        paid_at: null,
        paid_by: null,
        payment_payload: null,
        invoice: Date.now().toString(),
        invoice_url: null,
        status: "unpaid",
        total: req.body.amount,
        utm: req.body.utm,
        created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss", {
          timeZone: "Asia/Jakarta",
        }),
      };

      await Event.findByIdAndUpdate(
        event._id,
        { $push: { participants: params } },
        { new: true, upsert: true }
      );

      const total = req.body.amount;
      return res.send({
        status: true,
        message: {
          invoice: params.invoice.toString(),
          total: total,
          email: req.body.email,
          phone: req.body.phone,
          description: "Pembayaran: " + event.name,
        },
      });
    } catch (error) {
      return res.send({
        status: true,
        message: error.message,
      });
    }
  },
};

export default EventController;
