// api-serverless/prix.js — Yahoo Finance (US) + Twelve Data (FR/EU)
const https = require('https')

const US_TICKERS = new Set([
  'AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA','AMD',
  'ISRG','LLY','TSM','ASML','JPM','V','MA','UNH','XOM','JNJ',
  'WMT','PG','HD','BAC','KO','PEP','ABBV','MRK','CVX','ORCL',
])

const PARIS_MAP = {
  'TTE':'TTE.PA','MC':'MC.PA','RMS':'RMS.PA','OR':'OR.PA',
  'BNP':'BNP.PA','AIR':'AIR.PA','SAN':'SAN.PA','AI':'AI.PA',
  'SGO':'SGO.PA','STM':'STM.PA','CAP':'CAP.PA','HO':'HO.PA',
  'ACA':'ACA.PA','GLE':'GLE.PA','KER':'KER.PA','DG':'DG.PA',
  'CS':'CS.PA','EL':'EL.PA','ORA':'ORA.PA','VIE':'VIE.PA',
  'EN':'EN.PA','DSY':'DSY.PA','SAF':'SAF.PA','PUB':'PUB.PA',
  'VIV':'VIV.PA','WLN':'WLN.PA','LR':'LR.PA','ERF':'ERF.PA',
  'CW8':'CW8.PA','ESE':'ESE.PA','EWLD':'EWLD.PA','PAEEM':'PAEEM.PA',
  'PCEU':'PCEU.PA','PUST':'PUST.PA',
}

function isUSStock(ticker) {
  const t = ticker.toUpperCase().replace('.PA','')
  return US_TICKERS.has(t) || ticker.includes(':') 
}

function fetchYahooUS(ticker) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'query2.finance.yahoo.com',
      path: `/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
      },
      timeout: 8000,
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null)
        } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
    req.end()
  })
}

function fetchTwelveData(symbols, apiKey) {
  return new Promise((resolve) => {
    const symbolList = symbols.join(',')
    const options = {
      hostname: 'api.twelvedata.com',
      path: `/price?symbol=${encodeURIComponent(symbolList)}&apikey=${apiKey}`,
      method: 'GET',
      timeout: 10000,
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch { resolve({}) }
      })
    })
    req.on('error', () => resolve({}))
    req.on('timeout', () => { req.destroy(); resolve({}) })
    req.end()
  })
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=900')

  const raw = (req.query.tickers || '').split(',').map(t => t.trim()).filter(Boolean)
  if (!raw.length) return res.status(400).json({ error: 'no tickers' })

  const apiKey = process.env.TWELVE_DATA_API_KEY
  const results = {}

  // Separate US (Yahoo) vs FR/EU (Twelve Data)
  const usTickers = []
  const euTickers = []

  raw.forEach(ticker => {
    const t = ticker.toUpperCase()
    if (US_TICKERS.has(t)) {
      usTickers.push(ticker)
    } else {
      euTickers.push(ticker)
    }
  })

  // Fetch US stocks via Yahoo Finance
  await Promise.all(usTickers.map(async (ticker) => {
    results[ticker] = await fetchYahooUS(ticker.toUpperCase())
  }))

  // Fetch EU/FR stocks via Twelve Data
  if (euTickers.length > 0 && apiKey) {
    // Map tickers to Twelve Data format (e.g. TTE -> TTE:XPAR)
    const tdSymbols = euTickers.map(t => {
      const upper = t.toUpperCase()
      if (PARIS_MAP[upper]) return `${upper}:XPAR`
      return `${upper}:XPAR`
    })

    const tdData = await fetchTwelveData(tdSymbols, apiKey)

    euTickers.forEach((ticker, i) => {
      const tdSymbol = tdSymbols[i]
      // Twelve Data returns { price: "58.50" } per symbol when multiple
      const entry = euTickers.length === 1 ? tdData : tdData[tdSymbol]
      const price = parseFloat(entry?.price)
      results[ticker] = isNaN(price) ? null : price
    })
  } else if (euTickers.length > 0) {
    euTickers.forEach(t => { results[t] = null })
  }

  res.json(results)
}
