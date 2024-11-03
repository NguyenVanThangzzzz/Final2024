import Screening from "../models/screening.js";

// @desc    Tạo screening mới
// @route   POST /api/screening
export const createScreening = async (req, res) => {
  try {
    const { roomId, movieId, showTime, endTime, seatCapacity, price } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!roomId || !movieId || !showTime || !endTime || !seatCapacity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo screening mới - seats sẽ được tự động tạo bởi middleware
    const screening = new Screening({
      roomId,
      movieId,
      showTime,
      endTime,
      seatCapacity,
      price
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
      .populate('movieId', 'name image')
      .populate({
        path: 'roomId',
        select: 'name screenType roomType cinemaId',
        populate: {
          path: 'cinemaId',
          select: 'name country state streetName'
        }
      });

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

// @desc    Lấy tất cả screenings theo roomId
// @route   GET /api/screening/room/:roomId
export const getScreeningsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const screenings = await Screening.find({ roomId })
      .populate('movieId', 'name duration posterUrl')
      .populate({
        path: 'roomId',
        select: 'name screenType roomType cinemaId',
        populate: {
          path: 'cinemaId',
          select: 'name country state streetName'
        }
      })
      .sort({ showTime: 1 });

    res.json(screenings);
  } catch (error) {
    console.log("Error in getScreeningsByRoom controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái ghế
// @route   PUT /api/screening/:screeningId/seats/:seatNumber
export const updateSeatStatus = async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.params;
    const { status } = req.body;

    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    const seatIndex = screening.seats.findIndex(
      (seat) => seat.seatNumber === seatNumber
    );
    if (seatIndex === -1) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Cập nhật trạng thái ghế
    screening.seats[seatIndex].status = status;

    await screening.save();
    res.json(screening.seats[seatIndex]);
  } catch (error) {
    console.error("Error in updateSeatStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật nhiều ghế cùng lúc
// @route   PUT /api/screening/:screeningId/seats
export const updateMultipleSeats = async (req, res) => {
  try {
    const { screeningId } = req.params;
    const { seats } = req.body; // Array of {seatNumber, status}

    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    // Cập nhật trạng thái cho nhiều ghế
    seats.forEach(({ seatNumber, status }) => {
      const seatIndex = screening.seats.findIndex(
        (seat) => seat.seatNumber === seatNumber
      );
      if (seatIndex !== -1) {
        screening.seats[seatIndex].status = status;
      }
    });

    await screening.save();
    res.json(screening.seats);
  } catch (error) {
    console.error("Error in updateMultipleSeats:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách ghế của một screening
// @route   GET /api/screening/:screeningId/seats
export const getScreeningSeats = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.screeningId);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }
    res.json(screening.seats);
  } catch (error) {
    console.error("Error in getScreeningSeats:", error);
    res.status(500).json({ message: error.message });
  }
};
