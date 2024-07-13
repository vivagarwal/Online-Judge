const express = require("express");
const Problem = require("../model/Problem.js");
const router = express.Router();

// Create a new problem
router.post("/api/problems", async (req, res) => {
    try {
        const { name, description, inputs, outputs } = req.body;

        // Check that all the data exists
        if (!name || !description || !inputs || !outputs) {
            return res.status(400).send("Please enter all the information");
        }

        const newProblem = new Problem({ name, description, inputs, outputs });
        await newProblem.save();
        res.status(201).json({ message: "You have successfully created the problem!", newProblem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all problems
router.get("/api/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single problem by id
router.get("/api/problems/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a problem by id
router.put("/api/problems/:id", async (req, res) => {
    try {
        const { name, description, inputs, outputs } = req.body;

        // Check that all the data exists
        if (!name || !description || !inputs || !outputs) {
            return res.status(400).send("Please enter all the information");
        }

        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            { name, description, inputs, outputs },
            { new: true }
        );
        if (!updatedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(updatedProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a problem by id
router.delete("/api/problems/:id", async (req, res) => {
    try {
        const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json({ message: "Problem deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;