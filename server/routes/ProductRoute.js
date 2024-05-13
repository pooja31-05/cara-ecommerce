import express from "express";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProdutController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import fromidable from "express-formidable";

const router = express.Router();

// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  fromidable(),
  createProductController
);

// Update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  fromidable(),
  updateProductController
);

router.get("/get-products", getProductController);

router.get("/get-product/:slug", getSingleProductController);

router.get("/product-photo/:pid", productPhotoController);

router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// Product Count
router.get("/product-count", productCountController);

// Product per page
router.get("/product-list/:page", productListController);

//Serach Product
router.get("/search/:keyword", searchProdutController);

// Related Products
router.get("/related-products/:pid/:cid", relatedProductController);

// category wise Products
router.get("/product-category/:slug", productCategoryController);

// Payment Route -> token
router.get("/braintree/token", braintreeTokenController);

// Payments
router.post("/braintree/payment", braintreePaymentController);

export default router;
