import { Router } from "express";

//local imports
import {
  createWordSearchGame,
  completeCurrentGame,
  getWordSearchGameById,
  getWordSearchGames,
  deleteWordSearchGame,
  resetGamesCompletedByType,
} from "../../controllers/games/wordSearchGames.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/wordSearchGames", checkUserRol, getWordSearchGames);
router.post("/wordSearchGames", checkUserRol, createWordSearchGame);
router.post("/currentWordSearchGame/:wordSearchGameId", checkUserRol, completeCurrentGame);
router.get("/wordSearchGame/:id", checkUserRol, getWordSearchGameById);
router.delete("/wordSearchGame/:wordSearchGameId", checkUserRol, deleteWordSearchGame);
router.patch("/resetGamesCompletedByType", checkUserRol, resetGamesCompletedByType);

export default router;
