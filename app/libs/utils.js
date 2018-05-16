const {
	URL
} = require("url");
const path = require('path');
const fs = require('fs');

const got = require("got");
const {
	JSDOM
} = require("jsdom");


module.exports.round = (n, p = 2) => {
	return Math.floor(n * Math.pow(10, p)) / Math.pow(10, p);
}

module.exports.getFile = async url => {
	url = new URL(url);

	try {
		const {
			body: html
		} = await got(url.href);

		const {
			window: {
				document
			}
		} = new JSDOM(html);

		// Remove all useless scripts
		document.querySelectorAll("script").forEach(script => {
			if (!script.innerHTML.includes("dlbutton")) script.remove();
		});

		// Clean the script content
		const rows = document
			.querySelector("script")
			.innerHTML.split("\n")
			.filter(row => row !== "")
			.slice(0, 4)
			.map((item, index) => {
				if (index == 3) {
					return item
						.replace("document.getElementById('dlbutton').href = ", "")
						.trim();
				}

				return item.trim();
			});

		const row = rows[0].split("=")[1];

		url.pathname = eval(row);

		return url.href;
	} catch (error) {
		throw error;
	}
}

module.exports.getTime = (start, end) => {
	return Math.floor(Math.abs(end - start) / 1000 * 10) / 10;
}

module.exports.average = (...items) => {
	return items.reduce((a, b) => a + b) / items.length;
}

module.exports.getDifference = (start, end) => {
	delta = start;

	if (end !== undefined) {
		let delta = Math.abs(end - start) / 1000;
	}

	var days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract) whole hours
	var hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract) whole minutes
	var minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	// what's left is seconds
	var seconds = delta % 60; // in theory the modulus is not required

	return {
		days,
		hours,
		minutes,
		seconds
	};
}

module.exports.getFileName = url => {
	return url.match(/\/([A-z0-9.-]{1,}(|\.[a-z]{1,})+$)/g)[0];
}

module.exports.readJson = file => {
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}