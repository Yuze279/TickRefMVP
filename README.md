# TickRef — live event discovery and price tracking

Renamed and rebuilt from the Encore course concept. Frontend: responsive dark-purple TickRef site. Backend: Node 20+ HTTP server, no third-party packages. **This is a functioning live-data integration once an authorized API key is provided, not a fabricated ticket marketplace.**

## Run

```bash
cd tickref
cp .env.example .env
# Edit .env, paste your own TICKETMASTER_API_KEY
node --env-file=.env server.js
# open http://localhost:8080
```

`npm start` also works if environment variables have already been exported. `npm test` checks price normalization. On first launch without keys, the UI correctly explains that no live event feeds are configured rather than displaying imaginary events or prices.

## Implemented

- Event discovery/search by keyword, US city, category with real Ticketmaster Discovery API, and optional SeatGeek access.
- Honest provider-labelled *published starting prices*, original event links, external searches on five major marketplaces (these links are **not** actual verified comparison offers).
- Calendar of upcoming dates, visible result counts and minimum provider starting prices for each day, with date drill-down.
- Server-persisted watchlist (`data/store.json`), saved-event monitoring (every 30 minutes while server is running), real observed price-history chart, price-threshold notification center.
- Backend validations, API error handling, 5-minute discovery cache, provider timeout, credentials kept on the server.
- Responsive accessible-ish design with no npm dependencies.

## API keys and terms

Official Ticketmaster docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery/v2/ . Developer key required. Optional SeatGeek integration is contingent on API access. Ticketmaster ranges and SeatGeek lowest-listing stats are *not guaranteed fee-inclusive or identical-seat quotes*. StubHub / Vivid Seats / TickPick links open provider searches only. Do not advertise an all-in price comparison or cheapest seat guarantee until authorized offer APIs provide complete fees and consistent seat identifiers.

## Price-alert limitations

Watchlists and alerts persist in the server JSON file. Price points are saved only from genuine connected-provider responses, not fabricated historical data. Alerts trigger when an observed published starting price is at or below a threshold, visible in app (no push/email/SMS). Saved events are refreshed every ~30 minutes when server is online, and manually using the UI. Use persistent disk/DB on deployed servers. This is a shared watchlist on one server, not per-user account storage; add authentication before public multiuser rollout.

## Deploy

Deploy the whole directory to Render/Railway/Fly or any host that runs persistent Node services. Start command: `node server.js`, environment variables `TICKETMASTER_API_KEY` and `PORT`. Add a persistent disk or database for history/alerts. Static-only hosting will not enable API requests, price monitoring or watchlist persistence.

## Routes

`GET /api/health`, `/api/status`, `/api/events?q=&city=&category=`, `/api/event?id=tm:...`, `/api/watchlist`, `/api/history?id=tm:...`; `POST /api/watchlist`, `/api/alerts`, `/api/refresh`, `/api/notifications/read`; `DELETE /api/watchlist`, `/api/alerts`.

## Encore → TickRef decisions

Original vision: Google Flights for concerts/sports, low-cost cross-market discovery, flexible-date calendar, alerts, college-first audience. Pitch deck: transparent ranking and all-in comparison across multiple marketplaces; 34 interviews, first focus Lehigh students, planned $8/month or $60/year. **Actual product status:** event discovery + indicative starting price tracking works when authorized feeds are configured; same-seat all-in price comparison, actual affiliate commissions, production authentication, multiuser alerts, and booking guarantees still require integrations/rights and engineering. This README does not treat projected KPIs as realized performance.

## Immediate event display (Nov 17–18, 2026)

Without an API key, this build displays **13 genuinely listed concerts from November 17 and 18, 2026** in Philadelphia and the Lehigh Valley. Listings were cross-checked against public Ticketmaster discovery and local event-calendar pages on November 17, 2026. They are stored as a **dated schedule snapshot**, not claimed to be live API results. The source/marketplace buttons open external event searches. Starting prices remain unavailable rather than invented; schedule-only events can be saved, but price alerts are disabled until a price-enabled live provider returns the event. The public snapshot will become stale after these dates; configure a provider API feed for ongoing discovery.

Some snapshot entries were sourced from third-party concert calendars, so always confirm final date, availability, and pricing with the ticket seller.

## TickPick events and prices (no API key needed)

The server scrapes TickPick venue pages for Philadelphia and the Lehigh Valley (list in `TP_VENUES` in `server.js`) and shows today's events with TickPick's lowest listing price, cached for 10 minutes. If TickPick blocks the request, it falls back to the events copied from TickPick on November 17, 2026 (`TP_SNAPSHOT`). The Compare dialog ranks real seller prices: TickPick always, plus Ticketmaster/SeatGeek when their keys are set and the event matches by title and date. Other sellers show search links only. Check TickPick's terms before using scraping beyond a class prototype.
