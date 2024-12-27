import { Router } from "express";

// local imports
import {
  createGuessTheImageGame,
  completeCurrentGame,
  getGuessTheImageGameById,
  getGuessTheImageGames,
  deleteGuessTheImageGame,
} from "../../controllers/games/guessTheImageGame.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/guessTheImageGames", checkUserRol, getGuessTheImageGames);
router.post("/guessTheImageGames", checkUserRol, createGuessTheImageGame);
router.post("/currentGuessTheImageGame/:guessTheImageGameId", checkUserRol, completeCurrentGame);
router.get("/guessTheImageGame/:id", checkUserRol, getGuessTheImageGameById); 
router.delete("/guessTheImageGame/:guessTheImageGameId", checkUserRol, deleteGuessTheImageGame);

export default router;