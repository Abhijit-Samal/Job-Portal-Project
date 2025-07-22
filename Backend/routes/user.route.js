import express from 'express'
import { getCurrentUser, login, logout, register } from '../contoller/user.controller.js'


const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/verifyUser").post(getCurrentUser)


export default router