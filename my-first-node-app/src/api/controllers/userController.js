const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to create user in DB
exports.user_create = (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        req.body.password = hash;
        let new_user = new User(req.body);
        try {
            new_user.save((error, user) => {
                if (error) {
                    res.status(400);
                    res.json({ message: "Incomplete request" });
                } else {
                    res.status(201);
                    user = user.toObject();
                    delete user.password;       // Delete password in response
                    res.json(user)
                }
            })
        }
        catch (e) {
            res.status(500);
            res.json({ message: "Server error" });
        }
    });
};

// Function to connect a user
exports.user_login = (req, res) => {
    //let {body} = req;
    let body = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        User.findOne({email: req.body.email}, (mongooseError, user) => {
            if (!user) {
                res.status(404);
                res.json({message: "User not found"});
            } else {
                // Check if the given password corresponding with the hash password in bdd
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result === true) {
                        // Generate a token
                        jwt.sign({user}, 'HNqpS5AqarxkgGZd', {expiresIn: "1h"}, (jwtError, token) => {
                            if (jwtError) {
                                console.log(jwtError);
                                res.status(500);
                                res.json({message: "Server error"});
                            } else {
                                res.status(200);
                                user = user.toObject();
                                // Removal of unnecessary information
                                delete user.password;
                                delete user.created_at;
                                delete user.__v;
                                // return token generated and the user connected
                                res.json({token, user});
                            }
                        });
                    } else {
                        res.status(404);
                        res.json({message: "User not found"});
                    }
                });
            }
        });
    } catch {
        res.status(500);
        res.json({ message: "Erreur serveur." });
    }
}

// Function to get all users from DB
exports.user_get_all = (req, res) => {
    User.find({}, (error, users) => {
        if (error) {
            res.status(500);
            res.json({ message: "Server error" })
        } else {
            res.status(200);
            for (let i in users) {
                users[i] = users[i].toObject();
                users[i]['id'] = users[i]['_id'];
                delete users[i].password;       // Delete password of all users in response
            }
            res.setHeader('X-Total-Count', users.length);
            res.header('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(users);
        }
    })
};

// Function to delete a user
exports.user_delete_by_id = (req, res) => {
    try {
        User.findByIdAndRemove(req.params.user_id, (error) => {
            if (error) {
                res.status(400);
                res.json({ message: "User not found" });
            } else {
                res.status(200);
                res.json({ message: "User deleted" })
            }
        })
    } catch (error) {
        res.status(500);
        res.json({ message: "Server error" });
    }
};

exports.update_a_user = (req, res) => {
    try {
        User.findByIdAndUpdate(req.params.user_id, req.body, { new: true }, (error, comment) => {
            if (error) {
                res.status(400);
                console.log(error);
                res.json({ message: "User not found" });
            }
            else {
                res.status(200);
                res.json(comment)
            }
        })
    } catch (e) {
        res.status(500);
        console.log(e);
        res.json({ message: "Error server" })
    }
};

exports.get_a_user = (req, res) => {
    try {
        User.findById(req.params.user_id, (error, user_id) => {
            if (error) {
                res.status(400);
                console.log(error);
                res.json({ message: "Utilisateur introuvable" });
            }
            else {
                res.status(200);
                res.json(user_id)
            }
        })
    } catch (e) {
        res.status(500);
        console.log(e);
        res.json({ message: "Erreur serveur" })
    }
}