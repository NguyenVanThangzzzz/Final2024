import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useProductStore } from "../Store/productsStore";

const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Science Fiction",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "", // Đổi từ imageUrl thành image
    director: "",
    actors: "", // Đổi từ mảng thành chuỗi
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra kích thước hình ảnh
    if (newProduct.image) {
      const imageSize =
        newProduct.image.length * (3 / 4) -
        (newProduct.image.match(/=/g)
          ? newProduct.image.match(/=/g).length
          : 0);
      if (imageSize > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB limit.");
        return;
      }
    }
    try {
      // Gửi dữ liệu sản phẩm bao gồm cả image
      await createProduct({
        ...newProduct,
        image: newProduct.image,
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        director: "",
        actors: "", // Đặt lại thành chuỗi rỗng
      });
    } catch {
      console.log("error creating a product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleActorChange = (e) => {
    const value = e.target.value;
    setNewProduct((prev) => ({
      ...prev,
      actors: value, // Lưu giá trị như một chuỗi
    }));
  };

  const handleImageRemove = () => {
    setNewProduct({ ...newProduct, image: "" });
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
        </div>
        {newProduct.image && (
          <div className="relative mt-2">
            <img
              src={newProduct.image}
              alt="Uploaded"
              className="w-32 h-32 object-cover rounded-md" // Đặt kích thước cố định cho hình ảnh
            />
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white" // Điều chỉnh vị trí của nút "x"
              style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Đảm bảo nút "x" có kích thước cố định
            >
              &times; {/* Biểu tượng x để xóa ảnh */}
            </button>
          </div>
        )}

        <div>
          <label
            htmlFor="director"
            className="block text-sm font-medium text-gray-300"
          >
            Director
          </label>
          <input
            type="text"
            id="director"
            name="director"
            value={newProduct.director}
            onChange={(e) =>
              setNewProduct({ ...newProduct, director: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
              px-3 text-white focus:outline-none focus:ring-2
              focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="actors"
            className="block text-sm font-medium text-gray-300"
          >
            Actors (comma separated)
          </label>
          <input
            type="text"
            id="actors"
            name="actors"
            value={newProduct.actors}
            onChange={handleActorChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
              px-3 text-white focus:outline-none focus:ring-2
              focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
