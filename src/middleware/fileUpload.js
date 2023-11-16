const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
  
const upload = multer({
    storage: storage,
    limits: { fileSize: "1000000" },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
    
        if (mimeType && extname) {
        return cb(null, true);
        }
        cb("Give proper file formate to upload");
    },
    }).single("profileImage");

module.exports = upload;