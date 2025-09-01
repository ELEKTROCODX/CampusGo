
let stations = JSON.parse(localStorage.getItem("stations")) || [];


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
    document.getElementById("stationName").value = "";
}

function saveStation() {
    // Generate ID
    let uuid = crypto.randomUUID();
    const name = document.getElementById("stationName").value;
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
    document.getElementById("stationName").value = stations[index].name;
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
