async function Paging(hotelListings, page) {
    const startIndex = (page-1)*10+1
    const endIndex = page*10+1
    const paginatedListings = hotelListings.slice(startIndex, endIndex)
    return paginatedListings
}

export default Paging;