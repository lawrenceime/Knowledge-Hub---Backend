import Question from '../models/Question'; 
import Result from '../models/Result';


export const submitQuiz = async (userId: string, answers: { questionId: string; selectedOption: string; }[], timeTaken: number) => { 
    let score = 0;
    for(const answer of answers) {
        const question = await Question.findById(answer.questionId)
        if(question && question.correctOption === answer.selectedOption) {
            score++;
        }
    }
    const newResult = await Result.create({
        user: userId,
        score : score,
        totalQuestions: answers.length,
        timeTaken 
    });
    return newResult;   
    
 };  