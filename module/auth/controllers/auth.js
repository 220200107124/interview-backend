


// module.exports  = {login}
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Auth = require("../entity/auth");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const auth = await Auth.findOne({ email });
    console.log("auth found:", auth);

    if (!auth) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: auth._id, email: auth.email, role: auth.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      role:auth.role,
      name:auth.name,
      email:auth.email,

      message: "Login successful"
      , token,userInfo:auth });
    console.log("login successfully",auth);
  } catch (error) {
    console.error("auth login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports  = {login};