import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies
  if (!sellerToken) return res.status(400).json({ success: false, message: "Seller Not Authorized" })
  
  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next()
    } else {
      return res.status(404).json({message: "seller not authorized", success:false})
    }
  } catch (error) {
      return res.status(500).json({message: error.message, success:false})
  }
  
}

export default authSeller