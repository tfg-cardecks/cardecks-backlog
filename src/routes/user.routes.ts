import { Router } from "express";

//local imports
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserPassword,
  requestPasswordReset,
  resetPassword
} from "../controllers/user.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", checkUserRol, getUserById);
router.delete("/user/:id", deleteUser);
router.patch('/user/:id', updateUser);
router.patch("/user/:id/password", updateUserPassword);
router.post('/user/forgot-password',requestPasswordReset)
router.post('/user/forgot-password/:token',resetPassword);



export default router;
