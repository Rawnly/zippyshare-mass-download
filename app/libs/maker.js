const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const printBlock = require("@splash-cli/print-block");
const pf = require("@splash-cli/path-fixer");
const mkdir = require("mkdirp");

const {
	makeJSONFromArray,
	writeJSON,
	getFileName
} = require('./utils')



module.exports = async function (input, {
	source,
	destination
}) {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(source)) {
			return console.log(source, 'does not exists');
		}

		const file = fs.readFileSync(source, 'utf8')
		const json = makeJSONFromArray(file)

		mkdir.sync(destination)

		return fs.writeFile(path.join(destination, getFileName(source.replace(/\.\w+$/, '.json'))), JSON.stringify(json, null, 2), error => {
			if (error) return reject(error);

			printBlock(chalk `Your file has been created! {underline ${destination}}`)
			resolve(json)
		})
	});
}