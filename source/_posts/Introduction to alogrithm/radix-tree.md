---
title: Radix Tree 基数树
date: 2011-12-21 21:12
categories: Introduction to Algorithm -third edition
tags: Problem, radix tree, 笔记
override_permailink: /algorithm/introductiontoalgorithm/radix-tree-基数树
mathjax: true
---

###《算法导论》课后习题 12-2 解答。
> **Problems 12-2: Radix trees**
>
> Given two strings \\( a = a_0 a_1 \dots a_p and b = b_0 b_1 \dots b_q\\),
> where each \\( a_i \\) and each \\( b_j \\) is in some ordered set of
> characters, we say that string a is **lexicographically less than**
> string b if either
>
> 1. there exists an integer j, where \\( 0 \leq j \leq min(p, q) \\),
>    such that \\( a_i = b_j \\) for all \\( i = 0, 1, \dots, j - 1\\),
>    and \\(a_j < b-j\\)or
> 2. \\(p < q\\) and \\(a_i = b_i \\) for all \\( i = 0, 1, \dots, p\\).
>
> For example, if a and b are bit strings, then 10100 < 10110 by rule 1 
>(letting j = 3) and 10100 < 101000 by rule 2. This is similar to the
> ordering used in English-language dictionaries.
>
> The **radix tree** data structure shown in Figure 12.5 stores the bit
> strings 1011, 10, 011, 100, and 0. When searching for a key
> \\( a = a_0 a_1 \dots a_p \\), we go left at a node of depth i if
> \\( a_i = 0 \\) and right if \\( a_i = 1\\). Let S be a set of distinct
> binary strings whose lengths sum to n. Show how to use a radix tree to
> sort S lexicographically in \\( \theta(n) \\) time. For the example in
> Figure 12.5, the output of the sort should be the sequence 0, 011, 10,
> 100, 1011.
>
> ![image](http://www.roading.org/images/2012-01/image_thumb5.png)
>
> Figure 12.5: A radix tree storing the
> bit strings 1011, 10, 011, 100, and 0. Each node's key can be
> determined by traversing the path from the root to that node. There is
> no need, therefore, to store the keys in the nodes; the keys are shown
> here for illustrative purposes only. Nodes are heavily shaded if the
> keys corresponding to them are not in the tree; such nodes are present
> only to establish a path to other nodes.

**Solution:**很显然，对于上述的Radix tree进行排序，可以通过中序遍历先序遍历完成。
只需在遍历过程中判断key是否存在即可，而上述中可以通过节点是否为白色来判断。

上面的问题虽然解决，但是我觉得这个基数树这个数据结构比较特别和有用，我思考它用在
哪个方面比较有优势，却又不能总结出一二，只好求助于维基百科，特摘录一段如下
([原文地址](http://en.wikipedia.org/wiki/Radix_tree))：

> #### Applications
>
> As mentioned, radix trees are useful for constructing [associative
> arrays][] with keys that can be expressed as strings. They find
> particular application in the area of [IP][] [routing][], where the
> ability to contain large ranges of values with a few exceptions is
> particularly suited to the hierarchical organization of [IP addresses][]
> They are also used for [inverted indexes][] of text documents in [information retrieval][].

无奈的是，上面列举的几个应用方面我都不太熟悉。只好先标记，留待以后发掘吧。

[associative arrays]: http://en.wikipedia.org/wiki/Associative_array
[IP]: http://en.wikipedia.org/wiki/Internet_Protocol
[routing]: http://en.wikipedia.org/wiki/Routing
[IP addresses]: http://en.wikipedia.org/wiki/IP_address
[inverted indexes]: http://en.wikipedia.org/wiki/Inverted_index
[information retrieval]: http://en.wikipedia.org/wiki/Information_retrieval
