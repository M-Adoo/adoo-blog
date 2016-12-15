---
title: Chapter 12 二叉搜索树(Binary Search Tree) 2
date: 2011-12-15 21:39
categories: Introduction to Algorithm -third edition
tags:
	- binary search tree
	- 笔记
	- 算法导论
override_permailink: /algorithm/introductiontoalgorithm/chapter-12-二叉搜索树binary-search-tree-2
---

### 前驱和后继(Successor and predecessor)

所谓前驱和后继(也许这么翻译，并不太正确，姑且这么叫)是指，指定元素在所有元素顺序排列模式下的前一个元素或后一个元素。

要获取一个二叉搜索树中指定结点的后继的直观的办法是，找到所有比指定结点大的结点中最小的。根据二叉搜索树的属性，找比某结点大的元素，可以往两个两个方向走：

1.	往右子树方向走，结点右子树的元素都不小于本身；
2.	往父结点方向走，**指定的结点有可能处于其它结点的左子树中**。

当指定结点拥有右子树时，那么其后继必存在于其右子树中。因往父结点方向找到的比指定结点大的元素大于指定结点右子树的所有元素。如果指定结点没有右孩子呢？那么沿着父结点的方向找到第一个其做字数包含指定结点的结点，这个结点就是指定结点的后继。

求后继的伪码：
	
```c
TREE-SUCCESSOR(x)
	if x.right ≠ NIL
		then return TREE-MINIMUM (x.right )
		y =x.p
	while y ≠ NIL and x == y.right
		x = y
		y = y.p
	return y
```

类似的方法可以被我们用来求前驱，这里省略。

### 插入和删除操作

对于插入操作很好解决，从根节点出发，不断比较，一路向下，直到不能再下，就会找到一个合适的位置。下面是伪码：

```c
TREE-INSERT(T, z)
	y = NIL
	x = T.root
	while x ≠ NIL
		y=x
			if z.key < x.key
				x=x.left
			else
				x = x.right
	z.p=y
	if y == NIL
		T.root=z                // Tree T was empty
	else 
		if z.key < y.key
			y.left = z
		else 
			y.right = z
```

至于删除操作，则要麻烦一些，因为删除结点后，我们必须维持搜索二叉树的属性。假定，被删除的结点为z,那么有三种情况:

1.	z没有孩子；
2.	z有一个孩子；
3.	z有两个孩子。

对于没有孩子和一个孩子这种情况比较容易解决，有一个孩子可以用孩子替代z，一个孩子都没有则用 NIL。麻烦的在于有两个孩子的情况，此时我们必须找到z在其**右子树中(仅仅是右子树范围中，而不是整个树中)**的后继来代替z 。在进行具体操作时，导论上则归纳为四点：

>* 	If z has no left child, we replace z by its right child. When z's right child is also NIL, z has no children; when z's right child is not NIL, z has one child.
>*	If z has just one child, it is a left child and we replace z by that child . 
>*	Otherwise z has both a left child and a right child. We find z's successor y which lies in z's right subtree and has no left child . We want to splice y out of its current position and have it replace z in the tree.
>	*	If y is z's right child (Fig. 12.4c), we replace z by y, maintaining y's right child.
>	*	If y is not z's right child,we first replace y by its own right   child, then replace z by y.


我一开始有一点迷惑，为什么要找在右子树中的后继，而不是其真正的后继，好处在哪，更进一步，为什么是后继，而不是其它。

首先，我思考了一下，有怎么样的目标？如果目标单单是维持搜索二叉树的属性的话，那么直接重新建树就好，多么节省脑细胞，显然我们不这样做。我们想找的是一种既能维持搜索二叉树的属性，又手术动得比较小的方式，这无疑比较简单高效，就如我们在做堆的删除工作时，将被删除元素与末尾元素互换的原理一样。

在这之后，我可以总结出这三条：

1.   范围可以缩小，要维持搜索二叉树的属性，只需将范围划定在以 z为根节点的子树中即可，因为其它部分的属性并未被破坏。
2.   进一步缩小范围，可以找到一个点来替代z，这样不必要涉及整个子树。什么样的点最适合替代z?z的后继或前驱。秉着关起门来解决自家问题的原则(参照上一条)，对于后继或前驱的选择，应在z的子树中选择，所以这个替代点便变成了右子树中的后继或左子树中的前驱。
3.   另外，不论是右子树中的后继，还是左子树中的前驱，都有一个优点，都最多只有一个孩子。因为拿掉这个结点而带来的问题容易解决。至于，为什么它们最多只有一个孩子？想一想，左子树中的前驱为左子树中的最大值，它的位置应该在哪？一路向右走到底。同样的思路，可以加之遇右子树中的后继。

以下是删除操作的伪码：

```c
TREE-DELETE(T,z)
	if z.left == NIL            
		TRANSPLANT(T,z,z.right)
	else if z.right == NIL       
		TRANSPLANT(T,z,z.left)
	else y = TREE-MINIMUM(z.right)
		if y.p ≠ z              
			TRANSPLANT(T,y,y.right)  
			y.right = z.right
			y.right.p = y
		TRANSPLANT(T,z,y)          
		y.left = z.left       
		y.left.p = y          

TRANSPLANT(T,u,v)
	if u.p == NIL       
		T.root = v
	else if u == u.p.left   
		u.p.left = v
	else u.p.right = v      
	if v ≠ NIL
		v.p = u.p
```

注意：伪码中的 TRANSPLANT，只修改 v 与 u的父亲之间的关系，而不修改与u孩子的关系。

关于随机构造搜索二叉树，用给定的一列的元素构造二叉树，假使这列元素是有序的，那么将构造成一根“棍子”，为了规避这种最坏情况的发生，可以采用随机构造二叉树的办法，导论上给出证明，随机构造的搜索二叉树的期望复杂度是O(lgn),精力所限，那个证明我就没有细看了。

### 补：关于删除操作为什么不在被删除结点上赋值

> Many texts, including the ﬁrst two editions of this book, have a
> somewhat simpler method of deleting a node from a binary search tree
> when both of its children are present. Instead of replacing node
> <font face="BatangChe">z</font> by its successor y, we delete node y
> but copy its key and satellite data into node
> <font face="BatangChe">z</font>. The downside of this approach is that
> the node actually deleted might not be the node passed to the delete
> procedure. If other components of a program maintain pointers to nodes
> in the tree, they could mistakenly end up with “stale” pointers to
> nodes that have been deleted. Although the deletion method presented
> in this edition of this book is a bit more complicated,it guarantees
> that a call to delete node <font face="BatangChe">z</font> deletes
> node <font face="BatangChe">z</font> and only node
> <font face="BatangChe">z</font>.

