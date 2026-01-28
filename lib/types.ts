export type TreeNode = {
  id: number;
  name: string;
  children?: TreeNode[];
}

export type ActionReturn<T> =
  | { success: true; data: T }
  | { success: false; data: string };
