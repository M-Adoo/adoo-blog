---
title: 动态规划笔记（1）——Rod cutting
date: 2012-03-08 12:16
categories: Introduction to Algorithm -third edition
tags:
- dynamic programming
- rod cutting
- 算法导论
- 笔记
override_permailink: /algorithm/introductiontoalgorithm/动态规划笔记（1）rod-cutting
mathjax: true
---
动态规划（dynamic programming）,与“分治思想”有些相似，都是利用将问题分
为子问题，并通过合并子问题的解来获得整个问题的解。于“分治”的不同之处在
于，对于一个相同的子问题动态规划算法不会计算第二次，其实现原理是将每一
个计算过的子问题的值保存在一个表中。

动态规划一般被用于解决“最优解”问题。编写动态规划算法可以按照以下四个步
骤(引自原文)：

> 1. Characterize the structure of an optimal solution.   
> 2. Recursively define the value of an optimal solution.   
> 3. Compute the value of an optimal solution, typically in a bottom-up
>    fashion.   
> 4. Construct an optimal solution from computed information.

前三步可以求出最优解的值，如果仅是为了求出最优解的值，第四步可省略。第
四步用来获得最优解，这种时候通常要在第三步时维持一些额外的数据信息。

### Rod cutting

简单的理论之后，看一个切棒子(Rod cutting的撇脚翻译)具体问题。问题如下：
给你一根长*n*英尺的棒子和一份关于该棒子的价目表如下（其中 *i = 1,2,3,…,n*），请问如何将这根棒子卖出最高的价格，可以对棒子进行切割。

![][table]

#### 常规的解法

假设最优的切割方法是切为 k 段, 1 <= k <= n, 切割的方式为：

\\[ n = i_1 + i_2 + /dots + i_k \\].

则其总价格为：

\\[ r_n = p_{i_1} + p_{i_2} + /dots + p_{i_k} \\].

不像杂乱的切法，我们可以想象这样一种切法，每一刀切下去之后将棒子分为左右
两段，而下一刀总从右段下手，依此类推。那么：

![][1]

根据上述公式，可以很容易的写出相应的代码：

```cpp
CUT-ROD(p, n)
    if n == 0
        return 0
    q = -∞
    for i = 1 to n
        q = max(q, p[i] + CUT-ROD(p, n - i))
    return q
```

这段代码提供两个参数。p是一个数组，它存储着一份价目表，而n则表示要切割
的棒子的长度。当n不大时上述的算法或许简单管用，但是一旦n稍大，运行时间
将会成几何倍数增加。为什么会这样慢？其一，是因为其复杂度达到\\(O(2^n)\\),
另外则由于递归的次数太多了(多达\\(2^{n-1}\\)次)。

仔细观察不难发现，上述算法做了太多的重复工作，比方Cut-Rod(p,n),要递归
调用Cut-Rod(p,n-i), 其中 i=1,2,…,n。但对于其中Cut-Rod(p,n)中递归调用的
 Cut-Rod(p,n-1)又要重复计算 Cut-Rod(p,n-i-1)。

对于上述情况动态规划就能派上用场了。

### 用动态规划算法来切棒子

动态规划的想法很简单，利用一个表来存储子问题的解。只有表中没有这个子问
题的解的时候，才真正去求这个子问题的解并将该解保存到表中，否则直接用表
中的解。

一般有自顶向下和自下而上两种记忆法来实现动态规划。

自顶而下：

```c
MEMOIZED-CUT-ROD(p, n)
    let r[0...n] be a new array
    for i = 0 to n 
        r[i] = -∞
    return MEMOIZED-CUT-ROD-AUX(p, n, r)

MEMOIZED-CUT-ROD-AUX(p, n, r)
    if r[n] >= 0
        return r[n]
    if n == 0
        q = 0
    else 
        q = -∞
        for i = 1 to n 
            q = max(q, p[i] + MEMOIZED-CUT-ROD-AUX(p, n - i, r))
    r[n] = q
    return q
```

自上而下：
    
```c BOTTOM-UP-CUT-ROD(p, n)
    let r[0..n] be a new array
    r[0] = 0
    for j =1 to n
        q = -∞
        for i = i to j
            q = max(q, p[i] + r[j -i])
        r[j] = q
    return r[n]
```

上述的方法都只求出了最优的值，其解决方案并没有记录下来。也就是说对于切
棒子这个问题来说，只求出了最大的总价格，至于怎么切才能卖出这样的价钱并
没有解决。要想获得切法，则需要一个额外的数组来存取一些分割信息。

具体扩展后的伪码如下：

```c
EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
    let r[0..n] and s[0..n] be a new arrays
    r[0] = 0
    for j = 1 to n 
        q = -∞
        for i = 1 to j 
            if q < p[i] + r[j -i]
                q = p[i] + r[j-i]
                s[j] = i
        r[j] = q
    return r and s
```

上面代码中数组s用s[i]记录了长度为i的棒子的最优切法的第一部分长度，这
一点让我颇受启发。利用数组s可以轻易输出最优解法：

```c
PRINT-CUT-ROD-SOLUTION(p, n)
    (r, s) = EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
    while n > 0
        print s[n]
        n = n -s[n]
```

[table]: http://www.roading.org/images/2012-03/image_thumb.png
[1]: http://www.roading.org/images/2012-03/image_thumb3.png
