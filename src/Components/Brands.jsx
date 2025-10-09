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
    <section className="py-12 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8 text-blue-600">
        Explore our Brands
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {brands.map((brand, index) => (
          <div key={index} className="group cursor-pointer">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-14 object-contain grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
