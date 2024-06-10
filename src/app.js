const express = require('express')
const dotenv = require("dotenv")
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const authRoutes = require("./routes/auth.js")
const quizRoutes = require("./routes/quiz.js")

dotenv.config();
const prisma = new PrismaClient();
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine",'ejs')

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/auth",authRoutes)
app.use("/quizzes",quizRoutes)

const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to Quiz App' });
});

app.listen(PORT,()=>{
  console.log(`SERRVER is Running .. http://localhost:${PORT}`)
})