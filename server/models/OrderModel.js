import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: [],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not_Processed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
