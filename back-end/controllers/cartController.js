export const getCart = async (req, res) => {
  try {
    const admin = req.admin;

    // Populate thông tin sản phẩm từ reference
    await admin.populate('cartItems.product');

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalQuantity = admin.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Tính tổng giá trị giỏ hàng (giả sử mỗi sản phẩm có trường 'price')
    const totalAmount = admin.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      data: {
        cartItems: admin.cartItems,
        totalQuantity,
        totalAmount,
        uniqueItemsCount: admin.cartItems.length
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy thông tin giỏ hàng",
      error: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const admin = req.admin;

    const existingItemIndex = admin.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Nếu vé đã tồn tại, cập nhật số lượng
      admin.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Nếu vé chưa có, thêm mới
      admin.cartItems.push({ product: productId, quantity });
    }

    await admin.save();
    await admin.populate('cartItems.product');

    // Tính toán tổng số lượng và giá trị
    const totalQuantity = admin.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = admin.cartItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );

    res.status(200).json({
      success: true,
      message: "Đã cập nhật giỏ hàng",
      data: {
        cartItems: admin.cartItems,
        totalQuantity,
        totalAmount,
        uniqueItemsCount: admin.cartItems.length
      }
    });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm vào giỏ hàng" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const admin = req.admin;
    if (!productId) {
      admin.cartItems = [];
    } else {
      admin.cartItems = admin.cartItems.filter(
        (item) => item.productId !== productId
      );
    }
    await admin.save();
    res.json(admin.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const admin = req.admin;

    // Tìm sản phẩm trong giỏ hàng
    const existingItemIndex = admin.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      if (quantity <= 0) {
        // Xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 0
        admin.cartItems.splice(existingItemIndex, 1);
      } else {
        // Cập nhật số lượng
        admin.cartItems[existingItemIndex].quantity = quantity;
      }

      // Lưu thay đổi vào database
      await admin.save();

      // Populate thông tin sản phẩm
      await admin.populate('cartItems.product');

      // Tính toán lại tổng giá trị giỏ hàng
      const totalAmount = admin.cartItems.reduce((sum, item) =>
        sum + (item.product.price * item.quantity), 0
      );

      // Tính tổng số lượng sản phẩm
      const totalQuantity = admin.cartItems.reduce((sum, item) => sum + item.quantity, 0);

      return res.status(200).json({
        success: true,
        message: "Giỏ hàng đã được cập nhật",
        data: {
          cartItems: admin.cartItems,
          totalAmount,
          totalQuantity,
          uniqueItemsCount: admin.cartItems.length
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng"
      });
    }
  } catch (error) {
    console.error("Lỗi trong updateCart controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message
    });
  }
};
