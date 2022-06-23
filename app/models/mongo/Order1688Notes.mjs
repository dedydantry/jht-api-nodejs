import mongoose from "../../config/mongo.mjs";
const Schema = mongoose.Schema;

const Order1688NotesSchema = new Schema(
  {
    label: { type: String, required: true },
    address: {
      addressId: { type: String, default: null },
      fullName: { type: String },
      mobile: { type: String },
      phone: { type: String },
      postCode: { type: String },
      cityText: { type: String },
      provinceText: { type: String },
      areaText: { type: String },
      townText: { type: String, default: "" },
      address: { type: String },
      districtCode: { type: String, default: null },
    },
    note: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Order1688Notes = mongoose.model("Order1688Notes", Order1688NotesSchema);

export default Order1688Notes;
