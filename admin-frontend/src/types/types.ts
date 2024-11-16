export interface Setting {
  userId: string;
  name: string;
  logoImg: string;
  faviconImg: string;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

interface Attribute {
  key: string;
  value: string;
}

export interface Category {
  storeId: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  position: number;
  attributes: Attribute[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  parentCategory?: string | null;
}
