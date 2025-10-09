import aboutVideo from '../assets/vid.mp4';

export default function AboutUs() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-20">
      <div className="grid md:grid-cols-2 items-center max-w-6xl mx-auto">
        
        {/* Left Side Video */}
        <div>
          <video
            src={aboutVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[400px] object-cover rounded-l-xl shadow-lg"
          />
        </div>

        {/* Right Side Content */}
        <div className="bg-gray-100 p-10 rounded-r-xl shadow-md text-center flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">About Us</h2>
          <p className="text-gray-600 leading-relaxed max-w-xl">
            At <span className="font-semibold text-gray-800">TimeSync</span>, we craft premium watches that blend precision, style, and durability.
            Each piece is designed to elevate your look and keep you in perfect sync with every moment.
          </p>
        </div>
      </div>
    </section>
  );
}
