import Screening from "../models/screening.js";

// @desc    Tạo screening mới
// @route   POST /api/screening
export const createScreening = async (req, res) => {
  try {
    const { roomId, movieId, showTime, endTime } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!roomId || !movieId || !showTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo screening mới
    const screening = new Screening({
      roomId,
      movieId,
      showTime,
      endTime,
    });

    const createdScreening = await screening.save();
    res.status(201).json(createdScreening);
  } catch (error) {
    console.log("Error in createScreening controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy tất cả screenings
// @route   GET /api/screening
export const getAllScreenings = async (req, res) => {
  try {
    const screenings = await Screening.find({})
      .populate("roomId", "name") // Populate thông tin phòng
      .populate("movieId", "name"); // Populate thông tin phim
    res.json(screenings);
  } catch (error) {
    console.log("Error in getAllScreenings controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy screening theo ID
// @route   GET /api/screening/:id
export const getScreeningById = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate("roomId", "name")
      .populate("movieId", "name");

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    res.json(screening);
  } catch (error) {
    console.log("Error in getScreeningById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật screening
// @route   PUT /api/screening/:id
export const updateScreening = async (req, res) => {
  try {
    const { roomId, movieId, showTime, endTime } = req.body;

    const screening = await Screening.findById(req.params.id);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    // Cập nhật thông tin của screening
    screening.roomId = roomId || screening.roomId;
    screening.movieId = movieId || screening.movieId;
    screening.showTime = showTime || screening.showTime;
    screening.endTime = endTime || screening.endTime;

    const updatedScreening = await screening.save();
    res.json(updatedScreening);
  } catch (error) {
    console.log("Error in updateScreening controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa screening
// @route   DELETE /api/screening/:id
// @desc    Xóa screening
// @route   DELETE /api/screening/:id
export const deleteScreening = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    // Sử dụng findByIdAndDelete thay vì remove
    await Screening.findByIdAndDelete(req.params.id);
    res.json({ message: "Screening removed successfully" });
  } catch (error) {
    console.log("Error in deleteScreening controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
