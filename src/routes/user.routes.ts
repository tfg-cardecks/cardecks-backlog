import { Router } from "express";

//local imports
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", checkUserRol, getUserById);
router.delete("/user/:id", deleteUser);
router.patch('/user/:id', updateUser);


export default router;
