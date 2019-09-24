const mongoose = require("mongoose");
const mongoose_url  = "mongodb://mongo:27017/time-tracking-db"
mongoose.connect(mongoose_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB');
    process.exit(1);
});
mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB with url ${mongoose_url}`);
});