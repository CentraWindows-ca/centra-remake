"use   client";
import styles from "./workorderComponents.module.css";
import React, { useCallback, useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import Geocode from "react-geocode";

export default function WOInfoBar(props) {
  const {
    show,
    setShow,
    data
  } = props;

  const [latitude, setLatitude] = useState(49.18103828678011); // Map defaults to Centra Langley
  const [longitude, setLongitude] = useState(-122.6618332736532);

  const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: latitude, lng: longitude }}
      defaultOptions={{ fullscreenControl: false }}
    >
      <Marker
        position={{ lat: latitude, lng: longitude }}
      />
    </GoogleMap>
  ));

  useEffect(() => {
    if (data?.address && Geocode && show) {
      Geocode.setLocationType("ROOFTOP");
      Geocode.setLanguage("en");
      Geocode.setApiKey("AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U");

      Geocode.fromAddress(data.address).then(
        (response) => {
          const { lat, lng } = response?.results[0]?.geometry?.location;
          setLatitude(lat);
          setLongitude(lng);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [data, show]);

  return (
    <>
      <Modal
        open={show}
        onClose={() => { setShow(false) }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: "3px"
        }}
          className={styles.mapModal}
        >
          <div style={{ height: '400px', width: '100%' }}>
            <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
        </Box>
      </Modal>
    </>
  )
}