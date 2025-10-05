import { Router } from "express";
import { getCurrentUser, login, logout, register, resendCode, verification } from "../controllers/user.controller.js";

const route=Router();
route.post('/register',register);
route.post('/verification',verification)
route.post('/login',login)
route.post('/resend-code',resendCode);
route.get('/current-user',getCurrentUser);
route.get('/logout',logout);
export default route;