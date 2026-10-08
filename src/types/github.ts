export interface Release { name: string; tag: string; url: string; publishedAt: string; prerelease: boolean }
export interface Repository {
  id: number; name: string; fullName: string; description: string | null; url: string;
  homepage: string | null; demoUrl: string | null; demoCheckedAt: string | null;
  language: string | null; languages: Record<string, number>; technologies: string[]; categories: string[];
  stars: number; forks: number; watchers: number | null; openIssues: number;
  topics: string[]; license: string | null; createdAt: string; updatedAt: string; pushedAt: string;
  size: number; defaultBranch: string; archived: boolean; fork: boolean;
  readme: string | null; readmeUrl: string; readmeSummary: string | null;
  releases: Release[]; files: string[]; evidence: Record<string, string>;
  screenshot: string | null; screenshotCaption: string | null;
  featured: number; displayName: string; status: string; dataWarnings: string[];
}
export interface PublicEvent { id: string; type: string; repository: string; createdAt: string; url: string; label: string }
export interface GitHubData {
  schemaVersion: 1; fetchedAt: string | null; lastAttemptAt: string | null;
  status: 'ok' | 'partial' | 'unavailable'; error: string | null;
  user: { login: string; name: string; url: string }; repositories: Repository[];
  events: PublicEvent[]; eventsAvailable: boolean;
}
