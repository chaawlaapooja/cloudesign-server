const mongoose = require('mongoose')

const entriesSchema = new mongoose.Schema({
	name : String,
	image : String,
	systime: Number,
    exceptionBM: Number,
    virtualName: String,
    speed: Number,
    direction: Number,
    haltedSince: String,
    elevation: Number,
    timestamp: Date,
    distance: Number,
    locStr: String,
    noDataSince: String,
    analogData: String,
    lattitude: Number,
    movingSince: String,
    longitude: Number,
    regNo: {
    	type:String,
    	unique:true
    },
    bmStr: String
})

const entries = mongoose.model('entries', entriesSchema)

module.exports = entries