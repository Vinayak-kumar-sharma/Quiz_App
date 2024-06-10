const jwt = require('jsonwebtoken')
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const protect = async (req,res,next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    try {
      token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await prisma.user.findUnique({where:{id: decoded.id}})
    next()
    } catch (error) {
      res.status(401).json({error: 'Not Authorized,token failed'})

    }
    if(!token) {
      res.status(401).json({error: 'Not authorized'})
    }
}

module.exports = { protect }