import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
  userDetailsController,
  deleteOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// Router  object
const router = express.Router();

// Register user -- POST
router.post("/register", registerController);

// Login User -- POST
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

//test
router.get(
  "/getUserDetails/:id",
  requireSignIn,
  isAdmin,
  userDetailsController
);

//protected user router auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin router auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIn, updateProfileController);

// Orders
router.get("/orders", requireSignIn, getOrdersController);

// All-Orders : Admin side
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

router.delete(
  "/delete-order/:id",
  requireSignIn,
  isAdmin,
  deleteOrderController
);

router.get("/get-all-users", requireSignIn, isAdmin, getAllUsersController);

export default router;
