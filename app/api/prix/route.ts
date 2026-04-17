import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

export const runtime = 'nodejs'
export const maxDuration = 30

const US_SET = new Set([
  'AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA','AMD','ASML',
  'ISRG','LLY','TSM','JPM','V','MA','UNH','XOM','JNJ','WMT','PG',
  'HD','BAC','KO','PEP','ABBV','MRK','CVX','ORCL','DIS','NFLX',
  'CRM','INTC','QCOM','TXN','AVGO','ADBE','COST','GOOG',
])

const STOOQ_MAP: Record<string, string> = {
  'TTE':'tte.fr','MC':'mc.fr','RMS':'rms.fr','OR':'or.fr',
  'BNP':'bnp.fr','AIR':'air.fr','SAN':'san.fr','AI':'ai.fr',
  'SGO':'sgo.fr','STM':'stm.fr','CAP':'cap.fr','HO':'ho.fr',
  'ACA':'aca.fr','GLE':'gle.fr','KER':'ker.fr','DG':'dg.fr',
  'CS':'cs.fr','EL':'el.fr','ORA':'ora.fr','VIE':'vie.fr',
  'EN':'en.fr','DSY':'dsy.fr','SAF':'saf.fr','PUB':'pub.fr',
  'VIV':'viv.fr','WLN':'wln.fr','LR':'lr.fr','ERF':'erf.fr',
  'CW8':'cw8.fr','ESE':'ese.fr','EWLD':'ewld.fr','PAEEM':'paeem.fr',
  'BN':'bn.fr','SU':'su.fr','ATO':'ato.fr','SW':'sw.fr',
  'RI':'ri.fr','DIM':'dim.fr','RNO':'rno.fr','ML':'ml.fr',
}

function httpsGet(hostname: string, path: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve) => {
    const options = {
      hostname,
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json,text/plain,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        ...headers,
      },
      timeout: 8000,
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (c: Buffer) => data += c.toString())
      res.on('end', () => resolve(data))
    })
    req.on('error', () => resolve(''))
    req.on('timeout', () => { req.destroy(); resolve('') })
    req.end()
  })
}

async function fetchYahoo(ticker: string): Promise<number | null> {
  const symbol = US_SET.has(ticker.toUpperCase()) ? ticker.toUpperCase() : `${ticker}.PA`
  const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
  const data = await httpsGet('query1.finance.yahoo.com', path, {
    'Referer': 'https://finance.yahoo.com/',
    'Origin': 'https://finance.yahoo.com',
  })
  try {
    const json = JSON.parse(data)
    const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice
    return typeof price === 'number' ? price : null
  } catch { return null }
}

async function fetchStooq(ticker: string): Promise<number | null> {
  const stooqSymbol = STOOQ_MAP[ticker.toUpperCase()] || `${ticker.toLowerCase()}.fr`
  const path = `/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`
  const data = await httpsGet('stooq.com', path)
  const lines = data.trim().split('\n')
  if (lines.length < 2) return null
  const cols = lines[1].split(',')
  const close = parseFloat(cols[6])
  return isNaN(close) || close === 0 ? null : close
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tickers = searchParams.get('tickers') || ''
  if (!tickers) return NextResponse.json({ error: 'Missing tickers' }, { status: 400 })

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean)
  const results: Record<string, number | null> = {}

  await Promise.all(symbols.map(async (ticker) => {
    const upper = ticker.toUpperCase()
    if (US_SET.has(upper)) {
      results[ticker] = await fetchYahoo(upper)
    } else {
      const stooqPrice = await fetchStooq(upper)
      results[ticker] = stooqPrice ?? await fetchYahoo(upper)
    }
  }))

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 's-maxage=900' }
  })
}
