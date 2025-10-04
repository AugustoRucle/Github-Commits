/**
 * GitHub API client
 * Handles all interactions with the GitHub REST API
 */

export const GITHUB_API_BASE_URL = 'https://api.github.com';

export const GITHUB_API_VERSION = '2022-11-28';

export const GITHUB_DEFAULT_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': GITHUB_API_VERSION,
};

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  repository: string;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

interface GitHubCommitResponse {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
}

interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  avatar_url: string;
}

/**
 * @description Builds request headers by merging default headers with optional token
 * @param {string | undefined} token - Optional GitHub personal access token
 * @return {HeadersInit} Merged headers object
 */
function buildHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { ...GITHUB_DEFAULT_HEADERS };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * @description Validates and throws error for non-2xx responses
 * @param {Response} response - The fetch Response object
 * @param {string} url - The URL that was requested
 * @return {Promise<void>} Throws if response is not ok
 */
async function validateResponse(response: Response, url: string): Promise<void> {
  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} - URL: ${url}`
    );
  }
}
/**
 * @description Fetches a paginated list of commits for a specific repository
 * @param {string} owner - The GitHub username or organization that owns the repository
 * @param {string} repo - The name of the repository
 * @param {number} page - The page number to fetch (1-indexed)
 * @param {number} perPage - Number of commits per page (default: 100, max: 100)
 * @param {string | undefined} token - Optional GitHub personal access token for authentication
 * @param {AbortSignal | undefined} signal - Optional AbortSignal for request cancellation
 * @return {Promise<Commit[]>} Array of commits for the specified page
 */
export async function fetchCommitsByPage(
  owner: string | null,
  repo: string | null,
  page: number,
  perPage: number = 100,
  token?: string,
  signal?: AbortSignal
): Promise<Commit[]> {
  if (!owner || !repo) {
    throw new Error('Owner and repository are required');
  }

  if (page < 1) {
    throw new Error('Page number must be greater than 0');
  }

  if (perPage < 1 || perPage > 100) {
    throw new Error('perPage must be between 1 and 100');
  }

  const url = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url, { headers: buildHeaders(token), signal, });

    await validateResponse(response, url);

    const data: GitHubCommitResponse[] = await response.json();

    return data.map((commitData) => ({
      sha: commitData.sha,
      message: commitData.commit.message,
      author: {
        name: commitData.commit.author.name,
        email: commitData.commit.author.email,
        date: commitData.commit.author.date,
      },
      repository: repo,
      url: commitData.html_url,
    }));
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    throw error;
  }
}

/**
 * @description Fetches repositories for a specific GitHub user or organization
 * @param {string} ownerOrOrg - The GitHub username or organization name
 * @param {string | undefined} token - Optional GitHub personal access token for authentication
 * @param {AbortSignal | undefined} signal - Optional AbortSignal for request cancellation
 * @return {Promise<Repository[]>} Array of repositories from a single request
 */
export async function fetchRepositories(
  ownerOrOrg: string | null,
  token?: string,
  signal?: AbortSignal
): Promise<Repository[]> {
  if (!ownerOrOrg) {
    throw new Error('Owner or organization name is required');
  }

  const url = `${GITHUB_API_BASE_URL}/users/${ownerOrOrg}/repos?per_page=100&sort=updated&direction=desc`;

  try {
    const response = await fetch(url, { headers: buildHeaders(token), signal, });

    await validateResponse(response, url);

    const data: GitHubRepositoryResponse[] = await response.json();

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      html_url: repo.html_url,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
    }));
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    console.error(`Error fetching repositories for ${ownerOrOrg}:`, error);
    throw error;
  }
}


/**
 * @description Fetches repositories for a specific GitHub user or organization
 * @param {string} ownerOrOrg - The GitHub username or organization name
 * @param {string | undefined} token - Optional GitHub personal access token for authentication
 * @param {AbortSignal | undefined} signal - Optional AbortSignal for request cancellation
 * @return {Promise<Repository[]>} Array of repositories from a single request
 */
export async function fetchUser(
  token?: string,
  signal?: AbortSignal
): Promise<GitHubUserResponse> {
  try {
    const url = `${GITHUB_API_BASE_URL}/user`;
    const response = await fetch(url, { headers: buildHeaders(token), signal, });

    await validateResponse(response, url);

    const data: GitHubUserResponse = await response.json();

    return {
      id: data.id,
      login: data.login,
      avatar_url: data.avatar_url,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    console.error(`Error fetching user details:`, error);
    throw error;
  }
}
