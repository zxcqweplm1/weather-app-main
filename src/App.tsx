import { Card } from "./card";
import Header from "./components/header";
import { openMeteo } from "./api/openmeteo";
import { useEffect, useRef, useState } from "react";
import type { Place, Weather } from "./types/types";
import { getLocation } from "./api/nominatim";
import { useNavigate } from "react-router-dom";

function App() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const timerRef = useRef<number | null>(null);
  const [focus, setFocus] = useState(false);
  const [unit, setUnit] = useState("Metric");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  const navigate = useNavigate();
  const handleClick = async () => {
    if(!location) return;
    setSelectedLocation(location);
    setNoResults(false);
    await fetchWeather(location, unit);
  };

  const fetchWeather = async (location: string, unit: string) => {
    try {
      setSearch(true);
      const getApiData = await openMeteo(location, unit);
      if (!getApiData) {
        setWeather(null);
        setNoResults(true);
        return;
      }
      setWeather(getApiData as Weather);
    } catch (err) {
      console.error(err);
      navigate("/error");
    } finally {
      setFocus(false);
      setSearch(false);
    }
  }

  const handleSearch = (e: any) => {
    setLoading(true);
    const value = e.target.value;
    setLocation(value);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(async () => {
      try {
        const results = await getLocation(value);
        if (!results) return;
        setSuggestions(results ?? []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (location == "") {
      setSuggestions([]);
    }
  }, [location]);

  useEffect(() => {
    if(!selectedLocation) return;
      fetchWeather(selectedLocation, unit);
  }, [unit, selectedLocation])

  return (
    <>
      <Header 
      unit={unit}
      setUnit={setUnit}
      />
      <section>
        <div className="flex flex-col items-center text-center justify-center">
          <h1 className="mt-10 font-bold text-5xl leading-15">
            How's the sky looking today?
          </h1>
          <div className="flex xl:flex-row xl:w-170 relative w-full">
            <div className="w-full flex xl:flex-row flex-col items-start mt-10">
              <div className="relative w-full">
                <input
                  placeholder="Search for a place..."
                  className="bg-neutral-600 rounded-lg p-3 w-full"
                  value={location}
                  onChange={handleSearch}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  required
                  />

                {focus && (
                  <div className="absolute left-0 right-0 mt-1">
                    {loading ? (
                      <div className="bg-neutral-700 w-full rounded-lg h-10 text-start content-end p-2 pl-5">
                        <span>Search in progress</span>
                      </div>
                    ) : (
                      suggestions.map((result) => (
                        <div
                          key={result.place_id}
                          className="bg-neutral-700 w-full rounded-lg h-10 text-start content-end p-2 pl-5"
                        >
                          <button
                            className="text-md cursor-pointer"
                            onMouseDown={() => setLocation(result.display_name)}
                          >
                            <span>{result.display_name}</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button
                className="bg-blue-500 xl:ml-2 xl:mt-0 mt-3 rounded-lg p-3 font-bold cursor-pointer w-full flex-1"
                onClick={handleClick}
              >
                Search
              </button>
            </div>
          </div>
      {noResults && <p className="mt-10 font-bold text-2xl">No search result found!</p>}
        </div>
      </section>
      <section className="">
        <Card onRefresh={handleClick} data={weather} loading={search} unit={unit} />
      </section>
    </>
  );
}

export default App;
