import express from "express";
import dotenv from 'dotenv';
import authMiddleware from "../middlwares/authMiddleware.js";

const adminRouter = express.Router();
dotenv.config({path: './.env'});

import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/*
Check-Login


*/




/*

Get /
Admin-login page
*/

adminRouter.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Admin page"
        }

        // setting default layout for admin
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }


})

/*

POST /
Admin-Check Login
*/

adminRouter.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jsonwebtoken.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});


/*

Get /
Admin-Dashboard
*/
adminRouter.get('/dashboard',authMiddleware, async (req, res) => {
    res.render('admin/dashboard');


})



/*

Get /
Admin-Register
*/

adminRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(200).json({ message: "User created successfully" }, user);

        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "User already exists" });
            }
            res.status(500).json({ message: "Internal server error" });
        }


    } catch (error) {
        console.log(error)
    }

})








export { adminRouter };

