const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/DB'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

module.exports = mongoose;
