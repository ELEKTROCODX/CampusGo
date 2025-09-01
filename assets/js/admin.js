
let stations = JSON.parse(localStorage.getItem("stations")) || [];
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const station = stations.find(s => s._uuid === id);
if(!id) {
    document.getElementById("see-station-info").style.display = "none";
} else {
    if (station) {
        document.getElementById("no-station-found-msg").style.display = "none";
        document.getElementById("station-name-info").textContent = station.name;
        document.getElementById("station-id-info").textContent = station._uuid;

        // Generar el QR con el UUID
        new QRCode(document.getElementById("qrcode"), {
            text: station._uuid,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else {
        document.getElementById("no-station-found-msg").style.display = "block";
    }
}

renderStations();

function renderStations() {
    const container = document.getElementById("stations-grid");
    container.innerHTML = "";
    stations.forEach((obj, i) => {
        container.innerHTML += `
          <div class="station-card">
          <strong>${obj.name}</strong>
          <p>${obj._uuid}</p>
          <div class="station-state">${obj.status}</div>
            <div class="station-actions">
                <button class="btn btn-view" onclick="window.location.href='index.html?id=${obj._uuid}'"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-edit" onclick="editStation(${i})"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn btn-delete" onclick="deleteStation(${i})"><i class="fa-solid fa-trash"></i></button>
            </div>

          </div>
        `;
    });
}

function showCreateForm() {
    document.getElementById("new-station-form").style.display = "block";
    document.getElementById("editIndex").value = "";
    document.getElementById("station-name-form").value = "";
}

function saveStation() {
    // Generate ID
    let uuid = crypto.randomUUID();
    const name = document.getElementById("station-name-form").value;
    const editIndex = document.getElementById("editIndex").value;
    if (name.trim() === "") {
        alert("El nombre de la estación no puede estar vacío.");
        return;
    }
    if(editIndex === "") {
        stations.push({_uuid: uuid, name, status: "Unregistered" });
    } else {
        stations[editIndex].name = name;
    }
    localStorage.setItem("stations", JSON.stringify(stations));
    document.getElementById("new-station-form").style.display = "none";
    renderStations();
    cancelForm();
}

function editStation(index) {
    document.getElementById("new-station-form").style.display = "block";
    document.getElementById("editIndex").value = index;
    document.getElementById("station-name-form").value = stations[index].name;
}

function deleteStation(index) {
    if (confirm(`¿Estás seguro de que deseas eliminar la estación "${stations[index].name}"?`)) {
        stations.splice(index, 1);
        localStorage.setItem("stations", JSON.stringify(stations));
        renderStations();
    }
}

function cancelForm() {
    document.getElementById("new-station-form").style.display = "none";
}


function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
      const link = document.createElement("a");
      link.download = `${station.name}-QR.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
}

function hideStationInfo() {
    window.location.href = "index.html";
    document.getElementById("see-station-info").style.display = "none";
}