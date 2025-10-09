export default function About() {
  return (
    <section className="min-h-screen bg-white py-24 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <div className="inline-block mb-6">
          <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-blue-600 font-medium tracking-widest uppercase">
            Excellence in Timekeeping
          </div>
        </div>
        <h1 className="text-5xl text-gray-900 mb-6 tracking-tight">
          About <span className="text-black font-medium">Time</span>
          <span className="font-medium text-blue-600">Sync</span>
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
          Discover timeless elegance with our curated collection of premium watches. 
          Where exceptional craftsmanship meets innovative design to redefine luxury horology.
        </p>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://cdn4.ethoswatches.com/the-watch-guide/wp-content/uploads/2025/08/Bell-Ross-BR-05-36mm-Masthead-Desktop@2x-2048x789.jpg"
              alt="Luxury watch craftsmanship"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {/* Subtle shadow effect */}
          <div className="absolute -inset-4 -z-10">
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl opacity-60"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-blue-600"></div>
            <span className="text-blue-600 font-medium tracking-widest text-sm uppercase">Our Heritage</span>
          </div>
          <h2 className="text-4xl font-light text-gray-900 leading-tight">
            Crafting Timeless <span className="font-serif italic">Legacies</span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg font-light">
            Founded with an unwavering passion for excellence, TimeSync transcends 
            conventional watch retail. Each timepiece is meticulously curated to 
            embody precision, sophistication, and enduring design. Our collection 
            represents the pinnacle of horological artistry.
          </p>
          <div className="pt-4">
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600">Est. 2015</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600">Global Presence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600">Certified Authenticity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto mb-24">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-blue-600 font-medium tracking-widest uppercase">
              Our Pillars
            </div>
          </div>
          <h2 className="text-3xl font-light text-gray-900">Excellence Defined</h2>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Master Craftsmanship",
              description: "Traditional techniques harmonized with cutting-edge innovation in every timepiece.",
              gradient: "from-blue-500 to-cyan-400"
            },
            {
              icon: "💎",
              title: "Uncompromising Luxury",
              description: "Premium collections designed to transcend trends and become family heirlooms.",
              gradient: "from-purple-500 to-pink-400"
            },
            {
              icon: "❤️",
              title: "Client Excellence",
              description: "Personalized service ensuring trust, authenticity, and lifelong relationships.",
              gradient: "from-rose-500 to-orange-400"
            }
          ].map((value, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-500 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-300`}>
                  <span className="text-white text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-light text-white mb-6">
              Discover Your Legacy
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto font-light">
              Explore our exclusive collection and find the masterpiece that reflects your unique journey through time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/watches"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium group"
              >
                Explore Collection
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:bg-opacity-10 hover:text-gray-900 transition-all duration-300 font-medium"
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}