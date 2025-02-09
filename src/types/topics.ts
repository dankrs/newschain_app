export interface TopicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

export interface PredefinedTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category?: TopicCategory;
}

export interface UserTopic {
  id: string;
  predefined_topic_id?: string;
  custom_topic_name?: string;
} 