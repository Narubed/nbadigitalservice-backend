
// const db = require("../../models");
// const User = db.user;
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");

// Create and Save a new user
exports.create = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};
// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
    try {
        User.find()
        // User.aggregate([{$lookup:{from:"transports",localField:"transport_name",foreignField:"transport_name",as:"เชื่อมต่อข้อมูล"}}])
            .then(async data => {
                // const result = data.filter(value => value.firstName === "AOF");
                // console.log(result)
                res.send({ data, message: 'success' });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with id=" + id });
        });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }
        const id = req.params.id;
        if (!req.body.password) {
            User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update User with id=${id}. Maybe User was not found!`
                        });
                    } else res.send({ message: "User was updated successfully." });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating User with id=" + id
                    });
                });
        } else {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            User.findByIdAndUpdate(id, ({ ...req.body, password: hashPassword }), { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update User with id=${id}. Maybe User was not found!`
                        });
                    } else res.send({ message: "User was updated successfully." });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating User with id=" + id
                    });
                });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} User were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all User."
            });
        });
};
