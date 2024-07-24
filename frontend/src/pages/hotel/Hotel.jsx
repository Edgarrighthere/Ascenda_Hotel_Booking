import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './hotel.css';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';
import TrustYouScore from '../../components/trustYouScore/TrustYouScore';
import Categories from '../../components/categories/Categories';
import AmenitiesList from '../../components/amenities/Amenities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import RoomList from '../../components/room/Room';
import Map from '../../components/maps/Map';
import { ImageRounded } from '@mui/icons-material';

const Hotel = () => {
  const { id } = useParams();
  const location = useLocation();
  const {
    destinationId,
    hotel,
    destination,
    checkin,
    checkout,
    guests,
  } = location.state || {};
  const [price, setPrice] = useState(location.state?.price || 0);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [rawinfo, setRawInfo] = useState(null); // Initialize rawinfo as null initially
  const [rooms, setRooms] = useState(null); // Separate state for rooms

  useEffect(() => {
    const fetchRawInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/room_details/${id}/${destinationId}/${checkin}/${checkout}/${guests}`, 
          {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRawInfo(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRawInfo();
   
  }, [id, destinationId, checkin, checkout, guests]);

  useEffect(() => {
    if (rawinfo) {
      const loadedRooms = rawinfo.rooms_available
        ? rawinfo.rooms_available.slice(0, 5).map((room_variation) => ({
            roomType: room_variation.roomNormalizedDescription,
            imageUrl: room_variation.images[0],
            roomOnlyPrice: room_variation.chargeableRate,
            breakfastPrice: room_variation.chargeableRate + 50,
            cancelPolicy: room_variation.freeCancellation
              ? 'Free cancellation (except a service fee, if applicable)'
              : 'No free cancellation',
            all_room_info:room_variation,
          }))
        : [];
      setRooms(loadedRooms);
      
    }
  }, [rawinfo]);

  if (rawinfo === null || rooms === null) {
    return <div>Loading...</div>;
  }

  const photos = Array.from({ length: Math.min(rawinfo.number_of_images, 9) }).map((_, index) => ({
    src: `${rawinfo.image_details.prefix}${index}${rawinfo.image_details.suffix}`,
  }));

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === 'l') {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const categories = {
    overall: {
      name: 'Overall',
      score: rawinfo.trustyou?.score?.overall || 0,
      popularity: rawinfo.trustyou?.score?.kaligo_overall || 0,
    },
    romantic_hotel: {
      name: 'Romantic Hotel',
      score: rawinfo.trustyou?.score?.solo || 0,
      popularity: rawinfo.trustyou?.score?.couple || 0,
    },
    family_hotel: {
      name: 'Family Hotel',
      score: rawinfo.trustyou?.score?.family || 0,
      popularity: rawinfo.trustyou?.score?.business || 0,
    },
    business_hotel: {
      name: 'Business Hotel',
      score: rawinfo.trustyou?.score?.business || 0,
      popularity: 23.8,
    },
  };

  const amenities = rawinfo.amenities || [];

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              data-test="arrowLeft"
              onClick={() => handleMove('l')}
            />
            <div className="sliderWrapper">
              <img
                src={photos[slideNumber].src}
                alt=""
                className="sliderImg"
                data-test="sliderImgCurrent"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              data-test="arrowRight"
              onClick={() => handleMove('r')}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow">Book Now!</button>
          <h1 className="hotelTitle">{rawinfo.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{rawinfo.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location - 500m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over at $114 and get free airport transfer
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                  style={{
                    width: '100%', 
                    height: 'auto', 
                    aspectRatio: '1 / 1', 
                    cursor: 'pointer', 
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 data-test="hotelDescTitle" className="hotelTitle">Stay in the Heart of the City</h1>
              <p
                className="hotelDescription"
                dangerouslySetInnerHTML={{ __html: rawinfo.description }}
              />
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-night stay!</h1>
              <span>
                [HARDCODEDLocated in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
                <b>${price * 9}</b> (9 nights)
              </h2>
              <button className="bookNow">Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        {<div className="centeredContainer">
          <div data-test="trustYouScore" className="centeredContent">
            <TrustYouScore
              overall={rawinfo.trustyou?.score?.overall || 0}
              kaligo={rawinfo.trustyou?.score?.kaligo_overall || 0}
              solo={rawinfo.trustyou?.score?.solo || 0}
              couple={rawinfo.trustyou?.score?.couple || 0}
              family={rawinfo.trustyou?.score?.family || 0}
              business={rawinfo.trustyou?.score?.business || 0}
            />
          </div>
        </div> }
        <div className="centeredContainer categoriesContainer">
          <div data-test="categories" className="centeredContent">
            <Categories categories={categories} />
          </div>
        </div>
        <div className="centeredContainer amenitiesContainer">
          <div data-test="amenities" className="centeredContent">
            <AmenitiesList amenities={amenities} />
          </div>
        </div>
        <div className="centeredContainer roomListContainer">
          <div data-test="rooms" className="centeredContent">
            <RoomList rooms={rooms} />
          </div>
        </div>
        <div className="centeredContainer mapContainer">
          <div data-test="maps" className="centeredContent">
            <Map lat={rawinfo.latitude} lng={rawinfo.longitude} />
          </div>
        </div>
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
