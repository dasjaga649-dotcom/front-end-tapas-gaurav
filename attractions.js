// ATTRACTIONS FILE
const imageComingSoon = "https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225926_MUEPuko0xgjKvWeAHGPdErQHY6X2ZJ1m.jpg";

const getIcon = (type) => {
    if (type === 'eatery') return 'fas fa-utensils';
    if (type === 'attraction') return 'fas fa-landmark';
    if (type === 'attraction_product') return 'fas fa-route';
    return 'fas fa-map-marker-alt';
};

const getCardHtml = (attraction) => {
    const imageUrl = attraction.imagelinks && attraction.imagelinks.length > 0
        ? attraction.imagelinks[0]
        : imageComingSoon;

    return `
        <div class="travel-card flex-none snap-center">
            <img class="travel-card-image" src="${imageUrl}" alt="${attraction.name}">
            <div class="travel-card-info-top">
                <div class="attraction-icon bg-gray-900 text-white">
                    <i class="${getIcon(attraction.type)}"></i>
                </div>
                <div class="attraction-rating flex items-center space-x-1">
                    <span>${attraction.rating}</span>
                    <i class="fas fa-star text-yellow-400"></i>
                </div>
            </div>
            <div class="travel-card-title text-white">
                <h4 class="text-xl font-bold flex items-center space-x-2">
                    <span>${attraction.name}</span>
                    ${attraction.location?.lat ? `<a href="https://www.google.com/maps?q=${attraction.location.lat},${attraction.location.lon}" target="_blank" class="text-blue-300 hover:text-blue-500"><i class="fas fa-map-marker-alt"></i></a>` : ''}
                </h4>
            </div>
            <div class="travel-card-overlay">
                <div class="travel-card-details text-gray-200">
                    <p class="text-sm line-clamp-3">${attraction.description || 'No description available.'}</p>
                    <a href="${attraction.link}" target="_blank" class="text-blue-300 hover:underline text-sm font-medium mt-2 block">Visit Website</a>
                </div>
            </div>
        </div>
    `;
};

const renderAttractionsInPlace = (filteredData) => {
    const attractionsContainer = document.getElementById('attractions-container');
    if (attractionsContainer) {
        attractionsContainer.innerHTML = filteredData.map(getCardHtml).join('');
    }
};

const renderFiltersAndSorts = (container, data) => {
    const typeAliases = {
        'eatery': 'Restaurants',
        'attraction': 'Destinations',
        'attraction_product': 'Tours'
    };
    const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
    const typeOptionsHtml = uniqueTypes.map(type => `
        <label class="flex items-center space-x-2 text-gray-700 capitalize">
            <input type="checkbox" name="type-filter" value="${type}" class="form-checkbox h-4 w-4 text-blue-600 rounded">
            <span>${typeAliases[type] || type}</span>
        </label>
    `).join('');

    const filtersHtml = `
        <div class="p-4">
            <div class="mb-4">
                <h4 class="text-lg font-bold mb-2">Filter by Type</h4>
                <div class="grid grid-cols-2 gap-2" id="type-filters">
                    ${typeOptionsHtml}
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

const attachEventListeners = (chatMessages, attractionData) => {
    const filterBtn = chatMessages.querySelector('.filter-btn');
    const modal = chatMessages.querySelector('.filter-modal');
    const closeBtn = chatMessages.querySelector('.close-modal');
    const applyBtn = chatMessages.querySelector('#apply-filters-btn');

    if (filterBtn && modal && closeBtn && applyBtn) {
        filterBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

        applyBtn.addEventListener('click', () => {
            const selectedTypes = Array.from(modal.querySelectorAll('#type-filters input[type="checkbox"]:checked')).map(cb => cb.value);
            const selectedRating = modal.querySelector('#rating-filters input[type="radio"]:checked')?.value || 0;
            const sortOption = modal.querySelector('#sort-options input[type="radio"]:checked')?.value || 'none';

            let filteredData = attractionData.filter(item => {
                const itemType = item.type;
                const typeMatch = selectedTypes.length === 0 || (itemType && selectedTypes.includes(itemType));
                const ratingMatch = parseFloat(item.rating) >= parseFloat(selectedRating);
                return typeMatch && ratingMatch;
            });

            if (sortOption === 'rating-desc') {
                filteredData.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            } else if (sortOption === 'rating-asc') {
                filteredData.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
            }

            renderAttractionsInPlace(filteredData);
            modal.classList.add('hidden');
        });
    }
};

export const renderAttractions = (data, isMobile, chatMessages) => {
    const mainHtml = `
        <h3 class="text-xl font-bold mb-2 text-gray-800 flex items-center justify-between">
            Popular Attractions
            <button class="filter-btn text-gray-600 hover:text-gray-900 transition-colors">
                <i class="fas fa-filter"></i>
            </button>
        </h3>
        <div id="attractions-container" class="carousel flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4">
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
