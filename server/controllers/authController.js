import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import OrderModel from "../models/OrderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) {
      return res.status(400).send({ message: "name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "password is required" });
    }
    if (!phone) {
      return res.status(400).send({ message: "phone is required" });
    }
    if (!address) {
      return res.status(400).send({ message: "address is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }

    // if user already exists
    const existinguser = await userModel.findOne({ email: email });
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already register please login",
      });
    }

    // Register user
    // hash password
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error: error,
    });
  }
};

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        message: "invalid username or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "invalid email or password",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.send({
        success: false,
        message: "invalid email or password",
      });
    }
    // if everything match -- provide token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, NewPassword } = req.body;
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }
    if (!NewPassword) {
      return res.send({ message: "New password is required" });
    }

    // check
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.send({
        success: false,
        message: "Wrong Details!!",
      });
    }

    const hashed = await hashPassword(NewPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Forgot Password",
      error,
    });
  }
};

//test
export const userDetailsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    // if (password) return res.json({ error: "Password is required" });
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password,
        address: address || user.password,
        phone: phone || user.phone,
        answer: user.answer,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in update Profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting Orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting All Orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(orderId);
    console.log(status);
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in updating Orders status",
      error,
    });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Order deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Deleting Orders",
      error,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 });
    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting all users",
      error,
    });
  }
};
