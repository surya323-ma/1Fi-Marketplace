const mongoose = require("mongoose");

const emiPlanSchema = new mongoose.Schema(
  {
    tenureMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true }, // 0, 10.5, etc.
    cashback: { type: Number, default: 0 },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true }, // e.g. "256gb-silver"
    label: { type: String, required: true }, // e.g. "256GB / Silver"
    storage: { type: String },
    color: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    emiPlans: { type: [emiPlanSchema], default: [] },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true }, // used in /products/:slug
    name: { type: String, required: true },
    brand: { type: String, required: true },
    tag: { type: String }, // e.g. "NEW"
    description: { type: String },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
