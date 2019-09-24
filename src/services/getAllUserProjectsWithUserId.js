const UserProjects = require("../models/userProjects");
const getAllUserProjects = async (userId) => {
    const userProjects = await UserProjects.find({ userID: userId })
        .exec().
        then((projects) => {
            return projects;
        }).catch((err) => {
            throw new Error;
        })
    return userProjects
};

module.exports = getAllUserProjects;