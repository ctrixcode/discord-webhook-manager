export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}
