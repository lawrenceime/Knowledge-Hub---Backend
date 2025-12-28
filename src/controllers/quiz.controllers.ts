import { Request, Response } from 'express';
import Question from '../models/Question';
import Result from '../models/Result';

export const getQuestions = async (req: Request, res: Response) => {
    const questions = await Question.find().limit(10); // Exclude correctOption
    res.status(200).json({success: true, data: questions});
}

export const checkAnswer = async (req: Request, res: Response) => {
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
};

export const submitFinalResult = async (req: Request, res: Response) => {
    const { answers , timeTaken} = req.body;
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
    res.status(200).json({success: true, data: result
    })
}

export const createQuestion = async (req: Request, res: Response) => {
    const question = await Question.create(req.body);
    res.status(201).json({success: true, data: question});
};