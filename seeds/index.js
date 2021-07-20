const mongoose= require('mongoose');
const Campground= require('../models/campground');
const cities= require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db=  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Databse Connected");
}); 


const rand= array =>array[Math.floor(Math.random() * array.length)];


const seedDB= async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++) {
        const random= Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random() * 30) + 10;
        const camp= new Campground ({
            author: '60f589596f28fb34b8e25b9c',
            location: `${cities[random].city}, ${cities[random].state}`, 
            title: `${rand(descriptors)} ${rand(places)}`, 
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel dolores cum aliquam reprehenderit. Qui, ipsa eum. Ipsa natus incidunt vitae ex dolorum accusantium quisquam voluptatum nihil, exercitationem explicabo suscipit cum.' ,
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dornm7u6m/image/upload/v1626789936/Yelp-Camp/r7owkne9ksztqb7xhblk.jpg',
                  filename: 'Yelp-Camp/r7owkne9ksztqb7xhblk'
                },
                {
                  url: 'https://res.cloudinary.com/dornm7u6m/image/upload/v1626789938/Yelp-Camp/a7oekaywzknwbszkmmb7.jpg',
                  filename: 'Yelp-Camp/a7oekaywzknwbszkmmb7'
                },
                {
                  url: 'https://res.cloudinary.com/dornm7u6m/image/upload/v1626789943/Yelp-Camp/ansvlimtn9edewlshx2b.jpg',
                  filename: 'Yelp-Camp/ansvlimtn9edewlshx2b'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})