import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


const images = [
  "https://images.unsplash.com/photo-1703505841379-2f863b201212?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVucyUyMHdhdGNoZXN8ZW58MHx8MHx8fDA=",
  "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDV8fGZvc3NpbCUyMHdhdGNofGVufDB8fHx8MTY5NjYwMzc5MXww&ixlib=rb-4.0.3&q=80&w=2000",
  "https://images.unsplash.com/photo-1739145349551-6bd99442c50f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1638872726305-35e2e39fb154?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        >
          <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-20 z-10">
        <div className="max-w-2xl">
            <h1 className="text-5xl md:text-8xl font-serif font-light text-white mb-6 leading-tight">
                Precision in <br/> <span className="italic">Every Moment</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-md font-light">
                Discover our exclusive collection of premium watches designed for those who value time.
            </p>
            <Link to="/watches" className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 overflow-hidden font-semibold transition-all hover:pr-12">
                <span className="relative z-10">EXPLORE COLLECTION</span>
                <ChevronRight className="w-5 h-5 transition-all group-hover:translate-x-2" />
            </Link>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
         <button onClick={prevSlide} className="p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-full">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <button onClick={nextSlide} className="p-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-full">
            <ChevronRight className="w-6 h-6" />
         </button>
      </div>
    </section>
  );
}