import EventOrders from "../models/mongo/EventOrder.mjs";
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
};

export default EventOrderController;
