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

    try {
        await addDoc(collection(db, "ratings"), {
            viewerName: viewerName,
            movieName: movieName,
            rating: parseFloat(rating),
            customRating: customRating,  // Save the custom rating
            timestamp: new Date()
        });

        const ratingsDisplay = document.getElementById('ratingsDisplay');
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';
        ratingItem.innerHTML = `<strong>${viewerName}</strong> rated <strong>${movieName}</strong> a <strong>${rating}/5</strong> and wrote "${customRating}"`;
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
            ratingItem.innerHTML = `<strong>${data.viewerName}</strong> rated <strong>${data.movieName}</strong> a <strong>${data.rating}/5</strong> and wrote "${data.customRating}"`;
            ratingsDisplay.appendChild(ratingItem);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

// Call the function to fetch ratings when the page loads
fetchRatings();
