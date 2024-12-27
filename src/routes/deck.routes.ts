import { Router } from "express";

//local imports
import {
  getDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  getDecksByUserId,
  exportDeck,
  importDeck,
  importCardInDeck,
} from "../controllers/deck.controller";
import { checkUserRol } from "../middlewares/checkUserRole";
import { upload } from "../utils/uploadImage";

const router = Router();

router.get("/decks", checkUserRol, getDecks);
router.post("/decks", checkUserRol, createDeck);
router.get("/deck/:id", checkUserRol, getDeckById);
router.patch("/deck/:id", checkUserRol, updateDeck);
router.delete("/deck/:id", checkUserRol, deleteDeck);

router.get("/user/:userId/decks", checkUserRol, getDecksByUserId);
router.post("/deck/export/:id", checkUserRol, exportDeck);
router.post(
  "/deck/:deckId/importCard",
  checkUserRol,
  upload.single("file"),
  importCardInDeck
);
router.post('/deck/import', checkUserRol, upload.single('file'), importDeck);


export default router;
