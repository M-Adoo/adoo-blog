---
title: 算法导论——B-trees
date: 2012-04-15 22:23
categories: Introduction to Algorithm -third edition
tags: B-trees, 算法导论, 笔记
override_permailink: /algorithm/introductiontoalgorithm/算法导论b-trees
mathjax: true
---

B-trees(叫“B树”还是“B-树”？我还是用它的英文名吧)，是一种为磁盘或
其它辅存设备而设计的平衡树。它与红黑树有些类似，但是在节省IO操作
上比红黑树表现的更好。很多数据库系统会用B-trees或它的变形来存储
信息。

B-trees的特点是，一个结点可以有n个关键字，这些关键字把一段数据划
分成n+1段，对应n+1个孩子，如下图所示：

![0][]

### B-trees的定义

一棵 B-trees T具有如下属性(设其根结点为T.root):

> 1.  Every node *x* has the following fields:
>
>     -   *x.n*, the number of keys currently stored in node *x*,
>     -   the x.n keys themselves, \\( x.key_1, x.key_2, \dots, x.key_{x.n}\\)
>         stored in nondecreasing order, so that
>         \\( x.key_i \leq x.key_2 \leq \dots \leq x.key_{x.n}\\),
>     -   *x.leaf* , a boolean value that is TRUE if *x* is a leaf and FALSE
>         if *x* is an internal node.
>
> 2.  Each internal node *x* also contains *x.n+1* pointers
>     \\( x.c_1, x.c_2, \dots, x.c_{x.n+1} \\) to its children. Leaf
>     nodes have no children, so their \\( c_i \\) fields are undefined.
> 3.  The keys \\( x.key_i\\) separate the ranges of keys stored in each
>     subtree: if \\(k_i\\) is any key stored in the subtree with root
>     \\(x.c_i\\), then\\( k_i \leq x.key_1 \leq x_2 \leq x.key_2 \leq \dots
>     \x.key_{x.n} \leq k_{x.n + 1} \\)
> 4.  All leaves have the same depth, which is the tree's height *h*.
>
> 5.  There are lower and upper bounds on the number of keys a node 
>     can contain. These bounds can be expressed in terms of a fixed 
>     integer *t* ≥ 2 called the ***minimum degree*** of the B-tree:
>
>     -   Every node other than the root must have at least *t* - 1 keys.
>         Every internal node other than the root thus has at least *t*
>         children. If the tree is nonempty, the root must have at least one
>         key.
>     -   Every node can contain at most 2*t* - 1 keys. Therefore, an
>         internal node can have at most 2*t* children. We say that a node
>         is ***full*** if it contains exactly 2*t* - 1 keys.

### 创建一棵空*B-trees*

  ```c
  B-TREE-CREATE(T)
      x = ALLOCATE-NODE()
      x.leaf = TRUE
      x.n = 0
      T.root = x

### 搜索操作:

搜索操作与二叉搜索树的搜索有点类似，两点不同之处在于：一是结点中可能有
多个key，二是往下走的时候有可能有多个子路。这些不同只在于选路的时候多
做点判断罢了。下面为伪码：

  ```c
  B-TREE-SEARCH(x, k)
    i =1
    while i ≤ x.n and k >x.keyi
       i = i + 1
    if i ≤ x.n and k == x.keyi 
       return (x, i)
    if x.leaf
        return NIL
    else return B-TREE-SEARCH(x.ci , k)

### 插入操作

参照二叉搜索树的插入操作，其实B-trees的整体插入思路也类似。但是要注意
一点，如果要插入的目标结点已经满了(即关键字的数目为2t-1)，这个时候并不
能直接插入，因为直接插入就会破坏B-trees的结点性质。解决之道为，将这个
已经满了的结点以其第t个关键字为界一分为二，并把第t个关键字抽取出来插入
到父结点相应位置。并不能等到确定了要插入的目的结点再决定分不分裂，而是
在下降的过程中遇到满结点就应当分裂，这样就可以保证要分裂的时候父结点总
不是满的。

分裂结点的伪码：

    ```c
    B-TREE-SPLIT-CHILD(x, i)
        z = ALLOCATE-NODE()
        y=x.ci 
        z.leaf = y.leaf
        z.n = t - 1
        for j = 1 to t - 1
              z.keyj = y.keyj+t 
        if not y.leaf
            for j = 1 to t
                 z.cj = y.cj+t 
        y.n = t - 1
        for j = x.n + 1 downto i + 1
              x.cj+1 = x.cj 
        x.ci+1 = z
        for j = x.n downto i
             x.keyj+1  = x.keyj 
        x.keyi  = y.keyt     x.n = x.n + 1

插入结点的伪码：

    B-TREE-INSERT(T, k)
        r =T.root
        if r.n = 2t - 1
            s = ALLOCATE-NODE()
            T.root=s
            s.leaf = FALSE
            s.n = 0
            s.c1 = r
            B-TREE-SPLIT-CHILD(s, 1)
            B-TREE-INSERT-NONFULL(s, k)
       else B-TREE-INSERT-NONFULL(r, k)

在非满根结点插入关键字的伪码(供上面B-Tree-INSERT 使用的一个辅助函数)：

    ```c
    B-TREE-INSERT-NONFULL(x, k)
     i = x.n
     if x.leaf
         while i ≥ 1 and k < x.keyi       
             x.keyi+1 =x.keyi   
             i = i - 1
        x.keyi+1 = k
        x.n=x.n+1
     else while i ≥ 1 and k < x.keyi
                i =i - 1
        i = i + 1
        if x.ci .n == 2t - 1
            B-TREE-SPLIT-CHILD(x, i)
        if k> x.keyi 
            i = i + 1
        B-TREE-INSERT-NONFULL(x.ci , k)

### 删除操作

删除操作要比插入操作更复杂一点，因为删除一个关键字的时候，这个关键字
不但可以在叶子结点，也可以在内部结点。算法导论的叙述虽然很严密与细致,
但却对解题思路的骨架并不突出。这一段笔记我试着抛开算导，完全按我自己
的思路来组织，而不是被他牵着鼻子走。（稳妥起见，你应该同时参照原书）：

从*B-trees*中删除关键字*key*无非两种情况，从一个叶子结点中删除或是从
一个非叶子结点中删除。我很难想到一种好的办法可以直接删除一个非叶子结
点中的关键字，又维持*B-trees*的属性。转念一想，能否把从非叶子结点中删
除转化为从一个叶子结点中删除呢？当然能的，既然是一棵树，如果我们把问
题从其所在的结点转移到其子结点，那么问题最终总能转移到叶子结点上。在
具体考虑如何把从非叶子结点中删除关键字转化为从叶子结点中删除关键字之
前，我们先要论证一下从叶子结点中删除一个关键字是否足够简单。如果从叶
子结点中删除一个关键字比从非叶子结点中删除一个关键字更加复杂，那么就
得不偿失了。

从叶子结点中删除一个关键字也可以分为两种情况:

1.  该叶子结点中的关键字的数目大于*t-1*,此时可以直接进行删除;
2.  叶子结点中的关键字数目恰巧等于*t-1*,这时直接删除会破坏*B-trees*
    的属性，而且破坏之后再进行修正也看得出来不是容易事。

到这里我们遇到了窘境，如果叶子结点中关键字的数目等于*t-1*,那么从中删
除一个关键字很复杂，那么如果我们避免这种情况出现呢？便如同进行插入操
作时有意的为分裂结点的操作，避免出现其父结点是满的情况一样。
到此为止，我们有了初步的算法模型骨架，分为三步：

1.  定位要删除的关键字所在的结点;
2.  将删除问题下降到叶子结点;
3.  从叶子结点直接删除关键字。

再完善其具体细节就可以得到以下算法模型：

1.  由根结点出发定位被删除关键字所在的结点，在整个下降过程中，应保证每
    一次下降的目的结点的关键字的数目至少为*t*(保证下降到叶子的时候
    *关键字*的数目大于*t-1*)。如果下降过程中遇到关键字的数目为*t-1*的目
    的结点*x*，那么可以具体如下做：
    -   如果*x*有一个相邻的兄弟*y*且其关键字的数目大于*t-1，*，那么可以
        从父结点下降一个合适的关键字给*ｘ*，并从*y*上升一个关键字给父结
        点，并妥善设置好相关孩子指针。
    -   如果*x*的两个相邻的兄弟关键字的的数目都为*t-1*，那么将*x*与其任
        意一相邻的兄弟合并，并从父结点下降相关关键字到合并的结点中间。

2.  如果*key*所在的结点是内部结点，设该结点为*x*，那么将问题下降到其子一
    级并保证第1点，递归处理其子一级。具体做法：
    -   若*key*的前驱所在结点的最少有*t*个关键字，那么可用其前驱替换掉
        key，问题就从删除key转变为删除*key*的前驱，并且下降了一级。
    -   若*key*的后继所在的结点最少有*t*个关键字,那么同体可以用*key*的
        后继替换*key*，问题得到转换并下降一级。
    -   如果*key*的前驱和后继所在的结点关键字数目都为*t-1*,那么令*x*合
        并这任意两个相邻的结点之一，并将*key*降下来，作为中间关键字，问
        题也得到下降。

3.  如果是叶子，直接删除。

参考：introduction to algorithm –third edition

[0]: http://www.roading.org/images/2012-04/0.png 
