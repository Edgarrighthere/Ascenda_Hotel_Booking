import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from '../../pages/authentication/Login.jsx';

it("submits username and password", () => {
    const email = "edgaraw29@gmail.com";
    const password = "Edgar123!";
    const onSubmit = jest.fn();
    render(<Login onSubmit={handleLogin} />);
  
    userEvent.type(screen.getByLabelText(/Enter your registered email./i), email);
  
    userEvent.type(screen.getByLabelText(/Enter your registered password./i), password);
  
    userEvent.click(screen.getByText(/Login/i));

    userEvent.click(screen.getByText(/Forgot Password?/i));
  
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
        email,
        password
    });
});
  