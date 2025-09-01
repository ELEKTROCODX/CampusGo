
let stations = JSON.parse(localStorage.getItem("stations")) || [];
renderStations();

function renderStations() {
    const container = document.getElementById("stations-grid");
    container.innerHTML = "";
    stations.forEach((obj, i) => {
        container.innerHTML += `
          <div class="station-card">
          <strong>${obj.name}</strong>
            <div class="station-actions">
                <button class="btn btn-view" onclick="seeStationInfo('${obj._uuid}')"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-edit" onclick="editStation('${obj._uuid}')"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn btn-delete" onclick="deleteStation('${obj._uuid}')"><i class="fa-solid fa-trash"></i></button>
            </div>

          </div>
        `;
    });
}

function showCreateForm() {
    document.getElementById("new-station-form").style.display = "block";
    document.getElementById("edit-uuid").value = "";
    document.getElementById("station-name-form").value = "";
}

function saveStation() {
    // Generate ID
    let uuid = crypto.randomUUID();
    const name = document.getElementById("station-name-form").value;
    const editUuid = document.getElementById("edit-uuid").value;
    if (name.trim() === "") {
        alert("El nombre de la estación no puede estar vacío.");
        return;
    }
    if(editUuid === "") {
        stations.push({_uuid: uuid, name, status: "Unregistered" });
    } else {
        const index = stations.findIndex(station => station._uuid === editUuid);
        stations[index].name = name;

    }
    localStorage.setItem("stations", JSON.stringify(stations));
    document.getElementById("new-station-form").style.display = "none";
    renderStations();
    cancelForm();
}

function editStation(_uuid) {
    document.getElementById("new-station-form").style.display = "block";
    document.getElementById("edit-uuid").value = _uuid;
    document.getElementById("station-name-form").value = stations.find(station => station._uuid === _uuid).name;
}

function deleteStation(_uuid) {
    if (confirm("¿Estás seguro de que deseas eliminar esta estación?")) {
        stations = stations.filter(station => station._uuid !== _uuid);
        localStorage.setItem("stations", JSON.stringify(stations));
        renderStations();
    }    
}    

function cancelForm() {
    document.getElementById("new-station-form").style.display = "none";
}

function seeStationInfo(_uuid) {
    document.getElementById("see-station-info").style.display = "block";
    const index = stations.findIndex(station => station._uuid === _uuid);
    const station = stations.find(station => station._uuid === _uuid);
    document.getElementById("station-id-info").textContent = station._uuid;
    document.getElementById("qrcode").innerHTML = ""; // Limpiar QR previo
    if (station) {
        document.getElementById("no-station-found-msg").style.display = "none";
        document.getElementById("station-name-info").textContent = station.name;

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


function downloadQR() {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
        alert("No se ha generado el QR todavía.");
        return;
    }
    const station = document.getElementById("station-name-info").textContent;
    const margin = 20; // margen en píxeles
    // Crear un nuevo canvas más grande
    const newCanvas = document.createElement("canvas");
    const ctx = newCanvas.getContext("2d");
    newCanvas.width = canvas.width + margin * 2;
    newCanvas.height = canvas.height + margin * 2;
    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    // Dibujar el QR en el centro con margen
    ctx.drawImage(canvas, margin, margin);
    // Descargar
    const link = document.createElement("a");
    link.download = `${station}-QR.png`;
    link.href = newCanvas.toDataURL("image/png");
    link.click();
}

function hideStationInfo() {
    document.getElementById("see-station-info").style.display = "none";
    document.getElementById("station-id-info").textContent = "";
}