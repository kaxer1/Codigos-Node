const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4
        });
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos');
    }
}

module.exports = {
    dbConnection
}