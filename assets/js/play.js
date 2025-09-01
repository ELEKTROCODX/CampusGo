let stations = JSON.parse(localStorage.getItem("stations")) || [];
renderStations();

function renderStations() {
	const container = document.getElementById("stations-grid");
	container.innerHTML = "";
	stations.forEach((obj, i) => {
		container.innerHTML += `
          <div class="station-card" id="station-${obj._uuid}">
          <strong>${obj.name}</strong>
          <div class="station-state">${obj.status}</div>
          </div>
        `;
	});
}

const btnScan = document.getElementById("btn-scan-qr");
const btnStop = document.getElementById("btn-stop-qr");
const statusLine = document.getElementById("status-line");
const video = document.getElementById("video");
const canvas = document.getElementById("qr-canvas");
const ctx = canvas.getContext("2d");
const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
let scanning = false;
let stream = null;

async function startCamera() {
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: { ideal: "environment" } },
		});
		video.srcObject = stream;
		video.hidden = false;
		canvas.hidden = true;
		video.setAttribute("playsinline", true);
		await video.play();
		scanning = true;
		btnStop.hidden = false;
		btnStop.removeAttribute("aria-hidden");
		btnScan.setAttribute("aria-pressed", "true");
		statusLine.textContent = "Escaneando... apunta al QR";
		requestAnimationFrame(tick);
	} catch (err) {
		console.error(err);
		statusLine.textContent =
			"No se pudo acceder a la cámara. Revisa permisos o intenta otro dispositivo.";
		btnScan.removeAttribute("aria-pressed");
		btnScan.hidden = false;
		btnStop.hidden = true;
		alertMessageForCameraError(err);
	}
}

function alertMessageForCameraError(err) {
	if (err.name === "NotAllowedError")
		alert(
			"Permiso de cámara denegado. Actívalo en la configuración del navegador."
		);
	else if (err.name === "NotFoundError")
		alert("No se encontró una cámara en este dispositivo.");
	else if (err.name === "OverconstrainedError")
		alert(
			"No existe la cámara solicitada (trasera). Prueba en otro dispositivo."
		);
	else alert("Error accediendo a la cámara: " + (err.message || err));
}

function stopCamera() {
	scanning = false;
	if (stream) {
		stream.getTracks().forEach((t) => t.stop());
		stream = null;
	}
	video.pause();
	video.srcObject = null;
	video.hidden = true;
	btnStop.hidden = true;
	btnStop.setAttribute("aria-hidden", "true");
	btnScan.hidden = false;
	btnScan.setAttribute("aria-pressed", "false");
	statusLine.textContent = "Escaneo detenido. Puedes reiniciarlo.";
}

function tick() {
	if (!scanning) return;
	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});

		if (code && code.data) {
			handleScannedCode(code.data.trim());
			return;
		}
	}
	requestAnimationFrame(tick);
}

function handleScannedCode(content) {
	console.log("QR content:", content);

	scanning = false;
	audio.play().catch(() => { });
	stopCamera();
	const key = stations.findIndex((station) => station._uuid === content);
	console.log("Station index:", key);

	if (stations[key]) {
		console.log("Found station:", stations[key]);

		stations[key].status = "Visitado";
		localStorage.setItem("stations", JSON.stringify(stations));
		renderStations();
		statusLine.textContent = `Estación registrada: ${stations[key].name}`;
		document
			.getElementById(`station-${stations[key]._uuid}`)
			.classList.add("station-card.done");
	} else {
		alert("QR no reconocido: " + content);
		statusLine.textContent = "QR no válido. Intenta de nuevo.";
	}
}

btnScan.addEventListener("click", () => {
	btnScan.hidden = true;
	startCamera();
});
btnStop.addEventListener("click", stopCamera);
