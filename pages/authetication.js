"use strict";

import { url } from "../utils/urls.js";

function main() {
	document.getElementById("signin-form").addEventListener("submit", login);
  document.getElementById("signup-form").addEventListener("submit", register);
}

async function login(event) {
	event.preventDefault();
	let email = document.getElementById("txt-login-user-email").value;
	let password = document.getElementById("txt-login-user-password").value;
	let params = new URLSearchParams();

	params.append("username", email);
	params.append("password", password);
  sendAuthenticationRequest(params);
}

async function register(event) {
	event.preventDefault();
	let fname = document.getElementById("txt-resgister-user-fname").value;
	let lname = document.getElementById("txt-resgister-user-lname").value;
	let cc = document.getElementById("txt-resgister-user-cc").value;
	let email = document.getElementById("txt-resgister-user-email").value;
	let password = document.getElementById("txt-resgister-user-password").value;
	const data = {
		fname: fname,
		lname: lname,
		cc: cc,
		email: email,
		password: password,
	};

	try {
		const response = await fetch(`${url}/auth/sign-up`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();

		if (response.ok) {
      let params = new URLSearchParams()
      params.append("username", email)
      params.append("password", password)
      sendAuthenticationRequest(params)
		} else {
			window.alert(result.message);
		}
	} catch (error) {}
}

async function sendAuthenticationRequest(params) {
	try {
		const response = await fetch(`${url}/auth/sign-in`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});
		const result = await response.json();

		if (response.ok) {
			sessionStorage.setItem("access_token", result.access_token);
			location.href = "../index.html";
		} else {
			window.alert(result.message);
		}
	} catch (error) {
    console.log(error);
  }
}

main();
