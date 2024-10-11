"use strict";

import { url } from "./utils/urls.js";

const networthLabel = document.querySelector("#networth-value-section > span");
const numberFormat = new Intl.NumberFormat("es-CO");
const fitemTemplate = document.getElementById("fitem-template");

function main() {
	const token = sessionStorage.getItem("access_token");
	if (!token) {
		location.href = "./pages/authetication.html";
		return;
	}

	fetchUserData(token);
	fetchUserNetworthData(token);
	fetchUserActives(token);
	fetchUserPassives(token);
	document.getElementById("create-active-form").addEventListener("submit", {
		handleEvent: (event) => {
			handleCreateActive(event, token);
		},
	});
	document.getElementById("create-passive-form").addEventListener("submit", {
		handleEvent: (event) => {
			handleCreatePassive(event, token);
		},
	});
	document.getElementById("btn-create-networth").addEventListener("click", {
		handleEvent: () => {
			onCreateNetworth(token);
		},
	});

	document.getElementById("btn-logout").addEventListener("click", {
		handleEvent: () => {
			sessionStorage.removeItem("access_token");
			location.href = "./pages/authetication.html";
		},
	});
	document.getElementById("btn-update-networth").addEventListener("click", {
		handleEvent: () => {
			handleUpdateNetworth(token);
		},
	})
}

async function fetchUserData(token) {
	const userNameLabel = document.querySelector("#user-name-label");
	const userEmailLabel = document.querySelector("#user-email-label");
	const userCCLabel = document.querySelector("#user-cc-label");
	const userPhoneLabel = document.querySelector("#user-phone-label");
	const userPhotoLabel = document.querySelector("#user-photo-img");
	
	try {
		let response;
		let userData;
		response = await fetch(`${url}/auth`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			let photoURL

			userData = await response.json();
			photoURL = userData.photo ?? "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
			userNameLabel.textContent = `${userData.fname} ${userData.lname}`;
			userEmailLabel.textContent = userData.email;
			userCCLabel.textContent = userData.cc;
			userPhoneLabel.textContent = userData.phone;
			userPhotoLabel.setAttribute("src", photoURL);
		} else {
			location.href = "./pages/authetication.html";
		}
	} catch (error) {
		console.log(error);
	}
}

async function fetchUserNetworthData(token) {
	try {
		let response;
		let data;
		response = await fetch(`${url}/user/networth/value`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			data = await response.json();

			if (data != null) {
				networthLabel.textContent = `\$${numberFormat.format(data.value)}`;
				document.querySelector("#networth-value-section").style.display = "block";
				document.querySelector("#networth-create-section").style.display = "none";
			} else {
				document.querySelector("#networth-value-section").style.display = "none";
				document.querySelector("#networth-create-section").style.display = "block";
			}
		} else {
			location.href = "./pages/authetication.html";
		}
	} catch (error) {
		console.log(error);
	}
}

async function onCreateNetworth(token) {
	try {
		let response;
		let data;

		response = await fetch(`${url}/user/networth/value`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			data = await response.json();

			networthLabel.textContent = `\$${numberFormat.format(data.value)}`;
			document.querySelector("#networth-value-section").style.display = "block";
			document.querySelector("#networth-create-section").style.display = "none";
			return;
		}
		if (response.headers.get("x-error") == "NetworthAlreadyExists") {
			window.alert("Ya existe un valor de patrimonio neto para este usuario.");
		}
	} catch (error) {
		console.log(error);
	}
}

async function fetchUserActives(token) {
	try {
		const container = document.getElementById("actives-container");
		let activesListRequest;
		let activesValueRequest;

		activesListRequest = await fetch(`${url}/user/networth/actives`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		activesValueRequest = await fetch(`${url}/user/networth/actives/value`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (activesListRequest.ok && activesValueRequest.ok) {
			const data = await activesListRequest.json();
			const value = await activesValueRequest.json();
			let format = `\$${numberFormat.format(value)}`;
			let i = 0;

			document.getElementById("actives-value").textContent = format;
			data.forEach((element) => {
				let clone = fitemTemplate.content.cloneNode(true);
				let elementValue = `\$${numberFormat.format(element.value)}`;

				clone.querySelector(".fitem-id").textContent = ++i;
				clone.querySelector(".fitem-name").textContent = element.name;
				clone.querySelector(".fitem-value").textContent = elementValue;
				container.appendChild(clone);
			});
		}
	} catch (error) {
		console.log(error);
	}
}

async function fetchUserPassives(token) {
	try {
		const container = document.getElementById("passives-container");
		let passivesListRequest;
		let passivesValueRequest;

		passivesListRequest = await fetch(`${url}/user/networth/pasives`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		passivesValueRequest = await fetch(`${url}/user/networth/pasives/value`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (passivesListRequest.ok && passivesValueRequest.ok) {
			const data = await passivesListRequest.json();
			const value = await passivesValueRequest.json();
			let format = `\$${numberFormat.format(value)}`;
			let i = 0;

			document.getElementById("passives-value").textContent = format;
			data.forEach((element) => {
				let clone = fitemTemplate.content.cloneNode(true);
				let elementValue = `\$${numberFormat.format(element.value)}`;

				clone.querySelector(".fitem-id").textContent = ++i;
				clone.querySelector(".fitem-name").textContent = element.name;
				clone.querySelector(".fitem-value").textContent = elementValue;
				container.appendChild(clone);
			});
		}
	} catch (error) {
		console.log(error);
	}
}

async function handleCreateActive(event, token) {
	event.preventDefault();
	const form = event.target;
	let name = form.querySelector("#txt-active-name").value;
	let value = form.querySelector("#txt-active-price").value;

	try {
		const response = await fetch(`${url}/user/networth/actives`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				value: value,
			}),
		});
		const result = await response.json();

		if (response.ok) {
			location.reload();
		}
	} catch (error) {
		window.alert(error);
	}
}

async function handleCreatePassive(event, token) {
	event.preventDefault();
	const form = event.target;
	let name = form.querySelector("#txt-passive-name").value;
	let value = form.querySelector("#txt-passive-price").value;

	try {
		const response = await fetch(`${url}/user/networth/pasives`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				value: value,
			}),
		});
		const result = await response.json();

		if (response.ok) {
			location.reload();
		}
	} catch (error) {
		window.alert(error);
	}
}

async function handleUpdateNetworth(token) {
	try {
		let response = await fetch(`${url}/user/networth/value`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			location.reload();
			return;
		}
	} catch (error) {
		console.log(error);
	}
}

main();
