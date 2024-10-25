const express=require("express")
const mongoose= require("mongoose");
require("dotenv").config();
const port= 5000
const session=require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);
const multer=require("multer")
const app=express()
app.set("view engine", "ejs"); // view engine.
app.use(express.json())
app.use(express.urlencoded({ extended:true}))
app.use(express.static(__dirname + "/public"));
const store = new MongoDBStore({
    uri: process.env.DB_URL,
    collection: 'sessions',  // Collection where sessions will be stored
  });

store.on('error', function (error) {
  console.log(error);
});

app.use(session({
    secret: 'yourSecretKey', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    store: store,  // Store sessions in MongoDB
    cookie: {
      maxAge: 1000 * 60 * 10,  // Session expires after 10 minutes
    },
}));

//multer
const upload = multer({ dest: "uploads/" });
app.use(express.static("uploads"));
app.use(upload.single("file"));
app.use('/uploads', express.static('uploads'));
app.listen(port,()=>{
    console.log("app is running at port 5000")
})

app.get("/",require("./controllers/get_home.js"))

app.get('/login',require('./controllers/get_login.js'))
app.post('/login',require("./controllers/post_login.js"))

app.get("/register", require("./controllers/get_register.js"))
app.post("/register", require("./controllers/post_register.js"))

app.post("/user_verification", require("./controllers/user_verification.js"))

app.get("/logout", require("./controllers/logout_get.js"));
const dbConnect = ()=>{
    mongoose.connect(process.env.DB_URL, {
    })
    .then(()=> console.log('db connected successfull'))
    .catch( (error) => {
        console.log('Issue in db connection');
        console.error(error.message);
        process.exit(1);
    } );
}

const todoRoute=require('./routes/todo')

app.use('/todo',todoRoute)

dbConnect();
