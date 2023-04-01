export interface searchRecentTweetsResponse {
  data: searchRecentTweetsData[];
  includes: IncludesUsers;
  meta: Meta;
}

export interface searchRecentTweetsData {
  edit_history_tweet_ids: string[];
  text: string;
  id: string;
  author_id: string;
}

export interface IncludesUsers {
  users: User[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Meta {
  newest_id: string;
  oldest_id: string;
  result_count: number;
  next_token: string;
}
