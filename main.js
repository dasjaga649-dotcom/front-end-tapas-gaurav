// Element references
const chatContainer = document.getElementById('chat-container');
const introSection = document.getElementById('intro-section');
const toggleButton = document.getElementById('toggle-view');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userPromptInput = document.getElementById('user-prompt');

// State variables
let isDesktopView = false;
let sessionId = localStorage.getItem('tapasSessionId');
if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('tapasSessionId', sessionId);
}

// Function to show a modal with a message
const showModal = (text) => {
    document.getElementById('modal-text').innerText = text;
    document.getElementById('modal').classList.remove('hidden');
};

// Function to convert markdown-like text to HTML
// Now uses the imported 'marked' library
const markdownToHtml = (markdown) => {
    return marked.parse(markdown);
};

// Function to create and append a chat message bubble
const createMessageBubble = (text, isUser) => {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
    const messageDiv = document.createElement('div');
    if (isUser) {
        messageDiv.className = 'bg-blue-500 text-white p-3 rounded-2xl shadow-md max-w-[80%]';
        messageDiv.textContent = text; // Use textContent for user input to prevent XSS
    } else {
        messageDiv.className = 'bg-white text-gray-800 p-3 rounded-2xl shadow-md max-w-[80%] markdown-body';
        messageDiv.innerHTML = markdownToHtml(text);
    }
    
    bubbleDiv.appendChild(messageDiv);
    chatMessages.appendChild(bubbleDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Function to show a loading spinner
const createLoadingIndicator = () => {
    const loaderDiv = document.createElement('div');
    loaderDiv.className = 'flex items-start';
    loaderDiv.innerHTML = `
        <div class="bg-white p-3 rounded-2xl shadow-md">
            <div class="loader"></div>
        </div>
    `;
    chatMessages.appendChild(loaderDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loaderDiv;
};

// The imported rendering functions
// Assume these are imported from their respective files
import { renderFlights } from './flights.js';
import { renderHotels } from './hotels.js';
import { renderAttractions } from './attractions.js';
import { renderItinerary } from './itinerary.js';


// Function to process a JSON response and render the correct data
const processMessage = (jsonResponse) => {
    const data = JSON.parse(jsonResponse);

    // Regular expression to find and remove the placeholders
    const placeholderRegex = /\[(flightData|hotelData|attractionsData|itineraryData)\]/g;

    // Ensure text is a string before operating on it
    const text = typeof data.text === 'string' ? data.text : '';

    // Remove the placeholders from the text
    const cleanedText = text ? text.replace(placeholderRegex, '').trim() : '';

    // First, render the text part if it exists and is not empty after cleaning
    if (cleanedText) {
        createMessageBubble(cleanedText, false);
    }

    // Then, render the cards based on the presence of data
    if (data.dbData || data.itineraryData) {
        if (text.includes('[flightData]') && data.dbData) {
            renderFlights(data.dbData, !isDesktopView, chatMessages);
        } else if (text.includes('[hotelData]') && data.dbData) {
            renderHotels(data.dbData, !isDesktopView, chatMessages);
        } else if (text.includes('[attractionsData]') && data.dbData) {
            renderAttractions(data.dbData, !isDesktopView, chatMessages);
        } else if (data.itineraryData) {
            renderItinerary(data.itineraryData, !isDesktopView, chatMessages);
        }
    }
};

// Event listener for the chat form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userPrompt = userPromptInput.value.trim();
    if (userPrompt === '') return;

    createMessageBubble(userPrompt, true);
    userPromptInput.value = '';

    const loader = createLoadingIndicator();

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId,
                userPrompt: userPrompt
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        loader.remove();
        processMessage(JSON.stringify(responseData));
    } catch (error) {
        console.error('API call failed:', error);
        loader.remove();
        createMessageBubble('Oops! Something went wrong. Please try again later.', false);
    }
});

// Event listener for the toggle button
toggleButton.addEventListener('click', () => {
    if (window.innerWidth < 768 && !isDesktopView) {
        showModal("The desktop view is available on larger screens.");
        return;
    }
    
    isDesktopView = !isDesktopView;
    if (isDesktopView) {
        chatContainer.classList.add('desktop-view');
        chatContainer.classList.remove('phone-view');
        introSection.classList.add('hide-intro');
        toggleButton.innerHTML = '<i class="fas fa-mobile-alt text-sm"></i>';
    } else {
        chatContainer.classList.remove('desktop-view');
        chatContainer.classList.add('phone-view');
        introSection.classList.remove('hide-intro');
        toggleButton.innerHTML = '<i class="fas fa-desktop text-sm"></i>';
    }
    
    const messages = [...chatMessages.children];
    chatMessages.innerHTML = '';
    messages.forEach(msg => chatMessages.appendChild(msg));
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Initialize state on page load based on screen size
window.addEventListener('load', () => {
    if (window.innerWidth >= 768) {
        chatContainer.classList.add('transition-width');
        introSection.classList.add('transition-all');
        isDesktopView = true;
        toggleButton.innerHTML = '<i class="fas fa-mobile-alt text-sm"></i>';
    } else {
        isDesktopView = false;
        chatContainer.classList.add('phone-view');
        introSection.classList.add('hide-intro');
        toggleButton.innerHTML = '<i class="fas fa-desktop text-sm"></i>';
    }
});
