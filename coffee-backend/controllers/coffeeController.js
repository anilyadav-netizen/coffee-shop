const Coffee = require("../models/Coffee");
const axios = require("axios");
const sharp = require("sharp");
const FormData = require("form-data");
const { Readable } = require("stream");


const uploadToImgBB = async (buffer, originalname) => {
  const compressedBuffer = await sharp(buffer)
    .resize(600)
    .jpeg({ quality: 70 })
    .toBuffer();

  const formData = new FormData();

  formData.append("image", compressedBuffer, {
    filename: originalname,
    contentType: "image/jpeg",
  });

  const upload = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return upload.data.data.url;
};

// Create Coffee
exports.createCoffee = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToImgBB(
        req.file.buffer,
        req.file.originalname
      );
    }

    console.log(req.body,"body","filer", req.file)

    const coffee = await Coffee.create({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: coffee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Coffee
exports.updateCoffee = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToImgBB(
        req.file.buffer,
        req.file.originalname
      );

      updateData.image = imageUrl;
    }

    const coffee = await Coffee.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: coffee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Coffee
exports.getAllCoffee = async (req, res) => {
  try {
    const coffees = await Coffee.find()
      .select("name price image category")
      .populate("category", "name icon")
      .lean();

    return res.status(200).json({
      success: true,
      data: coffees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCoffeeById = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id)
      .populate("category", "name icon");

    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: "Coffee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: coffee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Coffee


// Delete Coffee
exports.deleteCoffee = async (req, res) => {
  try {
    await Coffee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Coffee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};