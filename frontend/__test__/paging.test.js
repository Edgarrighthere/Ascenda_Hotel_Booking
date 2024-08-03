import { render, screen, fireEvent } from '@testing-library/react';
import List from '../src/pages/list/List';
import Paging from '../src/controllers/Paging';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

// Unit tests for Paging function
describe('Frontend Pagination Unit and Integration Test', () => {
    const listings = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    test('FRONTEND_PAGINATION_1: Should return the correct items for page 1', async () => {
        const paginatedListings = await Paging(listings, 1);
        expect(paginatedListings).toEqual(
            listings.slice(0, 10)  // First 10 items
        );
    });

    test('FRONTEND_PAGINATION_2: Should return the correct items for page 2', async () => {
        const paginatedListings = await Paging(listings, 2);
        expect(paginatedListings).toEqual(
            listings.slice(10, 20)  // Next 10 items
        );
    });

    test('FRONTEND_PAGINATION_3: Should handle page number greater than total pages', async () => {
        const paginatedListings = await Paging(listings, 5);
        expect(paginatedListings).toEqual(
            listings.slice(20)  // Last 5 items
        );
    });

    test('FRONTEND_PAGINATION_4: Should handle page number less than 1', async () => {
        const paginatedListings = await Paging(listings, 0);
        expect(paginatedListings).toEqual(
            listings.slice(0, 10)  // First 10 items
        );
    });

    test('FRONTEND_PAGINATION_5: Should handle null page number', async () => {
        const paginatedListings = await Paging(listings, null);
        expect(paginatedListings).toEqual(
            listings.slice(0, 10)  // First 10 items
        );
    });

    test('FRONTEND_PAGINATION_6: Should return an empty list if there are no listings', async () => {
        const paginatedListings = await Paging([], 1);
        expect(paginatedListings).toEqual([]);
    });
});