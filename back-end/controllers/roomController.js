import Cinema from "../models/cinema.js";
import Room from "../models/room.js";

// @desc    Tạo phòng chiếu mới
// @route   POST /api/room
export const createRoom = async (req, res) => {
  try {
    const { name, seatCapacity, cinemaId, screenType, price } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!name || !seatCapacity || !cinemaId || !screenType || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra xem rạp chiếu có tồn tại không
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Tạo phòng mới với các ghế ngồi dựa trên sức chứa và giá do người dùng cung cấp
    const room = new Room({
      name,
      seatCapacity,
      cinemaId,
      screenType,
      price, // Giá cho tất cả các ghế
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    console.log("Error in createRoom controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả các phòng
// @route   GET /api/room
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.log("Error in getAllRooms controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin một phòng theo ID
// @route   GET /api/room/:id
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("cinemaId");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    console.log("Error in getRoomById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin phòng
// @route   PUT /api/room/:id
export const updateRoom = async (req, res) => {
  try {
    const { name, seatCapacity, screenType, price } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Cập nhật thông tin phòng
    room.name = name || room.name;
    room.seatCapacity = seatCapacity || room.seatCapacity;
    room.screenType = screenType || room.screenType;
    room.price = price || room.price;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    console.log("Error in updateRoom controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa phòng chiếu
// @route   DELETE /api/room/:id
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Sử dụng findByIdAndDelete để xóa phòng
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room removed" });
  } catch (error) {
    console.log("Error in deleteRoom controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
