// import React from "react";
// import { useNavigate } from "react-router-dom";

// const locations = [
//     { name: "Mumbai", movies: ["Animal", "Arjun Reddy", "Tumbbad"] },
//     { name: "Hyderabad", movies: ["OG", "RRR", "Mirai"] },
//     { name: "Bangalore", movies: ["Kantara", "Hanuman", "KGF 2"] },
// ];

// const Home = () => {
//     const navigate = useNavigate();

//     const handleMovieClick = (location, movie) => {
//         navigate(`/book/${location}/${movie}`);
//     };

//     return (
//         <div className="p-8 text-center" >
//             <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Select Location & Movie</h1>
//             {locations.map(loc => (
//                 <div key={loc.name} className="mb-8">
//                     <h2 className="text-xl font-semibold mb-2">{loc.name}</h2>
//                     <div className="flex gap-4 flex-wrap justify-center">
//                         {loc.movies.map(movie => (
//                             <button
//                                 key={movie}
//                                 className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 text-center"
//                                 onClick={() => handleMovieClick(loc.name, movie)}
//                             >
//                                 {movie}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Home;



import React from "react";
import { useNavigate } from "react-router-dom";

const locations = [
  {
    name: "Mumbai",
    movies: [
      {
        title: "Animal",
        img: "https://m.media-amazon.com/images/M/MV5BZThmNDg1NjUtNWJhMC00YjA3LWJiMjItNmM4ZDQ5ZGZiN2Y2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      },
      {
        title: "Arjun Reddy",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDzYCGcx5bdA9V1gbB1tn7ebU4_dR5ENZHeyGfIj1gHQFRklvEUpEqaXh4sMPj6HctD0E&usqp=CAU",
      },
      {
        title: "Tumbbad",
        img: "https://movieassetsdigital.sgp1.cdn.digitaloceanspaces.com/original/67d288f701c5d0e931039d8315205f73d51ebfaf",
      },
    ],
  },
  {
    name: "Hyderabad",
    movies: [
      {
        title: "OG",
        img: "https://upload.wikimedia.org/wikipedia/en/0/0c/OG_Poster.jpg",
      },
      {
        title: "RRR",
        img: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
      },
      {
        title: "Mirai",
        img: "https://iansportalimages.s3.amazonaws.com/ianslive_watermark/202509113507508.jpeg",
      },
    ],
  },
  {
    name: "Bangalore",
    movies: [
      {
        title: "Kantara",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VwmW2_dwlSFKjBL6GxaYDdWaL_cFuVo35A&s",
      },
      {
        title: "Hanuman",
        img: "https://images.filmibeat.com/img/popcorn/movie_posters/hanuman-20240111185049-20158.jpg",
      },
      {
        title: "KGF 2",
        img: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
      },
    ],
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleMovieClick = (location, movie) => {
    navigate(`/book/${location}/${movie}`);
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Select Location & Movie
      </h1>

      {locations.map((loc) => (
        <div key={loc.name} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{loc.name}</h2>

          <div className="flex gap-6 flex-wrap justify-center">
            {loc.movies.map((movie) => (
              <div
                key={movie.title}
                className="w-40 cursor-pointer transform hover:scale-105 transition"
                onClick={() => handleMovieClick(loc.name, movie.title)}
              >
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="w-full h-56 object-cover rounded-lg shadow-md"
                />
                <p className="mt-2 text-center font-medium">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
