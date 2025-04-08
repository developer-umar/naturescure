// fetching alll plants 
// export const fetchPlants = async () => {
//   try {
//     // console.log("🌿 Fetching plants from API..."); // ✅ Debugging
//     const response = await fetch("http://localhost:5000/api/plants");

//     // console.log("🔄 API Response:", response); // ✅ Debugging

//     if (!response.ok) {
//       throw new Error(`Failed to fetch plants: ${response.status}`);
//     }

//     const data = await response.json();
//     // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

//     return data;
//   } catch (error) {
//     // console.error("❌ Error fetching plants:", error);
//     return [];
//   }
// };

// fetching  ayurveda plants 

export const fetch_ayurvedic = async () => {

  try {

    const response = await fetch("/api/plants/category/ayurveda");



    // console.log("🔄 API Response:", response); // ✅ Debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }

    const data = await response.json();
    // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

    return data;
  } catch (error) {
    console.error("❌ Error fetching plants:", error);
    return [];
  }


};

// fetching   unani 

export const fetch_unani = async () => {

  try {

    const response = await fetch("/api/plants/category/unani");



    // console.log("🔄 API Response:", response); // ✅ Debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }

    const data = await response.json();
    // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

    return data;
  } catch (error) {
    console.error("❌ Error fetching plants:", error);
    return [];
  }


};
//fetch Siddha 


export const fetch_siddha = async () => {

  try {

    const response = await fetch("/api/plants/category/siddha");



    // console.log("🔄 API Response:", response); // ✅ Debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }

    const data = await response.json();
    // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

    return data;
  } catch (error) {
    console.error("❌ Error fetching plants:", error);
    return [];
  }


};

//  naturopathy 


export const fetch_naturopathy = async () => {

  try {

    const response = await fetch("/api/plants/category/naturopathy");



    // console.log("🔄 API Response:", response); // ✅ Debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }

    const data = await response.json();
    // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

    return data;
  } catch (error) {
    console.error("❌ Error fetching plants:", error);
    return [];
  }


};

//homeopathy

export const fetch_homeopathy = async () => {

  try {

    const response = await fetch("/api/plants/category/homeopathy");



    // console.log("🔄 API Response:", response); // ✅ Debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }

    const data = await response.json();
    // console.log("✅ Fetched Plants:", data); // ✅ Debugging output

    return data;
  } catch (error) {
    console.error("❌ Error fetching plants:", error);
    return [];
  }


};

// import { useState, useEffect } from "react";
// // import { fetchPlants } from "../api/fetchPlants";
// import PlantCard from "./PlantCard";

// const PlantsList = () => {
//   const [plants, setPlants] = useState([]);

//   useEffect(() => {
//     const getPlants = async () => {
//       try {
//         const data = await fetchPlants();
//         console.log("Fetched Plants:", data); 
//         if (Array.isArray(data)) {
//           setPlants(data);
//         } else {
//           console.error("Data format incorrect:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching plants:", error);
//       }
//     };

//     getPlants();
//   }, []);

//   return (
//     <div className="grid grid-cols-4 gap-4 p-4 mt-10">
//       {plants.length === 0 ? (
//         <p className="text-center text-gray-500">No plants found</p>
//       ) : (
//         plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)
//       )}
//     </div>
//   );
// };

// export default PlantsList;
