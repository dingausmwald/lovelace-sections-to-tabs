export interface TabConfig {
  section: string;
  icon?: string;
  title?: string;
}

export interface LayoutConfig {
  mediaquery?: string;
  tabs?: TabConfig[];
}

export interface ViewConfig {
  type: string;
  layout?: LayoutConfig;
  sections?: SectionConfig[];
}

export interface SectionConfig {
  type: string;
  name?: string;
  cards?: any[];
}
