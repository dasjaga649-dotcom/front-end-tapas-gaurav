// FLIGHTS FILE
//const backgroundImage = "https://images.pexels.com/photos/13755718/pexels-photo-13755718.jpeg";
//const backgroundImage = "https://jooinn.com/images/grey-airplane-window-11.jpg";
//const backgroundImage = "https://images.pexels.com/photos/1497305/pexels-photo-1497305.jpeg?cs=srgb&dl=pexels-lukas-hartmann-304281-1497305.jpg&fm=jpg";
const backgroundImage = "https://t3.ftcdn.net/jpg/02/91/60/90/360_F_291609042_wBT8QL5iSzK3cCGyUVNy4PZSsyhejG8V.jpg";
// FLIGHTS FILE
const imageComingSoon = "https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225926_MUEPuko0xgjKvWeAHGPdErQHY6X2ZJ1m.jpg";

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const getCardHtml = (flight) => {
    const imageUrl = flight.airline_logo ? flight.airline_logo : imageComingSoon;
    const departureTime = new Date(flight.departuredatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrivalTime = new Date(flight.arrivaldatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const durationFormatted = formatDuration(flight.totalduration);
    const airlineLogo = imageUrl;
    const travelClass = flight.travelclass || 'Economy';

    return `
        <div class="travel-card flex-none snap-center">
            <img class="travel-card-image" src="${backgroundImage}" alt="Flight Background">
            <div class="travel-card-info-top">
                <div class="flight-logo-container">
                    <img src="${airlineLogo}" alt="${flight.airline} logo">
                </div>
                <div class="attraction-icon bg-gray-900 text-white flex items-center">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${flight.price}</span>
                </div>
                <div class="attraction-rating flex items-center space-x-1">
                    <span>${travelClass}</span>
                    <i class="fas fa-plane text-yellow-400"></i>
                </div>
            </div>
            <div class="travel-card-title text-white">
                <h4 class="text-xl font-bold mb-1 flex items-center space-x-2">
                    <span>${flight.airline}</span>
                </h4>
            </div>
            <div class="travel-card-overlay">
                <div class="travel-card-details text-gray-200">
                    <div class="flex justify-between items-center text-sm font-medium text-gray-200">
                        <span>${flight.departureairportcode}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span>${flight.arrivalairportcode}</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-300">
                        <span>${departureTime}</span>
                        <span>${arrivalTime}</span>
                    </div>
                    <div class="text-xs text-gray-300 mt-2">Duration: ${durationFormatted}</div>
                </div>
            </div>
        </div>
    `;
};

const renderFlightsInPlace = (filteredData) => {
    const flightsContainer = document.getElementById('flights-container');
    if (flightsContainer) {
        flightsContainer.innerHTML = filteredData.map(getCardHtml).join('');
    }
};

const renderFiltersAndSorts = (container, data) => {
    const allAirlines = [...new Set(data.map(flight => flight.airline).filter(Boolean))].sort();
    const airlineOptionsHtml = allAirlines.map(airline => `
        <label class="flex items-center space-x-2 text-gray-700">
            <input type="checkbox" name="airline-filter" value="${airline}" class="form-checkbox h-4 w-4 text-blue-600 rounded">
            <span>${airline}</span>
        </label>
    `).join('');

    const filtersHtml = `
        <div class="p-4">
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Filter by Airline</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 max-h-32 overflow-y-auto" id="airline-filters">
                    ${airlineOptionsHtml}
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Sort by:</h4>
                <div class="flex flex-wrap gap-2" id="flight-sorts">
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="price-asc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Price (Low to High)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="price-desc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Price (High to Low)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="duration-asc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Duration (Shortest)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="duration-desc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Duration (Longest)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="departure-asc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Departure (Earliest)</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="radio" name="flight-sort" value="departure-desc" class="form-radio h-4 w-4 text-blue-600">
                        <span>Departure (Latest)</span>
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

const attachEventListeners = (chatMessages, flightData) => {
    const filterBtn = chatMessages.querySelector('.filter-btn');
    const modal = chatMessages.querySelector('.filter-modal');
    const closeBtn = chatMessages.querySelector('.close-modal');
    const applyBtn = chatMessages.querySelector('#apply-filters-btn');

    if (filterBtn && modal && closeBtn && applyBtn) {
        filterBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

        applyBtn.addEventListener('click', () => {
            const selectedAirlines = Array.from(modal.querySelectorAll('#airline-filters input[type="checkbox"]:checked')).map(cb => cb.value);
            const sortOption = modal.querySelector('#flight-sorts input[type="radio"]:checked')?.value || 'none';

            let filteredData = flightData.filter(flight => {
                const flightAirline = flight.airline;
                return selectedAirlines.length === 0 || (flightAirline && selectedAirlines.includes(flightAirline));
            });

            if (sortOption === 'price-asc') {
                filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortOption === 'price-desc') {
                filteredData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            } else if (sortOption === 'duration-asc') {
                filteredData.sort((a, b) => parseFloat(a.totalduration) - parseFloat(b.totalduration));
            } else if (sortOption === 'duration-desc') {
                filteredData.sort((a, b) => parseFloat(b.totalduration) - parseFloat(a.totalduration));
            } else if (sortOption === 'departure-asc') {
                filteredData.sort((a, b) => new Date(a.departuredatetime) - new Date(b.departuredatetime));
            } else if (sortOption === 'departure-desc') {
                filteredData.sort((a, b) => new Date(b.departuredatetime) - new Date(a.departuredatetime));
            }

            renderFlightsInPlace(filteredData);
            modal.classList.add('hidden');
        });
    }
};

export const renderFlights = (data, isMobile, chatMessages) => {
    const mainHtml = `
        <h3 class="text-xl font-bold mb-2 text-gray-800 flex items-center justify-between">
            Found Flights
            <button class="filter-btn text-gray-600 hover:text-gray-900 transition-colors">
                <i class="fas fa-filter"></i>
            </button>
        </h3>
        <div id="flights-container" class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
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
    bubble.innerHTML = `<div class="bg-white p-6 rounded-2xl shadow-md w-full">${mainHtml}</div>`;
    chatMessages.appendChild(bubble);

    const filterModalContent = bubble.querySelector('#filter-modal-content');
    renderFiltersAndSorts(filterModalContent, data);
    attachEventListeners(bubble, data);
};
