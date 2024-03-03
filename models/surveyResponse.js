const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
    frequency: String,
    navigation: String,
    checkout: String,
    satisfaction: Number,
    purchase: [String],
    experience: String,
    suggestions: String,
});

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse;