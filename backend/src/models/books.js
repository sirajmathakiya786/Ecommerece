const mongoose = require('mongoose');

const booksSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
        },
        lastName:{
            type: String,
        },
        email:{
            type: String,
        },
        rewards:{
            type: Number
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const Books = mongoose.model('books', booksSchema);
module.exports = Books;