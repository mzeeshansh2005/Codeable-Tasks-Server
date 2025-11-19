import User from '../models/User';
import { Request, Response } from 'express';
import { uploadImageToStorage, deleteImageFromStorage } from '../utils/uploadImage.js';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid, name, email, avatar } = req.body;
    let user = await User.findOne({ uid });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      if (avatar) user.avatar = avatar;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } else {
      // Create new user
      user = await User.create({ uid, name, email, avatar });
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    }
  } catch (error) {
    console.error('User creation/update failed:', error);
    res.status(500).json({
      success: false,
      message: 'User creation/update failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid: uid });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error('User fetching failed:', error);
    res.status(500).json({
      success: false,
      message: 'User fetching failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uid  = req.user?.uid;
    const { name, bio, avatar } = req.body;
    const user = await User.findOne({ uid });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    
    if (avatar !== undefined) {
      if (avatar.startsWith('data:image/')) {
        try {
 
          if (user.avatar && user.avatar.includes('storage.googleapis.com')) {
            await deleteImageFromStorage(user.avatar);
          }

          const avatarUrl = await uploadImageToStorage(avatar, 'avatars');
          user.avatar = avatarUrl;
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          res.status(500).json({
            success: false,
            message: 'Failed to upload avatar image',
            error: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          });
          return;
        }
      } else {
        user.avatar = avatar;
      }
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('User update failed:', error);
    res.status(500).json({
      success: false,
      message: 'User update failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateLastSignIn = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized - No user ID found',
      });
      return;
    }
    
    const user = await User.findOne({ uid });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Update the updatedAt field (Mongoose will do this automatically on save)
    user.updatedAt = new Date();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Last sign-in updated successfully',
      data: {
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update last sign-in failed:', error);
    res.status(500).json({
      success: false,
      message: 'Update last sign-in failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};