import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

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
    'VIV': 'VIV.PA', 'WLN': 'WLN.PA', 'LR': 'LR.PA', 'ERF': 'ERF.PA',
    'CW8': 'CW8.PA', 'ESE': 'ESE.PA', 'EWLD': 'EWLD.PA', 'PAEEM': 'PAEEM.PA',
    'PCEU': 'PCEU.PA', 'PUST': 'PUST.PA',
    'AAPL': 'AAPL', 'MSFT': 'MSFT', 'GOOGL': 'GOOGL', 'AMZN': 'AMZN',
    'NVDA': 'NVDA', 'META': 'META', 'TSLA': 'TSLA', 'AMD': 'AMD',
    'ASML': 'ASML', 'ISRG': 'ISRG', 'LLY': 'LLY', 'TSM': 'TSM',
  }
  return parisMap[t] || `${t}.PA`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tickers = searchParams.get('tickers') || ''

  if (!tickers) return NextResponse.json({ error: 'no tickers' }, { status: 400 })

  const symbols = tickers.split(',').map(t => t.trim()).filter(Boolean)
  const results: Record<string, number | null> = {}

  await Promise.all(symbols.map(async (ticker) => {
    const symbol = ticker.includes('.') ? ticker : guessSymbol(ticker)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const quote: any = await yahooFinance.quote(symbol, {}, { validateResult: false })
      results[ticker] = quote?.regularMarketPrice ?? null
    } catch {
      results[ticker] = null
    }
  }))

  return NextResponse.json(results)
}
