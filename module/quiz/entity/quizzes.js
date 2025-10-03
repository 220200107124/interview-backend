// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema(
//   {
//     type:{type:String,enum:["radio","checkbox","text"],default:"radio"},
//     question: { type: String, required: true },
//     options: [{ type: String, required: true }],
//     correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true }, // index of the correct option
//   },
//   { _id: true }
// ); //so each question can be edited/deleted individually

// const quizSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   category: { type: String, required: true },
//   difficulty: {
//     type: String,
//     enum: ["Easy", "Beginner", "Intermediate", "Advanced"],
//     required: true,
//   },
//   duration:{type:Number,required:true,default:30},
//   questions: { type: [questionSchema], default: [] },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Quiz", quizSchema);
  const mongoose = require("mongoose");

  const questionSchema = new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["radio", "checkbox", "text"], 
        default: "radio",
      },
      question: { type: String, required: true },

      // For radio/checkbox questions → multiple choice options
      options: [{ type: String }],
      correctAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
          validator: function (value) {
            if (this.type === "radio") {
              return typeof value === "number"; // index
            }
            if (this.type === "checkbox") {
              return Array.isArray(value); // array of indices
            }
            if (this.type === "text") {
              return typeof value === "string"; // expected text
            }
            return false;
          },
          message: "Invalid correctAnswer type for the selected question type",
        },
      },
    },
    { _id: true } // so each question can be edited/deleted individually
  );

  const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    duration: { type: Number, required: true, default: 30 }, // in minutes
    questions: { type: [questionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model("Quiz", quizSchema);
