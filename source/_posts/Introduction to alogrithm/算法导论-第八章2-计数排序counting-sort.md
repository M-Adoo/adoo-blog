---
title: 计数排序(Counting Sort)
date: 2011-09-30 21:54
categories: Introduction to Algorithm -third edition
tags: c++, Introduction to algorithm, 笔记
override_permailink: /algorithm/introductiontoalgorithm/算法导论-第八章2-计数排序counting-sort
---

与比较排序注重于元素之间的比较不同，计数排序专注于找准自己的位置，而不关心
自己比谁小，比谁大。其核心在于，对于任意一个属于数组A的元素x，统计出在A中有
多少个元素小于等于x,以确定x的位置。例如，有10个元素小于等于a那么a就应该排在
第11位。

### 算法模型：

假设对数组A[n]进行排序,A[n]中任意一元素x∈[0，k)。我们需要两个辅助数组，一个
为B[k],我们用来记录统计信息，另一个为C[n],用来储存排序结果。

1.  用下标i迭代数组A，用B[i]记录A中等于i的元素个数。
2.  迭代数组B，用B[i]记录小于等于i的元素的个数。
3.  根据B中的统计信息，将A中的元素放到C中合适的位置。

来看伪代码：

    ```cpp
    COUNTING-SORT(A, B, k)
        for i = 0 to k 
            c[i] = 0
        for j = 1 to A.length
            C[A[j]] = C[A[j]] + 1
        //C[i] now contains the number of elements equal to i
        for i = 1 to k 
            C[i] = C[j] + C[i - 1]
        //C[i] now contains the number of elements less than or equal to i
        for j = A.lenght downto 1 
            B[C[A[j]]] = A[j]
            C[A[j]] = C[A[j]] - 1

 
注意：第十行从后向前迭代能保护相等元素的相对位置，12行减1也是因为考虑到相等的
元素。

### 时间复杂度

计数排序具有线性复杂度，与任何一个比较排序相比，其复杂度都要低很多。

Θ（k）+Θ(n)+Θ(k)+Θ(n)=Θ(k+n)。

容我说道一下人生：人生如同排序，若你执着与世人较高较低，便总有烦劳忧愁，其路
也弯曲（nlgn）；若你心中自有定位，看淡争先落后，便自能泰然自若，其路也轻松
（线性）。特别是在我们学习技术的时候，若我们总在与人比较，又或者总计较于技术
间好坏的争论，就会落了下乘，重要的在于找准自己的定位。当然，回到技术层面，并
不是说非比较排序就一定比比较排序好，具体分析下一篇算法导论心得——基数排序
（Radix Sort）会讲到。

### C++实现

    ```cpp
    #ifndef COUNTING_SORT
    #define COUNTING_SORT
    #include<vector>
    template <typename InputIter,typename OutIter>
    void CountingSort(InputIter BegIter,InputIter EndIter,
        OutIter OutputIter, const int Boundary)
    {
        //the counter
        std::vector<int> Counter(Boundary,0);  
        for(auto Index=BegIter;Index!=EndIter;++Index)
            ++Counter[*Index];
        // Counter[] holds the number of input element equal to *index;
        for(int i=1;i!=Boundary;++i)
            Counter[i]+=Counter[i-1];
        //Now Counter[] contains the number of elements less than or eaual to i
        std::vector<int> Result(Counter[Boundary-1],0);
        for(std::reverse_iterator<InputIter> RIter(EndIter),REnd(BegIter); RIter!=REnd ;++RIter)
        {
            Result[Counter[*RIter]-1]=*RIter;
            --Counter[*RIter];
        }
        std::copy(Result.begin (),Result.end (),OutputIter);
    }
    #endif
