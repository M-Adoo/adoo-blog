---
title: C++实现红黑树，仿STL封装
date: 2011-12-31 20:37
categories: Introduction to Algorithm -third edition
tags: red black trees, 算法导论, C++
override_permailink: /algorithm/introductiontoalgorithm/c实现红黑树，仿stl封装
---
在[*Chapter 13 Red-Black trees(红黑树)*][]这篇笔记中对红黑树的各种操作都有较详尽的伪码，
相信使用C++来实现也并不是难事，我要做的是，在实现的基础上要进行一定的封装。当然风格嘛，
自然参照STL，最终的结果就是要实现一个STL风格的红黑树模板。

在C++泛型编程中两个重要的概念即是容器和迭代器。我的目的则是要实现一个与STL中的其他容器
类似，但是以红黑树为基础的容器`RB_Tree`。当然，实际上STL中的map、multimap、set、
multiset其基础结构就是红黑树。在这儿、我主要尝试自己封装一个红黑树试试。

无论如何,从实现来讲，一个`rb_node`的类模板是需要的，不过它将作为 `RB_Tree`类中的一个嵌
套类，因为`RB_Tree`容器的使用者并不需要知道，`rb_node`实现。`rb_node`的实现：

    ```cpp
    template<typename Type>
    struct RB_Tree<Type>::rb_node
    {
            Type _value;
            rb_node  *_left;
            rb_node  *_right;
            rb_node  *_parent;
            RB_Color _color;
            rb_node()
                :_value(Type()),_left(NULL),_right(NULL),_parent(NULL),_color(red)
            {};
        };

其次，要定义一个供`RB_Tree`容器使用的迭代器，为了拥有`iterator_trait`它将继承自
`std::iterator`，当然完全可以自己通过宏定义来实现`iterator_trait` ，但毫无疑问继承的话可以
写更少的代码.声明如下：

    ```cpp
    template<typename Type>
    class RB_Tree<Type>::node_iterator: 
        public std::iterator<std::bidirectional_iterator_tag ,rb_node>
    {
    public:
        node_iterator(rb_node* n): _node(n){};
        Type& operator* () const;
        rb_node* operator –>()const; 
        node_iterator operator++ ();     
        node_iterator operator++(int); 
        bool operator ==( node_iterator r_iter); 
        bool operator !=( node_iterator r_iter); 
        rb_node* pointer(); 
        //…省略很多种运算符重载 
    private:
        rb_node* _node;
    ;

最后就是`RB_Tree`这个容器了类了，大体上是这样：

    ```cpp
    template<typename Type>
    class RB_Tree{
    private:
        struct rb_node;
        class node_iterator;
    public:
        typedef  node_iterator iterator;
        typedef const node_iterator const_iterator;    RB_Tree();
        ~RB_Tree();
        iterator begin();
        iterator end();
        iterator insert(Type value);    
        iterator eraser(iterator iter);
    private:
        rb_node* _root;
    public:
        static rb_node* _nil;

具体的实现代码，你可以下载[RB_Tree.hpp][]

当然还应该定义更多的接口，比方重载一个模板函数insert能够接受一对迭代器，将迭代器中间的
数据插入到红黑树中，等等。

值得注意的是，该封装实现，是以学习以及练习为目的的，所以有很多本应有但确没有实现的接口。
另一个原因则是这段时间太过忙碌。

如果将上面提到的迭代器类与之前在[仿STL的二叉搜索树的C++实现][]中的迭代器比较，其实发现，
它们提供的是一样的操作，所以完全可以将红黑树和二叉搜索树的结点类抽象出来，让迭代器类针
对其抽象类实现，这样一来这一个迭代器模板类就会适用于几乎整个由二叉搜索树派生而来的数据
结构了，将会大大提高代码的复用性。当然这个工作我没有做。

[*Chapter 13 Red-Black trees (红黑树)*]: http://www.roading.org/algorithm/introductiontoalgorithm/chapter-13-red-black-trees-%E7%BA%A2%E9%BB%91%E6%A0%91.html
[RB_Tree.hpp]: https://github.com/M-Adoo/Algorithm/blob/master/Coding/rbTree.hpp
[仿STL的二叉搜索树的C++实现]: http://www.roading.org/algorithm/introductiontoalgorithm/%E4%BB%BFstl-%E7%9A%84%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E7%9A%84c%E5%AE%9E%E7%8E%B0.html
