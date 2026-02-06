export const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

function mapTickerToFMP(ticker: string): string {
  const map: Record<string, string> = {
    "BTC-USD": "BTCUSD",
    "EURUSD=X": "EURUSD",
    "ES=F": "ES", 
    "NQ=F": "NQ",
    "YM=F": "YM",
    "RTY=F": "RTY",
    "CL=F": "CL",
    "GC=F": "GC",
    "SI=F": "SI",
    "^TNX": "^TNX",
    "^DJI": "^DJI",
    "^IXIC": "^IXIC",
    "^GSPC": "^GSPC",
    "^BVSP": "^BVSP",
    "^GDAXI": "^GDAXI",
    "^FTSE": "^FTSE",
    "^FCHI": "^FCHI",
    "^N225": "^N225",
  };
  return map[ticker] || ticker;
}

export async function getFMPQuote(ticker: string) {
  if (!process.env.FMP_API_KEY) return null;
  
  const fmpTicker = mapTickerToFMP(ticker);
  
  try {
    const res = await fetch(`${FMP_BASE_URL}/quote/${fmpTicker}?apikey=${process.env.FMP_API_KEY}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      const q = data[0];
      // Map FMP response to Yahoo Finance format
      return {
        symbol: q.symbol,
        shortName: q.name,
        regularMarketPrice: q.price,
        regularMarketChange: q.change,
        regularMarketChangePercent: q.changesPercentage,
        regularMarketPreviousClose: q.previousClose,
        regularMarketOpen: q.open,
        regularMarketDayHigh: q.dayHigh,
        regularMarketDayLow: q.dayLow,
        regularMarketVolume: q.volume,
        marketCap: q.marketCap,
        fiftyTwoWeekHigh: q.yearHigh,
        fiftyTwoWeekLow: q.yearLow,
        averageDailyVolume3Month: q.avgVolume,
        trailingPE: q.pe,
        epsTrailingTwelveMonths: q.eps,
        currency: "USD", // FMP usually USD for US stocks
        exchange: q.exchange,
      };
    }
    return null;
  } catch (e) {
    console.error("FMP Quote Error", e);
    return null;
  }
}

export async function getFMPChart(ticker: string, range: string = "1d") {
  if (!process.env.FMP_API_KEY) return null;
  
  // Map range to FMP interval/timespan
  // FMP Historical Chart: /historical-chart/{interval}/{symbol}
  // Ranges: 1d -> 1min or 5min? 
  // FMP has /historical-chart/1min, /5min, /15min, /30min, /1hour, /4hour
  // And /historical-price-full/ for daily
  
  let endpoint = "";
  let query = "";
  
  switch(range) {
    case "1d":
      endpoint = `/historical-chart/5min/${ticker}`;
      break;
    case "5d":
      endpoint = `/historical-chart/15min/${ticker}`;
      break;
    case "1m":
      endpoint = `/historical-chart/1hour/${ticker}`;
      break;
    case "6m":
    case "1y":
    case "ytd":
    case "max":
      endpoint = `/historical-price-full/${ticker}`;
      query = "&serietype=line";
      break;
    default:
      endpoint = `/historical-price-full/${ticker}`;
  }

  try {
    const res = await fetch(`${FMP_BASE_URL}${endpoint}?apikey=${process.env.FMP_API_KEY}${query}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    // FMP returns { symbol, historical: [...] } for daily, or [...] for intraday
    let historical = Array.isArray(data) ? data : data.historical;
    
    if (!historical || historical.length === 0) return null;

    // Map to Yahoo format
    return historical.map((item: any) => ({
      date: new Date(item.date).getTime(), // FMP returns "2024-01-01 10:00:00" or "2024-01-01"
      high: item.high,
      low: item.low,
      open: item.open,
      close: item.close,
      volume: item.volume,
      adjClose: item.adjClose || item.close,
    })).reverse(); // FMP usually returns newest first, Yahoo often wants oldest first or handled by UI. 
    // AreaClosedChart expects array sorted? Usually sorted by date ascending.
    // FMP returns Descending (newest first).
    // So .reverse() makes it Ascending (oldest first).
  } catch (e) {
    console.error("FMP Chart Error", e);
    return null;
  }
}

export async function getFMPSearch(query: string) {
  if (!process.env.FMP_API_KEY) return null;
  try {
    const res = await fetch(`${FMP_BASE_URL}/search?query=${query}&limit=10&apikey=${process.env.FMP_API_KEY}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (!data || !Array.isArray(data)) return null;

    return {
      explains: [],
      count: data.length,
      quotes: data.map((item: any) => ({
        symbol: item.symbol,
        shortname: item.name,
        exchange: item.exchangeShortName,
        isYahooFinance: true, // Mock true to satisfy interface
        typeDisp: 'Equity', // Default
      })),
      news: [], // FMP news requires premium or separate call
      nav: [],
      lists: [],
      researchReports: [],
      screenerFieldResults: [],
      totalTime: 0,
      timeTakenForQuotes: 0,
      timeTakenForNews: 0,
      timeTakenForAlgowatchlist: 0,
      timeTakenForPredefinedScreener: 0,
      timeTakenForCrunchbase: 0,
      timeTakenForNav: 0,
      timeTakenForResearchReports: 0,
      timeTakenForScreenerFieldResults: 0,
      timeTakenForCulturalAssets: 0,
    };
  } catch (e) {
    console.error("FMP Search Error", e);
    return null;
  }
}

export async function getFMPScreener(query: string) {
  if (!process.env.FMP_API_KEY) return null;
  
  // Map Yahoo screener IDs to FMP endpoints
  let endpoint = "";
  let queryParams = "";

  if (query === "day_gainers") endpoint = "/stock_market/gainers";
  else if (query === "day_losers") endpoint = "/stock_market/losers";
  else if (query === "most_actives") endpoint = "/stock_market/actives";
  else if (query === "growth_technology_stocks") {
    endpoint = "/stock-screener";
    queryParams = "&sector=Technology&limit=20";
  }
  else if (query === "undervalued_growth_stocks") {
    endpoint = "/stock-screener";
    queryParams = "&limit=20&betaMoreThan=1&marketCapLowerThan=10000000000";
  }
  else if (query === "aggressive_small_caps") {
    endpoint = "/stock-screener";
    queryParams = "&limit=20&marketCapLowerThan=2000000000";
  }
  else {
    // For other queries, return null to let Yahoo/Mock handle it
    // Or default to actives if we want to ensure data
    // But returning null allows fallback which might be better if we have good mock data
    return null; 
  }

  try {
    const url = `${FMP_BASE_URL}${endpoint}?apikey=${process.env.FMP_API_KEY}${queryParams}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (!data || !Array.isArray(data)) return null;

    // Map to Yahoo Screener format
    const quotes = data.map((item: any) => ({
      symbol: item.symbol,
      shortName: item.companyName || item.name || item.symbol,
      regularMarketPrice: item.price,
      regularMarketChange: item.change || 0,
      regularMarketChangePercent: item.changesPercentage || 0,
      marketCap: item.marketCap || 0,
      regularMarketVolume: item.volume || 0,
      averageDailyVolume3Month: item.avgVolume || item.volume || 0,
      epsTrailingTwelveMonths: item.eps || 0, // FMP screener might not return eps directly in all endpoints, check response
      // For stock-screener endpoint, fields might be different, but let's assume standard object for now or fallback
    }));

    return {
      id: query,
      title: query.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      description: "Market Screener (FMP Data)",
      criteriaMeta: { size: quotes.length, offset: 0, sortField: "intradaymarketcap", sortType: "DESC", quoteType: "EQUITY", topOperator: "AND", criteria: [] },
      start: 0,
      count: quotes.length,
      total: quotes.length,
      quotes: quotes,
      useRecords: false,
      predefinedScr: true,
      versionId: 1,
      creationDate: 0,
      lastUpdated: 0,
      isPremium: false,
      iconUrl: "",
    };
  } catch (e) {
    console.error("FMP Screener Error", e);
    return null;
  }
}

export async function getFMPCompanyProfile(ticker: string) {
  if (!process.env.FMP_API_KEY) return null;

  try {
    const res = await fetch(`${FMP_BASE_URL}/profile/${ticker}?apikey=${process.env.FMP_API_KEY}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();

    if (data && data.length > 0) {
      const profile = data[0];
      return {
        summaryProfile: {
          longBusinessSummary: profile.description,
          sector: profile.sector,
          industryDisp: profile.industry,
          country: profile.country,
          fullTimeEmployees: parseInt(profile.fullTimeEmployees, 10) || 0,
          website: profile.website,
        }
      };
    }
    return null;
  } catch (e) {
    console.error("FMP Profile Error", e);
    return null;
  }
}
