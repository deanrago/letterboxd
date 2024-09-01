// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDBukqd6XO2E337g4vaRWvYkKnSIKYexxQ",
    authDomain: "letterboxd-6c442.firebaseapp.com",
    projectId: "letterboxd-6c442",
    storageBucket: "letterboxd-6c442.appspot.com",
    messagingSenderId: "20957730025",
    appId: "1:20957730025:web:21f8a2985bbc6bdc520c78",
    measurementId: "G-QQSJMRSG39"
};

// Your TMDb API Key
const tmdbApiKey = 'b17ef6c35106285c3df284b15117bd9f';  // Corrected to be a string

// Function to fetch movie data from TMDb
async function fetchMovieData(movieName) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieName)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch movie data: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0]; // Return the first movie result
        } else {
            throw new Error('No movie found');
        }
    } catch (error) {
        console.error("Error fetching movie data: ", error);
        return null;
    }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Handle form submission and save data to Firestore
document.getElementById('ratingForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const viewerName = document.getElementById('viewerName').value;
    const movieName = document.getElementById('movieName').value;
    const rating = document.getElementById('rating').value;
    const customRating = document.getElementById('customRating').value; // New custom rating field

    // Fetch movie data from TMDb
    const movieData = await fetchMovieData(movieName);

    try {
        await addDoc(collection(db, "ratings"), {
            viewerName: viewerName,
            movieName: movieName,
            rating: parseFloat(rating),
            customRating: customRating,
            moviePoster: movieData ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : '', // Save the poster URL
            timestamp: new Date()
        });

        const ratingsDisplay = document.getElementById('ratingsDisplay');
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';

        // Display the movie poster if available
        const posterHTML = movieData ? `<img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieName} poster" style="width:100px;">` : '';
        ratingItem.innerHTML = `${posterHTML}<strong>${viewerName}</strong> rated <strong>${movieName}</strong> a <strong>${rating}/5</strong> and wrote "${customRating}"`;

        ratingsDisplay.appendChild(ratingItem);

        document.getElementById('ratingForm').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// Fetch and display ratings when the page loads
async function fetchRatings() {
    const ratingsDisplay = document.getElementById('ratingsDisplay');
    ratingsDisplay.innerHTML = '<h2>Ratings</h2>';

    try {
        const querySnapshot = await getDocs(query(collection(db, "ratings"), orderBy("timestamp", "desc")));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const ratingItem = document.createElement('div');
            ratingItem.className = 'rating-item';

            // Display the movie poster if available
            const posterHTML = data.moviePoster ? `<img src="${data.moviePoster}" alt="${data.movieName} poster" style="width:100px;">` : '';
            ratingItem.innerHTML = `${posterHTML}<strong>${data.viewerName}</strong> rated <strong>${data.movieName}</strong> a <strong>${data.rating}/5</strong> and wrote "${data.customRating}"`;

            ratingsDisplay.appendChild(ratingItem);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

// Call the function to fetch ratings when the page loads
fetchRatings();
