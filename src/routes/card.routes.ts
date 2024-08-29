import { Router } from "express";

//local imports
import {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/card.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/cards", checkUserRol, getCards);
router.post("/cards", checkUserRol, createCard);
router.get("/card/:id", checkUserRol, getCardById);
router.patch("/card/:id", checkUserRol, updateCard);
router.delete("/card/:id", checkUserRol, deleteCard);

export default router;
