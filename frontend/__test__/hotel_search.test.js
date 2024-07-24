import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import mockAxios from 'jest-mock-axios'
import React from "react"
import { act } from "react"
import Header from '../src/components/header/Header'

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}))

afterEach(() => {
    mockAxios.reset()
    cleanup()
})

describe('Frontend Hotel Search Unit Test', () => {
    const mockNavigate = jest.fn()
    useNavigate.mockReturnValue(mockNavigate)
  
    beforeEach(() => {
        act(() => {
            render(
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            )
        })
    })
  
    test('FRONTEND_HOTEL_SEARCH_UNIT_1: Check if the search bar is present', () => {
        const searchBar = screen.getByTestId('headerSearchBar')
        expect(searchBar).toBeInTheDocument()
    })
});