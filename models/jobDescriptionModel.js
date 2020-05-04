const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobDescriptionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    jobDescription: [String],
    essential: [String],
    desirable: [String],
    skillsAndExperience: [String],
    aptitudes: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const JobDescriptionModel = mongoose.model('JobDescription', JobDescriptionSchema);

module.exports = JobDescriptionModel
