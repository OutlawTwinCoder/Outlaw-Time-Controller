Config = {}

-- Language: 'fr' or 'en'
Config.Locale = 'fr'

-- ACE permission to open the menu. You can also use 'outlaw.creator' from your standard.
Config.RequiredAce = 'outlaw.timeoutlaw'   -- add_ace group.admin "outlaw.timeoutlaw" allow

-- Default logical day/night boundaries (24h, integers only).
Config.DayStartHour   = 6   -- 06:00
Config.NightStartHour = 20  -- 20:00

-- Default real-world lengths (in minutes) for each phase.
Config.DayLengthMinutes   = 45 -- real minutes to complete the day phase
Config.NightLengthMinutes = 20 -- real minutes to complete the night phase

-- Default time multiplier (applies to both phases). 1.0 = normal (as configured by lengths)
Config.DefaultMultiplier = 1.0

-- UI theme ('dark-gold' | 'ocean' | 'mint' | 'sunset')
Config.Theme = 'dark-gold'

-- Panel style: 'transparent' (no big background/border), 'glass' (soft), or 'solid'.
Config.PanelStyle = 'transparent'

-- Whether to persist settings (lengths, starts, multiplier, freeze) to disk (state.json)
Config.EnablePersistence = true
