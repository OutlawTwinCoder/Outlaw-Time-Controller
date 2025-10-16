# Outlaw • Time Controller

A modern, themeable time administration panel for FiveM servers. The UI is built with accessibility and responsive design in mind and ships with English strings by default (French is available out of the box).

## Features

- ✨ Beautiful glass-inspired interface with multiple color themes (`dark-gold`, `ocean`, `mint`, `sunset`).
- 🌓 Separate day and night cycle controls, including jump buttons for instant transitions.
- ⏱️ Fine-grained control over in-game time progression (custom lengths, multipliers, and freeze toggle).
- 💾 Optional persistence layer that saves your last settings and reapplies them on server restart.
- 🌐 Built-in localisation with automatic fallback (English by default, French available).
- 🔒 Permission-gated access via ACE powers (`outlaw.timeoutlaw` by default).

## Installation

1. Drop the folder inside your FiveM resources directory (e.g. `resources/[local]/outlaw-time-controller`).
2. Make sure the folder name matches the resource name referenced in your server config.
3. Add the resource to your `server.cfg`:

   ```cfg
   ensure outlaw-time-controller
   ```

4. (Optional) Configure ACE permissions so the right staff can open the menu:

   ```cfg
   add_ace group.admin "outlaw.timeoutlaw" allow
   ```

## Configuration

All configuration lives in [`config.lua`](config.lua):

- `Config.Locale` – UI locale (`'en'` by default, switch to `'fr'` for French).
- `Config.RequiredAce` – ACE power required to open the panel.
- `Config.DayStartHour` / `Config.NightStartHour` – Logical boundaries for day vs night.
- `Config.DayLengthMinutes` / `Config.NightLengthMinutes` – Real minutes for each phase.
- `Config.DefaultMultiplier` – Base time multiplier.
- `Config.Theme` – Default UI theme (`dark-gold`, `ocean`, `mint`, `sunset`).
- `Config.PanelStyle` – Layout finish (`transparent`, `glass`, `solid`).
- `Config.EnablePersistence` – Whether to persist state to `state.json`.

After editing `config.lua`, restart the resource or run `refresh` + `ensure outlaw-time-controller` in the FiveM console.

## Commands

- `/timeoutlaw` – Opens the interface (permissions apply).

Use the on-screen controls to:

- Freeze or resume the clock.
- Jump to preset moments (day/night boundaries).
- Apply time multipliers.
- Adjust the length of day/night phases.
- Update the hours used to define day vs night.
- Instantly set a specific HH:MM.

## Localisation

Translations live in [`locales.lua`](locales.lua). To add a new language:

1. Duplicate one of the locale tables and adjust the strings.
2. Update `Config.Locale` to the new language code.
3. Optionally extend the UI translation table in [`html/app.js`](html/app.js).

The system automatically falls back to English if a key is missing.

## Development Notes

- The UI is written in vanilla JavaScript with a small state manager (`html/app.js`).
- Styles rely on CSS custom properties for themes; you can add new palettes by extending [`html/style.css`](html/style.css).
- Persistence uses `state.json` inside the resource folder. Disable it if your hosting environment prevents write access.

Happy administrating! 🎮
