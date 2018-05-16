const fs = require("fs");
const chalk = require("chalk");

const Ora = require("ora");
const path = require("path");
const File = require("simple-download");
const printBlock = require("@splash-cli/print-block");
const pf = require("@splash-cli/path-fixer");
const mkdir = require("mkdirp");

const {
	round,
	getFile,
	getTime,
	average,
	readJson,
	getFileName,
	getDifference
} = require("./utils");

const spinner = new Ora();

module.exports = async function (
	episodes,
	destination = path.join(__dirname, "downloads")
) {
	destination = pf(destination);
	episodes = readJson(pf(episodes));

	mkdir.sync(destination);

	let files = fs.readdirSync(destination).filter(f => f.includes(".rar")),
		urls = [],
		times = [],
		avTime = 0,
		eta = 0,
		file,
		action = {
			start: Date.now(),
			elapsedTime: 0
		};

	if (files.length) {
		printBlock(
			chalk `Found: {green ${files.length -
        1}} rar files. Counting from {green ${files.length - 1}}`,
			""
		);
	} else {
		files.push('');
	}

	spinner.start(
		chalk `{dim [ETA: calculating...]} {yellow ${urls.length + files.length - 1}} of {yellow ${episodes.length}}`
	);

	for (let i = files.length - 1; i < episodes.length; i++) {
		const element = episodes[i].replace(/\s+/, "");

		try {
			let start = Date.now();
			let url = await getFile(element);

			urls.push(url);
			file = new File(url, path.join(destination, getFileName(url)));

			let data = await file.download();
			let seconds = getTime(start, Date.now());

			times.push(seconds);
			avTime = average.apply(average, times);
			eta = getDifference(
				round(
					avTime *
					(episodes.length - urls.length + files.length - 1),
					0
				)
			);

			spinner.text = chalk `\n{dim [SINGLE: ${getDifference(avTime).hours}h ${getDifference(avTime).minutes}m ${getDifference(avTime).seconds}s]\n[ETA: ${eta.hours}h ${eta.minutes}m ${eta.seconds}s]}\n{yellow ${urls.length + files.length - 1}} of {yellow ${episodes.length}}`;
		} catch (error) {
			throw error;
		}
	}

	action.elapsedTime = getDifference(action.start, Date.now());

	spinner.info(
		`Completed in ${round(action.elapsedTime.hours, 0)}h ${round(
      action.elapsedTime.minutes,
      0
    )}m ${round(action.elapsedTime.seconds, 0)}s`
	);

	spinner.succeed();
};