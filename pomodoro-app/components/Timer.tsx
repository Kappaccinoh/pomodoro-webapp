'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface TimerProps {
  settings: {
    workDuration: number
    breakDuration: number
  }
}

export default function Timer({ settings }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration)
  const [isActive, setIsActive] = useState(false)
  const [isWork, setIsWork] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (isWork) {
        setTimeLeft(settings.breakDuration)
        setIsWork(false)
        playAlert()
      } else {
        setTimeLeft(settings.workDuration)
        setIsWork(true)
        playAlert()
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isWork, settings])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(settings.workDuration)
    setIsWork(true)
  }

  const playAlert = () => {
    const audio = new Audio('/alert.mp3')
    audio.play()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const progress = isWork
    ? ((settings.workDuration - timeLeft) / settings.workDuration) * 100
    : ((settings.breakDuration - timeLeft) / settings.breakDuration) * 100

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-semibold">{isWork ? 'Work Session' : 'Break Time'}</h2>
      <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
      <Progress value={progress} className="w-64" />
      <div className="space-x-2">
        <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </div>
    </div>
  )
}

