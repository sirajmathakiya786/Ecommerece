const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/referalproject',{
}).then(()=>{
    console.log("Connection has been established sucessfully");
}).catch(()=>{
    console.log('Connection has been failed');
})