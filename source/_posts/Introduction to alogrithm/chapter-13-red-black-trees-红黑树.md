---
title: Chapter 13 Red-Black trees (红黑树)
date: 2011-12-25 22:43
categories: Introduction to Algorithm -third edition
tags: 
- 算法导论
- red black trees
override_permailink: /algorithm/introductiontoalgorithm/chapter-13-red-black-trees-红黑树
---

之前的[二叉搜索树][]提供了一系列算法复杂度为*O*(*h*)的基本操作：SEARCH,
MINIMUM, MAXIMUM, INSERT, DELETE SUCCESSOR and
PREDECESSOR。无疑，当树的高度比较小的时候这些操作有很好的效率，然而当二叉树总是“一条脚站立”时，树的高度就会很高，此时它效率并不会比链表快。红黑树即是一种从二叉搜索树上发展而来的“平衡”搜索树，它能保证在最坏情况下上述操作的复杂度为
*O*(lg*n*) .

### 红黑树的属性( Properties of red-black trees)

红黑树的每个结点需要在二叉搜索树的基础上多添加一个字段
*color*,用以表示结点的颜色(红或黑)。一棵红黑树必须满足以下五点属性：

> 1.  Every node is either red or black.
> 2.  The root is black。
> 3.  Every leaf (NIL) is black.
> 4.  If a node is red, then both its children are black.
> 5.  For each node, all paths from the node to descendant leaves
>     contain the same number of black nodes.

当然还有一点最基本但不言自明的属性：红黑树首先是一棵搜索树，所以之前关于[二叉搜索树][]的属性也同样适用于红黑树。“胁迫”红黑树满足于上述的五点属性，其目的完全在于得到一棵更加平衡的二叉树，也就是下面这条定理：

> **Lemma 13.1** A red-black tree with *n* internal nodes has height at most 2 lg(*n* + *1*).

要证明这条定理并不难，具体可以见 *Introduction to algorithm –third edition*第309页。

一棵红黑树的表示可以如图(a)；但是为了节省空间，我们可以设定一个哨兵来代替全部叶子，如图 (b)
的结构；为了简练，我们可以不画出叶子以及根结点的父亲。

![红黑树的结构][red-black-trees]

对于SEARCH, MINIMUM, MAXIMUM, SUCCESSOR 和 PREDECESSOR这几个不破坏树结构的操作，我们可以完全使用与实现二叉搜索树的这些操作的方法来实现这些操作，但对于INSERT, DELETE这两个会破坏树结构的操作，则需要有一些小小的变化——操作之后修复红黑属性。

### 旋转( Rotations )

在红黑树中插入或删除指定节点后，事情并没有完全结束。因为红黑树的属性可能被破话，所以我们需要恢复红黑树的属性。恢复红黑树的属性，我们需要对树中的一些结点重新着色和修改一些指针结构。对于修改指针结构我们通过旋转来实现。

旋转分为左旋和右旋，左旋的具体操作为：

> When we do a left rotation on a node *x*, we assume that its right
> child *y* is not T.*nil*; *x* may be any node in the tree whose right
> child is not T.*nil*. The left rotation "pivots" around the link from
> *x* to *y*. It makes *y* the new root of the subtree, with *x* as
> *y*'s left child and *y*'s left child as *x*'s right child.

示意图：

![红黑树的旋转][rotations]

左旋的伪代码：

```c
LEFT-ROTATE(T, x)
	y = x.right                 //set y
	x.right = y.left            //turn y's left subtree into x's right subtree
	if y.left != T.nil
		y.left.p = x
	y.p = x.p                   //link x's parent to y 
	if x.p == t.nil
		T.root = y
	else if x == x.p.left
		x.p.left = y 
	else x.p.right = y
	x.left = x                  //put x on y's left
	x.p = y
```

左旋操作在具体的红黑树中的演示：

![左旋操作演示][left-rotation-demo]

### 插入操作

红黑树的插入操作与二叉搜索树的插入操作非常相似，毕竟红黑树也是一种二叉搜索树。其伪代码为：
	
```c
RB-INSERT(T, z)
	y = T.nil
	x = T.root
	while x != T.nil
		y = x 
		if z.key < x.key
			x = x.left
		else
			x = x.right
	z.p = y 
	if y == T.nil
		T.root = z
	else
		if z.key < y.key
			y.left = z
		else 
			y.right - z
	z.left = T.nil
	z.right = T.nil
	z.color = RED
	RB-INSERT-FIXUP(T, z)
```

但也有两处小小的不同：

-   将 *z*的左孩子与右孩子都设置为 T.NIL 并将 *z* 的颜色设置为红色(第14-16行)。
-   由于可能破坏红黑树的红黑属性，所以要进行红黑属性修复操作——调用RB-INSERT-FIXUP函数(第17行)。

在看RB-INSERT-FIXUP的伪代码之前，先考虑一下，当我们在红黑树中插入*z*结点并将其设置为红色后，红黑树的属性有哪些被破坏了。

-   属性1(*Every node is either red or black.* )显然不会被破坏。
-   属性2(*The root is black。*)则不确定，当*z*被插入一棵空树时，
	*z*将成为该空黑树的根结点，并且是红色的。
-   属性3(*Every leaf (NIL) is black.* )，同样也没有问题，T.NIL始终没有改变。
-   属性4(*If a node is red, then both its children are black.*)是又一个
	有可能被破坏的属性，如果结点*z*的父亲是红色，那么属性将被破坏了。
-   属性5（*For each node, all paths from the node to descendant leaves
	 contain the same number of black nodes.*），也没有问题，因为插入的是一
	个红色结点，黑高度(Black-height)并不会改变。什么是黑高度？

> We call the number of black nodes on any simple path from, but not
> including, a node x down to a leaf the black-height of the node.

所以，红黑树的属性只有在这两种情况下被破坏：

1.  T是一颗空树，所以属性2被破坏。
2.  *z*的父亲是红色，因此属性4被破坏。

这时在来讨论RB-INSERT-FIXUP就更加具体了，RB-INSERT-FIXUP要做的工作就是修复上面两种情况下带来的属性破坏。对于第一种情况，可以很容易的修复，直接将根节点着色为黑就可以了。关键在于对第二种的修复工作。对于第二种情况的修复工作，可以归纳为三种情况：

**情况1，*z*的叔叔是红色。**

因为z的父亲和叔叔是红色，所以它的爷爷必然是黑色，其情况如下图所示：

![case1: z的叔叔是红色][case1]

此时我们只需将 *z*的父亲和叔叔着色为黑，并将*z*的爷爷着色为红，即可解决节点*z*和
其父亲都为红色带来对属性4的破坏，且不会带来新的属性破坏。但问题并没有就此解决，因
为*z*的麻烦虽然解决，但却转移到了它的爷爷身上，它的爷爷同样面临着可能与它的父亲
同为红色的问题。不过没关系，让*z*的爷爷成为新的*z*吧，我们再以新*z*的来修复属性。
好在即使问题一直存在，但却不断在向根结点移动，最终，我们可以简单的将根结点设置为黑
就能解决了。

**情况2，*z*的叔叔是黑色，且*z*是右孩子。**

对于情况2，对*z*进行一次左旋，并将*z*的左孩子设置为新的*z*就可以快速的将情况2转化为情况3了。

**情况3，*z*的叔叔是黑色，且*z*是左孩子。**

对于情况3，我们对其爷爷进行一次旋转操作，并将其父亲着色为黑，其爷爷着色为红，此时在并不破坏其它属性的情况下，可以解决属性4冲突的问题。

情况2和情况3的示意图如下(当*z* 的父亲为左孩子的情况)：

![case 2 and case 3][case2and3]

一开始，我以为情况1也可以用类似情况3的方法来解决问题，实际上是不行的，在情况1下进行类似情况3的操作后，*z*的爷爷与它的右孩子将都是红色的。

有了上面的分析，现在要来实现RB-INSERT-FIXUP就比较容易了。伪代码，如下

```c
RB-INSERT-FIXUP(T, z)
	while z.p.color == RED
		if z.p == z.p.p.left
			y = z.p.p.right
			if y.color == RED
				z.p.color = BLACK           //case 1
				y.color = BLACK             //case 1
				z.p.p.color = RED           //case 1
				z = z.p.p                   //case 1
			else
				if z == z.p.right           //case 2
					z = z.p                 //case 2
					LEFT-ROTATE(T, z)       //case 3    
			z.p.color = BLACK               //case 3
			z,p.p.color = RED               //case 3
			RIGHT-ROTATE(T, z.p.p)
		else(same as then clause
			whit "right" and "left" exchaged)
```

### 删除操作

红黑树的删除操作是以二叉搜索树为基础构建的，当然它要复杂一点点，因为在删除完成之后，它还要额外维持红黑属性。

同样，首先要实现一个“移植函数”RB-TRANSPLANT：

```c
RB-TRANSPLANT(T, u, v)
	if u.p == T.nil
		T.root = v
	else 
		if u == u.p.left
			u.p.left = v
		else
			u.p.right = v
	v.p = u.p
```

RB-TRANSPLANT与二叉搜索树中的 TRANSPLANT基本上没有不同。细微分别之处在于：

1.  使用 T.NIL 代替了TRANSPLANT中使用的NIL
2.  在最后一行代码中，即使 *v*等于T.NiL也可以给 *v.p*赋值。

删除操作的代码较之二叉搜索树的删除操作代码，虽然主体相近，但差异也明显：

```c 
RB-DELETE(T, z)
	y = z
	y-original-color = y.color  
	if z.left == T.nil
		z = z.right
		RB-TRANSLANT(T, z, z,right)
	else
		if z.right == T.nil
			x = z.left
			RB-TRANSLANT(t, z, z.left)
		else y = TREE-MINIMUM(z.right)
			y-original-color = y.color
			x = y.right
			if y.p == z
				x.p = y
			else
				RB-TRANPLANT(T, y, y.right)
				y.right = z.right
				y.right.p = y
			RB-TRANSPLANT(T, z, y)
			y.left = z.left
			y.left.p = y
			y.color = z.color
		if y-original-color == BLACK
			RB-DELETE-FIXUP(T, x)
```

-   多维持了一个结点*y*,可以看出，在*z*只有一个孩子时，*y*保存的是
	*z*的结点，而在 *z*有两个孩子时，*y*保存的是代替*z* 的结点。
-   另外由于 *y*的颜色可能改变，用 *y-orignal-color*保存了*y*原来的颜色。
-   还有一个*x*总是储存着*y*原来的位置。另外，在第13行，确保 *x.p*在
	*x*等于*T.NIL* 时也指向*y*。在前面*z*只有一个结点的情况中不需要类似13行的
	操作是因为，那种情况下，如果*x*等于*T.NIL*那么*T*就成为一棵空树了。
-   最后，根据*y-orignal-color*是否为空来决定是否进行对红黑树执行属性维护了。

为什么当*y-orignal-color*的颜色为红的时候不需要进行属性维护呢？原因在于：第一，y
记录的是“真正”被删除的节点，在*z*只有一个节点的情况下，*y*直接记录*z*，这自不必说。当*z*有两个节点的时候，*z*的位置被*y*替代，且*y*继承了*z*的颜色，所以此时*z*
的删除不会影响任何红黑属性，而真正会影响到红黑属性的是将*y*从原来的位置移除操作。第二，显然删除一个红色的结点，对整个树的红黑属性，不会有任何影响。

至此，最后的问题就是，怎么通过*x*来维护*T*的红黑属性了，也就是如何实现
RB-DELETE-FIXUP 子函数的问题了。

想一想，如果我们在移除 y 的时候，可以将*y*的黑属性外加给*x*，那么，*x*的颜色要么是“红-黑”，要么就是“黑-黑”，假使真的可以这样的话，那么红黑树的任何属性就就都不会被破坏了。实际上当然不能如此，但却不妨碍我们这么想：当*x*的颜色是红色，那么代表它应该是“红-黑”，当*x*的颜色是黑色，那么代表它应该是“黑-黑”。维护红黑属性的问题就变成了如何在不破坏红黑树属性的情况下拆分*x*的颜色了。

当 x 为“红-黑”时，我们可以很简单的将*x*直接设置为黑色就可以了，因为丢掉一个红色，不会带来任何问题，而当*x*为“黑-黑”时，我们就要分情况讨论了。可以分为四种情况：

**情况1：*x*的兄弟是红色。**

因*x*的兄弟是红色，那么*x*的兄弟的两个儿子和*x*的父亲都是黑色。可以通过一次旋转(*x*是左儿子执行左旋，右儿子则要执行右旋)，并给一些结点改变颜色,来达到将情况1,转换到x 的兄弟是黑色的其它情况，也就是2、3、4三种情况中的一种。如下所示：

![x的兄弟是红色][delete-case1]

上图所示，在没有带来任何其它属性破坏的情况下，一次右旋操作之后，x的兄弟变成黑色了。

**情况2：*x*的兄弟*w*是黑色，而且*w*的两个孩子都是黑色。**

这种情况下，我们可以从*x*的身上拿下一个黑色，并且将*x*的兄弟改变为红色，然后给它们的父亲外加上一个黑色，*x*成功解除了一个黑色，但它的父亲又成了新的‘*x*’，继续颜色分离之旅。如下图(白色表示颜色未知)：

![x的兄弟是黑色，且x的兄弟的两个孩子是黑色][delete-case2]

**情况3：*x*的兄弟*w*是黑色，而且*w*的左孩子是红色,右孩子是黑色。**

这种情况下，将*w*进行一次旋转，并进行相应颜色变换，变转换到了情况4。如下图：

![x的兄弟w是黑色，而且w的左孩子是红色,右孩子是黑色][delete-case3]

**情况4：*x*的兄弟*w*是黑色，而且*w*的右孩子是红色。**

此时，只需对*x*的父亲着色为黑并进行一次旋转，使得*w*代替它原来父亲的位置并继承其颜色，即可将*x*身上的一个黑色拿去。且所有的问题都解决了。示意图如下：

![x的兄弟w是黑色，而且w的右孩子是红色][delete-case4]

此时再来看，RB-DELETE-FIXUP 的伪码就显得很清晰了：

```c
RB-DELETE-FIXUP(T, x)
	while x  != T.root and x.color == BLACK
		if x == x.p.left
			w = x.p.left
			if w.color == red       
				w.color = BLACK                                         //case 1
				x.p.color = RED                                          //case 1
				LEFT-ROTATE(T, x.p)                                  //case 1
				w = x.p.right                                              //case 1
			if w.left.color == BLACK and w.right.color == BLACk
				w.color = RED
				x = x.p
			else 
				if  w.right.color == BLACK
					w.left.color = BLACK
					RIGHT-ROTATE(T, w)
					w = x.p.right
				w.color = x.p.color
				x.p.color = BLACK
				w.right.color  = BLACK
				LEFT-ROTATE(T, x.p)
				x = T.root
		else
			(same as them clause with "right" and "left" exchaged)
	x.color = BLACK
```

[二叉搜索树]: http://www.roading.org/algorithm/introductiontoalgorithm/chapter-12-%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91binary-search-tree.html
[red-black-trees]: http://www.roading.org/images/2011-12/thumb.jpg
[rotations]: http://www.roading.org/images/2011-12/image_thumb2.png
[left-rotation-demo]: http://www.roading.org/images/2011-12/image_thumb4.png
[case1]: http://www.roading.org/images/2011-12/image_thumb6.png
[case2and3]: http://www.roading.org/images/2011-12/image_thumb7.png
[delete-case1]: http://www.roading.org/images/2011-12/image_thumb11.png
[delete-case2]: http://www.roading.org/images/2011-12/image_thumb12.png
[delete-case3]: http://www.roading.org/images/2011-12/image_thumb13.png
[delete-case4]: http://www.roading.org/images/2011-12/image_thumb14.png

