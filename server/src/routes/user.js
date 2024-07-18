import { Router } from "express";
import { User } from "../models/user.js";
import { validateToken } from "../../services/authenicaton.js";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("Data", req.body);

    //create the user model/document
    await User.create({
      fullName,
      email,
      password,
    });

    return res.status(200).json({ fullName: fullName, email: email });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.json({ token }).status(200);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
});

router.get("/check", async (req, res) => {
  const token = req.query.token;
  console.log("Token:", req.query);
  try {
    const user = validateToken(token);
    if (!user) {
      return res.status(400).json({ message: "Token invalid" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  console.log("Calling");
  const users = await User.find({});
  return res.json(users).status(200);
});

export default router;
