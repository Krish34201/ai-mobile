
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ShieldAlert, 
  Cpu, 
  Search, 
  Zap, 
  Activity, 
  RefreshCcw, 
  Check,
  Wallet,
  Binary,
  Power,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ParticleBackground } from '@/components/ui/particle-background'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const BLOCKCHAINS = [
  { id: 'btc', name: 'BTC', icon: '₿', color: 'bg-[#f7931a]' },
  { id: 'eth', name: 'ETH', icon: 'Ξ', color: 'bg-[#627eea]' },
  { id: 'bnb', name: 'BNB', icon: 'B', color: 'bg-[#f3ba2f]' },
  { id: 'sol', name: 'SOL', icon: 'S', color: 'bg-[#14f195]' },
  { id: 'trx', name: 'TRX', icon: 'T', color: 'bg-[#ff0013]' },
  { id: 'xrp', name: 'XRP', icon: 'X', color: 'bg-[#23292f]' },
]

interface LogEntry {
  id: string;
  message: string;
}

export default function Dashboard() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>(BLOCKCHAINS.map(b => b.id))
  
  const logContainerRef = useRef<HTMLDivElement>(null)

  const toggleBlockchain = (id: string) => {
    setActiveBlockchains(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const addLog = useCallback((message: string) => {
    setLogs(prev => {
      const newLogs = [{ id: Math.random().toString(36).substr(2, 9), message }, ...prev]
      return newLogs.slice(0, 50)
    })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterrogating) {
      interval = setInterval(() => {
        setCheckedCount(prev => prev + Math.floor(Math.random() * 5) + 1)
        const mnemonics = ["alpha", "beta", "gamma", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima"]
        const randomWords = mnemonics.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ")
        addLog(`Balance: 0 | Wallet check: ${randomWords}...`)
      }, 150)
    }
    return () => clearInterval(interval)
  }, [isInterrogating, addLog])

  const startInterrogation = () => {
    if (activeBlockchains.length === 0) {
      toast({ title: "Configuration Error", description: "Select at least one blockchain." })
      return
    }
    setIsInterrogating(true)
    toast({ title: "Interrogation Started", description: "Neural engine is scanning active nodes." })
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    toast({ title: "Interrogation Suspended", description: "All scan operations halted." })
  }

  return (
    <div className="relative min-h-screen z-10 p-6 flex flex-col font-code">
      <ParticleBackground />

      {/* Header */}
      <header className="mb-8">
        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Select a blockchain</h2>
        <p className="text-gray-400 text-sm mb-6">Here you can turn on/off blockchains for search</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {BLOCKCHAINS.map((chain) => {
            const isActive = activeBlockchains.includes(chain.id)
            return (
              <div 
                key={chain.id}
                onClick={() => toggleBlockchain(chain.id)}
                className={cn(
                  "relative h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border border-white/5",
                  isActive ? "bg-[#0a2e25] border-[#10b981]/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]" : "bg-[#111111] opacity-60 grayscale"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xl mb-1 shadow-lg", chain.color)}>
                  {chain.icon}
                </div>
                <span className={cn("text-xs font-bold", isActive ? "text-[#10b981]" : "text-gray-500")}>{chain.name}</span>
                
                <div className="absolute bottom-2 right-2">
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                    isActive ? "bg-[#10b981] border-[#10b981]" : "bg-transparent border-gray-600"
                  )}>
                    {isActive && <Check className="w-3 h-3 text-[#0a2e25] stroke-[4]" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </header>

      {/* Main Display Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-8">
        {/* Checked Panel */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Checked: <span className="text-[#10b981]">{checkedCount}</span></h3>
          <div className="flex-1 bg-[#111111]/80 border border-white/5 rounded-xl p-4 overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111111]/20 pointer-events-none" />
            <div className="space-y-1 h-full overflow-y-auto terminal-scrollbar pr-2">
              {logs.map((log) => (
                <div key={log.id} className="text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">
                  {log.message}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-600 italic">
                  Waiting for interrogation sequence...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Found Panel */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Found: <span className="text-blue-500">{foundCount}</span></h3>
          <div className="flex-1 bg-[#111111]/80 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative">
             <div className="w-full h-full opacity-20 flex flex-col items-center justify-center text-gray-500">
               <Binary className="w-16 h-16 mb-4" />
               <p className="text-sm">No positive entropy matches found in current cluster.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Control Footer */}
      <div className="flex flex-wrap gap-4 items-center justify-center py-6 border-t border-white/5">
        <Button 
          onClick={stopInterrogation}
          disabled={!isInterrogating}
          className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-12 h-14 rounded-lg font-bold text-lg min-w-[200px]"
        >
          Stop
        </Button>
        <Button 
          onClick={startInterrogation}
          disabled={isInterrogating}
          className="bg-[#428bca] hover:bg-[#3071a9] text-white px-12 h-14 rounded-lg font-bold text-lg min-w-[200px]"
        >
          {isInterrogating ? "Running..." : "Start"}
        </Button>
        <Button 
          className="bg-[#2c3e50] hover:bg-[#1a252f] text-white px-12 h-14 rounded-lg font-bold text-lg min-w-[200px]"
          onClick={() => toast({ title: "Action Restricted", description: "Withdrawal requires prioritized recovery vectors." })}
        >
          Withdraw
        </Button>
      </div>

      <footer className="mt-4 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          NeuroWallet AI v4.0 Elite - Encrypted Connection Secure
        </p>
      </footer>
    </div>
  )
}
