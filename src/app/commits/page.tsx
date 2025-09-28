'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import Modal from "../components/Modal";

interface Commit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  repository: string
  url: string
}

const FAKE_COMMITS: Commit[] = [
  {
    sha: "a7b3c9d2e1f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8",
    message:
      "feat: implement user authentication with OAuth integration\n\nAdded Google and GitHub OAuth providers with secure token handling",
    author: {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    repository: "web-dashboard",
    url: "https://github.com/company/web-dashboard/commit/a7b3c9d2e1f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8",
  },
  {
    sha: "b8c4d0e3f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
    message: "fix: resolve memory leak in data processing pipeline",
    author: {
      name: "Marcus Rodriguez",
      email: "marcus.r@company.com",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    repository: "analytics-engine",
    url: "https://github.com/company/analytics-engine/commit/b8c4d0e3f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
  },
  {
    sha: "c9d5e1f4g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
    message:
      "refactor: optimize database queries for better performance\n\nReduced query execution time by 60% through indexing improvements",
    author: {
      name: "Emily Watson",
      email: "emily.watson@company.com",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    repository: "user-service",
    url: "https://github.com/company/user-service/commit/c9d5e1f4g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
  },
];

export default function CommitsPage() {
  const [commits, setCommits] = useState<Commit[]>([])
  const [filteredCommits, setFilteredCommits] = useState<Commit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("all")
  const [repositories, setRepositories] = useState<string[]>([])
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  /**
   * @summary Loads fake commits to display in the page.
   * @description This function simulates an API call to fetch commits and repositories.
   */
  const loadFakeCommits = useCallback(async () => {
    try {
      setIsLoading(true)

      // Simulate API loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract unique repositories
      const repoNames = [...new Set(FAKE_COMMITS.map((commit) => commit.repository))]
      setRepositories(repoNames)

      // Set commits data
      setCommits(FAKE_COMMITS)
    } catch (error) {
      console.error("Error loading commits:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * @summary Formats a date string to a more readable format.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  /**
   * @summary Gets the color for a commit type based on the commit message.
   * @param {string} message - The commit message.
   * @returns {string} The Tailwind CSS classes for the color.
   */
  const getCommitTypeColor = (message: string) => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("fix") || lowerMessage.includes("bug")) return "bg-red-500/20 text-red-400"
    if (lowerMessage.includes("feat") || lowerMessage.includes("add")) return "bg-green-500/20 text-green-400"
    if (lowerMessage.includes("update") || lowerMessage.includes("change")) return "bg-blue-500/20 text-blue-400"
    if (lowerMessage.includes("refactor")) return "bg-purple-500/20 text-purple-400"
    return "bg-gray-500/20 text-gray-400"
  }

  /**
   * @summary Handles the selection of a commit.
   * @param {string} sha - The SHA of the commit.
   * @param {boolean} checked - Whether the commit is selected.
   */
  const handleCommitSelect = (sha: string, checked: boolean) => {
    const newSelected = new Set(selectedCommits)
    if (checked) {
      newSelected.add(sha)
    } else {
      newSelected.delete(sha)
    }
    setSelectedCommits(newSelected)
  }

  /**
   * @summary Handles the selection of all commits.
   * @param {boolean} checked - Whether all commits are selected.
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommits(new Set(filteredCommits.map((commit) => commit.sha)))
    } else {
      setSelectedCommits(new Set())
    }
  }

  /**
   * @summary Handles the processing of commits.
   */
  const handleProcessCommits = () => {
    if (selectedCommits.size > 0) {
      setIsModalOpen(true)
    }
  }

  /**
   * @summary Gets a random commit description.
   * @returns {string} A random commit description.
   */
  const getRandomCommitDescription = () => {
    const descriptions = [
      "These commits represent significant improvements to your codebase, including bug fixes, new features, and performance optimizations that will enhance user experience and system reliability.",
      "The selected commits showcase a comprehensive development effort spanning multiple repositories, demonstrating collaborative work on authentication systems, database optimizations, and user interface enhancements.",
      "Your commit selection includes critical updates to core functionality, security improvements, and architectural refactoring that will modernize your application stack and improve maintainability.",
      "These commits reflect a well-rounded development cycle with feature additions, bug resolutions, and code quality improvements that strengthen your project's foundation and scalability.",
      "The chosen commits represent strategic development decisions including API migrations, performance enhancements, and user experience improvements that align with modern development best practices.",
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  useEffect(() => {
    let filtered = commits

    if (searchQuery) {
      filtered = filtered.filter(
        (commit) =>
          commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          commit.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          commit.repository.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedRepo !== "all") {
      filtered = filtered.filter((commit) => commit.repository === selectedRepo)
    }

    setFilteredCommits(filtered)
  }, [commits, searchQuery, selectedRepo])

  useEffect(() => {
    const githubToken = localStorage.getItem("github_token")
    const chatgptToken = localStorage.getItem("chatgpt_token")

    if (!githubToken || !chatgptToken) {
      router.push("/")
      return
    }

    loadFakeCommits()
  }, [router, loadFakeCommits])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-800/50 -mx-4 px-4 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer"
              >
                <Image src="/images/right-arrow.png" alt="Back" width={16} height={16} className="rotate-180" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <Image src="/images/github.png" alt="GitHub" width={24} height={24} />
                  Repository Commits
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {filteredCommits.length} commits found across {repositories.length} repositories
                </p>
              </div>
            </div>

            <button
              onClick={handleProcessCommits}
              disabled={selectedCommits.size === 0}
              className={`text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 ${selectedCommits.size === 0 ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}>
              <Image src="/images/docs.png" alt="GitHub" width={16} height={16} />
              Process Commits ({selectedCommits.size})
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image src="/images/search.png" alt="Search" width={16} height={16} />
            </div>
            <input
              placeholder="Search commits, authors, or repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 rounded-md w-full text-white placeholder-gray-500 border px-4 py-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="select-all"
                checked={filteredCommits.length > 0 && selectedCommits.size === filteredCommits.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border border-blue-600 text-blue-600 focus:ring-blue-500 p-3"
              />
              <label htmlFor="select-all" className="text-sm text-gray-400">
                Select All
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Repositories</option>
                {repositories.map((repo) => (
                  <option key={repo} value={repo}>
                    {repo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400">Fetching commits from your repositories...</p>
            </div>
          </div>
        )}

        {/* Commits List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredCommits.length === 0 ? (
              <div className="border-gray-800/50 rounded-lg">
                <div className="py-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No commits found</h3>
                  <p className="text-gray-400">
                    {searchQuery || selectedRepo !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No commits were found in your repositories."}
                  </p>
                </div>
              </div>
            ) : (
              filteredCommits.map((commit) => (
                <div key={commit.sha} className="border border-gray-800 rounded-lg hover:border-gray-700 bg-gray-950">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedCommits.has(commit.sha)}
                          onChange={(e) => handleCommitSelect(commit.sha, e.target.checked)}
                          className="h-4 w-4 rounded border border-blue-600 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="font-medium text-white leading-relaxed">
                              {commit.message.split("\n")[0]}
                            </p>
                            {commit.message.includes("\n") && (
                              <p className="text-sm text-gray-400 mt-1">
                                {commit.message.split("\n").slice(1).join("\n").trim()}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Image src="/images/user.png" alt="User" width={16} height={16} />
                              <span>{commit.author.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image src="/images/clock.png" alt="Clock" width={16} height={16} />
                              <span>{formatDate(commit.author.date)}</span>
                            </div>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded-md">
                              {commit.repository}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-md ${getCommitTypeColor(commit.message)}`}>
                              {commit.message.toLowerCase().includes("fix")
                                ? "Fix"
                                : commit.message.toLowerCase().includes("feat")
                                  ? "Feature"
                                  : commit.message.toLowerCase().includes("refactor")
                                    ? "Refactor"
                                    : "Update"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono">
                          {commit.sha.substring(0, 7)}
                        </code>
                        <button
                          onClick={() => window.open(commit.url, "_blank")}
                          className="text-gray-400 hover:text-white"
                        >
                          <Image src="/images/external-link.png" alt="Back" width={14} height={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )))
            }
          </div>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Commit Analysis">
          <p>{getRandomCommitDescription()}</p>
          <div className="flex justify-end pt-4">
            <button onClick={() => setIsModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}