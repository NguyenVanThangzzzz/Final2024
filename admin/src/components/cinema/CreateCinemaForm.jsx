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
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Cinema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Cinema Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCinema.name}
            onChange={(e) =>
              setNewCinema({ ...newCinema, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-300"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={newCinema.country}
            onChange={(e) =>
              setNewCinema({ ...newCinema, country: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-300"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={newCinema.state}
            onChange={(e) =>
              setNewCinema({ ...newCinema, state: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Street Name */}
        <div>
          <label
            htmlFor="streetName"
            className="block text-sm font-medium text-gray-300"
          >
            Street Name
          </label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={newCinema.streetName}
            onChange={(e) =>
              setNewCinema({ ...newCinema, streetName: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-300"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={newCinema.postalCode}
            onChange={(e) =>
              setNewCinema({ ...newCinema, postalCode: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-300"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={newCinema.phoneNumber}
            onChange={(e) =>
              setNewCinema({ ...newCinema, phoneNumber: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Image Upload */}
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
            <ImagePlus className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
        </div>
        {newCinema.image && (
          <div className="relative mt-2">
            <img
              src={newCinema.image}
              alt="Uploaded"
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white"
              style={{
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading...
            </>
          ) : (
            <>
              <Building2 className="mr-2 h-5 w-5" />
              Create Cinema
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateCinemaForm;
