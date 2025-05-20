 
//place order cod: /api/order/cod

import Order from "../models/Order.js"
import Product from "../models/Product.js"

export const placeOrderCOD = async (req, res) => {
   try {
     const { userId, items, address } = req.body
     if (!address || items.length === 0) {
       return res.json({success:false, message:"Invalid Data"})
     }
     // Calculate amount using items

     let amount = await items.reduce(async (acc, item) => {
       const product = await Product.findById(item.product)
       return (await acc) + product.offerPrice * item.quantity

     }, 0)
     // add tax charger 2%

     amount += Math.floor(amount * 0.02)
     await Order.create({
       userId,
       items,
       amount,
       address,
       paymentType: "COD"
     })
     return res.json({success:true, message: "order place succesfully..."})
   } catch (error) {
     console.log(error.message)
     return res.json({success:false, message: error.message})

   }
}
 
// get order by user id : /api/order/user

export const getUserOrders = async (req, res) => {
  try {

    const userId = req.userId
   
    const orders = await Order.find({ userId: userId, $or: [ { paymentType: "COD" }, { isPaid: false } ] }).populate("items.product address").sort({ createdAt: -1 })
    res.json({success:true, orders})
     
  } catch (error) {
    console.log(error.message)
    return res.json({success:false, message: error.message})
  }
}

//get all orders for seller : /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ $or: [ { paymentType: "COD" }, { isPaid: true } ] }).populate("items.product address").sort({createdAt: -1})
    res.json({success:true, orders})
  } catch (error) {
    console.log(error.message)
    res.json({success:false, message: error.message})
  }
}