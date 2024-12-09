import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import React, { useState } from "react";
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

const CreateMovieForm = () => {
  const [newMovie, setNewMovie] = useState({
    name: "",
    description: "",
    image: "",
    genres: [],
    director: "",
    actors: "",
    isFeatured: false,
  });

  const { createMovie, loading } = useMovieStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newMovie.genres.length === 0) {
      return;
    }

    if (newMovie.image) {
      const imageSize = newMovie.image.length * (3 / 4) -
        (newMovie.image.match(/=/g) ? newMovie.image.match(/=/g).length : 0);
      if (imageSize > 10 * 1024 * 1024) {
        return;
      }
    }

    try {
      await createMovie(newMovie);
      setNewMovie({
        name: "",
        description: "",
        image: "",
        genres: [],
        director: "",
        actors: "",
        isFeatured: false,
      });
    } catch {
      console.log("error creating a movie");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie({ ...newMovie, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setNewMovie({ ...newMovie, image: "" });
  };

  const handleGenreChange = (genre) => {
    setNewMovie(prev => {
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
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Movie
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Movie Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newMovie.name}
            onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Description Field */}
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
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Image Upload Field */}
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
        {newMovie.image && (
          <div className="relative mt-2">
            <img
              src={newMovie.image}
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

        {/* Genres Field */}
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
                  checked={newMovie.genres.includes(genre)}
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
          {newMovie.genres.length === 0 && (
            <p className="mt-1 text-xs text-red-500">
              Please select at least one genre
            </p>
          )}
        </div>

        {/* Director Field */}
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
            value={newMovie.director}
            onChange={(e) =>
              setNewMovie({ ...newMovie, director: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Actors Field */}
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
            value={newMovie.actors}
            onChange={(e) =>
              setNewMovie({ ...newMovie, actors: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
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
              Create Movie
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateMovieForm;
