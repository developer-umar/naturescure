import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import PlantCard from "../components/PlantCard";  // ✅ Import PlantCard

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("/api/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error("Error fetching plants:", err));
  }, []);

  return (
    <div>
      <SearchBar setSearchResults={setSearchResults} />
      <h1 className="text-3xl font-bold">Herbal Plants</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(searchResults.length > 0 ? searchResults : plants).map((plant) => (
          <PlantCard key={plant._id} plant={plant} />  // ✅ Use PlantCard here
        ))}
      </div>
    </div>
  );
};

export default Home;
