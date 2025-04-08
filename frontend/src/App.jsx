import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ImageSlider from "./components/ImageSlider";
// import PlantsList from "./components/PlantsList";
import PlantsDetails from "./Pages/PlantsDetails";
import HerbalWisdom from "./components/HerbalWisdom";
import HerbalIntro from "./components/HerbalIntro";
// import About from "./Pages/About";
import Footer from "./components/Footer";
import Herba from "../Herba";
import Categories from "./Pages/Categories";
import Ayurveda from "./Pages/Ayurveda";
import Unani from "./Pages/Unani";

import Siddha from "./Pages/Siddha";
import Homeopathy from "./Pages/Homeopathy";
import Naturopathy from "./Pages/Naturopathy";
import Content from "./components/Content";
import Content_2 from "./components/Content_2";
import HerbalQuiz from "./Pages/HerbalQuiz";
import HerbalRemedyFinder from "./Pages/HerbalRemedyFinder";
import Cart from "./Pages/Cart";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";

import { Provider } from "react-redux";
import store from "./app/store";

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutForm from "./components/purchaseItem/CheckoutModal";
import  YourOrder  from "./components/purchaseItem/YourOrder";
import TrackOrder from "./components/purchaseItem/TrackOrder";
import Profile from "./components/auth/Profile";

// ✅ Protected Route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// ✅ `App.js` me protected routes implement karein



function App() {

  return (
    <Provider store={store}>
      <Router>  {/* ✅ Ensure the entire app is wrapped inside Router */}
        <Navbar />
        <Routes>
          <Route path="/"

            element={
              <>
                <ImageSlider />
                <HerbalIntro />




                {/* <PlantsList /> */}
                <Content />
                <Content_2 />
                <HerbalWisdom />
                <Footer />


              </>
            } />

          <Route path="/plants/:id" element={<ProtectedRoute element={<PlantsDetails />} />} />

          <Route path="/plants/:id" element={<PlantsDetails />} />
          <Route path="/remidy" element={<ProtectedRoute element={<HerbalRemedyFinder />} />} />

          <Route path="/herba" element={<ProtectedRoute element={<Herba />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/yourorder" element={<ProtectedRoute element={<YourOrder />} />} />
          <Route path="/cart/checkout" element={<ProtectedRoute element={<CheckoutForm />} />} />
          <Route path="/trackorder" element={<ProtectedRoute element={<TrackOrder />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/categories" element={<ProtectedRoute element={<Categories />} />} />

          <Route path="/quiz" element={<ProtectedRoute element={<HerbalQuiz />} />} />

          <Route path="/categories/ayurveda" element={<ProtectedRoute element={<Ayurveda />} />} />
          <Route path="/categories/unani" element={<ProtectedRoute element={<Unani />} />} />
          <Route path="/categories/naturopathy" element={<ProtectedRoute element={<Naturopathy />} />} />
          <Route path="/categories/siddha" element={<ProtectedRoute element={<Siddha />} />} />
          <Route path="/categories/homeopathy" element={<ProtectedRoute element={<Homeopathy />} />} />




        


        </Routes>
      </Router>
    </Provider>

  );
}

export default App;
