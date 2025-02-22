"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/Header"
import { useRouter } from "next/navigation"

export default function ParametersPage() {
  const [guideEnabled, setGuideEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedGuideEnabled = localStorage.getItem("showGuide")
    setGuideEnabled(storedGuideEnabled === "true")
  }, [])

  const handleGuideToggle = (checked: boolean) => {
    setGuideEnabled(checked)
    localStorage.setItem("showGuide", checked.toString())
  }

  const handleClearProgression = () => {
    localStorage.setItem("currentBucket", "1");
    localStorage.setItem("repetitionCards", "[]");
    localStorage.setItem("revision.currentCard", "null");
    localStorage.setItem("seenCards", "[]");
    localStorage.setItem("showGuide", "true");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Parameters</h1>
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guide</CardTitle>
              <CardDescription>Enable or disable the in-app guide</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span>Enable Guide</span>
              <Switch checked={guideEnabled} onCheckedChange={handleGuideToggle} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>App Progression</CardTitle>
              <CardDescription>Clear all app progression data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleClearProgression}>
                Clear App Progression
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

