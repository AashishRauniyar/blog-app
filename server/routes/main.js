import express from "express";

const router = express.Router();
import { Post } from "../models/Post.js";


/*
Get /
Home page
*/
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});





// function insertPostData (){
//     Post.insertMany(
//         [




//         ]
//     )
// }

//insertPostData();



/*
Get /
Post :id
*/

router.get('/post/:id', async (req, res) => {


    try {

        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "heyy this is a title"
        }
        
        res.render('post', { data, locals,
            currentRoute: `/post/${slug}`
         });

    } catch (error) {
        console.log(error)
    }
})


/*
Get /
Post :id
*/


router.post('/search', async (req, res) => {


    try {
        const locals = {
            title: "Search",
            description: "Search for posts"
        }

        let searchTerm = req.body.searchTerm

        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, ' ')

        const data = await Post.find({
            $or: [
                { title: { $regex: searchNoSpecialChars, $options: "i" } },
                { content: { $regex: searchNoSpecialChars, $options: "i" } }
            ]
        })
        res.render("search", { data, locals, currentRoute: '/' })
    } catch (error) {
        console.log(error)
    }
})














router.get("/about", (req, res) => {
    res.render("about", {
        currentRoute: '/about'
    })
})

router.get("/contact", (req, res) => {
    res.render("contact", {
        currentRoute: '/contact'
    })
})










export default router;



