fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'Outlaw_TimeController'
author 'ChatGPT (Outlaw Studios helper)'
description 'Admin time control with day/night ratio and NUI menu (/timeoutlaw)'
version '1.2.0'

ui_page 'html/index.html'

shared_scripts {
    'config.lua',
    'locales.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

files {
    'html/index.html',
    'html/style.css',
    'html/app.js'
}
