---
title: Van Emde Boas trees
date: 2013-06-10 17:28
categories: Introduction to Algorithm -third edition
tags:
    - Exercises
    - 算法导论
    - van Emde Boas trees
override_permailink: /algorithm/introductiontoalgorithm/Van_Emde_Boas_trees
mathjax: true
---

van Emde Boas trees 支持所有优先级优先级队列的操作，并且巧妙的是它对于SEARCH, 
INSERT,DELETE,MINIMUM,MAXMUN,SUCCESSOR,和PREDECESSOR这些操作的支持都在最坏复
杂度\\( O(\lg{\lg n}) \\)之内。不过有些限制的是，所有的Kye值都必须在
\\( 0 \dots n-1 \\)之间，且不能有重复值。换言之，他的算法复杂度不由数据的规模
有多 大而决定，而由key值的取值范围而决定。

<!-- more -->

算导上这一章的讲述方式我非常喜欢，循序渐进，从最基础最简单的一个结构开始，最终
演化成Van Emde Boas trees，这样的方式更能让人捕捉到发明人思路发展的一个演变过
程，毫无疑问，这一章得多记点笔记。

### 基础方法

这部分会有三种方法来存储动态集合，尽管它们没有一个能达到\\( O(\lg\lg u) \\), 
但是通过这三种方法却能让我们得到理解Van Emde Boas trees的真知灼见。

#### Direct Address

Direct Addressing提供一种最简单的方法来存储一组数据。Direct Addressing直接用
一个大小为\\( u \\)的位数组\\( A[0..u-1] \\)来存储这组属于集合\\( \lbrace 0, 
1,2,...,u-1 \rbrace \\)的数。如果这组数中有\\( x \\),那么\\( A[x] \\)的值存1，
否则存0。

这种简单粗暴的方法，显然不能达到预期。对于INSERT、DELETE、MEMBER这些操作复杂
度在\\( O(1) \\)内。而对于MINIMUM、MAXMIMUM、SUCCESSOR、PREDECESSOR这些操作
每一个都要\\( \theta(u) \\)。我们不妨对Direct Addressing进行改进一下。几个
\\( \theta(u) \\)的操作皆因必须对数组进行迭代才能得到结果的缘故。那么如果我
们在Direct Addressing之上建立一棵二叉树想必有所改善。

#### Superimposing a binary tree structure

为了提高几个操作的效率，我们的数据结构由一个数组，演变成了下面的结构：

![binary_tree_array][]

二叉树中的结点存储着0或1，当两个孩子中有一个为1时它为1，只有当两个孩子都为0
的时候它才为0。

在Direct Addressing中花费\\( \theta(u) \\)的操作，依赖于这棵二叉树现在都有了
一个更低的上限\\( O(\lg{u}) \\)。但这个上限还并不理想，不然我们不如使用一棵
红黑树，好歹人家还是\\( O(\lg{n}) \\)的上限。如果把这棵树的高度降低，说不定
是一个突破口，姑且试试。

#### Superimposing a tree of constant height

要降低树的高度，我们可以直接通过增加树的度数来实现，将二叉树将变为多叉树。假
设全域的大小是\\( u = 2^{2k} \\),其中\\( k \\)是一个整数，那么\\( \sqrt{u} \\)
也是一个整数。

和在位数组上建立一棵二叉树不同，现在我们在位数组上建立一棵度数为\\(\sqrt{u}\\)
的树，如下图(a)。这棵树的高度是2。树中的每个结点存储了各子树的逻辑与结果。

如下图(b)所示，可以将那些结点看作是一个数组\\( summary[0..\sqrt{u}-1] \\),当
且仅当\\( A[i\sqrt{u}..(i+1)\sqrt{u}-1] \\)含1,\\( summary[i] \\)才为1。

![][constant_height_tree_array]

我们把\\( A \\)中的\\( \sqrt{u} \\)位的子数组称为簇，对于一个给定值\\( x \\),
位\\( A[x] \\)存在于第\\( \lfloor x/\sqrt{u}\rfloor \\)个簇中。现在INSERT将在
\\( O(1) \\)内完成——对于插入一个\\( x \\),分别将\\( A[x] \\)和\\(\lfloor x/ 
\sqrt{u}\rfloor \\)设为1。对于MINIMUM、MAXIMUM、SUCCESSOR、PREDECESSOR和
DELETE这些操作将花费\\( O(\sqrt{u}) \\)。具体操作不做赘述。

比起Superimposing a binary tree，现在的结构似乎反而更糟了，前者最差劲的操作
也只要\\( \lg{u} \\),现在都要\\( \sqrt{u} \\)了，但是透过这个结构带来了一点
新的想法，如果我们把数组\\( summary \\)也变作一个Superimposinga tree of
constant height怎么样，一路递归下去情况会如何?

### A recursive structure

前面用\\(\sqrt{u} \\)度数的树给了我们一个启示，假如我们能够把问题的规模以开平
方的规模缩小的话，会有一个什么效果？假设我们能做到以开平方的规模递归减小一个
数据结构的规模，而且每个操作在每一级递归上只产生一次新的递归调用，那么 对于一
个大小为\\( u \\)的数据结构的操作有： 
\\[ T(u) = T(\sqrt{u}) + O(1) \\]
令\\( m= \lg{u} \\), 有\\( u = 2^m \\)。那么可以有：
\\[ T(2^m) = T(2^{m/2}) + O(1)\\]
设\\( S(m) = T(2^m)\\),可得新方程：
\\[ S(m) = S(m/2) + O(1)\\]
可以得出\\( S(m) = O(\lg m) \\),回到\\( T(u) \\)上来，那么
\\( T(u) = T(2^m) = S(m) = O(\lg m) = O(\lg{\lg u}) \\)。

这个假设说明如果我们能够以递归方式以开平方的规模来缩小数据的规模大小，并在每
一级递归上花费\\( O(1)\\)的时间的话，我们这个假设的数据结构的操作的复杂度将
是\\( O(\lg{\lg u}) \\)。

围绕方程 \\( T(u) = T(\sqrt{u} + O(1)) \\),我们来设计一个递归的数据结构，以开
平方的规模来减小每一次递归的大小。当然，我们可能不能一步达到让所有的操作都达
到\\( O(\lg{\lg u}) \\),但是我们还是可以先设计出一个原型。自\\( u \\)起，我们
用一个\\( \sqrt{u} = u^{1/2}\\)项的数据结构来持有\\( u^{1/4} \\)项的，以
\\( u^{1/4}\\)项的递归持有\\( u^{1/8} \\)项的，以\\( u^{1/8} \\)项的递归持有
... \\( u=2^{2^k} \\)，如此，\\( u^{1/2}，u^{1/4},u^{1/8},... \\)都为整数。

对于一个全域为\\( \lbrace 0,1,2,...u-1 \rbrace \\)的van Emde Boas数据结构为原
型，我们简称为proto-vEB(u)。它遵循以下这些规则：

*   如果\\( u = 2\\),那么已是基础大小，那么它包含两个标志位\\( A[0...1]\\)
*   否则，\\( u = 2^{2^k} \\), 且整数\\( k \geq 1\\), 所以\\( u \geq 4 \\)，
    这时，proto-vEB(u)包含两个属性:
    
    *   一个名为summary指向proto-vEB(\\(\sqrt u\\))的指针。
    *   一个\\( \sqrt{u} \\)大的指针数组\\( cluster[0...1] \\)，其中每一个指
        针指向一个proto-vEB(\\( \sqrt u \\))。

*   如果cluster的第i个指针所指向的的集合含有元素，那么i也存在于summary所指向
    的集合中，否则i也不存在于summary中。

对于一个\\( u = 16 \\)的集合\\( \lbrace 2,3,4,5,7,14,15 \rbrace \\)情况就是
下面这样的：

![][proto_van_emde_boas]

在proto-VEB(u)中，一个给定值\\(x\\),那么他应该储存在proto-VEB(u)中cluster的
第\\( \lfloor{x}/\sqrt{u} \rfloor\\)个指针指向的proto-VEB(\\( \sqrt{u} \\))
的第\\( x \mod \sqrt{u} \\)个值。鉴于此，在分析各项操作之前，先定义几个有用
的工具函数：
\[ high(x) = \lfloor{x} / \sqrt{u} \rfloor \]
\[ low(x) = x \mod \sqrt{u} \] \[ index(x, y) = x\sqrt{u} + y \]

#### 判断一个值是否存在

    PROTO-VEB-MEMBER(V, x)
        if V.u == 2
            return V.A[x]
        else
            return PROTO-VEB-MEMBER(V.cluster[high(x)], low(x))

一个简单的递归查找，很显然，\\( T(u) = T(\sqrt u + O(1)\\),无疑复杂度为
\\( O(\lg\lg u) \\)。

#### 找最小值

从summary中得到最小值i，那么最小值必定存在于\\(cluster[i]\\)所表示的集合中，
在从\\(cluster[i]\\)表示的集合中得到最小值，结合i值可以得到全局的最小值。伪
码：

```
PROTO-VEB-MINIMUMN(V)
    if V.u == 2
        if V.A[0] == 1
            return 0
        else if V.A[1] == 1
            return 1
        else
            return NIL
    else
        min-cluster = PROTO-VEB-MINIMUM(V.summary)
        if min-cluster == NIL
            return NIL
        else
            offset = PROTO-VEB-MINIMUN(V.cluster[min-cluster])
            return index(min-cluster, offset)
```

复杂度
\\[ T(u) = 2T(\sqrt u) + O(1) \\] 设\\( u = 2^m\\) 
\\[ T(2^m) = 2T(2^{m/2}) + O(1) \\] 设\\(S(m) = T(2^m)\\),得：
\\[ S(m) = 2S(m/2) + O(1) \\]
\\[ T(u) = S(m) = \theta(m) = \theta(lg u) \\]

#### 找x的后继

1.  从x所在的子集中找后继
2.  找不到的话，先从summary中得到下一个子集的索引，从下一个子集中找最小值。
3.  转换成全局的值。

伪码：

```
PROTO-VEB-SUCCESSOR(V, x)
    if V.u == 2
        if x == 0 and V.A[1] == 1
            return 1
        else 
            return NIL
    else
        offset = PROTO-VEB-SUCCESSOR(V.cluster[high(x)], low(x))
        if(offset != NIL)
            retuen index(high(x), offset)
        else
            succ-cluster = PROTO-VEB-SUCCESSOR(V.summary, high(x))
            if succ-cluster != NIL
                offset = PROTO-VEB-MINIMUM(V.cluster[succ-cluster])
                return index(succ-cluster, offset)
            else
                return NIL
```
复杂度: 
\\[ T(u) = 2T(\sqrt u) + \theta(\lg{\sqrt u}) \\]
\\[ = 2T(\sqrt u) + \theta(\lg u) \\]
用与前文类似的方法可以化得\\( T(u) = \theta(\lg u\lg\lg u) \\)

#### 插入元素

一路向下递归插入，并将summary相应设为1即可。伪码：

```
PROTO-VEB-INSERT(V, x)
    if V.u == 2
        V.A[x] = 1
    else
        PROTO-VEB-INSERT(V.summary, high(x))
        PROTO-VEB-INSERT(V.cluster[high(x)], low(x))
```

复杂度和PROTO-VEB-MINIMUN一样
\\[ T(u) = 2T(\sqrt u) + O(1) \\]
即
\\(\theta(\lg u)\\)

#### 删除元素

相对于插入，删除要麻烦一点，因为不能直接从summary中删除元素。要确保相对应的
cluser所代表的子集不包含任何元素才能在smmary中置0。探查一个proto-VEB是否只
包含一个元素，以目前的结构可以有几种方式，但没有一种快于 \\(\theta(\lg u)\\)
的方式。也就是说PROTO-VEB-DELETE注定要超过 \\(\theta(\lg u)\\)。这儿先别急
着实现proto-VEB的删除操作，先来回顾一下，所有的基本操作我们都已经分析过一遍
了。拿最大值、最小值很慢，拿前驱、后继很慢，插入删除也要比预期的慢，似乎除
了MEMBER操作，所有的操作都很慢，但是仔细分析发现，找前驱慢是因为取最小值太
慢了，找后继慢是因为取最大值太慢了。插入慢是因为要额外对summary执行一次插入，
删除慢是因为对这个结构的判空慢，实际上插入和删除慢是因为同一个问题，没法快
速知道一个proto-VEB的尺寸和极限值。归根结底，这些操作慢的症结在于，没法快速
知道最大值最小值，因为知道最大值最小值以后，尺寸便能在\\(\theta(1)\\)之内得
到了。既然如此，我们不如直接将最大值，最小值直接记录在proto-VEB的结构中。
Van Emde Boas Trees的最终模型就得到了，给proto-VEB添加记录最大值和最小值的
两个属性。

### The van Emde Boas tree

先约定，将van Emde Boas tree简称为vEb。

在给proto-VEB加上min和max两个属性之前,还得有一个问题要解决，proto-VEB 要求
\\(u = 2^{2^k}\\)，这个要求显然有点太过苛刻了，现在我们把这个范围放宽到
\\(u = 2^k\\)。放宽要面对的第一个问题就是\\(\sqrt u\\)不一定是整数了，解决的
办法便是，我们的规模不再要求以开平方的规模来缩小了，而是以接近开平方的规模缩
小，简言之，原来将proto-VEB(u)分解为\\(\sqrt u\\)个proto-VEB(\\(\sqrt u\\)),
现在则是将vEB(u)分解成\\(\lceil (\lg u)/2 \rceil\\)个
vEB(\\(\lfloor (\lg u)/2 \rfloor\\))。直观起见，将
\\(\lceil (\lg u)/2 \rceil\\)用\\(\sqrt[\uparrow] u\\)表示,将
\\(\lfloor (\lg u)/2 \rfloor\\)以\\(\sqrt[\downarrow] u\\)表示，
\\(u = {\sqrt[\uparrow] u} \cdot {\sqrt[\downarrow] u}\\).

相较于proto-VEB结构上有以下两个变化：

*   增加min和max两个属性
*   对于\\(u = 2\\)的VEB来说，不需要数组\\(A[0..1]\\)了，因为min和max足以来
    记录两个值。
*   对于\\(u > 2\\)的VEB来说，min不储存在任何一个cluster中，但是max值要，
    为什么这么做，可以让在空集合中插入元素和删除集合中唯一元素的操作都为
    \\(O(1)\\)。

重新定义一下几个方法：
\\[high(x) = \lfloor x / \sqrt[\downarrow] u \rfloor \\]
\\[low(x) = x \mod \sqrt[\downarrow] u \\]
\\[index(x, y) = x \sqrt[\uparrow] u + y \\]

现在，vEB的结构应该是这样的：
![][veb_struct]
一个具体的例子:
![][veb_example]

#### 最大值和最小值

```
VEB-TREE-MINIMUN(V)
    return V.min
VEB-TREE-MAXIMUM(V)
    return V.max
```

#### 判断一个值是否存在

```
VEB-TREE-MEMBER(V, x)
    if x == V.min or x == v.max
        return TRUE
    else if V.u == 2
        return FALSE
    else
        return VEB-TREE-MEMBER(V.cluster[high(x)], low(x))
```

#### 后继

```
VEB-TREE-SUCCESSOR(V, x)
    if V.u == 2
        if x == 0 and V.max == 1
            return 1
        else 
            return NIL
    else if V.min != NIL and x < V.min
        return v.min
    else
        max-low = VEB-TREE-MAXMIUN(V.cluster[high](x))
        if max-low != NIL nad low(x) < max-low
            offset = VEB-TREE-SUCCESSOR(V.cluster[high(x)], low(x))
            return index(high(x), offset)
        else
            succ-cluster = VEB-TREE-SUCCESSOR(V.summary, high(x))
            if succ-cluster == NIL
                return NIL
            else
                offset = VEB-TREE-MINIMUN(V.cluster[succ-cluster])
                return index(high(succ-cluster), offset)
```

#### 前驱

略。

#### 插入元素

```
VEB-EMPTY-TREE-INSERT(V, x)
    V.min = x
    V.max = x
VEB-TREE-INSERT(V, x)
    if V.min == NIL
        VEB-EMPTY-TREE-INSERT(v, x)
    else if x < V.min
        exchange x with V.min
        if V.u > 2
            if VEB-TREE-MINIMUN(V.cluster[high(x)]) == NIL
                VEB-TREE-INSERT(V.summary, high(x))
                VEB-EMPTY-TREE-INSERT(V.cluster[high(x)], low(x))
            else
                VEB-TREE-INSERT(V.cluster[high(x)], low(x))
        if x > V.max 
            V.max = x
```

#### 删除元素

```
VEB-TREE-DELETE(V, x)
    if V.min == V.max
        V.min == NIL
        V.max == NIL
    else if V.u == 2
        if x == 0
            V.min = 1
        else
            V.min = 0
        V.max = V.min
    else if x == V.min
            first-cluster = VEB-TREE-MINIMUN(V.summary)
            x = index(first-cluster, VEB-TREE-MINIMUN(V.cluster[first-cluster]))
            V.min = x
        VEB-TREE-DELETE(V.cluster[high(X)], low(x))
        if VEB-TREE-MINIMUN(V.cluster[high(x)]) == NIL
            VEB-TREE-DELETE(V.summary, high(x))
        if x == V.max
            summary-max = vEB-TREE-MAXIMUN(V.summary)
            if summary-max == NIL
                V.max = V.min
            else
                V.max = index(summary-max, vEB-TREE-MAXMIMUN(V.cluster[summary-max]))
```

综合分析上面的几个操作，除了删除操作以外其它几个操作每一次递归调用都只产生一次
新的递归调用。根据前文的\\( T(u) = T(\sqrt{u}) + O(1) \\)公式，些操作 都是
\\(O(\lg \lg u)\\)。再仔细看下删除操作的第二次递归调用(在第16行)我们会发现,假
如这一次递归被调到，那么必然x所在的cluster只包含一个元素，这种情况下第一次递归
调用(在第14行)只花费常数时间(只执行1-3行代码)，换言之，第二个递归调用发生的情
况下，第一个递归调用必然能在常熟时间内完成。所以删除操作还是符合公式
\\( T(u) = T(\sqrt{u}) + O(1) \\)。

### 小结

Van Emde Boas Tree空间的大小依赖于\\(u\\)的大小而不是数据的规模，另外创建一个
Van Emde Boas Tree初始化的时间估计不会太少。当然这些都是可以优化的问题。

本文参考： Introduction To Algorithm ——third edition

[binary_tree_array]: http://www.roading.org/images/2013-06/binary_tree_array.jpg
[constant_height_tree_array]: http://www.roading.org/images/2013-06/constant_height_tree_array.jpg
[proto_van_emde_boas]: http://www.roading.org/images/2013-06/proto_van_emde_boas.jpg
[veb_struct]: http://www.roading.org/images/2013-06/veb_struct.jpg
[veb_example]: http://www.roading.org/images/2013-06/veb_example.jpg