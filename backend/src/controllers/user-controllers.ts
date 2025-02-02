import { NextFunction, Request, Response } from "express"
import User from "../models/User.js"
import { compare, hash } from "bcrypt"

export const getAllUsers= async (req:Request,res: Response, next:NextFunction)=>{
    try {
        const users=await User.find()
        return res.status(200).json({message: 'ok', users})
    } catch (error) {
        console.log(error);        
        return res.status(500).json({message: 'error', cause: error.message})
       
    }
}
export const userSignup= async (req:Request,res: Response, next:NextFunction)=>{
    try {
        const {name, email, password}=req.body
        const existingUser= await User.findOne({email})
        if(existingUser) return res.status(401).send("user already registered")
        const hashedPassword=await hash(password, 10)
        const user=new User({name,email,password: hashedPassword})
        await user.save() //no...//newUser={name,email,password: hashedPassword}; const user= await User.create(newUser) 
        return res.status(201).json({message: 'ok', id:user._id.toString()})
    } catch (error) {
        console.log(error);        
        return res.status(500).json({message: 'error', cause: error.message})       
    }
}
export const userLogin= async (req:Request,res: Response, next:NextFunction)=>{
    try {
        const {email, password}=req.body
        const user= await User.findOne({email})
        if(!user){
            return res.status(401).send("user not registered")
        }
        const isPasswordCorrect= await compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(403).send("Incoorect Password")
        }
        return res.status(200).json({message: 'ok', id:user._id.toString()})
    } catch (error) {
        console.log(error);        
        return res.status(500).json({message: 'error', cause: error.message})       
    }
}