const Candidate = require("../entity/candidate");
const Assignment = require("../entity/Assignment");
const sendMail = require("./email");
const quizzes = require("../../quiz/entity/quizzes");

// GET all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      {
        $lookup: {
          from: "assignments",
          localField: "_id",
          foreignField: "candidateId",
          as: "assignments",
        },
      },
     {
  $addFields: {
    assignment: {
      $cond: {
        if: { $gt: [{ $size: "$assignments" }, 0] },
        then: { $arrayElemAt: ["$assignments", 0] },  // full object instead of just token
        else: null,
      },
    },
  },
},

      {
        $project: {
          assignments: 0, // hide full assignments array
        },
      },

 {
        $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "candidateId",
          as: "results",
        },
      },
      {
        $addFields: {
          result: {
            $cond: {
              if: { $gt: [{ $size: "$results" }, 0] },
              then: { $arrayElemAt: ["$results", 0] },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          results: 0, // hide full array
        },
      },

      
    ]);

    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates with token:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single candidate
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(404).json({ error: "Candidate not found" });
  }
};

const addCandidate = async (req, res) => {
  try {
    console.log("request body from candidate controller", req.body);

    const { difficulty } = req.body;

    //  Check if any quiz exists with this difficulty
    const quizExists = await quizzes.findOne({ difficulty });

    if (!quizExists) {
      return res
        .status(400)
        .json({ error: `No quiz found with difficulty '${difficulty}'` });
    }

    //  Proceed only if quiz difficulty exists
    const newCandidate = new Candidate(req.body);
    const saved = await newCandidate.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update candidate
const updateCandidate = async (req, res) => {
  try {
    const { difficulty } = req.body;

    // If difficulty is being updated, check if it exists in Quiz
    if (difficulty) {
      const quizExists = await quizzes.findOne({ difficulty });
      if (!quizExists) {
        return res
          .status(400)
          .json({ error: `No quiz found with difficulty '${difficulty}'` });
      }
    }

    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// SEND quiz email
const sendQuizEmail = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    // Find assignment for this candidate
    const assignment = await Assignment.findOne({ candidateId: candidate._id });
    if (!assignment)
      return res
        .status(404)
        .json({ message: "Assignment not found for candidate" });

    // Link with token
    const quizLink = `https://comfy-selkie-020033.netlify.app/quiz/${assignment.token}`;

    // Send email
    await sendMail(
      candidate.email,
      "Your Quiz Link",
      `Hi ${candidate.name},\n\nPlease take your quiz using this link:\n${quizLink}\n\nGood luck!`,
      `<p>Hi <b>${candidate.name}</b>,</p>
       <p>Please take your quiz using this link:</p>
       <a href="${quizLink}">${quizLink}</a>
       <p><i>Good luck!</i></p>`
    );

    res.json({ message: "Email sent successfully", quizLink });
  } catch (error) {
    console.error("Error sending quiz link:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};
module.exports = {
  getAllCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  sendQuizEmail,
};
