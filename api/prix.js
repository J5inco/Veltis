// api/prix.js — Yahoo Finance proxy (style J5 terminal qui fonctionne)
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
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://finance.yahoo.com',
    'Referer': 'https://finance.yahoo.com/',
  };

  const PARIS_MAP = {
    'TTE':'TTE.PA','MC':'MC.PA','RMS':'RMS.PA','OR':'OR.PA',
    'BNP':'BNP.PA','AIR':'AIR.PA','SAN':'SAN.PA','AI':'AI.PA',
    'SGO':'SGO.PA','STM':'STM.PA','CAP':'CAP.PA','HO':'HO.PA',
    'ACA':'ACA.PA','GLE':'GLE.PA','KER':'KER.PA','DG':'DG.PA',
    'CS':'CS.PA','EL':'EL.PA','ORA':'ORA.PA','VIE':'VIE.PA',
    'EN':'EN.PA','DSY':'DSY.PA','SAF':'SAF.PA','PUB':'PUB.PA',
    'VIV':'VIV.PA','WLN':'WLN.PA','LR':'LR.PA','ERF':'ERF.PA',
    'CW8':'CW8.PA','ESE':'ESE.PA','EWLD':'EWLD.PA','PAEEM':'PAEEM.PA',
    'AAPL':'AAPL','MSFT':'MSFT','GOOGL':'GOOGL','AMZN':'AMZN',
    'NVDA':'NVDA','META':'META','TSLA':'TSLA','AMD':'AMD',
    'ASML':'ASML','ISRG':'ISRG','LLY':'LLY','TSM':'TSM',
  };

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean);
  const results = {};

  await Promise.all(symbols.map(async (ticker) => {
    const symbol = PARIS_MAP[ticker.toUpperCase()] || `${ticker}.PA`;
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const response = await fetch(url, { headers: HEADERS });
      const data = await response.json();
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      results[ticker] = price ?? null;
    } catch (err) {
      results[ticker] = null;
    }
  }));

  res.setHeader('Cache-Control', 's-maxage=900');
  return res.status(200).json(results);
}
