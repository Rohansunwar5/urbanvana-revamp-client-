"use client"
import dynamic from "next/dynamic"

const ProblemSolution = dynamic(
  () => import("@/components/sections/problem-solution").then((m) => ({ default: m.ProblemSolution })),
  { ssr: false }
)

export function ProblemSolutionLazy() {
  return <ProblemSolution />
}
