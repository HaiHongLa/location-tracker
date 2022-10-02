import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

const MapContainer = (props) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
      <GoogleMap
        mapContainerStyle={{
          height: "100vh",
          width: "100%",
        }}
        zoom={15}
        center={props.centerLoc}
      >
        {/* {locations.map((item) => {
          return (
            <MarkerF
              key={item.name}
              position={item.location}
              draggable
              onClick={() => {
                onSelect(item);
              }}
            />
          );
        })}
        {selected.location && (
          <InfoWindowF
            position={selected.location}
            clickable={true}
            onCloseClick={() => setSelected({})}
          >
            <p>This is a real place pinged on map</p>
          </InfoWindowF>
        )} */}
        {props.locations &&
          props.locations.map((loc) => (
            <MarkerF
              key={Math.random()}
              label={{
                text: loc.name,
                fontSize: "18px",
                fontWeight: "600",
                color: "#062359",
              }}
              position={{ lat: loc.loc.lat, lng: loc.loc.lng }}
              icon={{
                url: require("../../assets/locicon3.png"),
                labelOrigin: { x: 30, y: 70 },
              }}
            ></MarkerF>
          ))}
        {/* <MarkerF
          label={{
            text: "Hai Hong La",
            fontSize: "18px",
            fontWeight: "600",
            color: "#062359",
          }}
          position={{ lat: 43.0680113801934, lng: -89.40717970112938 }}
          icon={{
            url: require("../../assets/locicon3.png"),
            labelOrigin: { x: 30, y: 70 },
          }}
        ></MarkerF> */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
