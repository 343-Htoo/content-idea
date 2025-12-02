export interface ContentIdea {
  title: string;
  content: string;
  hashtags: string;
}

export interface GeneratedResponse {
  ideas: ContentIdea[];
}

export enum InputMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE'
}