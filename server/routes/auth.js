import express from 'express'
export const Auth = express.Router()

Auth.get("/login", async (req, res) => {
    res.json("<Login />")
})

Auth.post("/register", async (req, res) => {
    res.json("<Register />")
})