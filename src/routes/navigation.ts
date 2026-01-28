export type NavMenuItem = {
  label: string;
  to: string;
};

export type NavSection = {
  title: string;
  items: NavMenuItem[];
};

export const navigation: NavSection[] = [];
