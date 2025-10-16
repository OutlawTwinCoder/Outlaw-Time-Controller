Locales = {}

Locales['en'] = {
    accessDeniedTitle = "Access denied",
    accessDeniedDesc  = "You don't have permission.",
    invalidHoursTitle = "Invalid hours",
    invalidHoursDesc  = "Day and night cannot start at the same hour.",
    timeAdjustedTitle = "Time adjusted",
    timeAdjustedBody  = "Set to %02d:%02d"
}

Locales['fr'] = {
    accessDeniedTitle = "Accès refusé",
    accessDeniedDesc  = "Tu n'as pas la permission.",
    invalidHoursTitle = "Heures invalides",
    invalidHoursDesc  = "Le jour et la nuit ne peuvent pas commencer à la même heure.",
    timeAdjustedTitle = "Temps ajusté",
    timeAdjustedBody  = "Réglé à %02d:%02d"
}

function _U(key, ...)
    local L = Locales[Config.Locale] or Locales['en']
    local val = L[key] or (Locales['en'][key] or key)
    if select('#', ...) > 0 then
        return string.format(val, ...)
    end
    return val
end
