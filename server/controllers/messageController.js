import MessageModel from "../models/MessageModel.js";
import NewsLetter from "../models/NewsLetter.js";

export const messageController = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name) {
      return res.send({ message: "Name is required!" });
    }
    if (!email) {
      return res.send({ message: "Email is required!" });
    }
    if (!message) {
      return res.send({ message: "Please type your message!" });
    }

    const msg = await new MessageModel({
      name,
      email,
      subject,
      message,
    }).save();

    res.status(200).send({
      success: true,
      message: "Message sent successfully",
      msg,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in message Controller",
      error,
    });
  }
};

export const newsLetterController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.send({ message: "Email is required!" });

    const alreadySubscribed = await NewsLetter.findOne({ email });
    if (alreadySubscribed) {
      return res.send({ message: "Already subscribed to our NewsLetter" });
    }

    const data = await new NewsLetter({ email }).save();

    res.status(200).send({
      success: true,
      message: "Signed up for our newsLetter",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in NewsLetter Controller",
      error,
    });
  }
};
