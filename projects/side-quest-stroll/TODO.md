# /projects/side-quest-stroll. TODO

## Now
- [ ] Real-world test: walk a few quests in city + countryside.
- [ ] Stress-test radius extremes (minimum 0.5 km, maximum 25 km).

## Next
- [ ] Auto-detect city vs countryside from the pin (Nominatim reverse geocode, cache result on pin). Manual toggle stays as override.
- [ ] Consider switching the routing provider from public OSRM to Mapbox Directions if rate-limit becomes an issue with regular use.
- [ ] Edit a saved pin without resetting (drag marker on map).
- [ ] Auto-detect arrival via geolocation watch (~30 m of target = mark done prompt). Opt-in toggle.
- [ ] Save photos / notes per completed quest (uploaded to /public/quests/<id>/ or as data URLs).
- [ ] Tap-to-edit historical quest text.

## Later
- [ ] Multiple home pins ("Home", "Work", "Parents"). Pin-name pill switcher above the map.
- [ ] Share a quest as a URL or QR (encode start, target, quest text).
- [ ] Daily quest streak / counter habit integration with `tempo`.
- [ ] PWA tile caching so the map works offline within a recently-viewed area.
- [ ] Address geocoding (Nominatim) as a fifth pin-input method.

## Versions
This project is WIP. No versions published yet.
