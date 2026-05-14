const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary environment variables are not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'shopnest/products',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    res.status(201).json({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};

module.exports = { uploadImage };
