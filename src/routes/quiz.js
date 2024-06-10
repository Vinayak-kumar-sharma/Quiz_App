const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/auth.js")
const { createQuiz, getQuizzes, getquiz, updateQuiz, deleteQuiz } = require('../controllers/quizcontroller.js')

router.route('/')
.post(protect,createQuiz)
.get(protect,getQuizzes)

router.route("/:id")
.get(protect,getquiz)
.put(protect,updateQuiz)
.delete(protect,deleteQuiz)

module.exports = router