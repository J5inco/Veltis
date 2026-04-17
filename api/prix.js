// api/prix.js — Stooq (FR/EU) + Yahoo (US) — solution multi-source
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { tickers } = req.query;
  if (!tickers) return res.status(400).json({ error: 'Missing tickers' });

  const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json,text/plain,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  // Mapping ticker → Stooq symbol (format: ticker.fr pour Paris)
  const STOOQ_MAP = {
    'TTE':'tte.fr','MC':'mc.fr','RMS':'rms.fr','OR':'or.fr',
    'BNP':'bnp.fr','AIR':'air.fr','SAN':'san.fr','AI':'ai.fr',
    'SGO':'sgo.fr','STM':'stm.fr','CAP':'cap.fr','HO':'ho.fr',
    'ACA':'aca.fr','GLE':'gle.fr','KER':'ker.fr','DG':'dg.fr',
    'CS':'cs.fr','EL':'el.fr','ORA':'ora.fr','VIE':'vie.fr',
    'EN':'en.fr','DSY':'dsy.fr','SAF':'saf.fr','PUB':'pub.fr',
    'VIV':'viv.fr','WLN':'wln.fr','LR':'lr.fr','ERF':'erf.fr',
    'CW8':'cw8.fr','ESE':'ese.fr','EWLD':'ewld.fr','PAEEM':'paeem.fr',
    'BN':'bn.fr','SU':'su.fr','ATO':'ato.fr','SW':'sw.fr',
    'RI':'ri.fr','DIM':'dim.fr','TEP':'tep.fr','SO':'so.fr',
    'RNO':'rno.fr','ML':'ml.fr','GET':'get.fr','NEX':'nex.fr',
  };
  
  const US_SET = new Set([
    'AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA','AMD','ASML',
    'ISRG','LLY','TSM','JPM','V','MA','UNH','XOM','JNJ','WMT','PG',
    'HD','BAC','KO','PEP','ABBV','MRK','CVX','ORCL','DIS','NFLX',
    'CRM','INTC','QCOM','TXN','AVGO','ADBE','COST',
  ]);

  async function fetchYahoo(ticker) {
    try {
      const symbol = US_SET.has(ticker.toUpperCase()) ? ticker.toUpperCase() : `${ticker}.PA`;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const r = await fetch(url, { headers: HEADERS });
      const d = await r.json();
      return d?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
    } catch { return null; }
  }

  async function fetchStooq(ticker) {
    try {
      const stooqSymbol = STOOQ_MAP[ticker.toUpperCase()] || `${ticker.toLowerCase()}.fr`;
      const url = `https://stooq.com/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
      const r = await fetch(url, { headers: HEADERS });
      const text = await r.text();
      // CSV format: Symbol,Date,Time,Open,High,Low,Close,Volume
      const lines = text.trim().split('\n');
      if (lines.length < 2) return null;
      const cols = lines[1].split(',');
      const close = parseFloat(cols[6]);
      return isNaN(close) || close === 0 ? null : close;
    } catch { return null; }
  }

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean);
  const results = {};

  await Promise.all(symbols.map(async (ticker) => {
    const upper = ticker.toUpperCase();
    if (US_SET.has(upper)) {
      // Yahoo for US
      results[ticker] = await fetchYahoo(upper);
    } else {
      // Try Stooq first for FR/EU, fallback to Yahoo
      const stooqPrice = await fetchStooq(upper);
      if (stooqPrice) {
        results[ticker] = stooqPrice;
      } else {
        results[ticker] = await fetchYahoo(upper);
      }
    }
  }));

  res.setHeader('Cache-Control', 's-maxage=900');
  return res.status(200).json(results);
}
