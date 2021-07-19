const express= require('express');
const app= express();
const path= require('path');
const ejsMate= require('ejs-mate');
const mongoose= require('mongoose');
const ExpressError= require('./utils/ExpressError');
const { campgroundSchema, reviewSchema}= require('./schemas.js');
const methodOverride= require('method-override');

const session= require('express-session');
const flash= require('connect-flash');
 

const passport= require('passport');
const localStrategy= require('passport-local');
const User= require('./models/user');


const userRoutes= require('./routes/user');
const campgroundRoutes=  require('./routes/campground');
const reviewRoutes= require('./routes/reviews');


const sessionConfig ={
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db=  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database Connected");
}); 

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req,res,next) => {
    
    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
})


app.get('/fakeUser',async(req,res) => {
    const user= new User({ email: 'mouryamanohar10@gmail.com', username: 'Mourya'});
    const newUser= await User.register(user,'chicken');
    res.send(newUser);
})







app.use('/',userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/', (req,res) => {
    res.render('campgrounds/home');
})




app.all('*', (req,res,next) => {
    next(new ExpressError('Page not Found!!!',404));
    //res.send('404!!!!!!!!!');
})

app.use((err,req,res,next) => {
    const {statusCode=500, message="Somemthing is Wrong!" }= err;
    if(!err.message) err.message='Oh No!, Something is Wrong!'
    res.status(statusCode).render('error', {err});
   // res.send('Oh Boy!! There is an error!!!');
})




app.listen(3000,() => { console.log("Connected")})