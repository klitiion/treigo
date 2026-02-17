'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ExchangeRateData {
  rates: {
    [key: string]: number
  }
  timestamp: number
}

interface CurrencyContextType {
  currency: 'EUR' | 'ALL'
  setCurrency: (curr: 'EUR' | 'ALL') => void
  exchangeRate: number
  convertPrice: (priceInAll: number) => number
  formatPrice: (price: number, currency?: 'EUR' | 'ALL') => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<'EUR' | 'ALL'>('EUR')
  const [exchangeRate, setExchangeRate] = useState(0.0084) // Default approximate rate
  const [mounted, setMounted] = useState(false)

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Try to fetch from the provided source
        const response = await fetch('https://iliria98.com/')
        if (response.ok) {
          const text = await response.text()
          // Parse HTML to extract exchange rate (ALL to EUR)
          // Looking for ALL/EUR rate
          const match = text.match(/ALL[\s\S]*?EUR[\s\S]*?(\d+\.\d+)/i)
          if (match && match[1]) {
            const rate = parseFloat(match[1])
            if (rate > 0 && rate < 1) {
              setExchangeRate(rate)
              localStorage.setItem('exchangeRate', rate.toString())
              localStorage.setItem('exchangeRateTimestamp', Date.now().toString())
            }
          }
        }
      } catch (error) {
        console.log('Using default exchange rate')
        // Use stored rate or default
        const stored = localStorage.getItem('exchangeRate')
        if (stored) {
          setExchangeRate(parseFloat(stored))
        }
      }
    }

    // Check if we have a cached rate from today
    const timestamp = localStorage.getItem('exchangeRateTimestamp')
    const today = new Date().toDateString()
    const cachedDate = localStorage.getItem('exchangeRateDate')

    if (timestamp && cachedDate === today) {
      const cached = localStorage.getItem('exchangeRate')
      if (cached) {
        setExchangeRate(parseFloat(cached))
      }
    } else {
      // Fetch new rate
      fetchExchangeRate()
      localStorage.setItem('exchangeRateDate', today)
    }

    // Load currency preference
    const savedCurrency = localStorage.getItem('currency') as 'EUR' | 'ALL' | null
    if (savedCurrency) {
      setCurrency(savedCurrency)
    }

    setMounted(true)
  }, [])

  const convertPrice = (priceInAll: number): number => {
    if (currency === 'ALL') return priceInAll
    return Math.round(priceInAll * exchangeRate * 100) / 100
  }

  const formatPrice = (price: number, curr?: 'EUR' | 'ALL'): string => {
    const activeCurrency = curr || currency
    if (activeCurrency === 'ALL') {
      return `${price.toLocaleString('sq-AL')} L`
    } else {
      return `€${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const handleSetCurrency = (curr: 'EUR' | 'ALL') => {
    setCurrency(curr)
    localStorage.setItem('currency', curr)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        exchangeRate,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
