const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //  unique emails
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true, // ensures one candidate per number
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"], // validation
      trim: true,
    },

    tech: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
      enum: ["Easy", "Beginner", "Intermediate", "Advanced"], // optional
    },
    //     password: {
    //   type: String,
    //   required: true, // will store hashed password
    // },
    // role: {
    //   type: String,
    //   enum: ["candidate"], // default only candidates in this schema
    //   default: "candidate",
    // },

  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("Candidate", candidateSchema);
