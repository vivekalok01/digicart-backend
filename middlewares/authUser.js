import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {

  const { token } = req.cookies;
  if (!token)
    return res.status(400).json({ message: "Not Authorized", success: false });

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id
    } else {
      return res.status(404).json({message: "Not auhtorized", success:false})
    }
    next()
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser