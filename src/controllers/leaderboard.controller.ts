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
    } catch (error: any) {
        console.error("Get leaderboard error:", error);
        res.status(500).json({ success: false, message: 'Could not load the leaderboard. Please try again later.' });
    }
}

export const getMyRank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; 
        const rankData = await leaderboardService.getUserRank(userId);
        res.status(200).json({ success: true, data: rankData });  
    } catch (error: any) {
        console.error("Get user rank error:", error);
        res.status(500).json({ success: false, message: 'Could not load your rank. Please try again later.' });
    }
     
}
