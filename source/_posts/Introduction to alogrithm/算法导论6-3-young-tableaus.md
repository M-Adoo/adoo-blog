---
title: 算法导论6-3 young tableaus
date: 2011-09-24 12:16
categories: Introduction to Algorithm -third edition
tags: 算法导论, young tableaus
override_permailink: /algorithm/introductiontoalgorithm/算法导论6-3-young-tableaus
---

### Problems 6-3: Young tableaus

> An m × n Young tableau is an m × n matrix such that the entries of
> each row are in sorted order from left to right and the entries of
> each column are in sorted order from top to bottom. Some of the
> entries of a Young tableau may be ∞, which we treat as nonexistent
> elements. Thus, a Young tableau can be used to hold r ≤ mn finite
> numbers.
>
> 1.    Draw a 4×4 Young tableau containing the elements {9, 16, 3, 2,
> 4, 8, 5, 14, 12}.
>
> 2.    Argue that an m × n Young tableau Y is empty if Y[1, 1] = ∞. 
> Argue that Y is full (contains mn elements) if Y[m, n]< ∞.
>
> 3.    Give an algorithm to implement EXTRACT-MIN on a nonempty m × n
> Young tableau that runs in O(m + n) time. Your algorithm should use a
> recursive subroutine that solves an m × n problem by recursively
> solving either an (m - 1) × n or an m × (n - 1) subproblem. (Hint:
> Think about MAX-HEAPIFY.) Define T(p), where p = m + n, to be the
> maximum running time of EXTRACT-MIN on any m × n Young tableau. Give
> and solve a recurrence for T(p) that yields the O(m + n) time bound.
>
> 4.    Show how to insert a new element into a nonfull m × n Young
> tableau in O(m + n) time.
>
> 5.    Using no other sorting method as a subroutine, show how to use an
> n × n Young tableau to sort n2 numbers in O(n3) time.
>
> 6.    Give an O(m+n)-time algorithm to determine whether a given number
> is stored in a given m × n Young tableau.

当我们仔细分析这个问题的时候不难发现，young tableaus和堆非常相像,像堆的堆属性
一样young tableaus 有young tableaus属性。只要我们保证young tableaus的每个元素
总是小于它的所在行的下个元素以及它的所在列的下个元素，不就可以了。下面写一个与
[堆排序][]中MaxHeapfy类似的函数Tableaufy:下面是伪代码，伪代码的所有约定与算法
导论的伪代码约定一样。

    ```C
    Tableaufy(A,i,j)
        if(i < A.RowSize && A[i][j] < A[i+1][j])
            LargestRow=i+1
            LargestColum=j
        else
            LargestRow=i
            LargestColum=j
        if( j < ColumeSize && A[LargestRow][LargesttColume]< A[i][j+1] )
            LargestRow=i
            LargestColum=j+1
        if(LargestRow != i && LargestColum!=j)
            exchage A[i][j] with A[LargestRow][LargestColum]
            Tableaufy(A,LargestRow,LargestColum)

一二问省略不说。看第三问，很明显最小的元素是Young Tableaus的最前面一个元素。
我们只要把这个元素交换提取出来，然后给这个位置的元素赋值为无穷大，然后对第
一个元素调用Tableaufy就可以了。分析Tableaufy，最大的递归次数为m+n次，递归之
外函数的复杂度为O(1),所以函数的复杂度为O（m+n），所以我们用来解决第三问的办
法只需O（m+n）。具体实现在这儿就免了。

以此类推，第四问，第五问就很容易了，只需参照[堆排序][]的思路来解答就可以了。

参考：introduction to algorithm –third edition

[堆排序]: http://www.roading.org/algorithm/introductiontoalgorithm/%E5%A0%86%E6%8E%92%E5%BA%8F.html
