import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";
import fs from "fs";
import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      mrp,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    // Validations
    switch (true) {
      case !name:
        return res.send({ message: "Name is required" });
      case !description:
        return res.send({ message: "Description is required" });
      case !price:
        return res.send({ message: "price is required" });
      case !mrp:
        return res.send({ message: "MRP is required" });
      case !category:
        return res.send({ message: "Category is required" });
      case !quantity:
        return res.send({ message: "quantity is required" });
      case !photo || photo.size > 1000000:
        return res.send({
          message: "Photo is required and should be less than 1mb",
        });
      case parseInt(price) > parseInt(mrp):
        return res.send({ message: "Price should be less than MRP" });
    }

    const product = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product!!",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product!!",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "product details",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product!!",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product Image",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product Image",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      mrp,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    // Validations
    switch (true) {
      case !name:
        return res.send({ message: "Name is required" });
      case !description:
        return res.send({ message: "Description is required" });
      case !price:
        return res.send({ message: "price is required" });
      case !mrp:
        return res.send({ message: "MRP is required" });
      case !category:
        return res.send({ message: "Category is required" });
      case !quantity:
        return res.send({ message: "quantity is required" });
      case !photo || photo.size > 1000000:
        return res.send({ message: "Photo is required and less than 1mb" });
      case price > mrp:
        return res.send({ message: "Price should be less than MRP" });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product List",
      error,
    });
  }
};

export const searchProdutController = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const result = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in searching",
      error,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in Related product",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in Product category",
      error,
    });
  }
};

// Payment token api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce, user } = await req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price * i.quantity;
    });
    // console.log(req.body.cart);
    let newTransaction = await gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: user._id,
            status: "Processed",
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
