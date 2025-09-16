// HOTELS FILE
const imageComingSoon = "https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225926_MUEPuko0xgjKvWeAHGPdErQHY6X2ZJ1m.jpg";

const getAmenityIcon = (amenity) => {
    const iconMap = {
        "Hot tub": "fas fa-hot-tub",
        "Beach access": "fas fa-umbrella-beach",
        "Spa": "fas fa-spa",
        "Pool": "fas fa-swimming-pool",
        "Kid-friendly": "fas fa-child",
        "Casino": "fas fa-dice",
        "Restaurant": "fas fa-utensils",
        "Bar": "fas fa-cocktail",
        "Room service": "fas fa-bell",
        "Fitness center": "fas fa-dumbbell",
        "Outdoor pool": "fas fa-swimming-pool",
        "Free breakfast": "fas fa-coffee",
        "Air conditioning": "fas fa-fan",
        "Airport shuttle": "fas fa-shuttle-van",
        "Crib": "fas fa-baby-carriage",
        "Pet-friendly": "fas fa-dog",
        "Smoke-free": "fas fa-smoking-ban",
        "Washer": "fas fa-washer",
        "Wheelchair accessible": "fas fa-wheelchair",
        "Free Wi-Fi": "fas fa-wifi"
    };
    return iconMap[amenity] || 'fas fa-concierge-bell';
};

const getCardHtml = (hotel) => {
    const imageUrl = hotel.imagelinks && hotel.imagelinks.length > 0
        ? hotel.imagelinks[0]
        : imageComingSoon;
    const amenitiesHtml = !hotel.amenities || hotel.amenities[0] == null ? [] : hotel.amenities.map(amenity => `
        <span class="flex items-center space-x-2 text-xs text-gray-200">
            <i class="${getAmenityIcon(amenity)}"></i>
            <span>${amenity}</span>
        </span>
    `).join('');

    return `
        <div class="travel-card flex-none snap-center">
            <img class="travel-card-image" src="${imageUrl}" alt="${hotel.name}">
            <div class="travel-card-info-top">
                <div class="attraction-icon bg-gray-900 text-white flex items-center">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${hotel.price}</span>
                </div>
                <div class="attraction-rating flex items-center space-x-1">
                    <span>${hotel.rating}</span>
                    <i class="fas fa-star text-yellow-400"></i>
                </div>
            </div>
            <div class="travel-card-title text-white">
                <h4 class="text-xl font-bold flex items-center space-x-2">
                    <span>${hotel.name}</span>
                    ${hotel.location?.lat ? `<a href="https://www.google.com/maps?q=${hotel.location.lat},${hotel.location.lon}" target="_blank" class="text-blue-300 hover:text-blue-500"><i class="fas fa-map-marker-alt"></i></a>` : ''}
                </h4>
            </div>
            <div class="travel-card-overlay">
                <div class="travel-card-details text-gray-200">
                    <div class="flex flex-wrap gap-2">
                        ${amenitiesHtml}
                    </div>
                    <a href="#" target="_blank" class="text-blue-300 hover:underline text-sm font-medium mt-2 block">Visit Website</a>
                </div>
            </div>
        </div>
    `;
};

const renderHotelsInPlace = (filteredData) => {
    const hotelsContainer = document.getElementById('hotels-container');
    if (hotelsContainer) {
        hotelsContainer.innerHTML = filteredData.map(getCardHtml).join('');
    }
};

const renderFiltersAndSorts = (container, data) => {
    const allAmenities = [...new Set(data.flatMap(hotel => hotel.amenities || []).filter(Boolean))].sort();
    const amenitiesOptionsHtml = allAmenities.map(amenity => `
        <label class="flex items-center space-x-2 text-gray-700">
            <input type="checkbox" name="amenity" value="${amenity}" class="form-checkbox h-4 w-4 text-blue-600 rounded">
            <span>${amenity}</span>
        </label>
    `).join('');

    const filtersHtml = `
        <div class="p-4">
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Filter by Amenities</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-1 max-h-32 overflow-y-auto" id="amenity-filters">
                    ${amenitiesOptionsHtml}
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Filter by Rating</h4>
                <div class="flex flex-wrap gap-2" id="rating-filters">
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="rating-filter" value="4" class="form-radio h-4 w-4 text-blue-600">
                        <span>4+ <i class="fas fa-star text-yellow-400"></i></span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="rating-filter" value="4.5" class="form-radio h-4 w-4 text-blue-600">
                        <span>4.5+ <i class="fas fa-star text-yellow-400"></i></span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="rating-filter" value="5" class="form-radio h-4 w-4 text-blue-600">
                        <span>5 <i class="fas fa-star text-yellow-400"></i></span>
                    </label>
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Sort</h4>
                <div class="flex flex-wrap gap-2" id="sort-options">
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="sort-option" value="price-asc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Price (Low to High)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="sort-option" value="price-desc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Price (High to Low)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="sort-option" value="rating-desc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Rating (High to Low)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="sort-option" value="rating-asc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Rating (Low to High)</span>
                    </label>
                </div>
            </div>
            <div class="flex justify-end">
                <button id="apply-filters-btn" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Apply Filters</button>
            </div>
        </div>
    `;
    container.innerHTML = filtersHtml;
};

const attachEventListeners = (chatMessages, hotelData) => {
    const filterBtn = chatMessages.querySelector('.filter-btn');
    const modal = chatMessages.querySelector('.filter-modal');
    const closeBtn = chatMessages.querySelector('.close-modal');
    const applyBtn = chatMessages.querySelector('#apply-filters-btn');

    if (filterBtn && modal && closeBtn && applyBtn) {
        filterBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

        applyBtn.addEventListener('click', () => {
            const selectedAmenities = Array.from(modal.querySelectorAll('#amenity-filters input[type="checkbox"]:checked')).map(cb => cb.value);
            const selectedRating = modal.querySelector('#rating-filters input[type="radio"]:checked')?.value || 0;
            const sortOption = modal.querySelector('#sort-options input[type="radio"]:checked')?.value || 'none';

            let filteredData = hotelData.filter(hotel => {
                const hasAllAmenities = selectedAmenities.length === 0 || (hotel.amenities && selectedAmenities.every(amenity => hotel.amenities.includes(amenity)));
                const hasMinRating = parseFloat(hotel.rating) >= parseFloat(selectedRating);
                return hasAllAmenities && hasMinRating;
            });

            if (sortOption === 'price-asc') {
                filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortOption === 'price-desc') {
                filteredData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            } else if (sortOption === 'rating-desc') {
                filteredData.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            } else if (sortOption === 'rating-asc') {
                filteredData.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
            }

            renderHotelsInPlace(filteredData);
            modal.classList.add('hidden');
        });
    }
};

export const renderHotels = (data, isMobile, chatMessages) => {
    const mainHtml = `
        <h3 class="text-xl font-bold mb-2 text-gray-800 flex items-center justify-between">
            Found Hotels
            <button class="filter-btn text-gray-600 hover:text-gray-900 transition-colors">
                <i class="fas fa-filter"></i>
            </button>
        </h3>
        <div id="hotels-container" class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
            ${data.map(getCardHtml).join('')}
        </div>
        <div class="filter-modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                <button class="close-modal absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                <h3 class="text-xl font-bold p-4 border-b">Filters & Sorts</h3>
                <div id="filter-modal-content"></div>
            </div>
        </div>
    `;

    const bubble = document.createElement('div');
    bubble.className = `flex justify-start my-4 ${isMobile ? '' : 'w-full'}`;
    bubble.innerHTML = `<div class="bg-white p-6 rounded-2xl shadow-md w-full max-w-[95%]">${mainHtml}</div>`;
    chatMessages.appendChild(bubble);

    const filterModalContent = bubble.querySelector('#filter-modal-content');
    renderFiltersAndSorts(filterModalContent, data);
    attachEventListeners(bubble, data);
};
