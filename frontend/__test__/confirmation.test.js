import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Confirmation from "../src/pages/confirmation/Confirmation";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";

// Mock the necessary modules
jest.mock("axios");
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    session_id: "12345",
  }),
  useLocation: () => ({
    search: '?state=%7B"hotelId":1,"roomType":"Deluxe","roomOnlyPrice":20000,"breakfastPrice":5000,"cancelPolicy":"Non-refundable","destinationId":2,"destination":"Paris","checkin":"2024-08-01","checkout":"2024-08-05","guests":2,"leadGuestEmail":"test@example.com","leadGuestFirstName":"John","hotelName":"Test Hotel"%7D',
  }),
}));

describe("Frontend Confirmation Page Unit and Integration Test", () => {
  const mockBookingFormDetails = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    specialRequests: "High floor",
  };

  const mockSearchDetails = {
    adults: 2,
    children: 0,
    checkin: "2024-08-01",
    checkout: "2024-08-05",
    days: 4,
    rooms: 1,
  };

  beforeEach(() => {
    localStorage.setItem("bookingFormDetails", JSON.stringify(mockBookingFormDetails));
    localStorage.setItem("search_details", JSON.stringify(mockSearchDetails));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("FRONTEND_CONFIRMATION_1: Should render the confirmation details correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: "Booking confirmed" });
    axios.post.mockResolvedValueOnce({ data: "Email sent" });

    render(
      <Router>
        <Confirmation />
      </Router>
    );

    // Check if loading message is shown
    expect(screen.queryByText(/Your booking has been confirmed!/)).not.toBeInTheDocument();

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

    // Check if confirmation details are displayed
    expect(screen.getByText(/Your booking has been confirmed!/)).toBeInTheDocument();
    expect(screen.getByText(/Guest's Name: John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Check-in Date: 2024-08-01/)).toBeInTheDocument();
    expect(screen.getByText(/Check-out Date: 2024-08-05/)).toBeInTheDocument();
    expect(screen.getByText(/Adults: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Children: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Rooms Booked: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Special Requests: High floor/)).toBeInTheDocument();
    expect(screen.getByText(/Booking reference: 12345/)).toBeInTheDocument();
  });

  it("FRONTEND_CONFIRMATION_2: Should handle 'Back to Home' button click", async () => {
    axios.post.mockResolvedValueOnce({ data: "Booking confirmed" });
    axios.post.mockResolvedValueOnce({ data: "Email sent" });

    render(
      <Router>
        <Confirmation />
      </Router>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

    const backToHomeButton = screen.getByText(/Back to Home/);
    fireEvent.click(backToHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("FRONTEND_CONFIRMATION_3: should handle errors when sending booking details", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to confirm booking"));

    render(
      <Router>
        <Confirmation />
      </Router>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Ensure the booking confirmation message is not shown
    expect(screen.queryByText(/Your booking has been confirmed!/)).not.toBeInTheDocument();
  });

  it("FRONTEND_CONFIRMATION_4: Should handle errors when sending confirmation email", async () => {
    axios.post.mockResolvedValueOnce({ data: "Booking confirmed" });
    axios.post.mockRejectedValueOnce(new Error("Failed to send email"));

    render(
      <Router>
        <Confirmation />
      </Router>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

    // Check if confirmation details are displayed
    expect(screen.getByText(/Your booking has been confirmed!/)).toBeInTheDocument();
  });
});
