const mongoose = require('mongoose');


const UsersSchema = new mongoose.Schema({

    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: {
        type: String, require: true,
    },
    password: {
        type: String, require: true,
    },
    token: {
        type: String, default: ""
    },
    status: {
        type: String, default: "y"
    },
    createdAt: {
        type: Date, default: Date.now()
    }

}, { versionKey: false, collection: 'users' })

const UserModel = mongoose.model('users', UsersSchema)//
module.exports = { UserModel }

