import dotenv from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import connectDB from './server/config/db.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';
import { isActiveRoute } from './server/helpers/routerHelpers.js';
dotenv.config({path: './.env'});


const app = express();
const PORT = process.env.PORT || 3000;


// connect to Db
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI}),
}))
//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main' );
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// public folder
app.use(express.static('public'))


//routes
import router from './server/routes/main.js';
import { adminRouter } from './server/routes/admin.js';
import session from 'express-session';
app.use('/', router);
app.use('/', adminRouter);




app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


