---
title: 排序之插入排序与合并排序-C++实现
date: 2011-9-10
categories: Introduction to Algorithm -third edition
tags: 
    - c++
    - 算法导论
    - 排序  
override_permailink: /algorithm/introductiontoalgorithm/插入排序-insertionsort-c实现
---


插入排序很简单，也好实现。下面是实现代码:

```cpp
//2011/7/17
#include<algorithm>
#include<limits>template  <typename  T>
T InsertionSort( const T& BeginIter, const T& EndIter)
{
    auto Iter=BeginIter;
    ++Iter;
    while(Iter!=EndIter)
    {
        auto Key=*Iter;
        std::reverse_iterator <T> RIter(Iter);
        std::reverse_iterator <T> RBeginIter(BeginIter);
        while(RIter!=RBeginIter && Key<*RIter)
        {
            auto Iter3=RIter;
            *--Iter3=*RIter++;
        }
        *--RIter=Key;
        ++Iter;
    }
    return Iter;
}
```

合并排序的核心思想则是将大的序列分成小的序列,再排序,然后将排好序的小序列合并.

下面是实现代码.

```cpp
//2011/8/16
template <typename T>
void MergeSort(const T& BegIter,const T& EndIter)
{    if(BegIter+1<EndIter)
    {
        auto MidIter=BegIter;
        advance(MidIter,distance(BegIter,EndIter)/2 );
        MergeSort(BegIter,MidIter);
        MergeSort(MidIter,EndIter);
        //CombineResult(BegIter,MidIter,EndIter);
        std::inplace_merge(BegIter,MidIter,EndIter);
    }
}
```