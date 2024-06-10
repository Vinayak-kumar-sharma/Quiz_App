const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const createQuiz = async (req,res)=>{
  const{ title,description,questions } = req.body
  try {
    const quiz = await prisma.quiz.create({
      data:{
        title,
        description,
        userid: req.user.id,
        questions: {
          create: questions
        }
      }
    })
    res.status(201).json(quiz)
  } catch (error) {
    res.status(400).json({
      error:error.message
    })
  }
}
const getQuizzes =async(req,res)=>{
  try {
    const quizzes = await prisma.quiz.findMany({
      where:{
        userid: req.user.id
      },
      include: {
        questions: true
      }
    })
    res.json(quizzes)
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}
const getquiz = async (req,res)=>{
  try{
    const quiz = await prisma.quiz.findUnique({
      where:{id:parseInt(req.params.id)},
      include:{questions:true}
    })
    if(!quiz){
      return res.status(404).json({
        error:'Quiz not found'
      })

    }
    res.json(quiz)
  }
  catch(error){
    res.status(400).json({
      error:error.message
    })
  }
}
const updateQuiz = async (req,res)=>{
  const { title, description, questions }=req.body
  try {
    const quiz = await prisma.quiz.update({
      where:{
        id: parseInt(req.params.id)
      },
      data:{
        title,
        description,
        questions: {
          deleteMany:{},
          create: questions,
        },
      },
    })
    res.json(quiz)

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }

}

const deleteQuiz = async (req,res)=>{
  try {
    await prisma.quiz.delete({
      where:{
        id: parseInt(req.params.id)
      },
    })
    res.json({
      message: 'Quiz deleted Succeesfully'
    })
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = { createQuiz, getQuizzes, getquiz, updateQuiz, deleteQuiz}