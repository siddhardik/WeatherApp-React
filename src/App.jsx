import { CircularProgress, Slide, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';



function App() {

  // For Auto Loaction Nearest City
  // const [userLocation, setUserLocation] = useState(null);
  const [nearestCity, setNearestCity] = useState("Medinipur");

  useEffect(() => {
    // Get user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // setUserLocation({ latitude, longitude });
  
        // Send the coordinates to the server
        axios
          .get(`/nearest-city?latitude=${latitude}&longitude=${longitude}`)
          .then((response) => {
            const nearestCityArray = response.data.nearestCity;
  
            if (nearestCityArray && nearestCityArray.length > 0) {
              // Access the first element of the array

              const city = nearestCityArray[0];
              setNearestCity(city);
            } else {
              // Handle the case where the array is empty
              setNearestCity("Kolkata"); // Default to Kolkata
            }
          })
          .catch((error) => {
            console.error('Error fetching nearest city:', error);
          });
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, []);



  const [cityName, setCityName] = useState(nearestCity);
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f35e1c39d76e47b8cfc0ab69bd961953&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };

  return (
    <div className="bg_img">
      {!loading ? (
        <>
          <TextField
            variant="filled"
            label="Search location"
            className="input"
            error={error}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <h1 className="city">{data.name}</h1>
          <div className="group">
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt=""
            />
            <h1>{data.weather[0].main}</h1>
          </div>

          <h1 className="temp">{data.main.temp.toFixed()} °C</h1>

          <Slide direction="right" timeout={800} in={!loading}>
            <div className="box_container">
              <div className="box">
                <p>Humidity</p>
                <h1>{data.main.humidity.toFixed()}%</h1>
              </div>

              <div className="box">
                <p>Wind</p>
                <h1>{data.wind.speed.toFixed()} km/h</h1>
              </div>

              <div className="box">
                <p>Feels Like</p>
                <h1>{data.main.feels_like.toFixed()} °C</h1>
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;
