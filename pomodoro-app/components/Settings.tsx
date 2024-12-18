'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SettingsProps {
  timerSettings: {
    workDuration: number
    breakDuration: number
  }
  setTimerSettings: React.Dispatch<React.SetStateAction<{
    workDuration: number
    breakDuration: number
  }>>
}

export default function Settings({ timerSettings, setTimerSettings }: SettingsProps) {
  const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerSettings({ ...timerSettings, workDuration: parseInt(e.target.value) * 60 })
  }

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerSettings({ ...timerSettings, breakDuration: parseInt(e.target.value) * 60 })
  }

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="workDuration">Work Duration (minutes)</Label>
          <Input
            id="workDuration"
            type="number"
            value={timerSettings.workDuration / 60}
            onChange={handleWorkDurationChange}
            min={1}
            max={60}
          />
        </div>
        <div>
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <Input
            id="breakDuration"
            type="number"
            value={timerSettings.breakDuration / 60}
            onChange={handleBreakDurationChange}
            min={1}
            max={30}
          />
        </div>
      </div>
    </div>
  )
}

