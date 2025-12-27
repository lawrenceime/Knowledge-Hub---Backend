import Result from "../models/Result";
import mongoose from "mongoose";

const getDateFilter  = (type: 'all-time' | 'last-week') => {
    if(type === 'all-time'){}

    const now = new Date();
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return { createdAt: { $gte: lastWeek } };
}

export const getTopThree = async (type: 'all-time' | 'last-week') => {
    const matchStage = getDateFilter(type);

    return await Result.aggregate([
        { $match: matchStage },
        { $sort: { score: -1, timeTaken: 1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        { $unwind: '$userDetails' },
        {
            $project: {
                score: 1,
                totalQuestions: 1,
                timeTaken: 1,
                username: '$userDetails.username',
                email: '$userDetails.email'
            }
        }
    ]); 

}

  export const getUserRank = async (userId: string) => {
    // 1. Get user's best score
    const userBest = await Result.findOne({ user: userId }).sort({ score: -1, timeTaken: 1 });
    
    if (!userBest) return { rank: null, score: 0 };

    // 2. Count how many people have a better score (or same score but faster time)
    const betterScoresCount = await Result.countDocuments({
        $or: [
            { score: { $gt: userBest.score } },
            { score: userBest.score, timeTaken: { $lt: userBest.timeTaken } }
        ]
    });

    return {
        rank: betterScoresCount + 1,
        stats: userBest
    };
};
