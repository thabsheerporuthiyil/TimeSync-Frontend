import Navbar from "../Components/Navbar";
import Featured from "../Components/Featured";

import HomeCarousel from "../Components/HomeCarousel";
import Brands from "../Components/Brands";
import AboutUs from "../Components/AboutUs";

export default function Home() {
  return (
    <div>
        <Navbar/>
        <HomeCarousel/>
        <Featured/>
        <Brands/>
        <AboutUs/>
    </div>
    
  );
}
