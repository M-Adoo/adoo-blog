---
title: 桶排序（Bucket sort）
date: 2011-10-4
categories: Introduction to Algorithm -third edition
tags: 
	- 桶排序
	- Bucket sort
	- 算法导论
	- 笔记
override_permailink: /algorithm/introductiontoalgorithm/第八章（4）-桶排序（bucket-sort）
---


### 算法模型

桶排序假设待排序的一组数统一的分布在一个范围中，并将这一范围划分成几个 子范围，也就是桶。
将待排序的一组数，分档规入这些子桶。并将桶中的数据进行排序。
将各个桶中的数据有序的合并起来。
仔细想一想，这是不是一种“分治”策略呢？再仔细想一想，计数排序是不是桶排序的 一种特化呢？

** 复杂度：**

很显然桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为 其它部分的时间复杂度都为O(n);很显然，桶划分的越小，各个桶之间的数据越少，排 序所用的时间也会越少。但相应的空间消耗就会增大。

可以证明，即使选用插入排序作为桶内排序的方法，桶排序的平均时间复杂度为线性。 具体证明，请参考算法导论。其空间复杂度也为线性。

**示意图**

![bucket-sort](http://www.roading.org/images/2011-10/wps_clip_image-21187_thumb.png)

伪代码：

```
Bucket-Sort(A)
    let B[0..n-1] be a new array
    n = A.lenghtS
    for i = 0 to n - 1
        make B[i] an empty list
    for i = 1 to n 
        insert A[i] into list B[nA[i]]
    for i = 0 to n - 1
        sort list B[i] with insertion sort
    concatenate the lists B[0], B[1]....B[n - 1] togather in order
```

### 与基数排序排序的比较

基数排序与桶排序都为线性复杂度的排序算法，基数排序排序更稳定，但它的系数更大。桶排 序的时间复杂度，与待排序的数组的分布有关，最差情况下可以为O(n2)O(n2)。

总的来讲，以个人观点，基数排序与桶排序虽然复杂度为线性，但她们同时都会有各种限制， 其灵活性上有欠缺，相较于原地排序其空间要求也更高。所以有一利，总有一弊。但是，当我 们的待排序数组具备一些基数排序与桶排序要求的特性，且空间上又比较富裕时，桶排序与基 数排序不失为最佳选择。

### 实例

略