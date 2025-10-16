local state = {
    dayStartHour    = Config.DayStartHour,
    nightStartHour  = Config.NightStartHour,
    dayLenMinutes   = Config.DayLengthMinutes,
    nightLenMinutes = Config.NightLengthMinutes,
    multiplier      = Config.DefaultMultiplier,
    freeze          = false,
}

local curMinutes = 12 * 60 -- default noon

local function minutesBetween(startH, endH)
    local startM = startH * 60
    local endM = endH * 60
    local diff = endM - startM
    if diff <= 0 then diff = diff + 24 * 60 end
    return diff
end

local function isDay(h)
    local d = state.dayStartHour
    local n = state.nightStartHour
    if d < n then
        return (h >= d and h < n)
    else
        return (h >= d or h < n)
    end
end

local function getSecondsPerGameMinute(h)
    local d = state.dayStartHour
    local n = state.nightStartHour
    local daySpanMin = minutesBetween(d, n)
    local nightSpanMin = 24*60 - daySpanMin

    local isDayNow = isDay(h)
    local realSecondsForPhase = (isDayNow and state.dayLenMinutes or state.nightLenMinutes) * 60.0
    local phaseGameMinutes = (isDayNow and daySpanMin or nightSpanMin)
    local spgm = realSecondsForPhase / math.max(1.0, phaseGameMinutes)
    spgm = spgm / math.max(0.001, state.multiplier)
    return spgm
end

local function setClockHM(h, m, s)
    NetworkOverrideClockTime(h, m, s or 0)
end

local function minutesToHM(mins)
    mins = mins % (24*60)
    local h = math.floor(mins / 60)
    local m = math.floor(mins % 60)
    return h, m
end

RegisterNetEvent('outlaw_time:state', function(newState)
    for k, v in pairs(newState) do
        state[k] = v
    end
    SendNUIMessage({ action = 'state', data = state })
end)

RegisterNetEvent('outlaw_time:forceTime', function(h, m)
    curMinutes = (h * 60 + (m or 0)) % (24*60)
    setClockHM(h, m or 0, 0)
end)

RegisterNetEvent('outlaw_time:open', function(serverState, locale, panelStyle, theme)
    for k, v in pairs(serverState) do
        state[k] = v
    end
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open',
        theme = theme or Config.Theme,
        style = panelStyle or 'transparent',
        locale = locale or Config.Locale,
        data = state,
        now = { h = math.floor(curMinutes/60), m = math.floor(curMinutes%60) }
    })
end)

RegisterNetEvent('outlaw_time:toast', function(title, message)
    BeginTextCommandThefeedPost("STRING")
    AddTextComponentSubstringPlayerName((title or "Info") .. "\n" .. (message or ""))
    EndTextCommandThefeedPostTicker(false, true)
end)

RegisterCommand('timeoutlaw', function()
    TriggerServerEvent('outlaw_time:requestOpen')
end, false)

RegisterNuiCallback('close', function(_, cb)
    SetNuiFocus(false, false)
    cb({ ok = true })
end)

RegisterNuiCallback('toggleFreeze', function(_, cb)
    TriggerServerEvent('outlaw_time:toggleFreeze')
    cb({ ok = true })
end)

RegisterNuiCallback('setMultiplier', function(data, cb)
    TriggerServerEvent('outlaw_time:setMultiplier', tonumber(data and data.multiplier or 1.0))
    cb({ ok = true })
end)

RegisterNuiCallback('setLengths', function(data, cb)
    if not data then cb({ ok=false }) return end
    TriggerServerEvent('outlaw_time:setLengths', tonumber(data.dayLen or state.dayLenMinutes), tonumber(data.nightLen or state.nightLenMinutes))
    cb({ ok = true })
end)

RegisterNuiCallback('setStartHours', function(data, cb)
    if not data then cb({ ok=false }) return end
    TriggerServerEvent('outlaw_time:setStartHours', tonumber(data.dayStart or state.dayStartHour), tonumber(data.nightStart or state.nightStartHour))
    cb({ ok = true })
end)

RegisterNuiCallback('jumpTo', function(data, cb)
    if not data or not data.which then cb({ ok=false }) return end
    TriggerServerEvent('outlaw_time:jumpTo', data.which)
    cb({ ok = true })
end)

RegisterNuiCallback('instantSet', function(data, cb)
    local h = tonumber(data and data.h or 12) or 12
    local m = tonumber(data and data.m or 0) or 0
    h = math.floor(math.max(0, math.min(23, h)))
    m = math.floor(math.max(0, math.min(59, m)))
    curMinutes = h*60 + m
    setClockHM(h, m, 0)
    cb({ ok = true })
end)

CreateThread(function()
    local last = GetGameTimer() / 1000.0
    local frac = 0.0
    while true do
        Wait(0)
        local now = GetGameTimer() / 1000.0
        local dt = now - last
        last = now

        local h, m = minutesToHM(curMinutes)
        if state.freeze then
            PauseClock(true)
            setClockHM(h, m, 0)
        else
            PauseClock(false)
            local spgm = getSecondsPerGameMinute(h)
            if spgm < 0.05 then spgm = 0.05 end
            local gameMinutesToAdd = dt / spgm
            frac = frac + gameMinutesToAdd
            local addWhole = math.floor(frac)
            if addWhole > 0 then
                frac = frac - addWhole
                curMinutes = (curMinutes + addWhole) % (24*60)
                h, m = minutesToHM(curMinutes)
            end
            local seconds = math.floor(frac * 60) % 60
            setClockHM(h, m, seconds)
        end
    end
end)
