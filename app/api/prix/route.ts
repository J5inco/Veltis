import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tickers = searchParams.get('tickers') || ''

  if (!tickers) return NextResponse.json({ error: 'no tickers' }, { status: 400 })

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean)

  const results: Record<string, number | null> = {}

  await Promise.all(symbols.map(async (ticker) => {
    // Yahoo Finance suffix for Euronext Paris
    const symbol = ticker.includes('.') ? ticker : guessSymbol(ticker)
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'fr-FR,fr;q=0.9',
        },
        next: { revalidate: 900 } // cache 15 min
      })
      if (!res.ok) { results[ticker] = null; return }
      const data = await res.json()
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      results[ticker] = price ?? null
    } catch {
      results[ticker] = null
    }
  }))

  return NextResponse.json(results)
}

// Map French tickers to Yahoo Finance symbols
function guessSymbol(ticker: string): string {
  const t = ticker.toUpperCase()
  const parisMap: Record<string, string> = {
    'TTE': 'TTE.PA', 'MC': 'MC.PA', 'RMS': 'RMS.PA', 'OR': 'OR.PA',
    'BNP': 'BNP.PA', 'AIR': 'AIR.PA', 'SAN': 'SAN.PA', 'AI': 'AI.PA',
    'SGO': 'SGO.PA', 'STM': 'STM.PA', 'CAP': 'CAP.PA', 'HO': 'HO.PA',
    'ACA': 'ACA.PA', 'GLE': 'GLE.PA', 'KER': 'KER.PA', 'DG': 'DG.PA',
    'CS': 'CS.PA', 'EL': 'EL.PA', 'ORA': 'ORA.PA', 'VIE': 'VIE.PA',
    'EN': 'EN.PA', 'DSY': 'DSY.PA', 'SAF': 'SAF.PA', 'PUB': 'PUB.PA',
    'VIV': 'VIV.PA', 'WLN': 'WLN.PA', 'LR': 'LR.PA', 'ERF': 'ERF.PA',
    // ETF Amundi
    'CW8': 'CW8.PA', 'ESE': 'ESE.PA', 'EWLD': 'EWLD.PA', 'PAEEM': 'PAEEM.PA',
    'PCEU': 'PCEU.PA', 'PUST': 'PUST.PA',
    // US stocks — direct
    'AAPL': 'AAPL', 'MSFT': 'MSFT', 'GOOGL': 'GOOGL', 'AMZN': 'AMZN',
    'NVDA': 'NVDA', 'META': 'META', 'TSLA': 'TSLA', 'AMD': 'AMD',
    'ASML': 'ASML', 'ISRG': 'ISRG', 'LLY': 'LLY', 'TSM': 'TSM',
  }
  return parisMap[t] || `${t}.PA`
}
