"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import * as Accordion from "@radix-ui/react-accordion"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, BookOpen, CheckCircle, Volume2, Repeat, BarChart } from "lucide-react"

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sticky Header */}
      <NavigationMenu.Root className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <NavigationMenu.List className="flex justify-between items-center max-w-7xl mx-auto px-4 py-4">
          <NavigationMenu.Item>
            <Link href="/" className="text-2xl font-bold text-[#2c3e50]">
              Wilspik
            </Link>
          </NavigationMenu.Item>
          <div className="flex space-x-6">
            {["Features", "How It Works", "Why Choose Us"].map((item) => (
              <NavigationMenu.Item key={item}>
                <NavigationMenu.Link className="text-[#34495e] hover:text-[#3498db] transition-colors">
                  {item}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </div>
          <NavigationMenu.Item>
            <Button asChild className="bg-[#3498db] hover:bg-[#2980b9]">
              <Link href="/home">Get Started</Link>
            </Button>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-[#3498db] to-[#2980b9] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white text-[#3498db] rounded-full py-3 px-6 inline-flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-8 h-8 mr-3 text-[#3498db]" />
            <h1 className="text-2xl md:text-4xl font-bold">Learn English Vocabulary</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white text-[#3498db] rounded-full py-3 px-6 inline-flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-8 h-8 mr-3 text-[#3498db]" />
            <span className="text-2xl md:text-4xl font-bold">🗣️ Speak with Confidence</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl mb-12"
          >
            Master the essential vocabulary you need to speak and understand English fluently with our science-backed
            learning app.
          </motion.p>
          <Button asChild size="lg" className="bg-white text-[#3498db] hover:bg-gray-100">
            <Link href="/home">Start Your Journey to Fluency</Link>
          </Button>
        </div>
      </section>

      {/* Subheadline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#2c3e50]">Stop forgetting what you learn</h2>
          <p className="text-xl text-[#34495e]">
            Our repetition system lets you review challenging words at your own pace to ensure lasting retention.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2c3e50]">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: BookOpen,
                title: "Learn Through Real Phrases",
                description:
                  "Practice using new words in real-life sentences by translating phrases from your native language into English.",
              },
              {
                icon: Repeat,
                title: "User-Controlled Repetition",
                description:
                  "Mark cards for revision, review them at your convenience, and unmark them when you feel confident.",
              },
              {
                icon: BarChart,
                title: "Personalized Learning Path",
                description:
                  "Progress through organized buckets of vocabulary at your own pace, tailoring your learning journey to your goals.",
              },
              {
                icon: Volume2,
                title: "Audio Pronunciation & Real-Life Usage",
                description:
                  "Hear pronunciations, use phonetic symbols, and practice sentences you'll use in real conversations.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-[#3498db] mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-[#2c3e50]">{feature.title}</h3>
                    <p className="text-[#34495e]">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2c3e50]">How It Works</h2>
          <div className="space-y-8">
            {[
              {
                title: "Focus on essential vocabulary",
                description: "Learn the ~3,000 most important words to speak English confidently.",
              },
              {
                title: "Progressive learning structure",
                description:
                  "Vocabulary is divided into 34 buckets, each containing 100 cards. Progress through buckets at your pace, unlocking new sets as you go.",
              },
              {
                title: "Scoring and mastery",
                description:
                  "Complete a bucket and receive a score based on your translation and pronunciation accuracy. Strive for a perfect score of 100/100 to master the bucket's vocabulary.",
              },
              {
                title: "User-driven repetition",
                description:
                  "Mark challenging cards to revisit them. Review them until you can translate and recall them naturally. Unmark cards only when you feel fully confident.",
              },
              {
                title: "Long-term retention",
                description: "Maintain fluency by revisiting mastered buckets whenever you need.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3498db] flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-white">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2c3e50]">{step.title}</h3>
                  <p className="text-[#34495e]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose This App */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2c3e50]">Why Choose This App?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Learn practical vocabulary for both everyday and professional settings.",
              "Perfect for busy learners—just 10 minutes a day can make a difference.",
              "Focus on conversational English, not just textbook phrases.",
              "Build the confidence to speak and understand English naturally.",
              "Improve pronunciation with phonetic symbols and audio examples.",
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start"
              >
                <CheckCircle className="w-6 h-6 text-[#3498db] mr-2 flex-shrink-0" />
                <p className="text-[#34495e]">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2c3e50]">Frequently Asked Questions</h2>
          <Accordion.Root type="single" collapsible className="space-y-4">
            {[
              {
                question: "How long does it take to become fluent?",
                answer:
                  "The time to achieve fluency varies for each individual. With consistent practice using our app for about 10-15 minutes daily, many users report significant improvement in their English skills within 3-6 months.",
              },
              {
                question: "Can I use this app if I'm a complete beginner?",
                answer:
                  "Yes! Our app is designed to cater to learners at all levels, from complete beginners to advanced speakers looking to refine their skills.",
              },
              {
                question: "How does the user-controlled repetition system work?",
                answer:
                  "You can mark any card that you find challenging for revision. These marked cards can be reviewed at your convenience until you feel confident with them. You have full control to unmark cards when you feel you've mastered them.",
              },
              {
                question: "Is there a mobile app available?",
                answer: "Only web application is available right now.",
              },
            ].map((faq, index) => (
              <Accordion.Item key={index} value={`item-${index}`}>
                <Accordion.Trigger className="w-full text-left p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <span className="font-semibold text-[#2c3e50]">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-[#3498db]" />
                </Accordion.Trigger>
                <Accordion.Content className="p-4 bg-white rounded-b-lg mt-1">
                  <p className="text-[#34495e]">{faq.answer}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#3498db] to-[#2980b9] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey to Fluency Today—It's Free!</h2>
          <p className="text-xl mb-8">Join hundreds of learners taking control of their English vocabulary journey.</p>
          <Button asChild size="lg" className="bg-white text-[#3498db] hover:bg-gray-100">
            <Link href="/home">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

