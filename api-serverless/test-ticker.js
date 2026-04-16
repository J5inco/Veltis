// Test endpoint — essaie tous les formats possibles pour un ticker FR
const https = require('https')

function fetchYahoo(symbol) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'query2.finance.yahoo.com',
      path: `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
      },
      timeout: 6000,
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice
          const currency = json?.chart?.result?.[0]?.meta?.currency
          resolve({ symbol, price: price ?? null, currency, status: res.statusCode })
        } catch { resolve({ symbol, price: null, error: 'parse error' }) }
      })
    })
    req.on('error', (e) => resolve({ symbol, price: null, error: e.message }))
    req.on('timeout', () => { req.destroy(); resolve({ symbol, price: null, error: 'timeout' }) })
    req.end()
  })
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  // Test all possible formats for TotalEnergies
  const formats = [
    'TTE.PA', 'TTE.F', 'TTE', 'FP.PA', 'FP', 'FP.F',
    'TTEF.PA', '0P0001FRTY.F', 'TTE.XPAR',
    'MC.PA', 'MC', 'LVMH.PA',
    'RMS.PA', 'RMS',
  ]
  
  const results = []
  for (const fmt of formats) {
    const r = await fetchYahoo(fmt)
    results.push(r)
  }
  
  res.json(results)
}
