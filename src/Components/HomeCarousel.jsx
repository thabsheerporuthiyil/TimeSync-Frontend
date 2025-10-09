import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


const images = [
  "https://images.unsplash.com/photo-1661030418924-52142661241d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1703505841379-2f863b201212?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVucyUyMHdhdGNoZXN8ZW58MHx8MHx8fDA=",
  "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDV8fGZvc3NpbCUyMHdhdGNofGVufDB8fHx8MTY5NjYwMzc5MXww&ixlib=rb-4.0.3&q=80&w=2000",
  "https://images.unsplash.com/photo-1612817159576-986a0b7a4165?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://hatton-garden-jewellers.co.uk/wp-content/uploads/2024/10/HgF-10.jpg",
];

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);// tracks current img


useEffect(() => {
  const interval = setInterval(() => {
    nextSlide();
  }, 4000);
  return () => clearInterval(interval);
}, []);

const prevSlide = () => {
  setCurrentIndex((prev) =>
    prev === 0 ? images.length - 1 : prev - 1
  );
};

const nextSlide = () => {
  setCurrentIndex((prev) =>
    prev === images.length - 1 ? 0 : prev + 1
  );
};

const goToSlide = (index) => {
  setCurrentIndex(index);
};

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Slides */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Precision in Every Moment</h2>
        </h1>
        <p className="text-lg md:text-xl mb-6"> Discover our exclusive collection of premium watches </p>
        <Link to="/watches" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-lg font-semibold">
  Shop Now
</Link>

      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 flex justify-center w-full space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}