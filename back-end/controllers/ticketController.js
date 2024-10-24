import Screening from "../models/screening.js"; // Import model Screening (để kiểm tra buổi chiếu nếu cần)
import Ticket from "../models/ticket.js"; // Import model Ticket

// @desc    Tạo vé mới
// @route   POST /api/ticket
export const createTicket = async (req, res) => {
  try {
    const { movieId, roomId, seatNumber, showTime, price } = req.body;

    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!movieId || !roomId || !seatNumber || !showTime || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra xem buổi chiếu có tồn tại không
    const screening = await Screening.findOne({ roomId, showTime });
    if (!screening) {
      return res.status(404).json({
        message: "No screening found for this room at the specified time",
      });
    }

    // Tạo vé mới
    const ticket = new Ticket({
      movieId,
      roomId,
      seatNumber,
      showTime,
      price,
    });

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

// @desc    Cập nhật thông tin vé
// @route   PUT /api/ticket/:id
export const updateTicket = async (req, res) => {
  try {
    const { movieId, roomId, seatNumber, showTime, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Cập nhật thông tin của vé
    ticket.movieId = movieId || ticket.movieId;
    ticket.roomId = roomId || ticket.roomId;
    ticket.seatNumber = seatNumber || ticket.seatNumber;
    ticket.showTime = showTime || ticket.showTime;
    ticket.price = price || ticket.price;

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    console.log("Error in updateTicket controller", error.message);
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

    await ticket.remove();
    res.json({ message: "Ticket removed" });
  } catch (error) {
    console.log("Error in deleteTicket controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
