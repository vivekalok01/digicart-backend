import express from 'express'
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js'
import { upload } from '../configs/multer.js'
import authSeller from '../middlewares/authSeller.js'

const productRoute = express.Router()

productRoute.post("/add", upload.array(["images"]), authSeller, addProduct)
productRoute.get("/list", productList)
productRoute.get("/id", productById)
productRoute.post("/stock",authSeller, changeStock)

export default productRoute