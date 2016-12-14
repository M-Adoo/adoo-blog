---
title: 第八章（3） 基数排序（Radix Sort）
date: 2011-10-02 16:37
categories: Introduction to Algorithm -third edition
tags: c++, 算法导论, 快速排序
override_permailink: /algorithm/introductiontoalgorithm/第八章（3）-基数排序（radix-sort）
mathjax: true
---

### 算法模型

基数排序是一种用在老式穿卡机上的算法。至于穿卡机是怎么使用基数排序的，你可以
参考算法导论第八章的描述。

在之前两种比较排序——合并排序与快速排序中我们使用一种“分而治之”的策略，基数排
序则使用另一种与之有有异曲同工之妙的策略。无论是合并排序还是快速排序，我们讲
究的是在数组级别的“分而治之”；而基数排序我们讲究的是在元素级别的“分而治之”，
例如我们将一个三位数分成，个位，十位，百位三部分。

我们先来看一个实例，假如，我们要对七个三位数来进行排序，依次对其个位，十位，
百位进行排序，如下图：

![][image1]

很显然，每一位的数的大小都在[0，9]中，对于每一位的排序用[计数排序][]再适合不过。

### 算法复杂度

对于n个d位数而言,如果[计数排序][]的Stable Sort[^注1]的算法复杂度为θ(n+k)，那么
其本身的算法复杂度为θ(dn+kd)。这个就不用证明了。

### 进阶

到目前为止，基数排序似乎并不是太实用。首先，你发现好像位数是个麻烦事，比如
一组数中间，既有是一位的，也有十位的，这时候似乎就不好用了；其次，如果一列
数中间有负数，似乎也死翘翘了。还有就是，这哥们能排浮点数吗？
  
当你看到某些教程或者文章的时候，作者会郑重提醒你，排序的数必须是整数，而且
整数还不够还要必须是正数。其实对于负数也是可以的，对于实数也同样是可以的，
在后面我会给出一个C++实现的对整数（正负数不论）进行基数排序的代码。

其实，基数排序排序关键还是基于位，对于我们来讲讲位是基于十进制的。但对于计
算机来讲，什么八进制，十进制，十六进制都是浮云，最实在的还是二进制。所以对
于我们来讲int型5和55555两个数的位数是不一样的，一个一位，一个五位，但对于
计算机来讲他们的位数是一样的，都是32位。

当然，基于二进制的时候我们不是按一位一位来排，我们要按几位几位来排，选多少
位最合适？在选多少位之前，我们先总结一条定理。
  
**定理**：对于n个b-bit位的元素和一任意正数`r <= b`（r代表基数排序选取的位数）
，在Stable Sort的时间复杂度为θ(n+k)的情况下，基数排序的时间复杂度为
\\(\theta((b/r)(n + 2^r))\\)。

证明：每一次对r位进行排序，则总共进行b/r次Stable Sort排序。每一次选r位，显
然k=2（k为[计数排序][]的范围）的r次方。所以
\\(\theta(d(n+k)) = \theta((b/r)(n + 2^r))\\)。算法导论给出说明：当`b<lgn`
时，r=b可以得到最小复杂度；当b\>=lgn时，r=lgn有最小复杂度。原谅我不
能给出数学上的证明。

### 实例

回到之前说的关于有负数的时候怎么排序的问题上来，我们要注意的一点事和I负数在
内存中存储的是补码。也就是说在我们基于二进制来进行排序的时候负数是用其补码
来排序的而不是本身，所以经过基数排序以后会得出这样的序列，所有的正数在一边，
所有的负数在一边，正数的一边是有序的，负数的一边也是有序的。但是正数的一边
本应该是负数的位置，而负数的一边本应该是正数的位置。比方，我们对3，2，5，-1，
-4，-2，-3排序后的结果会是：2，3，5，-4，-3，-2，-1.显然对于这样一个序列，
只要在排序后将正数序列和负数序列互换位置就可以了。

对整数进行基数排序的C++代码：

    ```cpp
    //RadixSort.h
    //By Adoo
    //2011/10/2

    #ifndef RADIX_SORT
    #define RADIX_SORT
    #include<deque>
    #include<iterator>

    template<typename InIt>
    void RadixSort(InIt BegIt,InIt EndIt )
    {
        int byte=8*sizeof(*BegIt);
        int count=std::distance (BegIt,EndIt);
        int size=std::log(double(count))/std::log(double(2));
        size=byte<size ? byte : size;
        int from=1;

        do
        {
            RadixCounting(BegIt,EndIt,from,size);
            from+=size;
        }while(from<byte);

        for(auto index=BegIt;index!=EndIt; ++index)
        {
            if(*index<0)
            {
                std::vector< std::iterator_traits<InIt>::value_type > vec(index,EndIt);
                vec.insert(vec.end(),BegIt,index);
                std::copy(vec.begin(),vec.end(),BegIt);
                return;
            }
        }

    };

    template<typename InIt>
    void RadixCounting(InIt BegIt,InIt EndIt ,const int From, const int Size)
    {//counting sort the elements form BegIt to EndIt base on the Size bits from From;

        //the counter
        int capa=std::pow(double(2),Size);
        std::vector<int> Counter(capa,0);

        int clip=capa-1;
        for(auto Index=BegIt;Index!=EndIt;++Index)
            ++Counter[((*Index)>>From-1)&clip];

        for(int i=1;i!=capa;++i)
            Counter[i]+=Counter[i-1];

        std::vector<int> Result(Counter[capa-1],0);
        for(std::reverse_iterator<InIt> RIter(EndIt),REnd(BegIt); RIter!=REnd ;++RIter)
        {
            int index=((*RIter)>>From-1)&clip;
            Result[ Counter[index]-- -1]=*RIter;
        }
        std::copy(Result.begin(),Result.end(),BegIt);
    }

    #endif
    
对于浮点数呢？（尾数，指数...）。   
基数排序虽然是线性排序，但在实际应用中它反而有可能比快速排序要慢，因为
其常数因子可能远大于快速排序的常数因子。例如，在性能较差的机器上，快速
排序在Cache的利用效率上要比基数排序高很多。在内存空间紧张的情况下，应当
选择快速排序类的原地排序算法。
  
我做了一个小小的测试。

数据量 | RadixSort | QiuckSort
-------|-----------|----------
1k     |  15       | 16
10k    | 125       | 265
50k    | 672       | 1469
100k   | 922       |  3141
500k   | 4975      | 19125
1000k  | 11844     | 36025

（单位：毫秒） 
对同一组随机数，基数排序和快排分别测试五次取平均值。Cpu：E5200,内存：4G。
100万后的数据测不下去了，cpu太慢，不知道等多久，不同的机器上，应该有很多
差别。

[计数排序]: http://www.roading.org/algorithm/introductiontoalgorithm/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA-%E7%AC%AC%E5%85%AB%E7%AB%A02-%E8%AE%A1%E6%95%B0%E6%8E%92%E5%BA%8Fcounting-sort.html
[image1]: http://www.roading.org/images/2011-10/wps_clip_image-1844_thumb.png
[^注1]: 所谓Stable Sort是指相等的元素在排序完成之后能保持排序之前的相对顺序。