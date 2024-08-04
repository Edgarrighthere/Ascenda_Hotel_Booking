import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import TrustYouScore from "../../components/trustYouScore/TrustYouScore";
import Categories from "../../components/categories/Categories";
import AmenitiesList from "../../components/amenities/Amenities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import RoomList from "../../components/room/Room";
import Map from "../../components/maps/Map";

const Hotel = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateFromParams = queryParams.get("state")
    ? JSON.parse(decodeURIComponent(queryParams.get("state")))
    : {};

  const {
    destinationId,
    hotel,
    destination,
    checkin,
    checkout,
    guests,
    roomOnlyPrice,
    hotelName,
  } = location.state || stateFromParams || {};

  const [price, setPrice] = useState(
    stateFromParams.roomOnlyPrice || location.state?.price || 0
  );
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [rawinfo, setRawInfo] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [loadingRawInfo, setLoadingRawInfo] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [differenceinDays, setDifferenceInDays] = useState(0);

  useEffect(() => {
    const fetchRawInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/room_details/${id}/${destinationId}/${checkin}/${checkout}/${guests}`,

          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRawInfo(data);
        setLoadingRawInfo(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRawInfo();
    let checkinDate = new Date(checkin);
    let checkoutDate = new Date(checkout);
    const time_diff = checkoutDate.getTime() - checkinDate.getTime();
    setDifferenceInDays(Math.round(time_diff / (1000 * 3600 * 24)));
  }, [id, destinationId, checkin, checkout, guests]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const hotelId = queryParams.get("hotelId");
    const destinationId = queryParams.get("destinationId");
    const checkin = queryParams.get("checkin");
    const checkout = queryParams.get("checkout");
    const guests = queryParams.get("guests");

    if (hotelId && destinationId && checkin && checkout && guests) {
      fetch(
        `http://localhost:5000/room_details/${id}/${destinationId}/${checkin}/${checkout}/${guests}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle the data from the room details endpoint
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching room details:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (rawinfo) {
      const loadedRooms = rawinfo.rooms_available
        ? rawinfo.rooms_available.slice(0, 10).map((room_variation) => ({
            roomType: room_variation.roomNormalizedDescription,
            imageUrl: room_variation.images[0],
            roomOnlyPrice: room_variation.chargeableRate,
            breakfastPrice: room_variation.chargeableRate + 50,
            cancelPolicy: room_variation.freeCancellation
              ? "Free cancellation (except a service fee, if applicable)"
              : "No free cancellation",
            all_room_info: room_variation,
          }))
        : [];
      setRooms(loadedRooms);
      setLoadingRooms(false);
    }
  }, [rawinfo]);

  const photos = rawinfo
    ? Array.from({ length: Math.min(rawinfo.number_of_images, 9) }).map(
        (_, index) => ({
          src: `${rawinfo.image_details.prefix}${index}${rawinfo.image_details.suffix}`,
        })
      )
    : [];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const categories = rawinfo
    ? {
        overall: {
          name: "Overall",
          score: rawinfo.trustyou?.score?.overall || 0,
          popularity: rawinfo.trustyou?.score?.kaligo_overall || 0,
        },
        romantic_hotel: {
          name: "Romantic Hotel",
          score: rawinfo.trustyou?.score?.solo || 0,
          popularity: rawinfo.trustyou?.score?.couple || 0,
        },
        family_hotel: {
          name: "Family Hotel",
          score: rawinfo.trustyou?.score?.family || 0,
          popularity: rawinfo.trustyou?.score?.business || 0,
        },
        business_hotel: {
          name: "Business Hotel",
          score: rawinfo.trustyou?.score?.business || 0,
          popularity: 23.8,
        },
      }
    : {};

  const amenities = rawinfo?.amenities || [];

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {loadingRawInfo || loadingRooms ? (
          <div>
            <p />
            <img src="./../images/loading.gif" alt="Loading..." />
          </div>
        ) : (
          <>
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
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  <img
                    src={photos[slideNumber].src}
                    alt=""
                    className="sliderImg"
                  />
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
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
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <h1 className="hotelTitle">Stay in the Heart of the City</h1>
                  <p
                    className="hotelDescription"
                    dangerouslySetInnerHTML={{ __html: rawinfo.description }}
                  />
                </div>
                <div className="hotelDetailsPrice">
                  <h1>Perfect for a {differenceinDays}-night stay!</h1>
                  <span>
                    [HARDCODED] Located in the real heart of Krakow, this
                    property has an excellent location score of 9.8!
                  </span>
                  <h2>
                    <b>${(price * differenceinDays).toFixed(2)}</b>
                  </h2>
                  <button>Reserve or Book Now!</button>
                </div>
              </div>
            </div>
            <div className="centeredContainer">
              <div className="centeredContent">
                <TrustYouScore
                  overall={rawinfo.trustyou?.score?.overall || 0}
                  kaligo={rawinfo.trustyou?.score?.kaligo_overall || 0}
                  solo={rawinfo.trustyou?.score?.solo || 0}
                  couple={rawinfo.trustyou?.score?.couple || 0}
                  family={rawinfo.trustyou?.score?.family || 0}
                  business={rawinfo.trustyou?.score?.business || 0}
                />
              </div>
            </div>
            <div className="centeredContainer categoriesContainer">
              <div className="centeredContent">
                <Categories categories={categories} />
              </div>
            </div>
            <div className="centeredContainer amenitiesContainer">
              <div className="centeredContent">
                <AmenitiesList amenities={amenities} />
              </div>
            </div>
            <div className="centeredContainer roomListContainer">
              <div className="centeredContent">
                <RoomList
                  hotelName={hotelName}
                  rooms={rooms}
                  hotelId={id}
                  destinationId={destinationId}
                  destination={destination}
                  checkin={checkin}
                  checkout={checkout}
                  guests={guests}
                  address={rawinfo.address}
                />
              </div>
            </div>
            <div className="centeredContainer mapContainer">
              <div className="centeredContent">
                <Map lat={rawinfo.latitude} lng={rawinfo.longitude} />
              </div>
            </div>
          </>
        )}
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
