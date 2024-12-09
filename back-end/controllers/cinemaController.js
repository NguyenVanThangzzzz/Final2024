import Cinema from "../models/cinema.js";
import cloudinary from "../db/cloudinary.js"; // Import cloudinary

// @desc    Lấy tất cả các rạp chiếu phim
// @route   GET /cinema
export const getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find({});
    res.json({ cinemas });
  } catch (error) {
    console.log("Error in getCinemas controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy rạp chiếu phim theo ID
// @route   GET /cinema/:id
export const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }
    res.json({ cinema });
  } catch (error) {
    console.log("Error in getCinemaById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo mới một rạp chiếu phim
// @route   POST /cinema
export const createCinema = async (req, res) => {
  try {
    const { name, country, state, streetName, postalCode, phoneNumber, image } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!name || !country || !state || !streetName || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tải lên hình ảnh lên Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "cinemas",
    });

    const cinema = await Cinema.create({
      name,
      country,
      state,
      streetName,
      postalCode,
      phoneNumber,
      image: cloudinaryResponse.secure_url, // Lưu URL hình ảnh
    });

    res.status(201).json({ cinema });
  } catch (error) {
    console.log("Error in createCinema controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin rạp chiếu phim
// @route   PUT /cinema/:id
export const updateCinema = async (req, res) => {
  try {
    const { name, country, state, streetName, postalCode, phoneNumber, image } = req.body;

    let cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Cập nhật các thông tin rạp
    cinema.name = name || cinema.name;
    cinema.country = country || cinema.country;
    cinema.state = state || cinema.state;
    cinema.streetName = streetName || cinema.streetName;
    cinema.postalCode = postalCode || cinema.postalCode;
    cinema.phoneNumber = phoneNumber || cinema.phoneNumber;

    // Cập nhật hình ảnh nếu có
    if (image && image !== cinema.image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "cinemas",
      });
      cinema.image = cloudinaryResponse.secure_url;
    }

    const updatedCinema = await cinema.save();
    res.json({ cinema: updatedCinema });
  } catch (error) {
    console.log("Error in updateCinema controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa rạp chiếu phim
// @route   DELETE /cinema/:id
export const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    await Cinema.findByIdAndDelete(req.params.id); // Sử dụng findByIdAndDelete thay vì remove
    res.json({ message: "Cinema removed" });
  } catch (error) {
    console.log("Error in deleteCinema controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
