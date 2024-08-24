import express from "express";
import dotenv from 'dotenv';
import authMiddleware from "../middlwares/authMiddleware.js";
import { Post } from "../models/Post.js";

const adminRouter = express.Router();
dotenv.config({ path: './.env' });

import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;





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

adminRouter.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});


/*

Get /
Admin-Create New Post
*/
adminRouter.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add-Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});


/*

Get /
Admin-Create New Post
*/
adminRouter.post('/add-post', authMiddleware, async (req, res) => {
    try {

        try {
            const newPost = new Post({
                title: req.body.title,
                content: req.body.content,
            })

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }

});

/*

PUT /
Admin-Create New Post
*/

adminRouter.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});




/**
 * GET /
 * Admin - Create New Post
*/
adminRouter.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

});

/*

Delete /
Admin- Delete Post
*/ 
adminRouter.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error); 
    }
})


/*

Get /
Admin- Logout
*/ 
adminRouter.get('/logout', authMiddleware, async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error, "log out error");
        
    }
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

