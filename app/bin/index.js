#!/usr/bin/env node

const Meow = require('meow');
const chalk = require('chalk');
const core = require('../libs/core');

const cli = Meow(chalk`
	{green $} {yellow zippyshare} [path] [flags]

	{yellow --destination -d}
	{yellow --source -s}

	{dim Examples:}
		{green $} {yellow zippyshare} {dim {underline ~/Desktop/episodes.json} --destination {underline ~/Movies/SERIES/my-serie/}}
		{green $} {yellow zippyshare} {dim --source {underline ~/Desktop/episodes.json} --destination {underline ~/Movies/SERIES/my-serie}}
		{green $} {yellow zippyshare} {dim --source {underline ~/Desktop/episodes.json}}
`, {
	flags: {
		destination: {
			alias: 'd',
			type: 'string',
			default: '~/Downloads'
		},
		source: {
			alias: 's',
			type: 'string'
		}
	}
})

async function client(input, {source, destination}) {
	if (!input && !source) throw new SyntaxError('Expected source file')

	await core(source || input, destination)
}

client(cli.input[0], cli.flags);