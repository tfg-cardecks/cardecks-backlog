import { Request, Response } from "express";

// local imports
import { User } from "../models/user";
import { Card } from "../models/card";
import { Deck } from "../models/deck";
import { Game } from "../models/game";
import { WordSearchGame } from "../models/games/wordSearchGame";
import {
  handleValidateEmail,
  handleValidateUniqueUser,
} from "../validators/validate";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const gameType = "WordSearchGame";
    const totalGamesCompleted = user.gamesCompletedByType.get(gameType) || 0;

    return res.status(200).json({ ...user.toObject(), totalGamesCompleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await Card.deleteMany({ _id: { $in: user.cards } });
    await Deck.deleteMany({ _id: { $in: user.decks } });
    await Game.deleteMany({ _id: { $in: user.games } });
    await WordSearchGame.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.status(204).json({ message: "Usuario eliminado" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// router.patch('/candidate/:id', checkUpdateCandidate, updateCandidate);//X
// router.patch('/:id/password', checkUpdatePassword, updateUserPassword);
// router.post('/forgot-password',checkRealUser,createChangePasswordRequest)
// router.post('/forgot-password/:token',checkCorrectToken,checkRepeatedPassword,updateUserForgottenPassword);

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updateData: any = {};
    if (username && username !== user.username) updateData.username = username;
    if (email && email !== user.email) updateData.email = email;

    if (updateData.username || updateData.email) {
      if (await handleValidateUniqueUser(updateData, res)) return;
    }

    if (updateData.email && handleValidateEmail(updateData.email, res)) return;

    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// export const updateUserPassword: any = async (req: Request, res: Response) => {
// 	try {
// 		const id = req.params.id
// 		const { newPassword } = req.body
// 		const data = await UserService.updateUserPassword(id, newPassword)
// 		return ApiResponse.sendSuccess(res, data, 200, {
// 			self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
// 		})
// 	} catch (error: any) {
// 		return ApiResponse.sendError(res, [
// 			{
// 				title: 'Internal Server Error',
// 				detail: error.message,
// 			},
// 		])
// 	}
// }

// export const updateUserForgottenPassword: any = async (req: Request, res: Response) => {
// 	try {
// 		const token = req.params.token
// 		const { encryptedPassword } = req.body
// 		const decodedToken=verifyJWT(token)
// 		const data = await UserService.updateUserPassword(decodedToken.sub, encryptedPassword)
// 		return ApiResponse.sendSuccess(res, data, 200, {
// 			self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
// 		})
// 	} catch (error: any) {
// 		return ApiResponse.sendError(res, [
// 			{
// 				title: 'Internal Server Error',
// 				detail: error.message,
// 			},
// 		])
// 	}
// }

// export const createChangePasswordRequest: any = async (req: Request, res: Response) => {
// 	try {
// 		const url=req?.body?.redirectUrlBase
// 		if(!url){
// 			throw new Error('redirectUrlBase is required')
// 		}
// 		const data = await UserService.createChangePasswordRequest(req.body,url)
// 		return ApiResponse.sendSuccess(res, data, 200, {
// 			self: url,
// 		})
// 	} catch (error: any) {
// 		return ApiResponse.sendError(res, [
// 			{
// 				title: 'Internal Server Error',
// 				detail: error.message,
// 			},
// 		])
// 	}
// }
