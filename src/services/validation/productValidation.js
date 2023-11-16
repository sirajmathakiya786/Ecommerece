const Joi = require('joi');

const userProductSchema = Joi.object({
    productName: Joi.string().required().messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name is required',    
    }),
    description: Joi.string(),
    date: Joi.date(),
    reviews: Joi.number(),
    price: Joi.number(), 
});

module.exports = {
  userProductSchema,
};

// productName: Joi.string().required().custom(async (value) => {
    
//   return new Promise((resolve, reject) => {
//     Product.findOne({
//       productName: value,
//     })
//       .then((result) => {
//         if (result) {
//           return reject(new Error("Product already in use"));
//         } else {
//           return resolve(true);
//         }
//       })
//       .catch(() => {
//         reject(new Error("Internal server error"));
//       });
//   });
// }),
