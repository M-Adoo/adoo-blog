---
title: 并查集(Disjoint Set)
date: 2013-07-18 18:00
categories: Introduction to Algorithm -third edition
tags: 算法导论, Disjoint set, 笔记
override_permailink: /algorithm/introductiontoalgorithm/Disjoint_set
mathjax: true
---

一些应用经常有这样的需求：查找一个包含某个元素的唯一集合，合并两个集合。
搜了一下google能够应用的地方还是挺多的，这里略去不表。

**并查集**又称不相交集，有两个名字的原因在于它原就有两个不同的英文名字，Disjoint
sets和Union-find set。更准确点应该说并查集是用来操作不相交集的数据结构。算法
导论上这一章就叫用于不相交集合的数据结构（Data Structures for Disjoint Sets）。
维基百科上也说：
> A union-find algorithm is an algorithm that performs two useful operations
> on such a data structure:
>
>- 	Find: Determine which subset a particular element is in. This can be used
> 	for determining if two elements are in the same subset.
>- 	Union: Join two subsets into a single subset.
>	Because it supports these two operations, a disjoint-set data structure is
>	sometimes called a union-find data structure or merge-find set. 

但一般说Disjoint Sets就指的是Data Structures for Disjoint Sets。

话休饶舌（最近金瓶梅看多了），转到并查集的正题上来。

### 并查集的操作

**并查集维持了一组不相交动态集合\\(S = \lbrace S_1, S_2,...,S_k\rbrace\\)，简言
之并查集就是一些互不相交的动态集合的集合。**假设\\(x\\)是某动态集合中的对象，那
么并查集应该支持以下操作：

-	MAKE-SET(x) 创建一个只有一个成员\\(x\\)的新集合，并要求\\(x\\)不在其它的
	集合中。
-	UNION(x, y) 合并\\(x,y\\)所在的集合。\\(x, y\\)所在的原集合都不再存在，一个
	新的集合产生。
-	FIND-SET(x) 返回包含\\(x\\)的集合。

### 并查集的一个应用

并查集众多应用中的一个就是用来确定无向图中的联通子图。对于图\\(G\\),我们用
\\(G.V\\)来表示它顶点的集合，用\\(G.E\\)来表示它所有边的集合。下图(a)是一个包含
四个联通子图的图。我们用并查集的操作来实现CONNECTED-COMPONENTS用以计算图的联通
子图，一旦CONNECTED-COMPONENTs执行，则可以用SAME-COMPONENT来判断两个顶点是否在
同一个联通子图上。下图(b)则说明了对图(a)执行CONNECTED-COMPONENTS的过程。

![graph][]

	CONNECTED-COMPNENTS(G)
		for each vertex in G.V
			MAKE-SET(v)
		for each edge (u, v) in G.E
			if FIND-SET(u) != FIND-SET(v)
				UNION(u, v)

	SAME-COMPONENT(u, v)
	 	if FIND-SET(u) == FIND-SET(v)
	 		return TRUE
	 	else
	 		return FALSE

#### 并查集的链表表示

下图(a)展示了一个用链表表示的并查集:每个集合都有其自己的链表表示。每个集合的
对象都有一个*head*指针指向链表的第一个对象，一个*tail*指针指向链表的最后一个
对象。每一个链表对象都有一个*next*指针指向链表中的下一个对象，以及一个指向集
合对象的的指针。

![link_disjoint_set][]

用链表表示的并查集实现MAKE-SET和FIND-SET都很容易，并且只需\\(O(1)\\),略去不表。
对于UNION的实现，则要复杂点。

#### UNION的简单实现

如上图(b)所示，实现UNION的最简单方法是将一个链表附加到另一个链表的最后。我们
可以很快的通过*tail*和*head*指针找到一个链表的第一个对象和最后一个对象，并将
两个链表链接起来，不过不幸的是我们还要将其中一个链表的所有对象中指向集合的指
针更新。

实际上，我们可以轻易的构建一个用于\\(n\\)个对象上的*m*个操作且需要\\(O(n^2)\\)
运行时间的序列。假设我们有对象\\(x_1,x_2,...,x_n\\)。我们用\\(n\\)个MAKE-SET来
创建\\(n\\)个并查集，并依靠\\(n-1\\)来将它们合并成一个并查集，所以
\\(m = 2n -1 \\)。最坏情况下，这\\(2n-1\\)个操作的顺序和用时是这样的：

Operation 					|		Number of objects updated
----------------------------|-----------------------------------
MAKE-SET(\\(x_1\\))			|					1
MAKE-SET(\\(x_2\\))			|					1
		.					|					.
		.					|					.
		.					|					.
MAKE-SET(\\(x_n\\))			|					1
UNION(\\(x_2, x_1\\))		|					1
UNION(\\(x_3, x_2\\))		|					2
		.					|					.
		.					|					.
		.					|					.
UNION(\\(x_n, x_{n-1}\\))	|					n

很显然这\\(2n-1\\)个操作的复杂度为：

\\[ m + \sum^{n-1}_{i=1}{i} = \theta(n^2)\\]

所有这\\(2n-1\\)个操作的平均复杂度在\\(\theta (n)\\)。

#### 加权合并(weighted-union)的启发策略

在最坏的情况下，合并的时候我们总是把一个长的链表合并到一个短的链表中去，于是
我们不得不更新更多的对象。反过来，假如在合并的时候我们总能把一个短的链表合并
到一个长的链表中去的话，则能保证我们每一次合并操作都以最合理的方式进行，而不
是依赖于运气了，而我们仅仅只需维持一个属性来代表链表的长度就能轻而易举的达到
上述目的。利用启发策略改进后的合并操作仍然需要\\(\omega(n)\\)的时间，假如两个
集合都有\\(\omega (n)\\)个成员的话。但是对于一个由MAKE-SET、UNION、FIND-SET
组成的大小为\\(m\\)，其中\\(n\\)个操作为MAKE-SET的操作序列来说，最多花费
\\(O(m + n\lg n)\\)，下面给出证明：

对于合并操作来说，我们最多执行\\(n-1\\)次操作。先来计算一下合并操作最多能花
费多少时间。合并操作的运行时间取决于更新链表中对象的指针的数目。换言之，
通过计算对象指向集合指针的更新次数就能计算出合并操作花费的总时间。对于对象
\\(x\\)来说，如果它指向集合的指针被更新，代表着它处在一个较短的链表中，那么当
\\(x\\)指向集合的指针第一次被更新的时候它所在的链表最少有两个成员，第二次被更
新时最少有4个成员，第三次最少有8个...，很显然对于\\(x\\)来说从始至终，它指向
集合的指针最多能被更新\\(\lg n\\)次，那么所有\\(n\\)个它们指向集合的指针最多
能被更新\\(n\lg n\\)次。

而除合并操作外的其它操作都只需要\\(O(1)\\)的时间，所以这个序列需要的总时间
为:\\(O(m + n\lg n)\\)。

### 不相交集森林

与之前用链表表示一个集合不同，不相交集森林用一棵树来表示一个集合。不相交集
森林如下图(a)表示的，每个结点代表一个成员都只包含一个指向父亲的指针，根节点
的父亲是自己。

![disjoint_set_forests][]

以这样的方式来实现并查集的三个操作：

> A MAKE-SET operation simply creates a tree with just one node. We perform
> a FIND-SET operation by following parent pointers until we find the root
> of the tree. The nodes visited on this simple path toward the root
> constitute the find path. A UNION operation, shown in Figure 21.4(b),
> causes the root of one tree to point to the root of the other

#### 可改进运行时间的启发式策略

但直接用这个简单的结构并不会有更快的速度，极端的情况是当一颗树成棍状时，它
和链表并没有什么区别。不过有两种方法可以对它进行优化——按秩合并(union by rank)
和路径压缩(path compression)。

**按秩合并(union by rank)** 和链表的加权合并非常类似，不过这里是根据树的高度
来合并，总是将矮的树合并到高的树中。对于每个结点，我们维持一个*rank*属性，用
来表示每个结点高度的一个上界。

**路径压缩**方法用在FIND-SET操作中，其具体做法就是在查找的过程中将查找路径上
的每一个结点都直接放到根结点下。**查找路径并不改变任何结点的***rank*[^1]。

#### 不相交集森林操作的伪码实现

	MAKE-SET
		x.p = x
		x.rank = 0

	UNION(x, y)
		LINK(FIND-SET(x), FIND-SET(y))

	LINK(x, y)
		if x.rank > y.rank
			y.p = x
		else
			x.p = y
			if x.rank == y.rank
				y.rank + 1

	FIND-SET(x)
		if x != x.p
			x.p = FIND-SET(x.p)
			return x.p

当同时使用到上述两种启发式策略时，不相交集森林\\(m\\)个操作的运行时间在
\\(O(m\alpha(n))\\),\\(\alpha(n)\\)的增长非常慢，在可以想象到的不相交集森林
的应用中，\\(\alpha(n) \leq 4\\),所以这个运行时间可以看作是线性的。也就是说
不相交集森林操作的平摊分析是\\(O(1)\\)。关于这个上限的证明，未曾吃透，也没
什么心情去细细看了，这篇笔记就只能如此草草记之了。


[graph]: http://www.roading.org/images/2013-07/graph.jpg
[link_disjoint_set]: http://www.roading.org/images/2013-07/link_disjoint_set.jpg
[disjoint_set_forests]: http://www.roading.org/images/2013-07/disjoint_set_forests.jpg
[^1]: 这句话配合前面按秩合并中将*rank*定义为一个结点高度的上限两个点让我很纠结了一阵，为什么改变压缩路径的时候不用改变*rank*？如此一来，不是有可能在进行合并的时候将高的树合到了矮的树上吗?还有为什么将*rank*定义为结点高度的上限，而不是准确的节点高度，如果是准确的结点高度，不就可以确保总是将矮的树合并到高的树上吗？显然这两个问题是纠缠在一起的。我想了许久，总是得到了一点明悟，对于一系列UNION操作而言，在这个过冲不论进行了多少次路径压缩，合并的顺序是不会发生变化的，该是谁合到谁上还是谁合到谁上，合并的效率也不会有差别。看上去对FIND-SET有一点影响，因为合并后的树高度可能偏高1，而这中情况的最坏结果是对于合并后的树的第一次FIND-SET有可能要多花费O(1)。这个开销对于每一次FIND-SET都要去维护一个准确的结点高度而言反而要更小了。