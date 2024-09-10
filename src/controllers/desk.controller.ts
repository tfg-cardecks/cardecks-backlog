import { Request, Response } from "express";

//local imports
import { Desk } from "../models/desk";
import { User } from "../models/user";
import { handleValidationErrors } from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";

export const getDesks = async (_req: Request, res: Response) => {
  try {
    const desks = await Desk.find();
    return res.status(200).json(desks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDeskById = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) return res.status(404).json({ message: "Escritorio no encontrado" });
    return res.status(200).json(desk);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDesk = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id; 
    const deskData = req.body;

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const desk = new Desk(deskData);
    await desk.save();

    user.desks.push(desk._id);
    await user.save();

    return res.status(201).json(desk);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const updateDesk = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    if (!desk) return res.status(404).json({ message: "Escritorio no encontrado" });
    return res.status(200).json(desk);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteDesk = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findByIdAndDelete(req.params.id);
    if (!desk) return res.status(404).json({ message: "Escritorio no encontrado" });
    return res.status(204).json({ message: "Escritorio eliminado con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};