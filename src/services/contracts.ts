/** Public JSON contracts exposed by the LearnAI API. */

export type UUID = string;
export type ISODateString = string;
export type ISODateTimeString = string;
export type Metadata = Readonly<Record<string, unknown>>;

export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginatedResponse<T> extends ApiEnvelope<T[]> {
  limit: number;
  offset: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiValidationIssue {
  field: string;
  type: string;
  message?: string;
}

export interface ApiErrorResponse {
  detail: string;
  errors?: ApiValidationIssue[];
}

export type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 413 | 422 | 429 | 503;

export interface DeletedResponse {
  deleted: boolean;
}

// Authentication and user profile

export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  user_id: UUID | null;
  name: string | null;
  last_name: string | null;
  email: string | null;
  streak: number | null;
  status: UserStatus | null;
  profile_image_path: string | null;
  profile_image_mime_type: string | null;
  profile_image_size_bytes: number | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
  last_login: ISODateTimeString | null;
  metadata?: Metadata | null;
}

export type UserResponse = ApiEnvelope<User>;

export interface AuthSession {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  expires_in: number | null;
  user: User | null;
  message: string | null;
  metadata?: Metadata | null;
}

export type AuthResponse = ApiEnvelope<AuthSession>;
export type AuthToken = AuthSession;

export interface AuthMessage {
  message: string;
  metadata?: Metadata | null;
}

export type AuthMessageResponse = ApiEnvelope<AuthMessage>;

export interface AuthRegisterPayload {
  email: string;
  name: string;
  last_name: string;
  password?: string;
  captcha_token?: string;
}

export type RegisterPayload = AuthRegisterPayload;

export interface AuthLoginPayload {
  email: string;
  password: string;
  captcha_token?: string;
}

export type LoginPayload = AuthLoginPayload;

export interface AuthOtpPayload {
  email: string;
  should_create_user?: false;
  captcha_token?: string;
}

export type OtpPayload = AuthOtpPayload;

export type OtpVerificationType = "email" | "recovery" | "invite" | "email_change";

export interface AuthVerifyOtpPayload {
  email: string;
  token: string;
  type?: OtpVerificationType;
  captcha_token?: string;
}

export type VerifyOtpPayload = AuthVerifyOtpPayload;

export interface AuthForgotPasswordPayload {
  email: string;
  captcha_token?: string;
}

export interface AuthUpdatePasswordPayload {
  password: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  last_name?: string;
}

export type UserProfileUpdatePayload = UpdateUserProfilePayload;

export interface ProfilePhoto {
  user_id: UUID;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  expires_in: number;
}

export interface ProfilePhotoUploadPayload {
  file: File;
}

export type ProfilePhotoResponse = ApiEnvelope<ProfilePhoto>;
export type ProfilePhotoDeleteResponse = DeletedResponse;

// Notebooks, tags, and study rooms

export type NotebookStatus = "active" | "archived" | "deleted";

export interface Notebook {
  notebook_id: UUID | null;
  name: string | null;
  description: string | null;
  grade: number | null;
  summary: string | null;
  is_dominated: boolean | null;
  is_favorite: boolean | null;
  status: NotebookStatus | null;
  spent_time: number | null;
  last_seen_at: ISODateTimeString | null;
  due_date: ISODateTimeString | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface CreateNotebookPayload {
  name: string;
  description?: string | null;
  summary?: string | null;
  is_favorite?: boolean;
  due_date?: ISODateTimeString | null;
}

export type NotebookCreatePayload = CreateNotebookPayload;

export interface UpdateNotebookPayload {
  name?: string;
  description?: string | null;
  summary?: string | null;
  is_favorite?: boolean;
  status?: NotebookStatus;
  due_date?: ISODateTimeString | null;
}

export type NotebookUpdatePayload = UpdateNotebookPayload;
export type NotebookResponse = ApiEnvelope<Notebook>;
export type NotebookListResponse = PaginatedResponse<Notebook>;

export type TagStatus = "active" | "inactive";
export type TagScope = "system" | "user";

export interface Tag {
  id: UUID;
  name: string;
  status: TagStatus;
  scope: TagScope;
}

export interface CreateTagPayload {
  name: string;
}

export type TagCreatePayload = CreateTagPayload;

export type TagResponse = ApiEnvelope<Tag>;
export type TagListResponse = PaginatedResponse<Tag>;

export interface NotebookTag {
  notebook_id: UUID | null;
  tag_id: UUID | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface Room {
  room_id: UUID | null;
  name: string | null;
  description: string | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface CreateRoomPayload {
  name: string;
  description?: string | null;
}

export type RoomCreatePayload = CreateRoomPayload;

export interface UpdateRoomPayload {
  name?: string;
  description?: string | null;
}

export type RoomUpdatePayload = UpdateRoomPayload;
export type RoomResponse = ApiEnvelope<Room>;
export type RoomListResponse = PaginatedResponse<Room>;

export type RoomRole = "user" | "admin";

export interface RoomMember {
  room_id: UUID | null;
  member_id: UUID | null;
  role: RoomRole | null;
  joined_at: ISODateTimeString | null;
}

export interface AddRoomMemberPayload {
  member_id: UUID;
  role?: RoomRole;
}

export interface RoomNotebook {
  room_id: UUID | null;
  notebook_id: UUID | null;
  created_by: UUID | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface AddRoomNotebookPayload {
  notebook_id: UUID;
}

export type RoomNotebookResponse = ApiEnvelope<RoomNotebook>;

// RAG documents and conversations

export type DocumentSourceType = "note" | "pdf" | "markdown" | "txt" | "document";
export type DocumentStatus = "active" | "archived" | "deleted";
export type DocumentProcessingStatus = "pending" | "processing" | "completed" | "failed";

export interface Document {
  document_id: UUID | null;
  notebook_id: UUID | null;
  name: string | null;
  description: string | null;
  source_type: DocumentSourceType | null;
  status: DocumentStatus | null;
  processing_status: DocumentProcessingStatus | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface DocumentUploadResult {
  document_id: UUID | null;
  notebook_id: UUID | null;
  name: string | null;
  source_type: DocumentSourceType | null;
  processing_status: DocumentProcessingStatus | null;
  mime_type: string | null;
  size_bytes: number | null;
  chunks_count: number;
}

export interface DocumentUploadPayload {
  file: File;
  description?: string;
}

export type DocumentResponse = ApiEnvelope<Document>;
export type DocumentListResponse = PaginatedResponse<Document>;
export type DocumentUploadResponse = ApiEnvelope<DocumentUploadResult>;

export type ConversationStatus = "active" | "archived" | "deleted";

export interface Conversation {
  conversation_id: UUID | null;
  notebook_id: UUID | null;
  created_by_user_id: UUID | null;
  name: string | null;
  summary: string | null;
  spent_time: number | null;
  status: ConversationStatus | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface CreateConversationPayload {
  name?: string;
}

export type ConversationCreatePayload = CreateConversationPayload;
export type ConversationResponse = ApiEnvelope<Conversation>;
export type ConversationListResponse = PaginatedResponse<Conversation>;

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  message_id: UUID | null;
  conversation_id: UUID | null;
  sent_by_user_id: UUID | null;
  role: MessageRole | null;
  content: string | null;
  order_message: number | null;
  created_at: ISODateTimeString | null;
}

export interface SendMessagePayload {
  content: string;
  model?: string;
}

export type ChatMessagePayload = SendMessagePayload;
export type MessageListResponse = PaginatedResponse<Message>;

export interface RagSource {
  chunk_id: UUID | null;
  document_id: UUID | null;
  document_name: string | null;
  similarity: number | null;
  content: string | null;
}

export interface SourcedResponse<T> extends ApiEnvelope<T> {
  sources: RagSource[];
}

export type ChatResponse = SourcedResponse<Message>;

// RAG flashcards

export interface GeneratedFlashcard {
  flashcard_id: UUID;
  question_id: UUID;
  question: string;
  answer: string;
}

export interface Flashcard extends GeneratedFlashcard {
  notebook_id: UUID;
  spent_time: number;
  created_at: ISODateTimeString | null;
}

export interface GenerateFlashcardsPayload {
  count?: number;
  model?: string;
}

export type FlashcardGenerationPayload = GenerateFlashcardsPayload;
export type FlashcardGenerationResponse = SourcedResponse<GeneratedFlashcard[]>;
export type FlashcardListResponse = PaginatedResponse<Flashcard>;

// Exams, questions, attempts, and grading results

export type QuestionType = "multiple_choice" | "true_false" | "open";
export type ExamStatus = "active" | "archived" | "deleted";
export type AttemptStatus = "in_progress" | "completed" | "failed" | "not_started";

export interface Question {
  question_id: UUID | null;
  type: QuestionType | null;
  statement: string | null;
  created_at: ISODateTimeString | null;
}

export interface QuestionOption {
  option_id: UUID;
  option_text: string;
  option_order: number;
}

export interface ExamQuestion {
  question_id: UUID;
  type: QuestionType;
  statement: string;
  question_order: number;
  options: QuestionOption[];
}

export interface Exam {
  exam_id: UUID;
  notebook_id: UUID;
  name: string;
  description: string | null;
  status: ExamStatus;
  questions: ExamQuestion[];
}

export interface ExamSummary {
  exam_id: UUID | null;
  notebook_id: UUID | null;
  name: string | null;
  description: string | null;
  status: ExamStatus | null;
  created_at: ISODateTimeString | null;
  updated_at: ISODateTimeString | null;
}

export interface GenerateExamPayload {
  name?: string;
  description?: string | null;
  true_false_count?: number;
  multiple_choice_count?: number;
  open_count?: number;
  model?: string;
}

export type ExamGenerationPayload = GenerateExamPayload;
export type ExamGenerationResponse = SourcedResponse<Exam>;
export type ExamResponse = ApiEnvelope<ExamSummary>;
export type ExamListResponse = PaginatedResponse<ExamSummary>;

export interface AttemptQuestion extends Omit<ExamQuestion, "options"> {
  points: number;
  options: QuestionOption[];
}

export interface SavedAttemptAnswer {
  answer_id: UUID;
  attempt_id: UUID;
  question_id: UUID;
  selected_option_id: UUID | null;
  answer_text: string | null;
  created_at: ISODateTimeString | null;
}

export interface AttemptSession {
  attempt_id: UUID;
  exam_id: UUID;
  status: AttemptStatus;
  attempt_number: number;
  max_attempts: number;
  attempts_remaining: number;
  started_at: ISODateTimeString | null;
  questions: AttemptQuestion[];
  answers: SavedAttemptAnswer[];
}

export type EmptyPayload = Readonly<Record<never, never>>;
export type StartAttemptPayload = EmptyPayload;
export type FinishAttemptPayload = EmptyPayload;

export interface SelectedOptionAnswerPayload {
  selected_option_id: UUID;
  answer_text?: never;
}

export interface TextAnswerPayload {
  answer_text: string;
  selected_option_id?: never;
}

export type SubmitAttemptAnswerPayload = SelectedOptionAnswerPayload | TextAnswerPayload;
export type AttemptAnswerPayload = SubmitAttemptAnswerPayload;
export type AttemptSessionResponse = ApiEnvelope<AttemptSession>;
export type SavedAttemptAnswerResponse = ApiEnvelope<SavedAttemptAnswer>;

export interface GradedAttemptAnswer {
  answer_id: UUID;
  question_id: UUID;
  is_correct: boolean;
  points_awarded: number;
  confidence: number | null;
  feedback: string | null;
}

export interface AttemptResult {
  attempt_id: UUID;
  exam_id: UUID;
  status: "completed";
  attempt_number: number;
  max_attempts: number;
  attempts_remaining: number;
  score: number;
  earned_points: number;
  total_points: number;
  answered_questions: number;
  total_questions: number;
  completed_at: ISODateTimeString;
  spent_time: number;
  answers: GradedAttemptAnswer[];
}

export type AttemptResultResponse = ApiEnvelope<AttemptResult>;
export type FinishedAttemptResponse = AttemptResultResponse;

// Dashboard statistics and learning events

export type StatisticsPeriod = "week" | "month" | "all";

export interface UserStatisticsParams {
  period?: StatisticsPeriod;
  timezone?: string;
}

export interface StatisticsOverview {
  average_score: number;
  completed_exams: number;
  total_exams: number;
  notebooks_dominated: number;
  total_notebooks: number;
  total_study_seconds: number;
}

export interface ReinforcementNotebook {
  notebook_id: UUID;
  name: string;
  mastery_percent: number;
  flashcards_count: number;
  exams_count: number;
}

export interface LearningPoint {
  date: ISODateString;
  exams_completed: number;
  flashcards_reviewed: number;
  study_minutes: number;
}

export interface UpcomingNotebook {
  notebook_id: UUID;
  name: string;
  due_date: ISODateTimeString;
}

export interface StreakDay {
  date: ISODateString;
  active: boolean;
}

export interface StreakStatistics {
  current_days: number;
  best_days: number;
  days: StreakDay[];
}

export interface NotebookStudyTime {
  notebook_id: UUID;
  name: string;
  study_seconds: number;
  percentage: number;
}

export type LearningActivityType = "study_session" | "flashcard_reviewed";

export interface RecentActivity {
  activity_type: string;
  occurred_at: ISODateTimeString;
  notebook_id: UUID | null;
  notebook_name: string | null;
  description: string;
  quantity: number;
  duration_seconds: number;
}

export interface UserStatistics {
  overview: StatisticsOverview;
  reinforcement: ReinforcementNotebook[];
  learning: LearningPoint[];
  upcoming: UpcomingNotebook[];
  streak: StreakStatistics;
  time_by_notebook: NotebookStudyTime[];
  recent_activity: RecentActivity[];
  generated_at: ISODateTimeString;
}

export type UserStatisticsResponse = ApiEnvelope<UserStatistics>;

export interface StudySessionLearningEventPayload {
  notebook_id: UUID;
  activity_type: "study_session";
  quantity?: 1;
  duration_seconds: number;
}

export interface FlashcardReviewLearningEventPayload {
  notebook_id: UUID;
  activity_type: "flashcard_reviewed";
  quantity: number;
  duration_seconds?: number;
}

export type CreateLearningEventPayload =
  | StudySessionLearningEventPayload
  | FlashcardReviewLearningEventPayload;

export type LearningEventPayload = CreateLearningEventPayload;

export interface LearningEvent {
  event_id: UUID;
  user_id: UUID;
  notebook_id: UUID;
  activity_type: string;
  quantity: number;
  duration_seconds: number;
  occurred_at: ISODateTimeString;
}

export type LearningEventResponse = ApiEnvelope<LearningEvent>;
