const express=require("express")
const router=express.Router()

const{
    createTodo,
    updateTodo,
    getTodo,
    checkTodo,
    deleteTodo
}=require('../controllers/Todo')


router.post("/createTodo",createTodo)
router.get("/getTodo",getTodo)
router.put("/updateTodo",updateTodo)
router.put("/checkTodo",checkTodo)
router.delete("/deleteTodo",deleteTodo)

module.exports= router