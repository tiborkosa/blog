const cloudinary = require('cloudinary');
const { cloud_img } = require('../../../config');

const TYPES = ['image/png', 'image/jpeg'];
const SIZES = [100, 600, 900];

cloudinary.config(cloud_img);

// disabled for now
exports.uploadMulti =  (req, res, next) => {
    const values = Object.values(req.files)
    const promises = values.map(
        image => cloudinary.uploader.upload(image.path)
        );
    
    Promise
        .all(promises)
        .then(
            results => res.json(results),
            err => next(err)
        );
};

exports.uploadOne = (req, res, next) => {
    const file = Object.values(req.files)[0];
    if(TYPES.indexOf(file.type) < 0){
        return res.status(400).json("Unsupported file extension");
    }
    const fileArr = file.originalFilename.split('.');
    const fileExtension = fileArr.pop();
    const fileName = fileArr.join('.');

    const promises = SIZES.map(
        x => cloudinary
            .v2
            .uploader
            .upload(
                file.path,
                {
                    public_id: `${req.user._id}/${fileName}_${x}.${fileExtension}`,
                    use_filename: true,
                    width: x, crop: "scale"
                }
            )
        );

    Promise
        .all(promises)
        .then(
            results => res.json({filename:`${req.user._id}/${fileName}.${fileExtension}`}),
            err => next(err)
        );
  
};
// used internally 
exports.deleteFiles = filenames => {

    const promises = filename.map( name =>{
        let fileArr = req.params.name.split('.');
        let fileExtension = fileArr.pop();
        let fileName = fileArr.join('.');

        if(fileName === 'sample.jpg') return null;
        return SIZES.map(
            x => cloudinary
                .uploader
                .destroy(`${req.user._id}/${fileName}_${x}.${fileExtension}`)
        );
    }).filter(el => el !== null).flat();

    Promise
        .all(promises)
        .then(
            null,
            err => console.log(err)
        );
}
