import {TreeNode} from "primeng/api";

export interface DataTreeTable<T> extends TreeNode {
   data : T; // as array
   children : TreeNode<T>[];
}
