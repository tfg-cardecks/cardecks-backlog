import { Router } from "express";

//local imports
import {
  getDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  getDecksByUserId,
} from "../controllers/deck.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/decks", checkUserRol, getDecks);
router.post("/decks", checkUserRol, createDeck);
router.get("/deck/:id", checkUserRol, getDeckById);
router.patch("/deck/:id", checkUserRol, updateDeck);
router.delete("/deck/:id", checkUserRol, deleteDeck);

router.get("/user/:userId/decks", checkUserRol, getDecksByUserId);


export default router;
