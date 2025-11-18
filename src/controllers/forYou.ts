import { Request, Response } from 'express';
import Project from '../models/Project';
export const getForYouRecents = async (req: Request, res: Response) => {
    const { type } = req.params;
    const user = req.user;
    if (type === 'projects') {
        const projects = await Project.find();
        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: projects,
        });
    }else if (type === 'all') {
        const projects = await Project.find();
        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: projects, 
        });
    }
    // const recents = await Recent.find({ userId });
    // res.status(200).json({
    //     success: true,
    //     message: 'Recents fetched successfully',
    //     data: recents,
    // });
};