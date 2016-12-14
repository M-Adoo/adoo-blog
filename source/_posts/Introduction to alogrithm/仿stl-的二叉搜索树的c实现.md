---
title: 仿STL 的二叉搜索树的C++实现
date: 2011-12-17 23:37
categories: Introduction to Algorithm -third edition
tags: binary search tree, c++, 算法导论, stl, 笔记
override_permailink: /algorithm/introductiontoalgorithm/仿stl-的二叉搜索树的c实现
---

看完导论的Chapter 12 binary search tree后，不忘用C++实现一下这个
数据结构，学习算法的时候也锻炼下C++的编码能力。另则，若按照STL的
风格来封装搜索二叉树，一是可以培养良好的编程风格，也能好好体会STL
的设计思想。

模型：BST模板类中有两个嵌套模板类，一个为节点模板，一个为迭代器的
模板。

编写的时候也订了三条原则：

-   效率优先
-   接口都通过迭代器操作，不以指针直接进行操作。
-   节省时间，毕竟是学习之作，并不是所有应该实现的接口我都实现，
    只实现一些基本的。

如果你看到下面声明的接口中有很多显而易见的不合理之处，比方 BST
类居然没有接受一对迭代器的构造函数构造，也没有重载接受一对迭代
器版本的insert函数,一个双向迭代器类重载了自增操作符，却没有重载
自减操作符…，凡此种种，请不要惊讶以为此行的目的在于对数据结构的
学习，以及学习STL的设计思想，而不在于做重复的工作，下面是关于仿
STL的二叉搜索树的C++我实现了的部分的声明，如果你想看看实现的源码，
请[点击我][]

    ```cpp
    //BST.hpp     A data structure which be called  binary search tree 
    //  2011/12/17   By Adoo
    // homepage:  http://www.roading.org
    #ifndef BST_HPP
    #define BST_HPP
    #include<iterator>// The binary search tree template
    template<typename T>
    class BST{
    protected:
        struct node;
        class node_iterator;public:
        typedef node_iterator iterator;
        typedef const node_iterator const_iterator;
         BST();
        iterator begin();
        iterator end();
        iterator find(T value);
        iterator insert(T value);
        template<typename iter_type>
        iterator insert(iter_type iter);
        void  eraser(iterator iter);
        void eraser(iterator ibeg, iterator iend);
        int eraser(T value); 
        ~  BST();
        
    private:
        node*  _root;
    };
    //The node for binary search tree
    template<typename T>
    struct BST<T>::node{
        node();
        T  _value;
        node  *_left;
        node  *_right;
        node  *_parent;
        // I should implement some override operator at here , but  I omit these. 
    };template<typename T>
    class BST<T>::node_iterator: 
        public std::iterator<std::bidirectional_iterator_tag ,node>
    {
    public:
        node_iterator(node* n);
        T& operator* ();
        node* operator ->();
        node_iterator operator++ ();
        node_iterator operator++(int);
        node_iterator min();
        bool operator ==( node_iterator r_iter);
        bool operator !=(const node_iterator r_iter);
        node* pointer();
    private:
        node* _node;
    };
    #endif

上述部分的实现,使得我们可以类似使用STL中的容器一样来操作BST
了，当然还应该实现更多的函数以及操作符来提供更多的支持，但就
上面实现的那些而言，我们已经可以做类似如下的操作了：

    ```cpp
    //用特定的迭代器来遍历 BST
    for(BST<int>::iterator  iter=B.begin(); iter != B.end(); ++iter)
    {
        cout<<*iter<<" ";
    }

接受值类型匹配的其它类型的迭代器来作为插入：

    ```cpp
    BST<int> s;
    for(vector<int>::iterator   iter=vec.begin(); iter!=vec.end() ; ++iter)
    {
        s.insert(iter);
    }

…总之，目的是让BST使用起来与STL 一样的风格。

[点击我]: https://github.com/M-Adoo/Algorithm/blob/master/Coding/bst.hpp

