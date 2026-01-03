// ------------ Global Variables ------------
let userRating = 0;

// ------------ Image Upload & Analysis ------------
function showPreview() {
  const imageInput = document.getElementById("imageInput");
  const previewSection = document.getElementById("previewSection");
  const previewImage = document.getElementById("previewImage");
  const suggestionText = document.getElementById("suggestionText");

  if (!imageInput || imageInput.files.length === 0) return;

  previewImage.src = URL.createObjectURL(imageInput.files[0]);
  suggestionText.innerText =
    "Image uploaded. Click 'Analyze E-Waste' to get suggestion.";

  previewSection.classList.remove("hidden");
}


function handleUpload(){
  let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];

  const imageInput = document.getElementById("imageInput");
  const description = document.getElementById("description").value;

  // Pull the REAL email from the login page
  const userData = {
    name: localStorage.getItem("username") || "User",
    email: localStorage.getItem("userEmail") || "No Email Provided"
    // The "phone" line is deleted here so it doesn't get saved
  };

  if(!imageInput.files[0]){
    alert("Please upload image");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(){
    uploads.push({
      image: reader.result,
      username: userData.name,
      email: userData.email, // This is now the user's real email
      category: "General E-Waste",
      description: description,
      rating: userRating,                      // ⭐ rating
      date: new Date().toLocaleString(),  
      status: "pending",
      technicianSuggestion: "",
      technicianPhone: ""
    });

    localStorage.setItem("ewasteUploads", JSON.stringify(uploads));

    document.getElementById("previewImage").src = reader.result;
    document.getElementById("previewSection").classList.remove("hidden");
    document.getElementById("suggestionText").innerText =
      "Your request has been sent to technician ✅";
  };

  reader.readAsDataURL(imageInput.files[0]);
}




// ------------ Search logic ------------
const deviceDB = {
    mobile: "Remove battery (if removable), backup data, give to certified e-waste recycler or donate if working.",
    battery: "Take to a battery collection point or recycler. Do not put in regular trash.",
    laptop: "Backup and wipe data, remove the battery, and take to an e-waste recycling center or refurbisher.",
    tv: "Older CRT TVs must go to special hazardous-waste collection. Modern LED/LCD can be recycled too.",
    charger: "Most chargers and cables contain plastic and metal — drop them at electronics recycling points.",
    monitor: "LCD/LED can be recycled. CRTs require special handling due to lead.",
    tablet: "Similar to laptops — backup, wipe, recycle at certified centers.",
    'hard drive': "Wipe securely or physically destroy drive before recycling to protect data."
};

function findDeviceInfo(query) {
    if (!query) return "Please type a device name (example: mobile, laptop, battery).";
    const q = query.toLowerCase().trim();
    if (deviceDB[q]) return deviceDB[q];
    for (const key of Object.keys(deviceDB)) {
        if (key.includes(q) || q.includes(key)) return deviceDB[key];
    }
    return "No exact match found. Try 'mobile', 'battery', 'laptop', or 'charger'.";
}

// ------------ Main Initialization ------------
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Search Listeners
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('deviceSearch');
    const searchResult = document.getElementById('searchResult');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchResult.textContent = findDeviceInfo(searchInput.value);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); searchBtn.click(); }
        });
    }

    // 2. Infographic / Modal Logic
    const infoCards = document.querySelectorAll('.info-card');
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    infoCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title || (card.querySelector('h4') ? card.querySelector('h4').innerText : "");
            const content = card.dataset.content || (card.querySelector('p') ? card.querySelector('p').innerText : "");
            
            if (modalTitle && modal) {
                modalTitle.textContent = title;
                modalBody.textContent = content;
                modal.classList.remove('hidden');
            }
        });
    });

    // Added: Close modal logic
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Added: Close modal when clicking outside the box
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // 3. Feedback Star Logic
    const stars = document.querySelectorAll(".star");
    const feedbackBtn = document.getElementById("submitFeedback");
    const ratingStatus = document.getElementById("rating-status");

    stars.forEach(star => {
        star.addEventListener("click", () => {
            userRating = parseInt(star.getAttribute("data-value"));
            
            // Visual Update for Stars
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute("data-value"));
                if (sValue <= userRating) {
                    s.classList.add("selected");
                } else {
                    s.classList.remove("selected");
                }
            });
            
            if (ratingStatus) ratingStatus.innerText = `You rated this ${userRating} stars!`;
        });
    });

    // 4. Feedback Submit Logic
    if (feedbackBtn) {
        feedbackBtn.onclick = function() {
            const feedbackText = document.getElementById("feedbackText").value;

            if (userRating === 0) {
                alert("Please select a star rating first!");
                return;
            }

            const newFeedback = {
                username: localStorage.getItem("username") || "Unknown User",
                  email: localStorage.getItem("userEmail") || "-",
                rating: userRating,
                comment: feedbackText,
                time: new Date().toLocaleString()
            };

            let allFeedbacks = JSON.parse(localStorage.getItem("adminFeedbacks")) || [];
            allFeedbacks.push(newFeedback);
            localStorage.setItem("adminFeedbacks", JSON.stringify(allFeedbacks));

                // 🔄 SYNC rating to ewasteUploads
    let ewaste = JSON.parse(localStorage.getItem("ewasteUploads")) || [];
    const userEmail = localStorage.getItem("userEmail");

    ewaste = ewaste.map(u => {
      if (u.email === userEmail && (!u.rating || u.rating === 0)) {
        return { ...u, rating: userRating };
      }
      return u;
    });

    localStorage.setItem("ewasteUploads", JSON.stringify(ewaste));

            const container = document.querySelector(".feedback-container");
            if (container) {
                container.innerHTML = `<h3>Thank you, ${newFeedback.username}! 🎉</h3><p>Feedback sent to Admin.</p>`;
            }
        };
    }
});


// 2. Add this at the absolute end of the file
function toggleInfo(card) {
  // This allows the cards to flip and show the text as seen in your video
  document.querySelectorAll(".info-item").forEach(item => {
    if (item !== card) item.classList.remove("active");
  });

  card.classList.toggle("active");
}
// Inside user-main/script.js
// Inside user-main/script.js
// Replace your submission function in user-main/script.js
function submitToAdmin() {
    const feedbackData = {
        username: document.getElementById("userName").value, 
        email: document.getElementById("userEmail").value,    // Must be "email"
        category: document.getElementById("category").value, // Must be "category"
        comment: document.getElementById("description").value,
        image: document.getElementById("previewImage").src,  // Must be "image"
        rating: userRating,                                  
        time: new Date().toLocaleString()                     
    };

    let allEntries = JSON.parse(localStorage.getItem("adminFeedbacks")) || [];
    allEntries.push(feedbackData);
    localStorage.setItem("adminFeedbacks", JSON.stringify(allEntries));
    alert("Data sent to Admin!");
}
const fileInput = document.getElementById("imageInput");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imageBase64 = reader.result;

    let uploads = JSON.parse(localStorage.getItem("adminFeedbacks")) || [];

    uploads.push({
      image: imageBase64,   // ✅ THIS IS IMPORTANT
      username: localStorage.getItem("username") || "Unknown User",
      email: localStorage.getItem("email") || "",
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      rating: userRating,
      time: new Date().toLocaleString()
    });

    localStorage.setItem("adminFeedbacks", JSON.stringify(uploads));
    alert("Uploaded successfully!");
  };

  reader.readAsDataURL(file); // 🔥 MUST
});
function uploadEwaste(){

  let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];

  const imageInput = document.getElementById("imageInput");
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if(!imageInput.files[0]){
    alert("Please upload image");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(){

    uploads.push({
      image: reader.result,          // ✅ image
      username: userData.name,        // ✅ user name
      email: userData.email,          // ✅ email
      phone: userData.phone,          // ✅ phone
      category: category,             // ✅ category
      description: description, 
      rating: userRating,   // ⭐⭐⭐⭐⭐ ADD THIS
  date: new Date().toLocaleString(),      // ✅ problem
      status: "pending",              // ✅ status
      technicianSuggestion: "",
      technicianPhone: ""
    });

    localStorage.setItem("ewasteUploads", JSON.stringify(uploads));
    alert("Uploaded successfully ✅");
  };

  reader.readAsDataURL(imageInput.files[0]);
}
// Replace the section in script.js that displays the technician reply
const uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];
const loggedInUserEmail = localStorage.getItem("userEmail"); // Get the email from login

// Find the specific upload for the logged-in user that has a reply
const myUpload = uploads.find(u => u.email === loggedInUserEmail && u.status === "suggested");

if (myUpload) {
    // Show tech response box only if a matching reply exists
    const techBox = document.querySelector(".tech-response");
    const techSuggestion = document.querySelector(".tech-suggestion");
    const techPhone = document.querySelector(".tech-phone");
    const techBadge = document.getElementById("techBadge");

    techSuggestion.innerText = myUpload.technicianSuggestion;
    techPhone.innerText = myUpload.technicianPhone;

    techBox.style.display = "block";
    techBadge.style.display = "inline-block";
} else {
    // Ensure the box is hidden if no reply exists for THIS user
    document.querySelector(".tech-response").style.display = "none";
    document.getElementById("techBadge").style.display = "none";
}
