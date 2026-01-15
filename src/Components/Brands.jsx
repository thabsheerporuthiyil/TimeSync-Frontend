import rolex from "../assets/rolex.svg";
import hublot from "../assets/hublot.png";
import casio from "../assets/casio.png";
import titan from "../assets/titan.png";
import seiko from "../assets/seiko.png";

export default function Brands() {
  const brands = [
    { name: "Titan", logo: titan },
    { name: "Rolex", logo: rolex },
    { name: "Hublot", logo: hublot },
    { name: "Casio", logo: casio },
    { name: "Seiko", logo: seiko },
  ];

  return (
    <section className="py-12 bg-gray-50/50 border-y border-gray-100/50">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-12">
            Authorized Retailer of Global Icons
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {brands.map((brand, index) => (
            <div key={index} className="group transition-all">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 md:h-12 object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
