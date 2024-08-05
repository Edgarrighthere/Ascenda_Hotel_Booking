import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import BookingForm from "../src/pages/confirmation/BookingForm";
import '@testing-library/jest-dom';

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Frontend BookingForm Unit and Integration Test", () => {
  test("FRONTEND_BOOKING_FORM_1: Renders the booking form", () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Enter Your Booking Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upgrade to Breakfast Package\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Special Requests:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Proceed to Payment/i })).toBeInTheDocument();
  });

  test("FRONTEND_BOOKING_FORM_2: Shows error message if required fields are missing", async () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    expect(await screen.findByText(/Please fill in all required fields./i)).toBeInTheDocument();
  });

  test("FRONTEND_BOOKING_FORM_3: Shows error message if email is invalid", async () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name:/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    expect(await screen.findByText(/Please provide a valid email address./i)).toBeInTheDocument();
  });

  test("FRONTEND_BOOKING_FORM_4: Shows error message if phone number is invalid", async () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name:/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), {
      target: { value: "invalid-phone" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    expect(await screen.findByText(/Please provide a valid phone number./i)).toBeInTheDocument();
  });

  test("FRONTEND_BOOKING_FORM_5: Fills and submits the form", async () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name:/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByLabelText(/Upgrade to Breakfast Package\?/i));
    fireEvent.change(screen.getByLabelText(/Special Requests:/i), {
      target: { value: "Late check-in" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));
  });

  test("FRONTEND_BOOKING_FORM_PROCEED_BUTTON: Proceed to Payment button works", async () => {
    const mockResponse = { data: { id: "session_id" } };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <BookingForm />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/First Name:/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Special Requests:/i), {
      target: { value: "Late check-in" },
    });

    // Click the Proceed to Payment button
    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    // Check if the axios post request was made with correct data
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Optionally, you can check if the data is stored in localStorage correctly
    const bookingFormDetails = JSON.parse(localStorage.getItem("bookingFormDetails"));
    expect(bookingFormDetails).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      specialRequests: "Late check-in"
    });
  });
});