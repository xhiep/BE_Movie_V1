
const multer = require('multer');
const mkdirp = require('mkdirp');
const uploadImage = (type) => {
    const made = mkdirp.sync(`./public/images/${type}`);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/images/${type}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "_" + file.originalname)

        }
    })
    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const extensionImageList = [".jpg", ".png"];
            const extension = file.originalname.slice(-4);
            const check = extensionImageList.includes(extension);
            if (check) {
                cb(null, true)
            } else {
                cb(new Error("file không hợp lệ"))
            }
        }
    });
    return upload.single(type);
}

module.exports = {
    uploadImage
}