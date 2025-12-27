import { Request, Response, NextFunction } from 'express';
import * as leaderboardService from '../services/leaderboard.service';
import { success } from 'zod';

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allTimeTopThree = await leaderboardService.getTopThree('all-time');
        const lastWeekTopThree = await leaderboardService.getTopThree('last-week');
        res.status(200).json({ 
            success : true,
            data : {
            allTime: allTimeTopThree,
           lastWeek: lastWeekTopThree 
            }    
        });
    } catch (error) {
        next(error);
    }
}

export const getMyRank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; 
        const rankData = await leaderboardService.getUserRank(userId);
        res.status(200).json({ success: true, data: rankData });  
    } catch (error) {
         next(error);
    }
     
}
