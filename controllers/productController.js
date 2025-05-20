import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/Product.js'

// add product: /api/product/add
export const addProduct = async (req, res) => {
     try {
       let productData = JSON.parse(req.body.productData)
       const images = req.files
       let imageUrl = await Promise.all(
         images.map(async (item) => {
           let result = await cloudinary.uploader.upload(item.path, {
             resource_type: 'image'
           })
           return result.secure_url
         })
       )
       await Product.create({ ...productData, image: imageUrl })
       res.status(200).json({success: true, message:'Product Added'})
     } catch (error) {
       console.log(error.message)
       res.status(500).json({success:false, message: error.message})
     }
}

// get product: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({})
    
    res.json({success:true, products})
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false, message: error.message})
  }
}

//get single product: /api/product/id
export const productById = async (req, res) => {
   try {
     const { id } = req.body
     const products = await Product.findById({ _id: id })
     res.json({success:true, products})
   } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false, message: error.message})
   }
}

// changel product in sotck: /api/product/stock 
export const changeStock = async (req, res) => {
   try {
     const { id, inStock } = req.body
     await Product.findByIdAndUpdate(id, { inStock })
     res.json({success:true, message: "Stock Updated"})
   } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false, message: error.message})
   }
}