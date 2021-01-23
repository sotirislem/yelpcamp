if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "SayQK0k8AXlE21y1f9v94idsiW1EhqXg";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

////////////////////////////////////////////////////////////////////////

const path = require('path');
const express = require('express');
const session = require('express-session');
const ejsMateEngine = require('ejs-mate');
const methodOverride = require('method-override');
const helmet = require('helmet');

const mongoose = require('mongoose');
const MongoDBStore = require("connect-mongo")(session);
const mongoSanitize = require('express-mongo-sanitize');

const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

////////////////////////////////////////////////////////////////////////

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const store = new MongoDBStore({
	url: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60	// 24 Hours
});

store.on("error", function (e) {
	console.log("MongoDBStore error:", e);
});

const sessionConfig = {
	store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,								// HTTPS only
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,	// 7 Days
		maxAge: 1000 * 60 * 60 * 24 * 7					// 7 Days
	}
}

////////////////////////////////////////////////////////////////////////

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => { console.log("MongoDB connected!") });


const app = express();

app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get(['/', '/home'], (req, res) => {
	res.render('home')
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found! [404 Error]', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode).render('error', { err })
});

app.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});

////////////////////////////////////////////////////////////////////////