// Amenities.test.js
import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import Amenities from "../src/components/amenities/Amenities";

describe("Amenities component", () => {
  it("renders without crashing and displays the amenities", () => {
    const amenities = {
      pool: true,
      gym: true,
      freeBreakfast: true,
      parking: true,
    };

    const { getByText } = render(<Amenities amenities={amenities} />);

    expect(getByText("Amenities")).toBeInTheDocument();
    expect(getByText("pool")).toBeInTheDocument();
    expect(getByText("gym")).toBeInTheDocument();
    expect(getByText("freeBreakfast")).toBeInTheDocument();
    expect(getByText("parking")).toBeInTheDocument();
  });

  it("handles empty amenities", () => {
    const amenities = {};

    const { getByText } = render(<Amenities amenities={amenities} />);

    expect(getByText("Amenities")).toBeInTheDocument();
    // Checking if the list is empty or if there's a message indicating no amenities available
    expect(document.querySelector('.amenities-list').children.length).toBe(0);
  });
});