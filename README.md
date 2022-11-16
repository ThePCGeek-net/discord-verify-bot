# Discordjs 14 verify bot

## Setup

You will need to make a .env file with your variables as follows:

```env
BOT_TOKEN=
UNVERIFIED_ROLE=
```

Fill in the token for your discord bot and the ID from the role you wish to assign which will have no view access to any of your categories and only have view access to the 'welcome' channel

You can run this bot easily in a docker container, the Dockerfile is part of the repo.  Just git clone it and run `docker build .` to build the container locally and then `docker run` it. I won't go into depth on how to run a docker container since there is plenty of that online.

## Discord - setup

In your server you will need to or already have the unverified role set up and proper permissions, deny view access on all categories and make sure perms are synced where necessary.

Join your bot app to your server and as a discord admin go to any channel, preferably a private one for admins only, and type `!deploy` then press enter. that will push the slash command.  Then do `/setup` and select the welcome channel you made where the message will be that new users will need to click on to gain access to the rest of the server.

I recommend putting your rules in that channel first if you want so the verify button message is down below them.  You can always edit the rules message later on or if need be delete the message with the button from the bot and re-run /setup again to re-create it.

## using CI/CD

I included my example .gitlab-ci.yml if you want to use CI/CD to deploy using docker in docker method, again I wont go into detail because lot of tutorials online how to get a docker host set up for that properly.

You will need to create the .env in CI or else put it on the host ahead of time and use --envfile docker run option to specify its path on the docker server, or else pass in those vars as -e flags separately on docker run.
