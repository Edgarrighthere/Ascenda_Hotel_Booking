async function Paging(listings, page) {
    const startIndex = (page-1)*10
    const endIndex = page*10
    const paginatedListings = listings.slice(startIndex, endIndex)
    return paginatedListings
}

export default Paging;