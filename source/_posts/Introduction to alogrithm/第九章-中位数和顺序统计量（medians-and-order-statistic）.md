---
title: 第九章 中位数和顺序统计量（Medians and Order Statistic）
date: 2011-10-17 20:38
categories: Introduction to Algorithm -third edition
tags: c++, 算法导论, 笔记, Order Statistic
override_permailink: /algorithm/introductiontoalgorithm/第九章-中位数和顺序统计量（medians-and-order-statistic）
mathjax: true
---

### 概览

本章主要讲的是如何来获取顺序统计量（Order statistic）,所谓第i个顺序统计量即
是指在一组数中的第i小的元素，中位数即是大小位于一组数中间的那个数，如果一组
数为偶数个，则有两个中位数，大的叫大中位数（upper medians 姑且这么翻译吧），
小的叫小中位数（lower medians）。可以先考虑几个问题：

1.  获取最大或者最小的元素，要比较多少次？
2.  同时获取最大或最小的元素，要比较多少次？
3.  通过排序来获取顺序统计量的话，是否合理？

### 9.1最大值，最小值问题

获取最大值或者最小值，可以通过一次遍历比较获得。对于规模为n的一组数，需要进行
n-1次比较。且这已经是最优方法，因为除了最小的数本身，其它剩余的数都必然要与一
个比它更小的数比较一次（不然如何能知道它自己不是最小的数？）。

### 同时获取最大值和最小值

我们可以简单的通过n-1次比较来获得最小值或最大值，那么如果同时获取最大值我们是
不是需要进行2n-2次比较呢?看起来2n-2次比较似乎不错了，毕竟它已经是一个线性复杂
度的算法了，但是我们其实可以做的更好。只需要3n/2次比较我们就可以得出最大值和
最小值，同样还是一个线性复杂度的算法，但其效率可以提高到将近原来的1.333倍。其
具体做法是：不直接进行关于最大值最小值的比较，而是先将n个数分对，每对数之间进
行比较，大的数只参加最大值的比较，小的数只参加最小值的比较。

具体实现略。

### 9.2以期望复杂度为线性获取第i个统计顺序量

很显然我们通过排序来获取第i个统计顺序量，这种方法无疑简单护脑。但是毫无疑问的
一点是，以排序来获取第i个统计量的话，这其中肯定有“浪费”，因为我们获取了一些我
们不需要的信息。所以，我们可以更优秀的算法，其期望复杂度为Θ(n) ，最坏复杂度为
\\(\theta(n^2)\\)。在这儿我们再一次用到“分治”思想，与[快速排序][]类似,我们先
利用一个中枢值将一组数分为两部分,一部分都大于中枢值,另一部分都小于中枢值。然后
判断出要求的统计量在哪部分，另一部分则可以抛弃——以此达到缩小问题规模的目的，
依此递归。

**伪代码为**
    
    ```C
    RANDOMIZED-SELECT(A, p, r, i)
        if p == r
            then return A[p]
        q = RANDOMIZED-PARTITION(A, p, r)
        k = q - p + 1
        if i == k          // the pivot value is the answer
            then return A[q]
        else
            if i < k
                then return RANDOMIZED-SELECT(A, p, q - 1, i)
            else return RANDOMIZED-SELECT(A, q + 1, r, i - k)

函数RANDOMIZED-PARTITION(A, p, r)为随机快排的辅助函数，其功能为在其目标数组A
的第p个到第r个元素之间，随机选取一个数作为中枢值，并以此将p-r分为两部分，并
返回其中枢值下标。参见[快速排序][]。

### C++实现

    //RadomizedSelect
    //by Adoo  2011/10/17#ifndef RADOMIZEDSELECT
    #define RADOMIZEDSELECT
    #include"QuickSort.h"template<typename Iter>
    Iter RadomizedSelect(Iter IBeg,Iter IEnd,int index)
    {
        if(std::distance(IBeg,IEnd)<2)
            return IBeg;
        auto apart=RadomPartition(IBeg,IEnd);
        // Don´t forget add 1;
        int i=std::distance(IBeg,apart)+1;
        if(index==i)
            return apart;
        else
            return index<i ? RadomizedSelect(IBeg,apart,index):RadomizedSelect(++apart,IEnd,index-i);   
    }
    #endif

注：代码中用到QuickSort.h头文件中的RadomPartition函数，具体实现可以见[快速排序][]
中源码中关于Partition函数的实现，唯一不同即是pivot的选取，Parition默认用最后一个
元素作为pivot，而RadomPartition使用随机元素作为pivot。

### 关于算法复杂度的证明

只能参考原书，没能沉下气看懂这一个证明。

### 9.3最坏情况下时间复杂度为线性的方法

核心思想在于：选取一个更好的元素作为中枢值来划分数组。假使该算法名为Select，五步：

1.  将n个元素按5个元素一组划分为n/5组，若n不能整除5，最后一组用剩余的数组成。
2.  查找每一组的中位数：
 
    1.  用插入排序对每一组进行排序。
    2.  选取每一组数的中位数。

3.  使用递归调用Select来获取由各组中位数组成的数组的中位数x。
4.  以x作为中枢值使用类似快排的方法来划分数组，假设中枢值为第k个元素，那么前k-1个
    元素小于中枢值,后n-k个元素大于中枢值。
5.  有三种可能：
    -   如果i=k，那么已经找到，返回x。
    -   如果i<k，递归调用Select来获取在小于中枢值分段的第i小的元素，并返回该数。
    -   如果i\>k，递归调用Select来获取在大于中枢值分段的第i-k小的元素，并返回该数。

### 伪代码

用自然语言来形容感觉有点复杂，我自己写了一段伪代码：

    ```C
    Select(A,p,r,i)
        index=p
        while true
            if(k > p)
                InsertSort(A,index-5,r)
                B.add(A[(r+index-5)/2])
                break
            else
                InsertSort(A,index,index+4)
                B.add(A[index+2])
                index=index+5
        pivot=Select(B,0,B.length,B.length/2)
        q=partition(A,p,r,pivot)
        k=q-p+1
        if(k==i)
            return pivot
        else
           retrun i<pivot ? Select(B,0,k-1,i) : Select(B,k+1,r,i-k)

### 关于算法复杂度的证明

勉强看懂，不证。

[快速排序]: http://www.roading.org/algorithm/introductiontoalgorithm/%E7%AC%AC%E4%B8%83%E7%AB%A0%EF%BC%881%EF%BC%89-%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F.html
