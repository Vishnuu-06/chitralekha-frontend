export type ContentType = 'MOVIE' | 'SHOW' | 'ANIME' | 'BOOK';

export interface ContentItem {
  id: number;
  contentType: ContentType;
  provider: string;
  externalId: string;
  title: string;
  description?: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseYear?: number;
  genres?: string;
  creators?: string;
  totalItems?: number;
  averageRating?: number | null;
  ratingsCount?: number;
  reviewsCount?: number;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface UserProfileData {
  user: UserSummary;
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string;
    favoriteMovies: string;
    favoriteShows: string;
    favoriteAnime: string;
    favoriteBooks: string;
  };
  stats: {
    followersCount: number;
    followingCount: number;
    ratingsCount: number;
    reviewsCount: number;
    listsCount: number;
    watchedMoviesCount: number;
    readBooksCount: number;
  };
  isFollowing: boolean;
  isSelf: boolean;
}

export type TrackingStatus =
  | 'WATCHED'
  | 'WANT_TO_WATCH'
  | 'WATCHING'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'DROPPED'
  | 'READ'
  | 'READING'
  | 'WANT_TO_READ';

export interface UserTrackingRecord {
  id: number;
  contentId: number;
  content: ContentItem;
  status: TrackingStatus;
  progress: number;
  isFavorite: boolean;
  updatedAt: string;
}

export interface ReviewItem {
  id: number;
  title: string;
  body: string;
  ratingScore: number;
  containsSpoilers: boolean;
  createdAt: string;
  author: {
    id: number;
    username: string;
  };
}

export interface PostItem {
  id: number;
  userId: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  content?: ContentItem | null;
  body: string;
  createdAt: string;
}

export interface PostCommentItem {
  id: number;
  body: string;
  author: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface ContentListItem {
  id: number;
  order: number;
  notes?: string;
  addedAt: string;
  content: ContentItem;
}

export interface ListSummary {
  id: number;
  name: string;
  description: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  owner: {
    id: number;
    username: string;
  };
  items?: ContentListItem[];
}

export interface ConversationSummary {
  id: number;
  otherUser: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  latestMessage: string;
  latestTimestamp: string;
  isUnread: boolean;
}

export interface MessageItem {
  id: number;
  senderId: number;
  senderUsername: string;
  body: string;
  createdAt: string;
  isMine: boolean;
  sharedContent?: ContentItem;
}

export interface NotificationItem {
  id: number;
  message: string;
  type: string;
  targetUrl: string;
  readFlag: boolean;
  createdAt: string;
}

export interface TasteRecommendation {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  sharedTitlesCount: number;
  explanation: string;
}
