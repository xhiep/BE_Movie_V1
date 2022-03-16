const { Users, TypeUser, sequelize } = require('../models');
const { Op, QueryTypes } = require('sequelize');
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
            if (checkUser.isActive) {
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
                res.status(404).send("EMAIL không hoạt động ");
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
        //fnc
        const update = async (userName = userUpdate.userName, phoneNumber = userUpdate.phoneNumber, avatar = userUpdate.avatar, typeUser = userUpdate.typeUser, password = userUpdate.password) => {
            userUpdate.userName = userName;
            userUpdate.password = password;
            userUpdate.phoneNumber = phoneNumber;
            userUpdate.typeUser = typeUser;
            if (file?.path) {
                userUpdate.avatar = `${file.path}`
            } else {
                userUpdate.avatar = avatar;
            }
            await userUpdate.save();
            return userUpdate;
        }
        //end fnc
        if (req.user.type === "SUPPER_ADMIN") {
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
        } else {
            if (req.user.email === userUpdate.email) {
                if (password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(password, salt);
                    const updated = await update(userName, phoneNumber, avatar, typeUser, hashPassword);
                    res.status(200).send(updated);
                }
                else {
                    if (typeUser == 3) {
                        res.status(400).send("NOT SUPPER_ADMIN")
                    } else {
                        const updated = await update(userName, phoneNumber, avatar, typeUser);
                        res.status(200).send(updated);
                    }
                }
            } else {
                res.status(403).send("Bạn không phải người sở hữu tài khoản này")
            }
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
                    },
                    isActive: true
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
const getUserWithShowTimeID = async (req, res) => {
    const { id } = req.query;
    try {
        const lstUser = await sequelize.query(`
            select distinct userName , email , phoneNumber, count(*) as numberTicket 
            from (seats
            inner join users on users.id = seats.idUser)
            where seats.idShowTime = ${id}
            group by idUser;
        `, { type: QueryTypes.SELECT });
        res.status(200).send(lstUser);
    } catch (error) {
        res.status(500).send(error)
    }
}
const deleteUser = async (req, res) => {
    try {
        const userDelete = req.details;
        userDelete.isActive = false;
        await userDelete.save();
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
    BlockAndUnBlock,
    getUserWithShowTimeID
}