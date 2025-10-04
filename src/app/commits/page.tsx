'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import Modal from "../components/Modal";
import { fetchCommitsByPage, fetchRepositories as fetchReposFromAPI, type Commit, type Repository } from "@/api/github";
import { useDebounce } from "@/hooks/useDebounce";

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

  const setAndGetRepositories = async () => {
    const controller = new AbortController();
    try {
      const githubToken = localStorage.getItem("github_token");

      if (!githubToken) return;

      setIsLoading(true);

      const OWNER_GITHUB = localStorage.getItem('github_username');
      const repos = await fetchReposFromAPI(OWNER_GITHUB, githubToken, controller.signal);
      const repoNames = repos.map((repo) => repo.name);
      setRepositories(repoNames);
      return repoNames;
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const setAndGetCommitsForRepository = async (repoName: string | null, page: number = 1, perPage: number = 100) => {
    const controller = new AbortController();
    const githubToken = localStorage.getItem("github_token");

    try {
      if (repoName === "all" || !repoName) {
        setFilteredCommits([]);
        setCommits([]);
        return;
      }

      if (!githubToken) return;

      const OWNER_GITHUB = localStorage.getItem('github_username');
      const commits = await fetchCommitsByPage(OWNER_GITHUB, repoName, page, perPage, githubToken, controller.signal);

      commits.sort((a: Commit, b: Commit) => new Date(b.author.date).getTime() - new Date(a.author.date).getTime());

      setFilteredCommits(commits);
      setCommits(commits);
    } catch (error) {
      console.error(`Error fetching commits for ${repoName}:`, error);
    }
  };

  /**
   * @description Filters commits by author name and commit message
   * @param {Commit[]} commits - Array of commits to filter
   * @param {string} searchFilter - Search value to filter by (case-insensitive, partial match)
   * @return {Commit[]} Filtered array of commits matching either author or message
   */
  const filterCommitsByAuthorAndMessage = (commits: Commit[], searchFilter: string): Commit[] => {
    if (!searchFilter) {
      return commits;
    }

    const lowerSearchFilter = searchFilter.toLowerCase();

    return commits.filter((commit) => {
      const authorMatch = commit.author.name.toLowerCase().includes(lowerSearchFilter);
      const messageMatch = commit.message.toLowerCase().includes(lowerSearchFilter);

      return authorMatch || messageMatch;
    });
  };

  /**
   * @description Debounced version of the filter function with 500ms delay
   */
  const debouncedFilter = useDebounce(() => {
    console.log('debug:hola')
    setFilteredCommits(filterCommitsByAuthorAndMessage(commits, searchQuery));
  }, 500);

  /**
   * @description Handles search input change and triggers debounced filtering
   * @param {string} value - The search input value
   * @return {void}
   */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedFilter();
  };

  /**
   * 
   * 
   */
  const handleSetRepository = (repositoryName: string) => {
    setSelectedRepo(repositoryName);
    setSearchQuery('');
    setAndGetCommitsForRepository(repositoryName);
  }

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
   * Set repositiories and show commits of first repository
   *
   * @return
   */
  const setRepositoriesAndShowCommits = () => {
    const setAngGet = async () => {
      const githubToken = localStorage.getItem("github_token");
      const chatgptToken = localStorage.getItem("chatgpt_token");

      console.log('debug:token', { githubToken, chatgptToken })

      if (!githubToken || !chatgptToken) {
        router.push("/")
        return
      }

      const [repository] = (await setAndGetRepositories()) ?? [];
      setSelectedRepo(repository);
      setAndGetCommitsForRepository(repository);
    }

    setAngGet();
  }

  useEffect(setRepositoriesAndShowCommits, [])

  const fullSelectedCommits = commits.filter(commit => selectedCommits.has(commit.sha));

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
                  {filteredCommits.length} commits found in {selectedRepo} repository
                </p>
              </div>
            </div>

            <button
              onClick={handleProcessCommits}
              disabled={selectedCommits.size === 0}
              className={`text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 ${selectedCommits.size === 0 ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}>
              <div className="w-4 h-4 bg-white"></div>
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
              placeholder="Search commits or authors..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                className="h-4 w-4 rounded border border-blue-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="select-all" className="text-sm text-gray-400">
                Select All
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
              <select
                value={selectedRepo}
                onChange={(e) => handleSetRepository(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Selected a repository</option>
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
                          className="h-4 w-4 rounded border border-blue-600 text-blue-600 focus:ring-blue-500"
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Commit Summary"
          commits={fullSelectedCommits}
        />
      </div>
    </div>
  )
}