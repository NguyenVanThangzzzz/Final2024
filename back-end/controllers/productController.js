import cloudinary from "../db/cloudinary.js";
import { redis } from "../db/redis.js";
import Product from "../models/product.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not in redis, get from db
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    // .lean() is gonna return a plain js object instead of a mongodb
    // good performance
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl, isFeatured, director, actor } =
      req.body;
    let cloudinaryResponse = null;

    if (imageUrl) {
      cloudinaryResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      imageUrl: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      isFeatured,
      director,
      actor,
    });
    res.status(201).json({ product });
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Tìm sản phẩm theo ID và cập nhật
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // trả về document đã được cập nhật
      runValidators: true, // kiểm tra tính hợp lệ trước khi cập nhật
    });

    // Nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Trả về sản phẩm đã được cập nhật
    res.status(200).json(updatedProduct);
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json({ updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.imageUrl) {
      const publicId = product.imageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
