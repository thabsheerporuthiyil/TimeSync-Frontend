import { ArrowRight, Award, Globe, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-white selection:bg-blue-100 pt-32 pb-20">
      {/* 1. Hero / Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-blue-600 mb-6 bg-blue-50 px-4 py-2 rounded-full">
            The TimeSync Story
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight mb-8">
            Precision in <span className="font-light text-gray-400">Every Moment</span>
          </h1>
          <p className="max-w-2xl text-gray-500 text-lg md:text-xl font-light leading-relaxed">
            Founded in 1994, TimeSync has evolved from a boutique workshop into a 
            global sanctuary for horological enthusiasts and collectors.
          </p>
        </div>
      </section>

      {/* 2. Visual Storytelling Section */}
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://cdn4.ethoswatches.com/the-watch-guide/wp-content/uploads/2025/08/Bell-Ross-BR-05-36mm-Masthead-Desktop@2x-2048x789.jpg"
                alt="Watchmaking Excellence"
                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Design Element: Floating Label */}
            <div className="absolute -bottom-10 -right-10 hidden xl:block bg-blue-600 text-white p-10 rounded-2xl shadow-xl max-w-xs">
              <p className="text-3xl font-serif mb-2 italic">30+</p>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Years of Horological Expertise</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-[1px] w-20 bg-blue-600"></div>
            <h2 className="text-4xl font-serif text-gray-900 leading-snug">
              Curating Legacies, <br /> 
              <span className="italic text-gray-400 font-light text-3xl">Not Just Timepieces.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              We believe a watch is more than an instrument; it's a testament to 
              human achievement and a vessel for memories. Our master curators 
              scour the globe for pieces that balance mechanical perfection 
              with artistic soul.
            </p>
            
            <div className="grid grid-cols-2 gap-10 pt-6">
              <div>
                <p className="text-2xl font-serif text-gray-900 mb-1">Global</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Authenticity Chain</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-gray-900 mb-1">Lifetime</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Service Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Three Pillars (Refined Values) */}
      <section className="bg-gray-50 py-32 mb-40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">Our Core Philosophy</h2>
            <p className="text-3xl font-serif text-gray-900">Excellence in Every Detail</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-2">
                <Award size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-900">Curation</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Every brand we host undergoes a rigorous selection process based on 
                movement quality and heritage.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-2">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-900">Trust</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                100% certified authenticity. Our in-house horologists inspect every 
                component before it reaches your wrist.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-2">
                <Globe size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-900">Heritage</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Bridging the gap between 19th-century craftsmanship and 21st-century 
                innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial CTA */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gray-900 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">
              Experience the <span className="italic text-blue-400 font-light">Craft</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
              Step into our virtual gallery or visit our flagship boutiques 
              worldwide for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/watches"
                className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white flex items-center gap-2 group/btn"
              >
                View Collection <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="border border-white/20 text-white px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-white hover:text-gray-900"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}