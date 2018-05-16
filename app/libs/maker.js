const fs = require('fs');

const chalk = require('chalk');
const printBlock = require("@splash-cli/print-block");
const pf = require("@splash-cli/path-fixer");
const mkdir = require("mkdirp");

const {
	makeJSONFromArray,
	writeJSON
} = require('./utils')



module.exports = async function (input, {
	source,
	destination
}) {
	return new Promise((resolve, reject) => {
		const file = fs.readFileSync(source, 'utf8')
		const json = makeJSONFromArray(file);

		return fs.writeFile(destination, JSON.stringify(json, null, 2), error => {
			if (error) return reject(error);

			printBlock(chalk `Your file has been created! {underline ${destination}}`)
			resolve(json)
		})
	});
}