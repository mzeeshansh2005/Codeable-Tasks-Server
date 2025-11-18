import User from '../models/User';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  try {
  const { id, name, email } = req.body;
  const user = await User.create({ id, name, email });
  res.status(201).json({
    success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'User creation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    console.error('User fetching failed:', error);
    throw error;
  }
};