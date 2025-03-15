"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import {
  CheckCircle,
  BookOpen,
  Volume2,
  Repeat,
  BarChart,
  ChevronDown,
  ArrowRight,
  Globe,
  Brain,
  Clock,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  SpeakerWaveIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightBulbIcon,
  BookmarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function PresentationPage() {
  const [activeTab, setActiveTab] = useState("features")
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Modern Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                Wilspik
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab("features")}
                className={cn(
                  "text-theme-text-secondary hover:text-theme-primary transition-colors px-1 py-2 relative",
                  activeTab === "features" && "text-theme-primary",
                )}
              >
                Features
                {activeTab === "features" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("how-it-works")}
                className={cn(
                  "text-theme-text-secondary hover:text-theme-primary transition-colors px-1 py-2 relative",
                  activeTab === "how-it-works" && "text-theme-primary",
                )}
              >
                How It Works
                {activeTab === "how-it-works" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("why-us")}
                className={cn(
                  "text-theme-text-secondary hover:text-theme-primary transition-colors px-1 py-2 relative",
                  activeTab === "why-us" && "text-theme-primary",
                )}
              >
                Why Choose Us
                {activeTab === "why-us" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
                  />
                )}
              </button>
            </nav>

            <Button asChild className="bg-theme-primary hover:bg-theme-secondary text-white">
              <Link href="/home">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-theme-secondary/10 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-theme-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-theme-secondary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center rounded-full px-4 py-1 bg-theme-primary/10 text-theme-primary text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Master English Vocabulary</span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-theme-text-primary"
              >
                Learn English <span className="text-theme-primary">Faster</span>,{" "}
                <span className="text-theme-secondary">Smarter</span>, and{" "}
                <span className="text-theme-accent">Forever</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-lg text-theme-text-secondary">
                Master the essential vocabulary you need to speak and understand English fluently with our
                science-backed learning app.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-theme-primary hover:bg-theme-secondary text-white">
                  <Link href="/home">Start Learning Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group">
                  <Link href="#how-it-works" className="flex items-center">
                    How It Works
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeIn} className="flex items-center space-x-4 text-sm text-theme-text-secondary">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center text-white text-xs border-2 border-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ learners worldwide</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-2xl blur-xl opacity-20 transform -rotate-6"></div>

              {/* Card using the exact design from the provided code */}
              <Card className="w-full max-w-sm relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                  25 / 100
                </div>

                <CardHeader className="text-center space-y-2 mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 relative" id="englishWord">
                    hello (n.)
                  </h2>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 relative" id="pronunciation">
                    <SpeakerWaveIcon className="w-5 h-5" />
                    <span className="text-sm">/həˈloʊ/</span>
                  </div>
                  <p className="text-lg text-gray-700 relative" id="frenchTranslation">
                    bonjour
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Translation Challenge Design */}
                  <div className="relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-theme-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm z-10">
                      Your Challenge
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 pt-5 border border-theme-primary/20 shadow-sm">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center w-full mb-2">
                          <div className="bg-theme-primary rounded-full p-2 mr-3">
                            <LightBulbIcon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-theme-primary font-medium">Try to translate this phrase:</p>
                        </div>
                        <div className="w-full pl-2">
                          <div className="bg-white p-3 rounded-lg relative shadow-sm" id="frenchPhrase">
                            <p className="text-base text-theme-text-primary">
                              Je dis bonjour à mes voisins tous les matins.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg space-y-2 relative" id="englishPhrase">
                    <div className="relative">
                      <p className="text-base text-green-800 transition-all duration-300 blur-sm">
                        I say hello to my neighbors every morning.
                      </p>
                      <div className="flex items-center space-x-2 text-green-600 transition-all duration-300 blur-sm">
                        <SpeakerWaveIcon className="w-5 h-5" />
                        <span className="text-xs">/aɪ seɪ həˈloʊ tuː maɪ ˈneɪbərz ˈɛvri ˈmɔːrnɪŋ/</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full flex items-center space-x-2">
                          <EyeIcon className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Check your answer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center mt-4">
                  <div id="previousCard" className="relative">
                    <Button variant="outline" size="sm" disabled={true}>
                      <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  <div id="markRevision" className="relative">
                    <Button variant="outline" size="sm" className="flex-1 mx-2">
                      <BookmarkIcon className="w-5 h-5 mr-2" />
                      Mark for Revision
                    </Button>
                  </div>

                  <div id="nextCard" className="relative">
                    <Button className="bg-theme-primary hover:bg-theme-secondary text-white">
                      Next
                      <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subheadline */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-theme-text-primary">Stop forgetting what you learn</h2>
          <p className="text-xl text-theme-text-secondary">
            Our repetition system lets you review challenging words at your own pace to ensure lasting retention.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-theme-background" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-theme-text-primary"
            >
              Key Features
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 bg-theme-primary mx-auto mb-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-theme-text-secondary max-w-2xl mx-auto"
            >
              Our app is designed with science-backed learning principles to help you master English vocabulary
              efficiently.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Learn Through Real Phrases",
                description:
                  "Practice using new words in real-life sentences by translating phrases from your native language into English.",
                color: "from-theme-primary to-theme-secondary",
              },
              {
                icon: Repeat,
                title: "User-Controlled Repetition",
                description:
                  "Mark cards for revision, review them at your convenience, and unmark them when you feel confident.",
                color: "from-theme-success to-green-400",
              },
              {
                icon: BarChart,
                title: "Personalized Learning Path",
                description:
                  "Progress through organized buckets of vocabulary at your own pace, tailoring your learning journey to your goals.",
                color: "from-theme-warning to-amber-400",
              },
              {
                icon: Volume2,
                title: "Audio Pronunciation",
                description:
                  "Hear pronunciations, use phonetic symbols, and practice sentences you'll use in real conversations.",
                color: "from-theme-info to-blue-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 text-white transform group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-theme-text-primary">{feature.title}</h3>
                    <p className="text-theme-text-secondary">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-theme-text-primary"
            >
              How It Works
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 bg-theme-primary mx-auto mb-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-theme-text-secondary max-w-2xl mx-auto"
            >
              Our structured approach ensures you build vocabulary efficiently and retain it long-term.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-6 border-l-2 border-dashed border-theme-primary/30"></div>
                {[
                  {
                    title: "Focus on essential vocabulary",
                    description: "Learn the ~3,000 most important words to speak English confidently.",
                    icon: Brain,
                  },
                  {
                    title: "Progressive learning structure",
                    description:
                      "Vocabulary is divided into 34 buckets, each containing 100 cards. Progress through buckets at your pace, unlocking new sets as you go.",
                    icon: BarChart,
                  },
                  {
                    title: "Scoring and mastery",
                    description:
                      "Complete a bucket and receive a score based on your translation and pronunciation accuracy. Strive for a perfect score of 100/100 to master the bucket's vocabulary.",
                    icon: CheckCircle,
                  },
                  {
                    title: "User-driven repetition",
                    description:
                      "Mark challenging cards to revisit them. Review them until you can translate and recall them naturally. Unmark cards only when you feel fully confident.",
                    icon: Repeat,
                  },
                  {
                    title: "Long-term retention",
                    description: "Maintain fluency by revisiting mastered buckets whenever you need.",
                    icon: Clock,
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-16 pb-12"
                  >
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-white border-2 border-theme-primary flex items-center justify-center z-10">
                      <step.icon className="w-6 h-6 text-theme-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-theme-text-primary">{step.title}</h3>
                    <p className="text-theme-text-secondary">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 rounded-2xl transform rotate-3"></div>
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Learning process visualization"
                className="relative rounded-xl shadow-lg border border-gray-100 bg-white p-4"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-theme-success/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-theme-success" />
                  </div>
                  <div>
                    <p className="text-sm text-theme-text-secondary">Average improvement</p>
                    <p className="text-xl font-bold text-theme-success">+43%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose This App */}
      <section className="py-20 px-4 bg-theme-background" id="why-us">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-theme-text-primary"
            >
              Why Choose This App?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 bg-theme-primary mx-auto mb-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-theme-text-secondary max-w-2xl mx-auto"
            >
              Our app stands out with its focus on practical vocabulary and effective learning methods.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Practical Vocabulary",
                description: "Learn practical vocabulary for both everyday and professional settings.",
                icon: Globe,
              },
              {
                title: "Time-Efficient",
                description: "Perfect for busy learners—just 10 minutes a day can make a difference.",
                icon: Clock,
              },
              {
                title: "Conversational Focus",
                description: "Focus on conversational English, not just textbook phrases.",
                icon: BookOpen,
              },
              {
                title: "Confidence Building",
                description: "Build the confidence to speak and understand English naturally.",
                icon: Sparkles,
              },
              {
                title: "Pronunciation Mastery",
                description: "Improve pronunciation with phonetic symbols and audio examples.",
                icon: Volume2,
              },
              {
                title: "Science-Backed",
                description: "Our methods are based on proven learning science and memory techniques.",
                icon: Brain,
              },
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow border border-gray-100">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-full bg-theme-primary/10 flex items-center justify-center mb-4">
                      <reason.icon className="w-5 h-5 text-theme-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-theme-text-primary">{reason.title}</h3>
                    <p className="text-theme-text-secondary">{reason.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-theme-text-primary"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 bg-theme-primary mx-auto mb-6"
            ></motion.div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "faq-1",
                question: "How long does it take to become fluent?",
                answer:
                  "The time to achieve fluency varies for each individual. With consistent practice using our app for about 10-15 minutes daily, many users report significant improvement in their English skills within 3-6 months.",
              },
              {
                id: "faq-2",
                question: "Can I use this app if I'm a complete beginner?",
                answer:
                  "Yes! Our app is designed to cater to learners at all levels, from complete beginners to advanced speakers looking to refine their skills.",
              },
              {
                id: "faq-3",
                question: "How does the user-controlled repetition system work?",
                answer:
                  "You can mark any card that you find challenging for revision. These marked cards can be reviewed at your convenience until you feel confident with them. You have full control to unmark cards when you feel you've mastered them.",
              },
              {
                id: "faq-4",
                question: "Is there a mobile app available?",
                answer: "Yes, we offer mobile apps for both iOS and Android devices, allowing you to learn on-the-go.",
              },
            ].map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div
                  className={cn(
                    "border border-gray-200 rounded-lg overflow-hidden",
                    activeAccordion === faq.id ? "shadow-md" : "",
                  )}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-6 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-theme-text-primary">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-theme-primary transition-transform",
                        activeAccordion === faq.id ? "transform rotate-180" : "",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      activeAccordion === faq.id ? "max-h-40" : "max-h-0",
                    )}
                  >
                    <div className="p-6 pt-0 text-theme-text-secondary">{faq.answer}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-theme-primary to-theme-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6"
          >
            Start Your Journey to Fluency Today—It's Free!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl mb-8 text-white/90"
          >
            Join hundreds of learners taking control of their English vocabulary journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="bg-white text-theme-primary hover:bg-gray-100">
              <Link href="/home">Get Started Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                Wilspik
              </h3>
              <p className="text-gray-400">Master English vocabulary faster, smarter, and forever.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Vocabulary Learning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pronunciation Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Revision System
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Progress Tracking
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Wilspik. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

