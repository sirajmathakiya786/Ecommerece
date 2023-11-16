const Joi = require('joi');
const { checkEmailExists } = require('../../models/users'); // Replace with the actual module for checking email existence

const usersSchema = Joi.object({
    email: Joi.string().required().custom(async (value, helpers) => {
        try {
            const emailExists = await checkEmailExists(value);
            if (emailExists) {
                throw new Error('Email already exists');
            }
            return value;
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw new Error('Internal server error');
        }
    }),

    firstName: Joi.string().max(50), 
    lastName: Joi.string().max(50),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phoneNumber: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
    role: Joi.string().valid('user', 'admin'),
    profileImage: Joi.string().uri()
});

module.exports = {
    usersSchema,
};
