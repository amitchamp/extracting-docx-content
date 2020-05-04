// Models
const JobDescription = require('../models/jobDescriptionModel');

// Helper
const docFileReader = require('../utils/docFileReader');

exports.homePage = async (req, res, next) => {
    const filePath = `assets/jobDescription.docx`;

    docFileReader.extract(filePath).then(function (fileResponse, err) {
        if (err) { }
        object = fileResponse;

        if (fileResponse) {
            let isFirstIteration = true;
            let jobDescriptionTitle = '';
            let jobDescriptionData = [];

            for (const key in fileResponse) {
                if (fileResponse.hasOwnProperty(key)) {

                    if (isFirstIteration && fileResponse[key].length == 0) {
                        jobDescriptionTitle = key;
                        isFirstIteration = false;
                    } else {
                        const descriptionObject = {};
                        descriptionObject["title"] = key;
                        descriptionObject["description"] = fileResponse[key].length > 0 ? fileResponse[key] : [];

                        jobDescriptionData.push(descriptionObject);
                    }
                }
            }

            return res
                .render('index', {
                    jobDescriptionTitle: jobDescriptionTitle,
                    jobDescriptionData: jobDescriptionData
                });
        }
    });
}

exports.saveJobDescription = async (req, res, next) => {
    const data = {
        title: req.body.jobTitle,
        jobDescription: req.body.job_description,
        essential: req.body.essential,
        desirable: req.body.desirable,
        skillsAndExperience: req.body.skills_and_experience,
        aptitudes: req.body.aptitudes,
    }

    await JobDescription.create(data);

    return res.redirect('/thanks');
}

exports.thanksPage = (req, res, next) => {
    return res
        .render('thanks');
}
