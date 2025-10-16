local RESOURCE = GetCurrentResourceName()

local state = {
    dayStartHour     = Config.DayStartHour,
    nightStartHour   = Config.NightStartHour,
    dayLenMinutes    = Config.DayLengthMinutes,
    nightLenMinutes  = Config.NightLengthMinutes,
    multiplier       = Config.DefaultMultiplier,
    freeze           = false,
    lastForcedHour   = nil,
    lastForcedMinute = nil
}

local function loadState()
    if not Config.EnablePersistence then return end
    local raw = LoadResourceFile(RESOURCE, "state.json")
    if raw and raw ~= "" then
        local ok, data = pcall(json.decode, raw)
        if ok and type(data) == "table" then
            for k, v in pairs(data) do
                if state[k] ~= nil then state[k] = v end
            end
        end
    end
end

local function saveState()
    if not Config.EnablePersistence then return end
    SaveResourceFile(RESOURCE, "state.json", json.encode(state, { indent = true }), -1)
end

AddEventHandler('onResourceStart', function(res)
    if res ~= RESOURCE then return end
    loadState()
    TriggerClientEvent('outlaw_time:state', -1, state)
    if state.lastForcedHour ~= nil then
        TriggerClientEvent('outlaw_time:forceTime', -1, state.lastForcedHour, state.lastForcedMinute or 0)
    end
end)

local function hasPerm(source)
    if source <= 0 then return true end
    if IsPlayerAceAllowed(source, Config.RequiredAce) then return true end
    if IsPlayerAceAllowed(source, 'outlaw.creator') then return true end
    return false
end

RegisterNetEvent('outlaw_time:requestOpen', function()
    local src = source
    if not hasPerm(src) then
        TriggerClientEvent('outlaw_time:toast', src, _U('accessDeniedTitle'), _U('accessDeniedDesc'))
        return
    end
    TriggerClientEvent('outlaw_time:open', src, state, Config.Locale, Config.PanelStyle, Config.Theme)
end)

RegisterNetEvent('outlaw_time:toggleFreeze', function()
    local src = source
    if not hasPerm(src) then return end
    state.freeze = not state.freeze
    TriggerClientEvent('outlaw_time:state', -1, state)
    saveState()
end)

RegisterNetEvent('outlaw_time:setMultiplier', function(mult)
    local src = source
    if not hasPerm(src) then return end
    mult = tonumber(mult) or 1.0
    if mult < 0.25 then mult = 0.25 end
    if mult > 10.0 then mult = 10.0 end
    state.multiplier = mult
    TriggerClientEvent('outlaw_time:state', -1, state)
    saveState()
end)

RegisterNetEvent('outlaw_time:setLengths', function(dayLen, nightLen)
    local src = source
    if not hasPerm(src) then return end
    dayLen = math.max(1, math.floor(tonumber(dayLen) or state.dayLenMinutes))
    nightLen = math.max(1, math.floor(tonumber(nightLen) or state.nightLenMinutes))
    state.dayLenMinutes = dayLen
    state.nightLenMinutes = nightLen
    TriggerClientEvent('outlaw_time:state', -1, state)
    saveState()
end)

RegisterNetEvent('outlaw_time:setStartHours', function(dayStart, nightStart)
    local src = source
    if not hasPerm(src) then return end
    dayStart = math.floor(math.max(0, math.min(23, tonumber(dayStart) or state.dayStartHour)))
    nightStart = math.floor(math.max(0, math.min(23, tonumber(nightStart) or state.nightStartHour)))
    if dayStart == nightStart then
        TriggerClientEvent('outlaw_time:toast', src, _U('invalidHoursTitle'), _U('invalidHoursDesc'))
        return
    end
    state.dayStartHour = dayStart
    state.nightStartHour = nightStart
    TriggerClientEvent('outlaw_time:state', -1, state)
    saveState()
end)

RegisterNetEvent('outlaw_time:jumpTo', function(which)
    local src = source
    if not hasPerm(src) then return end
    local h, m = 12, 0
    if which == 'day_start' then
        h, m = state.dayStartHour, 0
    elseif which == 'day_end' then
        h, m = state.nightStartHour, 0
    elseif which == 'night_start' then
        h, m = state.nightStartHour, 0
    elseif which == 'night_end' then
        h, m = state.dayStartHour, 0
    end
    state.lastForcedHour, state.lastForcedMinute = h, m
    TriggerClientEvent('outlaw_time:forceTime', -1, h, m)
    TriggerClientEvent('outlaw_time:toast', -1, _U('timeAdjustedTitle'), _U('timeAdjustedBody', h, m))
    saveState()
end)
