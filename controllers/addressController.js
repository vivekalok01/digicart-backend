import Address from "../models/Address.js"


export const addAddress = async (req, res) => {
  try {
    const userId = req.userId
    const { address } = req.body 
    await Address.create({ ...address, userId })
    res.json({success:true, message: "Address added succesfully.."})
  } catch (error) {
    console.log(error.message)
    res.json({success:false, message: error.message})

  }
}

export const getAddress = async (req, res) => {
     try {
       const userId = req.userId
       const addresses = await Address.find({userId})
       res.json({success:true, addresses})
     } catch (error) {
      console.log(error.message)
    res.json({success:false, message: error.message})
     }
}