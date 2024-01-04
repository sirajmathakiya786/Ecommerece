const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/ImageGallery');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1 MB limit for each file
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpg|jpeg|png/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
  
      if (mimeType && extname) {
        return cb(null, true);
      }
      cb("Give proper file format to upload");
    },
  }).array("imageGallery", 5); // Allow up to 5 images in a single request
  
  module.exports = uploadImage;