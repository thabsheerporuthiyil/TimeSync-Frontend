import Navbar from "../Components/Navbar";
import Featured from "../Components/Featured";
import HomeCarousel from "../Components/HomeCarousel";
import Brands from "../Components/Brands";
import AboutUs from "../Components/AboutUs";


export default function Home() {
  return (
    <div className="bg-white selection:bg-blue-100 min-h-screen">
      <Navbar />
      <main>
        <HomeCarousel />
        <section className="mt-20 mb-28">
           <Brands />
        </section>
        <section className="mb-32">
           <Featured />
        </section>
        <section className="mb-40">
           <AboutUs />
        </section>
      </main>
    </div>
  );
}