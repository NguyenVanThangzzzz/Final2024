import Cinema from "../models/cinema.js";
import Room from "../models/room.js";

// @desc    Tạo phòng chiếu mới
// @route   POST /api/room
export const createRoom = async (req, res) => {
  try {
    const { name, cinemaId, screenType, roomType } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!name || !cinemaId || !screenType || !roomType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra xem rạp chiếu có tồn tại không
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Tạo phòng mới
    const room = new Room({
      name,
      cinemaId,
      screenType,
      roomType,
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
// export const getAllRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find({});
//     res.json(rooms);
//   } catch (error) {
//     console.log("Error in getAllRooms controller", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("cinemaId")
      .select("name cinemaId screenType roomType");
    res.status(200).json({ rooms });
  } catch (error) {
    console.log("Error in getAllRooms controller", error.message);
    res.status(500).json({ message: "Failed to fetch rooms" });
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
    const { name, screenType, roomType } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Cập nhật thông tin phòng
    room.name = name || room.name;
    room.screenType = screenType || room.screenType;
    room.roomType = roomType || room.roomType;

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

// @desc    Lấy danh sách các phòng theo ID của rạp chiếu
// @route   GET /api/room/cinema/:cinemaId
export const getRoomByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const rooms = await Room.find({ cinemaId }).populate("cinemaId");
    res.status(200).json({ rooms });
  } catch (error) {
    console.log("Error in getRoomByCinema controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách ghế của một phòng
// @route   GET /api/room/:id/seats
export const getRoomSeats = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room.seats);
  } catch (error) {
    console.log("Error in getRoomSeats controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái ghế
// @route   PUT /api/room/:roomId/seats/:seatId
export const updateSeatStatus = async (req, res) => {
  try {
    const { roomId, seatId } = req.params;
    const { status, screeningId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const seatIndex = room.seats.findIndex(seat => seat.seatNumber === seatId);
    if (seatIndex === -1) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Cập nhật trạng thái và screeningId của ghế
    room.seats[seatIndex].status = status;
    room.seats[seatIndex].screeningId = screeningId;

    await room.save();
    res.json(room.seats[seatIndex]);
  } catch (error) {
    console.error("Error in updateSeatStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật nhiều ghế cùng lúc
// @route   PUT /api/room/:roomId/seats
export const updateMultipleSeats = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { seats } = req.body; // Array of {seatNumber, status}

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Cập nhật trạng thái cho nhiều ghế
    seats.forEach(({ seatNumber, status }) => {
      const seatIndex = room.seats.findIndex(
        (seat) => seat.seatNumber === seatNumber
      );
      if (seatIndex !== -1) {
        room.seats[seatIndex].status = status;
      }
    });

    await room.save();
    res.json(room.seats);
  } catch (error) {
    console.log("Error in updateMultipleSeats controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
