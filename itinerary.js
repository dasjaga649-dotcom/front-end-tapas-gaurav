// itinerary.js
const imageComingSoon = "https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225926_MUEPuko0xgjKvWeAHGPdErQHY6X2ZJ1m.jpg";

// Helper function to format the dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to render a simple card (for activities, flights, hotels)
const getCardHtml = (item) => {
    const imageUrl = item.imageLinks && item.imageLinks.length > 0 ? item.imageLinks[0] : imageComingSoon;
    const ratingHtml = item.rating ? `<div class="attraction-rating flex items-center space-x-1"><i class="fas fa-star text-yellow-400"></i><span>${item.rating}</span></div>` : '';
    const priceHtml = item.price ? `<div class="attraction-icon bg-gray-900 text-white flex items-center space-x-1"><i class="fas fa-dollar-sign"></i><span>${item.price}</span></div>` : '';

    return `
        <div class="travel-card flex-none snap-center">
            <img class="travel-card-image" src="${imageUrl}" alt="${item.name}">
            <div class="travel-card-info-top">
                ${priceHtml}
                ${ratingHtml}
            </div>
            <div class="travel-card-title text-white">
                <h4 class="text-xl font-bold">${item.name}</h4>
            </div>
            <div class="travel-card-overlay">
                <div class="travel-card-details text-gray-200">
                    <p class="text-sm line-clamp-3">${item.description}</p>
                </div>
            </div>
        </div>
    `;
};

// Function to render the overview section
const renderOverview = (data) => {
    const { destination, title, summary, stats } = data.overview;
    const checkIn = formatDate(stats.checkInDate);
    const checkOut = formatDate(stats.checkOutDate);

    const dailyPlanList = data.dailyPlan.map(day => `
        <div class="collapse collapse-plus bg-base-200">
    <input type="checkbox" id="collapse-toggle-${day.day}" class="hidden" /> 
    <label for="collapse-toggle-${day.day}" class="collapse-title text-xl font-medium">
        Day ${day.day}: ${day.title}
    </label>
    <div class="collapse-content"> 
        <ul class="list-disc list-inside space-y-1">
            ${day.activities.map(activity => `<li>${activity.name}</li>`).join('')}
        </ul>
    </div>
</div>
    `).join('');

    return `
        <div class="p-6">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">${title}</h2>
            <p class="text-sm text-gray-600 mb-4">${summary}</p>
            <div class="flex flex-wrap gap-4 text-center mb-6">
                <div class="flex-1 min-w-[120px] bg-gray-100 p-3 rounded-lg">
                    <h5 class="text-xl font-bold">${stats.durationInDays}</h5>
                    <p class="text-xs text-gray-500">Days</p>
                </div>
                <div class="flex-1 min-w-[120px] bg-gray-100 p-3 rounded-lg">
                    <h5 class="text-xl font-bold">${stats.placesVisited}</h5>
                    <p class="text-xs text-gray-500">Places Visited</p>
                </div>
                ${stats.checkInDate && `
                    <div class="flex-1 min-w-[120px] bg-gray-100 p-3 rounded-lg">
                        <h5 class="text-xl font-bold">${checkIn}</h5>
                        <p class="text-xs text-gray-500">Check-in</p>
                    </div>
                `}
                ${stats.checkOutDate && `
                    <div class="flex-1 min-w-[120px] bg-gray-100 p-3 rounded-lg">
                        <h5 class="text-xl font-bold">${checkOut}</h5>
                        <p class="text-xs text-gray-500">Check-out</p>
                    </div>
                `}
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-800">Quick Daily Summary</h3>
            <div class="space-y-2">
                ${dailyPlanList}
            </div>
        </div>
    `;
};

// Function to render the daily plan
const renderDailyPlan = (dailyPlan) => {
    const dailyCards = dailyPlan.map(day => `
        <div class="p-6 border-b border-gray-200 last:border-b-0">
            <h3 class="text-lg font-bold mb-2 text-gray-800">Day ${day.day}: ${day.title}</h3>
            <div class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
                ${day.activities.map(getCardHtml).join('')}
            </div>
        </div>
    `).join('');

    return `<div class="p-4 space-y-4">${dailyCards}</div>`;
};

// Function to render the "Explore More" section
const renderExploreMore = (exploreMoreData) => {
    const cards = exploreMoreData.map(getCardHtml).join('');
    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4 text-gray-800">Explore More</h3>
            <div class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
                ${cards}
            </div>
        </div>
    `;
};

// Function to render flight suggestions
const backgroundImage = "https://t3.ftcdn.net/jpg/02/91/60/90/360_F_291609042_wBT8QL5iSzK3cCGyUVNy4PZSsyhejG8V.jpg";

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const getFlightCardHtml = (flight) => {
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


// Function to render flight suggestions
const renderFlights = (flightSuggestions) => {
    const cheapest = flightSuggestions.cheapest?.[0];
    const shortestDuration = flightSuggestions.shortestDuration?.[0];

    const flightCards = [];
    if (cheapest) {
        flightCards.push(getFlightCardHtml(cheapest));
    }
    if (shortestDuration) {
        flightCards.push(getFlightCardHtml(shortestDuration));
    }

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4 text-gray-800">Flight Suggestions</h3>
            <div class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
                ${flightCards.join('')}
            </div>
        </div>
    `;
};

// Function to render hotel recommendations
const renderHotels = (hotelRecommendations) => {
    const cheapestHotels = hotelRecommendations.cheapest || [];
    const highestRatedHotels = hotelRecommendations.highestRated || [];

    const hotelCard = (hotel) => {
        const imageUrl = hotel.imageLinks && hotel.imageLinks.length > 0 ? hotel.imageLinks[0] : imageComingSoon;
        return `
            <div class="travel-card flex-none snap-center">
                <img class="travel-card-image" src="${imageUrl}" alt="${hotel.name}">
                <div class="travel-card-info-top">
                    <div class="attraction-icon bg-gray-900 text-white flex items-center space-x-1">
                        <i class="fas fa-dollar-sign"></i><span>${hotel.price}</span>
                    </div>
                    <div class="attraction-rating flex items-center space-x-1">
                        <i class="fas fa-star text-yellow-400"></i><span>${hotel.rating || 'N/A'}</span>
                    </div>
                </div>
                <div class="travel-card-title text-white">
                    <h4 class="text-xl font-bold">${hotel.name}</h4>
                </div>
            </div>
        `;
    };

    return `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-4 text-gray-800">Hotel Recommendations</h3>
            <div class="space-y-6">
                <div>
                    <h4 class="font-bold text-gray-700 mb-2">Cheapest Options</h4>
                    <div class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
                        ${cheapestHotels.map(hotelCard).join('')}
                    </div>
                </div>
                <div>
                    <h4 class="font-bold text-gray-700 mb-2">Highest Rated</h4>
                    <div class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
                        ${highestRatedHotels.map(hotelCard).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
};


// itinerary.js
// ... (keep all your existing helper functions like formatDate, getCardHtml, etc.)

export const renderItinerary = (itineraryData, isMobile, chatMessages) => {
    // Define the sections to be displayed as tabs
    const sections = [
        { id: 'overview-page', title: 'Overview', content: renderOverview(itineraryData) },
        { id: 'daily-plan-page', title: 'Daily Plan', content: renderDailyPlan(itineraryData.dailyPlan) },
        // Conditionally add other sections if they exist in the data
        ...(itineraryData.exploreMore ? [{ id: 'explore-more-page', title: 'Explore More', content: renderExploreMore(itineraryData.exploreMore) }] : []),
        ...(itineraryData.hotelRecommendations ? [{ id: 'hotels-page', title: 'Hotels', content: renderHotels(itineraryData.hotelRecommendations) }] : []),
        ...(itineraryData.flightSuggestions ? [{ id: 'flights-page', title: 'Flights', content: renderFlights(itineraryData.flightSuggestions) }] : [])
    ];

    // Generate the tab buttons
    const tabsHtml = sections.map((section, index) => `
        <button class="tab-button ${index === 0 ? 'tab-active' : ''}" data-target="${section.id}">
            ${section.title}
        </button>
    `).join('');

    // Generate the tab content pages
    const pagesHtml = sections.map((section, index) => `
        <div id="${section.id}" class="itinerary-page ${index === 0 ? 'page-active' : ''}">
            ${section.content}
        </div>
    `).join('');

    const mainHtml = `
        <div class="itinerary-tabs-container">
            <div class="tabs-header">
                ${tabsHtml}
            </div>
            <div class="tabs-content">
                ${pagesHtml}
            </div>
        </div>
    `;

    const bubble = document.createElement('div');
    bubble.className = `flex justify-start my-4 ${isMobile ? '' : 'w-full'}`;
    bubble.innerHTML = `<div class="bg-white p-6 rounded-2xl shadow-md w-full max-w-[95%]">${mainHtml}</div>`;
    chatMessages.appendChild(bubble);

    // Add event listeners to the new tabs
    const tabButtons = bubble.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // Deactivate all tab buttons and hide all pages
            tabButtons.forEach(btn => btn.classList.remove('tab-active'));
            const allPages = bubble.querySelectorAll('.itinerary-page');
            allPages.forEach(page => page.classList.remove('page-active'));

            // Activate the clicked tab and show the corresponding page
            button.classList.add('tab-active');
            document.getElementById(targetId).classList.add('page-active');
        });
    });
};