# YelpCamp
This project was made during 'The Web Developer Bootcamp 2021' course attendance.\
It uses Express - Node.js web application framework.

## Installation
Use npm to install the package and all of its dependencies.
```
npm install
```

## Additional requirements
* [MongoDB](https://www.mongodb.com/)
* [Cloudinary](https://cloudinary.com/) account
* [Mapbox](https://www.mapbox.com/) account

Create a .env file and supply the required data as shown below:
```
DB_URL                <== Your MongoDB url (example: mongodb://localhost:27017/yelp-camp)
SEEDS_AUTHOR_ID       <== A user's User._id from MongoDB, in order to seed database with fake Campgrounds data and associate them with a particular user (use: node seeds/index.js)
CLOUDINARY_CLOUD_NAME <== Cloudinary account info
CLOUDINARY_KEY        <== Cloudinary account info
CLOUDINARY_SECRET     <== Cloudinary account info
MAPBOX_TOKEN          <== Mapbox account info
```

## Execution
```
nope app.js
```
