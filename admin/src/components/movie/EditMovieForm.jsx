import { motion } from "framer-motion";
import { Loader, Save, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMovieStore } from "../../Store/movieStore";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy", 
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary",
  "Family"
];

const EditMovieForm = ({ movie, onClose }) => {
  const { updateMovie, loading } = useMovieStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    genres: [],
    director: "",
    actors: "",
    isFeatured: false
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        name: movie.name || "",
        description: movie.description || "",
        image: movie.image || "",
        genres: movie.genres || [],
        director: movie.director || "",
        actors: movie.actors || "",
        isFeatured: movie.isFeatured || false
      });
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.genres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    if (formData.image && formData.image.startsWith('data:image')) {
      const imageSize = formData.image.length * (3 / 4) - 
        (formData.image.match(/=/g) ? formData.image.match(/=/g).length : 0);
      if (imageSize > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB limit.");
        return;
      }
    }

    try {
      await updateMovie(movie._id, {
        ...formData,
        image: formData.image !== movie.image ? formData.image : undefined
      });
      onClose();
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => {
      const updatedGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return {
        ...prev,
        genres: updatedGenres
      };
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
          Edit Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Movie Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
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
              className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600"
            >
              <Upload className="h-5 w-5 inline-block mr-2" />
              Change Image
            </label>
          </div>

          {formData.image && (
            <div className="relative mt-2">
              <img
                src={formData.image}
                alt="Preview"
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

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genres
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {GENRES.map((genre) => (
                <div key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-${genre}`}
                    checked={formData.genres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                  />
                  <label
                    htmlFor={`genre-${genre}`}
                    className="ml-2 text-sm text-gray-300"
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Director */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Director
            </label>
            <input
              type="text"
              value={formData.director}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* Actors */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Actors
            </label>
            <input
              type="text"
              value={formData.actors}
              onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>

          {/* Featured Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-300">
              Featured Movie
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditMovieForm; 