// /lib/projects-store.ts
"use client"
import type { Project } from "@/lib/types"

const KEY = "projects" // <- usa SIEMPRE esta key

function read(): Project[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch {
    return []
  }
}
function write(projects: Project[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(projects))
}

export function getProjects(fallback: Project[] = []): Project[] {
  const ls = read()
  return ls.length ? ls : fallback
}
export function setProjects(projects: Project[]) {
  write(projects)
}
export function addProject(p: Project) {
  const all = read()
  all.unshift(p)
  write(all)
}
export function findProject(id: string, fallback: Project[] = []): Project | undefined {
  const all = getProjects(fallback)
  return all.find(p => p.id === id)
}
export function removeProject(id: string) {
  const all = getProjects([])
  const next = all.filter(p => p.id !== id)
  setProjects(next)
}

export function clearProjects() {
  setProjects([])
}

