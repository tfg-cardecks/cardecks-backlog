import { Router } from "express";

// local imports
import {
  createHangmanGame,
  completeCurrentGame,
  getHangmanGameById,
  getHangmanGames,
  deleteHangmanGame,
  resetGamesCompletedByType,
} from "../../controllers/games/hangmanGame.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/hangmanGames", checkUserRol, getHangmanGames);
router.post("/hangmanGames", checkUserRol, createHangmanGame);
router.post("/currentHangmanGame/:hangmanGameId", checkUserRol, completeCurrentGame);
router.get("/hangmanGame/:id", checkUserRol, getHangmanGameById); // Ensure this route is correct
router.delete("/hangmanGame/:hangmanGameId", checkUserRol, deleteHangmanGame);
router.patch("/resetGamesCompletedByType", checkUserRol, resetGamesCompletedByType);

export default router;