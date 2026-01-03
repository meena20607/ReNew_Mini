const table = document.getElementById("uploadTable");
let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];


function loadData() {
  table.innerHTML = "";
  if (uploads.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No uploads yet</td></tr>`;
    return;
  }

  uploads.forEach((u, index) => {
    const stars = '★'.repeat(u.rating || 0) + '☆'.repeat(5 - (u.rating || 0));

    table.innerHTML += `
      <tr>
      
        <td style="text-align:left;">
            <div style="font-weight:bold; color:#1f7a3f;">${u.username || "Guest"}</div>
           
        </td>
        <td>${u.category || "General E-Waste"}</td> <td>${u.comment || u.description || "-"}</td>
        <td style="color: #f1c40f;">${stars}</td>
        <td>${u.time || u.date || "-"}</td>
        <td><button onclick="deleteEntry(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button></td>
      </tr>
    `;
  });

  document.getElementById("total").innerText = uploads.length;
}

function deleteEntry(index) {
    if(confirm("Delete this entry?")) {
        uploads.splice(index, 1);
        localStorage.setItem("ewasteUploads", JSON.stringify(uploads)); 
        loadData();
    }
}


// SIDEBAR NAVIGATION LOGIC

const menuItems = document.querySelectorAll(".sidebar ul li");
const views = document.querySelectorAll("main section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // active green color
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // hide all sections
    views.forEach(view => view.style.display = "none");

    // show clicked section
    const key = item.getAttribute("data-key");
    const section = document.getElementById(key + "-view");
    if(section) section.style.display = "block";

    // when technician solved clicked
    if(key === "techSolved"){
      loadTechnicianSolved();
    }

    // when reports clicked
    if(key === "reports"){
      loadReports();
    }
  });
});

loadData();
// LOAD SAVED SETTINGS
const savedTheme = localStorage.getItem("theme");
const savedFont = localStorage.getItem("font");
const savedBrightness = localStorage.getItem("brightness");
const animEnabled = localStorage.getItem("animation");

if(savedTheme) document.body.classList.add(savedTheme);
if(savedFont) document.body.style.fontFamily = savedFont;
if(savedBrightness) document.body.style.filter = `brightness(${savedBrightness}%)`;
if(animEnabled === "false") document.body.classList.add("no-anim");

// THEME
function setTheme(theme){
  document.body.classList.remove("green","dark","light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}

// FONT
function setFont(font){
  document.documentElement.style.fontFamily = font + ", sans-serif";
  localStorage.setItem("font", font);
}

// BRIGHTNESS
function setBrightness(val){
  document.body.style.filter = `brightness(${val}%)`;
  localStorage.setItem("brightness", val);
}

// ANIMATION TOGGLE
function toggleAnimation(enabled){
  if(!enabled){
    document.body.classList.add("no-anim");
    localStorage.setItem("animation","false");
  }else{
    document.body.classList.remove("no-anim");
    localStorage.setItem("animation","true");
  }
}
// NOTIFICATIONS
function toggleNotifications(val){
  localStorage.setItem("notifications", val);
  alert(val ? "Notifications ON 🔔" : "Notifications OFF 🔕");
}

// LANGUAGE
function setLanguage(lang){
  localStorage.setItem("language", lang);
  if(lang === "ta"){
    document.querySelector("h1").innerText = "நிர்வாக டாஷ்போர்டு";
  }else{
    document.querySelector("h1").innerText = "Admin Dashboard";
  }
}

// LAYOUT
function setLayout(type){
  document.body.classList.remove("compact","spacious");
  document.body.classList.add(type);
  localStorage.setItem("layout", type);
}


// LOGOUT
function logoutAdmin(){
  if(confirm("Are you sure to logout?")){
    sessionStorage.removeItem("isAdminLoggedIn");
    window.location.href = "../home/admin-login.html";
  }
}

// SIDEBAR COLLAPSE (DOUBLE CLICK)
document.querySelector(".sidebar").ondblclick = () =>{
  document.querySelector(".sidebar").classList.toggle("collapsed");
};
const languages = {
  en: {
    dashboard: "Dashboard",
    uploads: "Uploads",
    reports: "Reports",
    settings: "Settings",
    adminDashboard: "Admin Dashboard",
    userUploads: "User Uploads",
    reportsTitle: "Reports & Feedback",
    techSolved: "Technician Solved",

    settingsTitle: "Settings",
    theme: "Theme",
    brightness: "Brightness",
    animations: "Animations",
    notifications: "Notifications",
    language: "Language",
    layout: "Layout",
    sounds: "UI Sounds",
    logout: "Logout"
    
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    uploads: "பதிவேற்றங்கள்",
    reports: "அறிக்கைகள்",
    settings: "அமைப்புகள்",
    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    userUploads: "பயனர் பதிவேற்றங்கள்",
    reportsTitle: "அறிக்கைகள் & கருத்துகள்",
    techSolved: "Technician தீர்வு",

    settingsTitle: "அமைப்புகள்",
    theme: "தீம்",
    brightness: "ஒளிர்வு",
    animations: "அசைவுகள்",
    notifications: "அறிவிப்புகள்",
    language: "மொழி",
    layout: "அமைப்பு",
    sounds: "ஒலி அமைப்புகள்",
    logout: "வெளியேறு"
  }
};

function setLanguage(lang){
  localStorage.setItem("language", lang);

  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    el.innerText = languages[lang][key];
  });
}
const savedLang = localStorage.getItem("language") || "en";
setLanguage(savedLang);


const fontSelect = document.getElementById("fontSelect");

if(fontSelect){
  fontSelect.addEventListener("change", function () {
    setFont(this.value);
  });
}

function setFont(font){
  document.body.style.fontFamily = font + ", sans-serif";
  localStorage.setItem("font", font);
}
window.addEventListener("DOMContentLoaded", () => {
  const savedFont = localStorage.getItem("font");
  if(savedFont){
    document.body.style.fontFamily = savedFont + ", sans-serif";

    const fontSelect = document.getElementById("fontSelect");
    if(fontSelect) fontSelect.value = savedFont;
  }
});
// Load saved layout
const savedLayout = localStorage.getItem("layout") || "compact";
document.body.classList.add(savedLayout);

// Change layout
function setLayout(type){
  document.body.classList.remove("compact","spacious");
  document.body.classList.add(type);
  localStorage.setItem("layout", type);
}
// REPLACE your existing loadReports function with this one
function loadReports() {
  const feedbacks = JSON.parse(localStorage.getItem("adminFeedbacks")) || [];
  const table = document.getElementById("reportTable");

  // Stats Logic - Remains exactly as you had it
  const totalUploads = feedbacks.length;
  const totalUsers = [...new Set(feedbacks.map(u => u.email))].length;
  const avgRating = feedbacks.length ? (feedbacks.reduce((sum, u) => sum + (u.rating || 0), 0) / feedbacks.length).toFixed(2) : 0;

  document.getElementById("totalUploads").innerText = totalUploads;
  document.getElementById("avgRating").innerText = avgRating;
  document.getElementById("totalUsers").innerText = totalUsers;

  // Populate Table with the new Delete Column
  table.innerHTML = "";
  if (feedbacks.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No feedback available</td></tr>`;
  } else {
    feedbacks.forEach((u, index) => {
      const stars = '★'.repeat(u.rating || 0) + '☆'.repeat(5 - (u.rating || 0));
      table.innerHTML += `
        <tr>
          <td>${u.username || "Guest"}</td>
          <td>${u.email || "-"}</td>
          <td>${u.category || "General"}</td>
          <td style="color:#f1c40f;">${stars}</td>
          <td>${u.comment || u.description || "-"}</td>
          <td>${u.time || u.date || "-"}</td>
          <td>
            <button onclick="deleteFeedback(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
  }

  // Chart.js Logic - Remains exactly as you had it
  const categoryCount = {};
  feedbacks.forEach(u => {
    const cat = u.category || "General";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  if (window.categoryChartInstance) {
    window.categoryChartInstance.destroy();
  }

  window.categoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(categoryCount),
      datasets: [{
        label: 'Uploads per Category',
        data: Object.values(categoryCount),
        backgroundColor: '#2ecc71'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Uploads by Category' }
      },
      scales: {
        y: { beginAtZero: true, precision: 0 }
      }
    }
  });
}

// ADD THIS NEW FUNCTION at the very bottom of your script
function deleteFeedback(index) {
    if (confirm("Are you sure you want to delete this feedback?")) {
        let feedbacks = JSON.parse(localStorage.getItem("adminFeedbacks")) || [];
        feedbacks.splice(index, 1); // Remove the specific item
        localStorage.setItem("adminFeedbacks", JSON.stringify(feedbacks));
        loadReports(); // Refresh only the reports view
    }
}

// Call this whenever reports section is opened

const ctx = document.getElementById("categoryChart").getContext("2d");

if(window.categoryChartInstance){
  window.categoryChartInstance.destroy();
}


function loadTechnicianSolved(){
  let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];
  const table = document.getElementById("techSolvedTable");

  table.innerHTML = "";

  const solved = uploads
    .map((u, index) => ({ ...u, index }))
    .filter(u => u.technicianSuggestion && u.technicianSuggestion.trim() !== "");

  if(solved.length === 0){
    table.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:gray;">
          No technician replies yet
        </td>
      </tr>`;
    return;
  }

  solved.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>
          <b>${u.username || "User"}</b><br>
        </td>
        <td>${u.category || "-"}</td>
        <td>${u.description || "-"}</td>
        <td>
          ${u.technicianSuggestion}<br>
          
        </td>
        <td>
          <span class="status solved">Replied</span>
        </td>
        <td>
          <button 
            onclick="deleteTechnicianSolved(${u.index})"
            style="background:#ff4d4d;color:white;">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
} 



menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    views.forEach(view => view.style.display = "none");

    const key = item.getAttribute("data-key");
    document.getElementById(key + "-view").style.display = "block";

    if(key === "techSolved"){
      loadTechnicianSolved();
    }
  });
});
function deleteTechnicianSolved(index){
  if(confirm("Delete technician reply?")){
    let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];

    uploads[index].technicianSuggestion = "";
    uploads[index].technicianPhone = "";

    localStorage.setItem("ewasteUploads", JSON.stringify(uploads));

    loadTechnicianSolved(); // refresh
  }
}
