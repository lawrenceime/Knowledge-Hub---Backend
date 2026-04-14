import { Request, Response } from 'express';
import Question from '../models/Question';
import Result from '../models/Result';

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find().limit(10); // Exclude correctOption
        res.status(200).json({success: true, data: questions});
    } catch (error: any) {
        console.error("Get questions error:", error);
        res.status(500).json({ success: false, message: 'Could not load questions. Please try again later.' });
    }
}

export const checkAnswer = async (req: Request, res: Response) => {
    try {
        const { questionId, selectedOption } = req.body;
        const question = await Question.findById(questionId).select('+correctOption');
        if(!question) {
            return res.status(404).json({success: false, message: 'Question not found'});
        }
        const isCorrect = question.correctOption === selectedOption;
        res.status(200).json({
            success: true,
            data: {
              isCorrect,
              correctOption: question.correctOption // Send back answer so user sees what was right
            }
        });
    } catch (error: any) {
        console.error("Check answer error:", error);
        res.status(500).json({ success: false, message: 'Could not submit your answer. Please try again later.' });
    }
};

export const submitFinalResult = async (req: Request, res: Response) => {
    try {
        const { answers , timeTaken} = req.body;
        
        if (!Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: 'Invalid submission format. Answers must be a list.' });
        }

        const userId = (req as any).user.id; // From Auth Middleware
        let score = 0;
        for(const ans of answers) {
            const q = await Question.findById(ans.questionId).select('+correctOption');
            if(q && q.correctOption === ans.selectedOption) {
                score++;
            }
        }
        const result = await Result.create({
            user: userId,
            score,
            totalQuestions: answers.length,
            timeTaken
        });
        res.status(200).json({success: true, data: result});
    } catch (error: any) {
        console.error("Submit final result error:", error);
        res.status(500).json({ success: false, message: 'Could not save your quiz results. Please try again later.' });
    }
}

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({success: true, data: question});
    } catch (error: any) {
        console.error("Create question error:", error);
        
        // Mongoose validation error if required fields are missing
        if (error.name === 'ValidationError') {
             return res.status(400).json({ success: false, message: 'Failed to create question. Please check the required fields.' });
        }
        
        res.status(500).json({ success: false, message: 'Could not create the question. Please try again later.' });
    }
};