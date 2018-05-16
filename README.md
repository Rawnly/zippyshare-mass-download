# Snahp Zippyshare Spider

> Download zippyshare files directly on your machine

## Usage

```bash
	$ zshare <cmd> <flags>

 FLAGS (valid for all commands):
		--destination -d <path>
		--source -s      <path>

  COMMANDS:
		make <flags>            | Generated a json file from a list
		download <flags>        | Download files from a json list

  USAGE:
		$ zshare make --source ~/Desktop/list.txt --destination ~/Desktop

		# Then

		$ zshare download --source ~/Desktop/list.json --destination ~/Movies
```
