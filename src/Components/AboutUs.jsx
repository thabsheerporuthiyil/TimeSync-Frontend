import { Link } from "react-router-dom";
import aboutVideo from '../assets/vid.mp4'


export default function AboutUs() {
  return (
    <section className="w-full py-24 px-6 md:px-20 overflow-hidden bg-white">
      {/* Section Heading Block */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-serif text-gray-900 tracking-tight">
          Beyond the <span className="italic text-gray-500 font-light">Dial</span>
        </h2>
        <div className="h-[1px] w-20 bg-blue-600 mx-auto mt-6"></div>
      </div>

      {/* Main Content Block */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden">
        {/* Left Side Video */}
        <div className="relative h-[400px] md:h-[600px]">
          <video
            src={aboutVideo}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay for better integration */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Right Side Content */}
        <div className="bg-slate-900 p-12 md:p-20 flex flex-col justify-center">
          <span className="text-blue-500 font-bold tracking-[0.3em] text-xs mb-4 uppercase">
            Our Heritage
          </span>
          <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
            Crafting Time <br/> Since 1994
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light italic border-l-2 border-blue-600 pl-6">
            "At <span className="text-white font-medium">TimeSync</span>, we don't just sell watches; we curate the instruments of your life's most meaningful journeys."
          </p>
          <div>
            <Link to='/about' className="inline-block px-12 py-4 border border-white/20 text-white text-xs tracking-widest font-bold uppercase hover:bg-white hover:text-black transition-all duration-500 rounded-sm">
                The Discovery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

