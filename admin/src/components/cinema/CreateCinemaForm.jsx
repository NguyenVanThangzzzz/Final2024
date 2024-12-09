import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload, Building2, ImagePlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCinemaStore } from "../../Store/cinemaStore";

const CreateCinemaForm = () => {
  const [newCinema, setNewCinema] = useState({
    name: "",
    country: "",
    state: "",
    streetName: "",
    postalCode: "",
    phoneNumber: "",
    image: "",
  });

  const { createCinema, loading } = useCinemaStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCinema.image) {
      const imageSize =
        newCinema.image.length * (3 / 4) -
        (newCinema.image.match(/=/g) ? newCinema.image.match(/=/g).length : 0);
      if (imageSize > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB limit.");
        return;
      }
    }
    try {
      await createCinema(newCinema);
      setNewCinema({
        name: "",
        country: "",
        state: "",
        streetName: "",
        postalCode: "",
        phoneNumber: "",
        image: "",
      });
    } catch {
      console.log("error creating a cinema");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCinema({ ...newCinema, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setNewCinema({ ...newCinema, image: "" });
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 lg:p-8 mb-8 w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-emerald-300">
        Create New Cinema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Cinema Name
            </label>
            <input
              type="text"
              id="name"
              value={newCinema.name}
              onChange={(e) => setNewCinema({ ...newCinema, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              value={newCinema.country}
              onChange={(e) => setNewCinema({ ...newCinema, country: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              value={newCinema.state}
              onChange={(e) => setNewCinema({ ...newCinema, state: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="streetName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Street Name
            </label>
            <input
              type="text"
              id="streetName"
              value={newCinema.streetName}
              onChange={(e) => setNewCinema({ ...newCinema, streetName: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={newCinema.postalCode}
              onChange={(e) => setNewCinema({ ...newCinema, postalCode: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={newCinema.phoneNumber}
              onChange={(e) => setNewCinema({ ...newCinema, phoneNumber: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white text-sm md:text-base"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-600 cursor-pointer"
            >
              <ImagePlus className="h-5 w-5 mr-2" />
              Upload Image
            </label>
            
            {newCinema.image && (
              <div className="relative">
                <img
                  src={newCinema.image}
                  alt="Preview"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white"
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Building2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Create Cinema
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateCinemaForm;
