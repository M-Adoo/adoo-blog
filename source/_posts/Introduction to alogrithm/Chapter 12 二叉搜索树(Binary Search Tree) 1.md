---
title: Chapter 12 二叉搜索树(Binary Search Tree) 1
date: 2011-12-15
categories: Introduction to Algorithm -third edition
tags:
    - Binary Search Tree
    - 算法导论
    - 笔记
override_permailink: /algorithm/introductiontoalgorithm/chapter-12-二叉搜索树binary-search-tree
---

### 何为二叉搜索树？

> Such a tree can be represented by a linked data structure in which each node is an object. In addition to a key field and satellite data, each node contains fields left, right, and p that point to the nodes corresponding to its left child, its right child, and its parent, respectively. If a child or the parent is missing, the appropriate field contains the value NIL. The root node is the only node in the tree whose parent field is NIL.

> **binary-search-tree** property:Let x be a node in a binary search tree. If y is a node in the left subtree of x, then key[y] ≤ key[x]. If y is a node in the right subtree of x, then key[x] ≤ key[y].

### 遍历操作

可以用三种方式来遍历搜索二叉树：前序遍历(preorder tree walk)、中序遍历(inorder tree walk)、后续遍历(postorder tree walk)。其名字的由来，缘于根节点被呈现的次序，是在最前中间、还是最后。

对于搜索二叉树来讲，由于其固有的特性（***binary-search-tree property***），中序遍历是按节点大小顺序方式遍历二叉树的。看一个递归版本的中序遍历代码：

```
INORDER-TREE-WALK(x)
 if x ≠ NIL
    then INORDER-TREE-WALK(left[x])
        print key[x]
        INORDER-TREE-WALK(right[x])
```

因根结点不小于所有左子树的节点，且不大于所有右子树的节点，所以上面的中序遍历的伪代码，输出的结果将按照从小到大排列。虽然递归用来表现算法简单明了，但在实际应用中为了更好的效率，我们可能更希望有一个迭代版。关于迭代版，会在做本节的习题12.1-3 时在来实现，另外，在用C++实现二叉搜索树这个数据结构的时候，也会采用迭代版。

搜索以及求最大最小节点的操作

根据二叉搜索树属性，这些都是很简单的操作，以下为这些操作的伪码：

```
//搜索
ITERATIVE-TREE-SEARCH(x, k)
    while x ≠ NIL and k ≠ key[x]
        if k < key[x]
            then x = x.left
        else x = x.right
    return x
// 最小值
TREE-MINIMUM (x)
    while left[x] ≠ NIL
        x = x.left;
    return x
//最大值
TREE-MAXIMUM(x)
    while  x.right≠ NIL
       x=x. right
    return x
```
