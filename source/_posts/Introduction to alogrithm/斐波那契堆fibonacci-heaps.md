---
title: 斐波那契堆(Fibonacci Heaps)
date: 2012-07-30 22:33
categories: Introduction to Algorithm -third edition
tags: algorithm, 算法导论, 笔记, fibonacci heaps
override_permailink: /algorithm/introductiontoalgorithm/斐波那契堆fibonacci-heaps
---

### 概览

斐波那契堆是由一组最小堆有序树组成，其中的每棵树都必须符合最小堆属性。
简单点，斐波那契堆是由一组有点特别的树组成。除了两个与元素删除有关的
操作（EXTRACT-MIN和DELETE）之外，它的其它操作都能在常数时间内完成。可
以看下斐波那契堆和二叉堆的运行时间对比表：

![time-table][]

### 结构

说白点，斐波那契堆由一组有根树组成，不过这些有根树都得是二项堆。大致
结构如下：

![][1]

有一个min指针指向了这些树根中关键字最小的一个。

对于每一个结点来说，除了关键字之外，至少还得有left、right、parent、child
四个指针、一个mark标记和一个degree计数，四个指针好说，分别用来指向左右兄
弟、父亲和任意一个孩子。至于mark标记则是用来标识一个非根结点是否已经失去
了一个孩子（这样的结点，不能在夺其子女了，可能要进行一些其它的特别操作），
实际上涉及到mark的操作并不多。degree则是用来统计该结点有几个儿子。丰满起
来的斐波那契堆就成了这样：

![][2]

### 基本操作

斐波那契堆包含MAKE-HEAP、INSERT、MINIMUM、EXTRACT-MIN、UNION、
DECREASE-KEY、DELETE等几项基本操作。建堆、插入、合并、和获得关键字最小的
结点这四个操作比想象的还要简单。建堆只需简单的初始化一下min指针和记录结点
数目的成员n即可；插入操作则是直接将结点插入到根链表中，这相当于进行一个循
环双向链表的插入操作；合并操作直接将两个斐波那契堆得根链表合二为一；获得
最小关键字的结点，更不必说，直接返回min指针即可。因此，对于MAKE-HEAP、
INSEST、MINIMUN、UNION这四个操作就不多费笔墨。主要关注一下EXTRACT-MIN和
DECREAS-KEY两个操作，而一旦实现了这两个操作，DELETE的实现则变得轻而易举。

#### EXTRACT-MIN

EXTRACT-MIN除了要提取出最小关键字的结点之外，其实还要对斐波那契堆的结构进
行整理。如果不进行整理的话，那么斐波那契堆就完全成了一个双向循环链表了。整
理到什么程度？直到根链表中所有的结点的degree值都不同！很奇怪之处在于，算导
上对于为什么以所有根结点的degree不同为指标，居然只字未提。不过就我观察，其
原因可能在于，当根结点的degree都不同的时候，此时的斐波那契堆就成了一个二项
堆或者近似二项堆。

EXTRACT-MIN可以分为三步走：

1.  将min的所有孩子取出加入到根链表中去；
2.  从根链表中移除min结点；
3.  整理斐波那契堆并获得新的min指针；

EXTRACT-MiN的伪码为：

    ```cpp
    EXTRACT-MIN(H)
        z = H.min
        if z != NIL
            for each child of z 
                add x to the root list of H
                x.p = NIL
            remove z from the root list of H
            if z == z.right
                H.min = NIL
            else
                H.min = z.right
                CONSOLIDATE(H)
            H.n = H.n - 1;
        return z

其中CONSOLIDATE函数正是用来整理斐波那契堆的，它创建一个数组A来暂存根结点，
并在遍历根链表的过程中将根结点degree相同的树合并。

其伪码如下（其中![][3]，且![][4]，具体证明见书本）：

    ```cpp
    CONSOLIDATE(H)
        let A[D(H.n)] be a new array
        for i = 0 to D(H.n)
            A[i] = NULL
        for each node w in the root list of H
            x = w
            d = x.degree
            while A[d] != NULL
                y = A[d]
                if x.key > y.key 
                    exchange x with y
                HEAP-LINK (H, y, x)
                A[d] = NIL 
                d = d + 1
            A[d] = x 
        H.min = NIL
        for i = 0 to D(H.n)
            if A[i] != NIL
                if H.min == NIL
                    create a root list for H contaning just A[i]
                    H.min = A[i]
                else
                    insert A[i] into H's root list
                    if A[i].key < H.min.key
                        H.min = A[i]
    HEAP-LINK(H, y, x)
        remove y from the root list of H
        make y a child of x, incrementing x.degree
        y.mark = false

看一个实例的演示图或许更加清楚明白：

![][5]

![][6]

### Decreasing a key

将一个关键字变小，有两种情况发生，一种是这个关键字变小以后还是比它的父结点
关键字大，这时候什么都不用做；但是如果关键字变小后比它的父结点关键字要小的
话，这时候可以将这个结点所在的子树直接移植到根链表中去。但是不管不顾的乱移
植，有可能带来各种怪异的树结构，典型的就是变成了一根棍子。于是，可以采取一
种折中的方式，当一个非根结点失去第二个孩子的时候，也将被移植到根链表中。这
可以保证根链表中的每棵树都是一个近似二项堆。伪码如下：

    ```cpp
    DECREASE-KEY(H, x, k)
        if k > x.key
            error "new key is greater than current key"
        x.key = k
        if y != NIL and x.key < y.key
            CUT(H, x,  y)
            CASCADING-CUT(H, y)
        if x.key < h.min.key
            H.min = xCUT(H, x, y)
        remove x from the child list of y, decrementing y.degree
        add x to the root list of H
        x.p = NIL
        x.mark = false
    CASCADING-CUT(H. y)
        z = y.p
        if z != NIL
            if y.mark == false
                y.mark = true
            else
                CUT(H, y, z)
                CASCADING-CUT(H, z)

删除操作则完全可以利用DECREASE-KEY配合EXTRACT-MIN两者完成，先将要删除结点的
关键字减小为无穷小，则提取最小关键字的结点就可以达到目的。

### 总结

总的来说，斐波那契堆可以在常数时间内进行进行插入、合并、减小关键字等操作，但
删除搜索等操作并不是其擅长。斐波那契堆并没有太多需要时刻保持的属性，这使得对
于插入、合并、减小关键字等操作变得轻而易举。但实际上它将很多的工作留在了提取
最小元素时来完成，所以这个操作实现起来复杂，运行起来耗时。

斐波那契堆将一些事情集中起来在某些操作上来处理，这就产生了一些被优化的操作，
所以斐波那契堆就变成了一个优点很鲜明的数据结构。尽管如此，但斐波那契堆对于工
程实践来讲，可能太过于复杂了，算导上就说：

> From a practical point of view, however, the constant factors and
> programming complexity of Fibonacci heaps make them less desirable than 
> ordinary binary(or k-ary) heaps for most applications, except for certain
> applications that manage large amounts of data.

它说呢，鉴于斐波那契堆的复杂性和常数因子可能较大，除了某些管理大数据的应用，
人们还宁愿用二叉堆。话说回来，它又说了，说斐波那契堆还是有蛮多理论研究价值
的![咬牙切齿][]。

参考：introduction to algorithm –third edition

[time-table]: http://www.roading.org/images/2012-07/image.png
[1]: http://www.roading.org/images/2012-07/image1.png
[2]: http://www.roading.org/images/2012-07/image2.png
[3]: http://www.roading.org/images/2012-07/image3.png
[4]: http://www.roading.org/images/2012-07/image4.png
[5]: http://www.roading.org/images/2012-07/image5.png
[6]: http://www.roading.org/images/2012-07/image6.png
[咬牙切齿]: http://www.roading.org/images/2012-07/wlEmoticon-baringteethsmile.png
