if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const seedingAmount = 100;
const author = process.env.SEEDS_AUTHOR_ID;		// User._id from MongoDB in order to associate new records with a particular User.
if (!author){
	console.log("* SEEDS_AUTHOR_ID not found in .env file.");
	process.exit(1);
}

const mongoose = require('mongoose');
const { places, descriptors, cities } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => { console.log("MongoDB connected!\n") });


const seedDB = async () => {
	await Campground.deleteMany({});

	console.log('Start seeding the database...');
	const randomArrayGetter = (array) => array[Math.floor(Math.random() * array.length)];

	for (let i = 0; i < seedingAmount; i++) {
		const randomCity = randomArrayGetter(cities);
		
		const camp = new Campground({
			author,
			location: `${randomCity.city}, ${randomCity.state}`,
			title: `${randomArrayGetter(descriptors)} ${randomArrayGetter(places)}`,
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
			price: Math.floor(Math.random() * 20) + 10,
			geometry: {
				type: "Point",
				coordinates: [
					randomCity.longitude,
					randomCity.latitude,
				]
			},
			images: [
				{
					url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
					filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
				},
				{
					url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
					filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
				}
			]
		})
		await camp.save();
	}
}

seedDB()
	.then(() => {
		mongoose.connection.close();
		console.log('\t* Done!');
	});