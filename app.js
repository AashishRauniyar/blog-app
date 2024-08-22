import dotenv from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import connectDB from './server/config/db.js';

dotenv.config({path: './.env'});


const app = express();
const PORT = process.env.PORT || 3000;


// connect to Db
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main' );
app.set('view engine', 'ejs');

// public folder
app.use(express.static('public'))


//routes
import router from './server/routes/main.js';

app.use('/', router);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


