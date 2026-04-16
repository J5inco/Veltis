import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

function guessSymbol(ticker: string): string {
  const t = ticker.toUpperCase()
  const parisMap: Record<string, string> = {
    'TTE': 'TTE.PA', 'MC': 'MC.PA', 'RMS': 'RMS.PA', 'OR': 'OR.PA',
    'BNP': 'BNP.PA', 'AIR': 'AIR.PA', 'SAN': 'SAN.PA', 'AI': 'AI.PA',
    'SGO': 'SGO.PA', 'STM': 'STM.PA', 'CAP': 'CAP.PA', 'HO': 'HO.PA',
    'ACA': 'ACA.PA', 'GLE': 'GLE.PA', 'KER': 'KER.PA', 'DG': 'DG.PA',
    'CS': 'CS.PA', 'EL': 'EL.PA', 'ORA': 'ORA.PA', 'VIE': 'VIE.PA',
    'EN': 'EN.PA', 'DSY': 'DSY.PA', 'SAF': 'SAF.PA', 'PUB': 'PUB.PA',
    'VIV': 'VIV.PA', 'WLN': 'WLN.PA', 'CW8': 'CW8.PA', 'ESE': 'ESE.PA',
    'EWLD': 'EWLD.PA', 'PAEEM': 'PAEEM.PA',
    // US — pas de suffixe
    'AAPL': 'AAPL', 'MSFT': 'MSFT', 'GOOGL': 'GOOGL', 'AMZN': 'AMZN',
    'NVDA': 'NVDA', 'META': 'META', 'TSLA': 'TSLA', 'AMD': 'AMD',
    'ASML': 'ASML', 'ISRG': 'ISRG', 'LLY': 'LLY', 'TSM': 'TSM',
  }
  return parisMap[t] || `${t}:XPAR`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tickers = searchParams.get('tickers') || ''
  const apiKey = process.env.TWELVE_DATA_API_KEY

  if (!tickers) return NextResponse.json({ error: 'no tickers' }, { status: 400 })
  if (!apiKey) return NextResponse.json({ error: 'no api key' }, { status: 500 })

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean)
  const results: Record<string, number | null> = {}

  // Twelve Data allows batch requests — fetch all at once
  const symbolList = symbols.map(t => guessSymbol(t)).join(',')

  try {
    const url = `https://api.twelvedata.com/price?symbol=${symbolList}&apikey=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()

    symbols.forEach((ticker) => {
      const symbol = guessSymbol(ticker)
      // Batch response: data[symbol].price OR single response: data.price
      const entry = symbols.length === 1 ? data : data[symbol]
      const price = parseFloat(entry?.price)
      results[ticker] = isNaN(price) ? null : price
    })
  } catch {
    symbols.forEach(t => { results[t] = null })
  }

  return NextResponse.json(results)
}
