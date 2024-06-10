const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const{ PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
  }

  const user = await prisma.user.create({
      data: {
          username,
          email,
          password: hashedPassword,
      },
  });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req,res)=>{
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where:{
        email
      }
    })
    if(!user || !(await bcrypt.compare(password, user.password))){
      return res.status(401).json({error:'Invalid credentials'})
    }
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
      expiresIn:'1h'
    })
    res.json({token,message:"Logged in Succesfully"})
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = {registerUser,loginUser }