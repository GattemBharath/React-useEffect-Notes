import React, { useEffect, useState, useCallback } from "react";
import "./triplist.css";

import "../hooks/useFetch";
import { useFetch } from "../hooks/useFetch";

const TripList = () => {
  // const [trips, setTrips] = useState([]);
  const [url, setUrl] = useState("http://localhost:3000/trips");

  // console.log(trips);

  /*
  useCallback is used to prevent function dependencies triggering useEffect reruns all the time.
*/

  // const fetchTrips = useCallback(async () => {
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   setTrips(data);
  // }, [url]);

  // useEffect(() => {
  //   // fetch(url)
  //   //   .then((res) => res.json())
  //   //   .then((data) => setTrips(data));
  //   fetchTrips();
  // }, [fetchTrips]);

  const { data: trips, isPending, error } = useFetch(url, { type: "GET" });

  return (
    <div className="trip-list">
      <h2>Trip List</h2>
      {isPending && <div>Loading trips...</div>}
      {error && <div>{error}</div>}
      <ul>
        {!isPending &&
          trips &&
          trips.map((trip) => {
            return (
              <li key={trip.id}>
                <h3>{trip.title}</h3>
                <p>{trip.price}</p>
              </li>
            );
          })}
      </ul>
      <div className="filters">
        <button
          onClick={() => setUrl("http://localhost:3000/trips?loc=europe")}
        >
          European Trips
        </button>
        <button
          onClick={() => setUrl("http://localhost:3000/trips?loc=america")}
        >
          American Trips
        </button>
        <button onClick={() => setUrl("http://localhost:3000/trips")}>
          All Trips
        </button>
      </div>
    </div>
  );
};

export default TripList;
