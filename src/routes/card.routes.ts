import { Router } from "express";

//local imports
import {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardsByUserId,
  exportCard,
  importCard,
  autocompleteCardThemes,
} from "../controllers/card.controller";
import {
  uploadCardImage,
  errorHandlingFiles,
  upload,
} from "../utils/uploadImage";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/cards", checkUserRol, getCards);
router.post("/cards", checkUserRol, createCard);
router.get("/card/:id", checkUserRol, getCardById);
router.patch("/card/:id", checkUserRol, updateCard);
router.delete("/card/:id", checkUserRol, deleteCard);
router.post(
  "/card/:id/uploadCardImage",
  checkUserRol,
  upload.single("image"),
  errorHandlingFiles,
  uploadCardImage
);
router.get("/user/:userId/cards", checkUserRol, getCardsByUserId);
router.post("/card/export/:id", checkUserRol, exportCard);
router.post("/card/import", checkUserRol, upload.single("file"), importCard);

router.get("/cardAutocomplete", checkUserRol, autocompleteCardThemes);

export default router;
