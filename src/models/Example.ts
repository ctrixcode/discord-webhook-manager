export interface IExample {
  name: string;
  description: string;
  isDeleted: boolean;
  tags: string[];
  price: number;
  metadata: {
    category: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
