let uploads = JSON.parse(localStorage.getItem("ewasteUploads")) || [];

function loadTechnicianTable(){
  const table = document.getElementById("techTable");
  table.innerHTML = "";

  if(uploads.length === 0){
    table.innerHTML = `
      <tr>
        <td colspan="5">No user uploads yet</td>
      </tr>`;
    return;
  }

  uploads.forEach((u,index)=>{
    table.innerHTML += `
      <tr>
        <td><img src="${u.image}"></td>

        <td>
          <b>${u.username}</b><br>
          📧 ${u.email}<br>
          
        </td>

        <td>${u.category}</td>

        <td>${u.description}</td>

        <td>
          <textarea id="sugg${index}"
            placeholder="Write short suggestion (4 lines max)">${u.technicianSuggestion || ""}</textarea>

          <input id="phone${index}"
            placeholder="Your contact number"
            value="${u.technicianPhone || ""}">

          <button onclick="sendSuggestion(${index})">Send</button>
<button onclick="deleteUpload(${index})" style="background:#e74c3c;">Delete</button>

        </td>
      </tr>
    `;
  });
}

function sendSuggestion(index){
  uploads[index].technicianSuggestion =
    document.getElementById("sugg"+index).value;

  uploads[index].technicianPhone =
    document.getElementById("phone"+index).value;

  uploads[index].status = "suggested";

  localStorage.setItem("ewasteUploads", JSON.stringify(uploads));

  alert("Suggestion sent ✅");
}
function deleteUpload(index){
  if(!confirm("Are you sure you want to delete this upload? This will remove it for the user too.")) return;

  // Remove the upload from the array
  uploads.splice(index, 1);

  // Update localStorage
  localStorage.setItem("ewasteUploads", JSON.stringify(uploads));

  // Reload the table
  loadTechnicianTable();

  alert("Upload deleted ✅");
}


loadTechnicianTable();
