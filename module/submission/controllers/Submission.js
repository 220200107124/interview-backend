const mongoose = require("mongoose");
const Submission = require("../entity/submission");

const Result = require("../../result/entity/result");
const Assignment = require("../../candidate/entity/Assignment");

// =================== SUBMIT QUIZ ===================
// const submitQuiz = async (req, res) => {
//   console.log("=== SUBMIT QUIZ CONTROLLER START ===");
//   try {
//     const { assignmentId, answers } = req.body;

//     // if (!assignmentId || !answers) {
//     //   return res.status(400).json({ error: "Missing required fields" });
//     // }
//     if (!Array.isArray(answers)) {
//       return res.status(400).json({ error: "Answers must be an array" });
//     }

//     const assignment = await Assignment.findOne({ _id: assignmentId })
//       .populate("quizId")
//       .populate("candidateId");

//     if (!assignment) return res.status(404).json({ error: "Assignment not found" });

//     const candidate = assignment.candidateId;
//     if (!candidate) return res.status(400).json({ error: "Missing candidateId" });

//     if (assignment.status === "completed") {
//       return res.status(400).json({ error: "This assignment has already been completed" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
//       return res.status(400).json({ error: "Invalid assignmentId" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(candidate._id)) {
//       return res.status(400).json({ error: "Invalid candidateId" });
//     }

//     const quiz = assignment.quizId;
//     if (!quiz) return res.status(404).json({ error: "Quiz not found in assignment" });

//     let correctAnswers = 0;
//     const totalQuestions = quiz.questions?.length || 0;

//     const formattedAnswers = answers.map((answer) => {
//       const question = quiz.questions[answer.questionIndex];
//       if (!question) return answer;

//       const selectedOption = Number(answer.selectedOption);

//       if (question.correctAnswer === selectedOption) {
//         correctAnswers++;
//       }

//       return {
//         questionIndex: answer.questionIndex,
//         selectedOption, // index (0,1,2..)
//       };
//     });

//     const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

//     // Save Submission
//     const submission = new Submission({
//       assignment: assignment._id,
//       candidate: candidate._id,
//       answers: formattedAnswers,
//       submittedAt: new Date(),
//     });

//     await submission.save();

//     // Save Result
//     const result = new Result({
//       candidateId: candidate._id,
//       quizTitle: quiz.title,
//       tech: candidate.tech || "N/A",
//       score: correctAnswers,
//       totalQuestions,
//       percentage,
//       attempts: 1,
//       status: "submitted",
//       date: new Date(),
//     });

//     await result.save();
//     console.log("result saved",result);
   
//     assignment.status = "completed";
//     assignment.token=null;
//     // assignment.token = assignment.token + "_used"; 
//      assignment.completedAt = new Date();
     
//     if (!assignment.startedAt) {
//       assignment.startedAt = new Date();
//     }
//     await assignment.save();

//     return res.status(200).json({
//       message: "Quiz submitted successfully!",
//       score: `${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)`,
//       submissionId: submission._id,
//       resultId: result._id,
//       assignmentId: assignment._id,
//     });
//   } catch (err) {
//     console.error("Submit quiz error:", err);
//     return res.status(500).json({
//       error: "Server error",
//       details: process.env.NODE_ENV === "development" ? err.message : undefined,
//     });
//   }
// };
const submitQuiz = async (req, res) => {
  console.log("=== SUBMIT QUIZ CONTROLLER START ===");
  try {
    const { assignmentId, answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    const assignment = await Assignment.findOne({ _id: assignmentId })
      .populate("quizId")
      .populate("candidateId");

    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    const candidate = assignment.candidateId;
    if (!candidate) return res.status(400).json({ error: "Missing candidateId" });

    if (assignment.status === "completed") {
      return res.status(400).json({ error: "This assignment has already been completed" });
    }

    const quiz = assignment.quizId;
    if (!quiz) return res.status(404).json({ error: "Quiz not found in assignment" });

    let correctAnswers = 0;
    const totalQuestions = quiz.questions?.length || 0;

    const formattedAnswers = answers.map((answer) => {
  const question = quiz.questions[answer.questionIndex];
  if (!question) return answer;

  let isCorrect = false;

  if (question.type === "radio") {
    // Single choice
    if (Number(answer.answer) === question.correctAnswer) {
      isCorrect = true;
    }
  } 
  


else if (question.type === "checkbox") {
    // Multiple choices (ignore order)
    
    // 1. Ensure correctAnswers is an array of numbers and sorted.
    const correctArr = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.map(Number).sort()
        : [];
    
    
    const submittedAnswer = Array.isArray(answer.answer)
        ? answer.answer // It's already an array
        : [answer.answer]; // Wrap the single value (number or string) in an array

    const givenArr = submittedAnswer
        .map(val => Number(val)) // Convert to number
        .filter(val => !isNaN(val)) // Filter out invalid entries
        .sort(); // Sort for comparison

    if (
        correctArr.length === givenArr.length &&
        correctArr.every((val, idx) => val === givenArr[idx])
    ) {
        isCorrect = true;
    }
} 

// ...
   else if (question.type === "text") {
    // Text-based (case-insensitive)
    const userAns = String(answer.answer || "").trim().toLowerCase();
    const correctAns = String(question.correctAnswer || "").trim().toLowerCase();
    if (userAns === correctAns) {
      isCorrect = true;
    }
  }

  if (isCorrect) correctAnswers++;

  return {
    questionIndex: answer.questionIndex,
    answer: answer.answer,
    correct: isCorrect,
  };
});


    const percentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Save Submission
    const submission = new Submission({
      assignment: assignment._id,
      candidate: candidate._id,
      answers: formattedAnswers,
      submittedAt: new Date(),
    });
    await submission.save();

    // Save Result
    const result = new Result({
      candidateId: candidate._id,
      quizTitle: quiz.title,
      tech: candidate.tech || "N/A",
      score: correctAnswers,
      totalQuestions,
      percentage,
      attempts: 1,
      status: "submitted",
      date: new Date(),
    });
    await result.save();
     console.log("result saved",result);

    assignment.status = "completed";
    assignment.token = null;
    assignment.completedAt = new Date();
    if (!assignment.startedAt) {
      assignment.startedAt = new Date();
    }
    
    await assignment.save();

    return res.status(200).json({
      message: "Quiz submitted successfully!",
      score: `${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)`,
      submissionId: submission._id,
      resultId: result._id,
      assignmentId: assignment._id,
    });
  } catch (err) {
    console.error("Submit quiz error:", err);
    return res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};



module.exports = { submitQuiz };
