async function Paging(listings, page) {
    const pageLimit = Math.ceil(listings.length/10)
    var paginatedListings

    if (listings.length === 0) {
        paginatedListings = []
    } else {
        if (page === null) {
            page = 1
        } else if (page === 0) {
            page = 1
        } else if (page > pageLimit) {
            page = pageLimit
        }
        const startIndex = (page-1)*10
        const endIndex = page*10
        paginatedListings = listings.slice(startIndex, endIndex)
    }
    return paginatedListings
}

module.exports = Paging