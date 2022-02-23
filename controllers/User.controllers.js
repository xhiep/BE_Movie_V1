const { Users, TypeUser } = require('../models');
const { Op } = require('sequelize');
const { PORT } = require('../utils/util');
const bcrypt = require('bcryptjs');
const gravatarUrl = require('gravatar-url');
var jwt = require('jsonwebtoken');
// lấy loại người dùng từ bảng TypeUser 
const getTypeUser = async (id) => {
    const user_type = await TypeUser.findOne({ where: { id } });
    return user_type;
}
///-----
const signUp = async (req, res) => {
    const { userName, password, email, phoneNumber, typeUser } = req.body;
    try {
        const checkUser = await Users.findOne({ where: { email } });
        if (!checkUser) {
            let type = 1;
            if (typeUser) {
                type = typeUser;
            };
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const avatarUrl = gravatarUrl(email);
            const newUser = await Users.create({ userName, password: hashPassword, email, phoneNumber, typeUser: type, avatar: avatarUrl });
            res.status(201).send(newUser);
        } else {
            res.status(403).send("Email đã tồn tại");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await Users.findOne({ where: { email } });
        if (checkUser) {
            if (!checkUser.isBlock) {
                if (bcrypt.compareSync(password, checkUser.password)) {
                    {
                        const user_type = await getTypeUser(checkUser.typeUser);
                        const token = jwt.sign({ email: email, type: user_type.type }, 'secret', { expiresIn: 60 * 60 });
                        checkUser.typeUser = user_type;
                        checkUser.password = undefined;
                        res.status(200).send({
                            message: "LOGIN SUCCESS",
                            user: {
                                token,
                                userLogin: checkUser
                            }
                        });
                    }
                } else {
                    res.status(403).send("Password sai");
                }
            } else {
                res.status(403).send("Tài khoản của bạn đã bị khóa  ");
            }

        } else {
            res.status(404).send("EMAIL không tồn tại");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const updateUser = async (req, res) => {
    const { userName, password, phoneNumber, typeUser, avatar } = req.body;
    const { file } = req;
    try {
        const userUpdate = req.details;
        const update = async (userName = userUpdate.userName, password = userUpdate.password, phoneNumber = userUpdate.phoneNumber, avatar = userUpdate.avatar, typeUser = userUpdate.typeUser) => {
            userUpdate.userName = userName;
            userUpdate.password = password;
            userUpdate.phoneNumber = phoneNumber;
            userUpdate.typeUser = typeUser;
            if (file?.path) {
                userUpdate.avatar = `localhost:${PORT}/${file.path}`
            } else {
                userUpdate.avatar = avatar;
            }
            await userUpdate.save();
            return userUpdate;
        }
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const updated = await update(userName, hashPassword, phoneNumber, avatar, typeUser);
            res.status(200).send(updated);
        }
        else {
            const updated = await update(userName, password, phoneNumber, avatar, typeUser);
            res.status(200).send(updated);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAllUser = async (req, res) => {
    const { name } = req.query;
    try {
        let listUser;
        if (name) {
            listUser = await Users.findAll({
                where: {
                    userName: {
                        [Op.like]: `%${name}%`
                    }
                },
                include: [
                    {
                        model: TypeUser,
                        as: 'type_user'
                    }
                ]
            });
        } else {
            listUser = await Users.findAll({
                include: [
                    {
                        model: TypeUser,
                        as: 'type_user'
                    }
                ]
            });
        }
        listUser.forEach(element => {
            element.password = undefined;
            element.typeUser = undefined;

        });
        res.status(200).send(listUser);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetailsUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userDetails = await Users.findOne({
            where: {
                id
            },
            include: [
                {
                    model: TypeUser,
                    as: 'type_user'
                }
            ]
        });
        userDetails.typeUser = undefined;
        userDetails.password = undefined;
        res.status(200).send(userDetails);
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userDelete = req.details;
        await Users.destroy({
            where: {
                id
            }
        });
        userDelete.password = undefined;
        res.status(200).send({
            message: "Xóa thành công ",
            data: userDelete
        });
    } catch (error) {
        res.status(500).send(error);
    }
}
const BlockAndUnBlock = async (req, res) => {
    const { id } = req.params;
    const { isBlock } = req.body;
    try {
        const details = await Users.findOne({
            where: {
                id
            }
        });
        details.isBlock = isBlock;
        await details.save();
        res.status(200).send(details);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    signUp,
    signIn,
    updateUser,
    getAllUser,
    getDetailsUser,
    deleteUser,
    BlockAndUnBlock
}