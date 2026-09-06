const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products - list all products (summary: default variant only)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    const summary = products.map((p) => {
      const defaultVariant = p.variants[0];
      const zeroInterestPlans = (defaultVariant?.emiPlans || []).filter((plan) => plan.interestRate === 0);
      const longestZeroInterest = zeroInterestPlans.sort((a, b) => b.tenureMonths - a.tenureMonths)[0];
      const emiTeaser = longestZeroInterest
        ? `0% interest • ${longestZeroInterest.tenureMonths} months`
        : "EMI plans available";

      return {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        tag: p.tag,
        image: defaultVariant?.image,
        mrp: defaultVariant?.mrp,
        price: defaultVariant?.price,
        variantCount: p.variants.length,
        emiTeaser,
      };
    });
    res.json({ success: true, count: summary.length, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:slug - full product detail with all variants + EMI plans
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
