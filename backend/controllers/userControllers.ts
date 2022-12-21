import { Request, Response } from "express"
const User = require("../models/userModels")
const asyncHandler = require("express-async-handler")
const generateToken = require("../utils/generateToken")

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email })

    if (userExists) {

        res.status(400)
        throw new Error("User already exists")
    } else {
        const user = await User.create({
            name,
            email,
            password
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                favorites: user.favorites,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
        else {
            res.status(400)
            throw new Error("Error Occurred")
        }
    }

})

const authUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({
        email
    })

    if (user && (await user.matchPassword(password))) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            favorites: user.favorites,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password")
    }
})
module.exports = { registerUser, authUser }