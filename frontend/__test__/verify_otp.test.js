import { render, screen, cleanup, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import InputOTP from "../src/pages/authentication/InputOTP";
import mockAxios from 'jest-mock-axios';
import React from "react";

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

describe('Frontend Login Integration with verify_OTP Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
      act(() => {
          render(
              <BrowserRouter>
                  <InputOTP />
              </BrowserRouter>
          );
      });
    });

    test('FRONTEND_VERIFY_OTP_1: Check if the /inputOTP header is present', () => {
      const verifyOTPHeader = screen.getByText('2FA Authentication', { selector: '.otpTitle' });
      expect(verifyOTPHeader).toBeInTheDocument();
      expect(verifyOTPHeader).toHaveClass('otpTitle');
    });

    test('FRONTEND_VERIFY_OTP_2: Check if the input OTP section is present with 6 input boxes', () => {
      // Verify the presence of exactly 6 input fields for OTP
      const otpInputs = screen.getAllByRole('textbox', { name: '' });
      expect(otpInputs).toHaveLength(6);
      
      // Optionally, you can check if they are of the correct type
      otpInputs.forEach(input => {
          expect(input).toHaveAttribute('type', 'text');
      });
    });

    test('FRONTEND_VERIFY_OTP_3: Check if the "verify OTP" button is present', async () => {
      const verifyOTPButton = screen.getByRole('button', { name: /Verify OTP/i });
      expect(verifyOTPButton).toBeInTheDocument();
      userEvent.click(verifyOTPButton);

      const errorMessage = await screen.findByText(/OTP must be 6 digits./i);
      expect(errorMessage).toBeInTheDocument();
    });

    test('FRONTEND_VERIFY_OTP_4: Check if the "resend code" button is present', async () => {
      const resendCodeButton = screen.getByRole('button', { name: /Resend code/i });
      expect(resendCodeButton).toBeInTheDocument();
    });
});
