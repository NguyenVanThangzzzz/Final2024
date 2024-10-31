import Screening from "../models/screening.js";
import Ticket from "../models/ticket.js";

// @desc    Tạo vé mới
// @route   POST /api/ticket
export const createTicket = async (req, res) => {
  try {
    const { screeningId, userId, movieId, roomId, seatNumber } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!screeningId || !userId || !movieId || !roomId || !seatNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra buổi chiếu tồn tại
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({
        message: "Screening not found",
      });
    }

    // Kiểm tra ghế có sẵn không và lấy giá từ ghế
    const seat = screening.seats.find(s => s.seatNumber === seatNumber);
    if (!seat) {
      return res.status(400).json({
        message: "Seat not found",
      });
    }

    if (seat.status !== "available") {
      return res.status(400).json({
        message: "Seat is not available",
      });
    }

    // Tạo vé mới với giá từ seat
    const ticket = new Ticket({
      screeningId,
      userId,
      movieId,
      roomId,
      seatNumber,
      price: seat.price,
      status: "pending",
      paymentStatus: "unpaid"
    });

    // Cập nhật trạng thái ghế trong screening
    seat.status = "pending";
    await screening.save();

    const createdTicket = await ticket.save();

    res.status(201).json(createdTicket);
  } catch (error) {
    console.log("Error in createTicket controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy tất cả các vé
// @route   GET /api/ticket
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate("screeningId")
      .populate("userId", "name email")
      .populate("movieId", "name")
      .populate("roomId", "name");
    res.json(tickets);
  } catch (error) {
    console.log("Error in getAllTickets controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy vé theo ID
// @route   GET /api/ticket/:id
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("screeningId")
      .populate("userId", "name email")
      .populate("movieId", "name")
      .populate("roomId", "name");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.log("Error in getTicketById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái vé
// @route   PUT /api/ticket/:id
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Cập nhật trạng thái ghế trong screening
    const screening = await Screening.findById(ticket.screeningId);
    const seat = screening.seats.find(s => s.seatNumber === ticket.seatNumber);

    if (status) {
      ticket.status = status;
      // Cập nhật trạng thái ghế tương ứng
      if (status === "confirmed") {
        seat.status = "booked";
      } else if (status === "cancelled") {
        seat.status = "available";
      }
    }

    if (paymentStatus) {
      ticket.paymentStatus = paymentStatus;
    }

    await screening.save();
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (error) {
    console.log("Error in updateTicketStatus controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa vé
// @route   DELETE /api/ticket/:id
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Cập nhật lại trạng thái ghế trong screening
    const screening = await Screening.findById(ticket.screeningId);
    const seat = screening.seats.find(s => s.seatNumber === ticket.seatNumber);
    if (seat) {
      seat.status = "available";
      await screening.save();
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket removed" });
  } catch (error) {
    console.log("Error in deleteTicket controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy vé theo userId
// @route   GET /api/ticket/user/:userId
export const getTicketsByUser = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId })
      .populate("screeningId")
      .populate("movieId", "name")
      .populate("roomId", "name")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.log("Error in getTicketsByUser controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin ghế từ screening
// @route   GET /api/ticket/seat-info/:screeningId/:seatNumber
export const getSeatInfo = async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.params;

    // Kiểm tra screening tồn tại
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({
        message: "Screening not found",
      });
    }

    // Tìm thông tin ghế
    const seat = screening.seats.find(s => s.seatNumber === seatNumber);
    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    // Trả về thông tin ghế
    res.json({
      seatNumber: seat.seatNumber,
      status: seat.status,
      price: seat.price,
      isAvailable: seat.status === "available"
    });

  } catch (error) {
    console.log("Error in getSeatInfo controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy tất cả ghế của một screening
// @route   GET /api/ticket/seats/:screeningId
export const getScreeningSeats = async (req, res) => {
  try {
    const { screeningId } = req.params;

    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({
        message: "Screening not found",
      });
    }

    // Trả về danh sách tất cả các ghế và thông tin của chúng
    res.json({
      seats: screening.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        price: seat.price,
        isAvailable: seat.status === "available"
      }))
    });

  } catch (error) {
    console.log("Error in getScreeningSeats controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin chi tiết screening để hiển thị cho khách hàng
// @route   GET /api/ticket/screening-detail/:screeningId
export const getScreeningDetail = async (req, res) => {
  try {
    const { screeningId } = req.params;

    const screening = await Screening.findById(screeningId)
      .populate('movieId', 'name image') // Lấy thông tin phim
      .populate('roomId', 'name screenType roomType') // Lấy thông tin phòng
      .populate({
        path: 'roomId',
        populate: {
          path: 'cinemaId',
          select: 'name'
        }
      }); // Lấy thêm thông tin rạp

    if (!screening) {
      return res.status(404).json({
        message: "Screening not found",
      });
    }

    // Tạo response với đầy đủ thông tin cần thiết
    const screeningDetail = {
      movie: {
        id: screening.movieId._id,
        name: screening.movieId.name,
        image: screening.movieId.image
      },
      cinema: {
        name: screening.roomId.cinemaId.name
      },
      room: {
        id: screening.roomId._id,
        name: screening.roomId.name,
        screenType: screening.roomId.screenType,
        roomType: screening.roomId.roomType
      },
      showTime: screening.showTime,
      endTime: screening.endTime,
      seats: screening.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        price: seat.price,
        isAvailable: seat.status === "available"
      }))
    };

    res.json(screeningDetail);

  } catch (error) {
    console.log("Error in getScreeningDetail controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
