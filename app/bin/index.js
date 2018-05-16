#!/usr/bin/env node

const Meow = require('meow');
const chalk = require('chalk');
const downloader = require('../libs/downloader');
const maker = require('../libs/maker');

const cli = Meow(chalk `
	{green $} {yellow zshare} {cyan <cmd> <flags>}

	FLAGS (valid for all commands):
		{yellow --destination -d} {cyan <path>}
		{yellow --source -s}	 {cyan <path>}

	COMMANDS:
		{cyan make <flags>}		{gray | Generated a json file from a list}
		{cyan download <flags>}	{gray | Download files from a json list}
	
	USAGE:
		{green $} {yellow zshare} {cyan make --source} {underline ~/Desktop/list.txt} {cyan --destination} {underline ~/Desktop}
		
		{dim # Then}

		{green $} {yellow zshare} {cyan download --source} {underline ~/Desktop/list.json} {cyan --destination} {underline ~/Movies}
`, {
	flags: {
		destination: {
			alias: 'd',
			type: 'string'
		},
		source: {
			alias: 's',
			type: 'string'
		}
	}
})

async function client(input, {
	source,
	destination
}) {
	if (!source || !destination) throw new SyntaxError('Expected source/destination')

	source = pf(source);
	destination = pf(destination);

	switch (input) {
		case "download":
			await downloader(source, destination)
			break;
		case "make":
			await maker(source, destination)
			break;
		default:
			printBlock(chalk `{red Invalid argument {bold "${input}"}}`)
			break;
	}
}

client(cli.input[0], cli.flags);