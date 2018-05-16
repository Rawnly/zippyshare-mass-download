#!/usr/bin/env node

const Meow = require('meow');
const chalk = require('chalk');
const downloader = require('../libs/downloader');
const maker = require('../libs/maker');
const pb = require('@splash-cli/print-block')
const pf = require('@splash-cli/path-fixer')

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
	if (!input) {
		return pb(chalk `Invalid {bold {yellow command}}!`, '- make', '- download', '', 'zshare --help for more')
	}
	switch (input) {
		case "download":
			if (!source || !destination) {
				return pb(chalk `Invalid {bold {yellow source/destination}}!`, '- make', '- download', '', 'zshare --help for more')
			}

			source = pf(source);
			destination = pf(destination);
			await downloader(source, destination)
			break;
		case "make":
			if (!source || !destination) {
				return pb(chalk `Invalid {bold {yellow source/destination}}!`, '- make', '- download', '', 'zshare --help for more')
			}

			source = pf(source);
			destination = pf(destination);
			await maker(source, destination)
			break;
		default:
			return pb(chalk `Invalid {bold {yellow command}} "{red ${input}}"!`, '- make', '- download', '', 'zshare --help for more')
			break;
	}
}

client(cli.input[0], cli.flags);