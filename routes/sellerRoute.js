import express from 'express'
const sellerRouter = express.Router()
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js'
import authSeller from '../middlewares/authSeller.js'


sellerRouter.post("/login", sellerLogin)
sellerRouter.get("/is-auth",authSeller,isSellerAuth )
sellerRouter.get("/logout",authSeller, sellerLogout)

export default sellerRouter