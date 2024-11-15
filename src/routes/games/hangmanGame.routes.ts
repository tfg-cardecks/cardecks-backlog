import { Router } from "express";

// local imports
import {
  createHangmanGame,
  completeCurrentGame,
  getHangmanGameById,
  getHangmanGames,
  deleteHangmanGame,
} from "../../controllers/games/hangmanGame.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/hangmanGames", checkUserRol, getHangmanGames);
router.post("/hangmanGames", checkUserRol, createHangmanGame);
router.post("/currentHangmanGame/:hangmanGameId", checkUserRol, completeCurrentGame);
router.get("/hangmanGame/:id", checkUserRol, getHangmanGameById); 
router.delete("/hangmanGame/:hangmanGameId", checkUserRol, deleteHangmanGame);

export default router;