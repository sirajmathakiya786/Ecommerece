const axios = require('axios');
const Books = require('../models/books');


const fetchBooks = async(req,res)=>{
    try {
        const response = await axios.get('http://localhost:6060/users/get-user');
        const books = response.data

        await Books.deleteMany({});

        const callApi = await Books.insertMany(books);
        
        return res.status(200).send(callApi)
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}




module.exports = {fetchBooks};