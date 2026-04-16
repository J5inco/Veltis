// api/prix.js — Yahoo Finance serverless (Node.js pur, comme J5 terminal)
const https = require('https')

const PARIS_MAP = {
  'TTE': 'TTE.PA', 'MC': 'MC.PA', 'RMS': 'RMS.PA', 'OR': 'OR.PA',
  'BNP': 'BNP.PA', 'AIR': 'AIR.PA', 'SAN': 'SAN.PA', 'AI': 'AI.PA',
  'SGO': 'SGO.PA', 'STM': 'STM.PA', 'CAP': 'CAP.PA', 'HO': 'HO.PA',
  'ACA': 'ACA.PA', 'GLE': 'GLE.PA', 'KER': 'KER.PA', 'DG': 'DG.PA',
  'CS': 'CS.PA', 'EL': 'EL.PA', 'ORA': 'ORA.PA', 'VIE': 'VIE.PA',
  'EN': 'EN.PA', 'DSY': 'DSY.PA', 'SAF': 'SAF.PA', 'PUB': 'PUB.PA',
  'VIV': 'VIV.PA', 'WLN': 'WLN.PA', 'LR': 'LR.PA', 'ERF': 'ERF.PA',
  'CW8': 'CW8.PA', 'ESE': 'ESE.PA', 'EWLD': 'EWLD.PA', 'PAEEM': 'PAEEM.PA',
  'AAPL': 'AAPL', 'MSFT': 'MSFT', 'GOOGL': 'GOOGL', 'AMZN': 'AMZN',
  'NVDA': 'NVDA', 'META': 'META', 'TSLA': 'TSLA', 'AMD': 'AMD',
  'ASML': 'ASML', 'ISRG': 'ISRG', 'LLY': 'LLY', 'TSM': 'TSM',
}

function guessSymbol(ticker) {
  const t = ticker.toUpperCase()
  return PARIS_MAP[t] || `${t}.PA`
}

function fetchYahoo(symbol) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'query2.finance.yahoo.com',
      path: `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com',
        'Origin': 'https://finance.yahoo.com',
      },
      timeout: 8000,
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice
          resolve(price ?? null)
        } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
    req.end()
  })
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=900')

  const tickers = (req.query.tickers || '').split(',').map(t => t.trim()).filter(Boolean)
  if (!tickers.length) return res.status(400).json({ error: 'no tickers' })

  const results = {}
  await Promise.all(tickers.map(async (ticker) => {
    const symbol = guessSymbol(ticker)
    results[ticker] = await fetchYahoo(symbol)
  }))

  res.json(results)
}
