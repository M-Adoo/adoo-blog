---
title: C++类对象的大小
date: 2011-11-24 12:41
categories: 深度探索C++对象模型
tags: c++, Inside The C++ Object Model, 笔记
override_permailink: /develop/cpp/c类对象的大小
---

### 一个实例引出的思考

	```cpp
	class X{};
	class Y:virtual public X{};
	class Z:virtual public X{};
	class A:public Y, public Z{};

猜猜sizeof上面各个类都为多少？

Lippman的一个法国读者的结果是：	 	

	sizeof X yielded 1 						
	sizeof Y yielded 8 						
	sizeof Z yielded 8 						
	sizeof A yielded 12					

我在vs2010上的结果是：

	sizeof X yielded 1   
	sizeof Y yielded 4   
	sizeof Z yielded 4	
	sizeof Z yielded 8		

当我们对于C++对象的内存布局知之甚少的情况下，想搞清这些奇怪现象的缘由将是一件
非常困难的事情。不过下文会为你一一解惑。

事实上，对于像X这样的一个的空类，编译器会对其动点手脚——隐晦的插入一个字节。为
什么要这样做呢？插入了这一个字节，那么X的每一个对象都将有一个独一无二的地址。
如果不插入这一个字节呢？哼哼，那对X的对象取地址的结果是什么？两个不同的X对象间
地址的比较怎么办？

我们再来看Y和Z。首先我们要明白的是实现虚继承，将要带来一些额外的负担——额外需要
一个某种形式的指针。到目前为止，对于一个32位的机器来说Y、Z的大小应该为5，而不
是8或者4。我们需要再考虑两点因素：内存对齐（alignment—）和编译器的优化。

alignment[^注1]会将数值调整到某数的整数倍，32位计算机上位4bytes。内存对齐可以
使得总线的运输量达到最高效率。所以Y、Z的大小被补齐到8就不足为奇了。

那么在vs2010中为什么Y、Z的大小是4而不是8呢？我们先思考一个问题，X之所以被插入
1字节是因为本身为空，需要这一个字节为其在内存中给它占领一个独一无二的地址。但
是当这一字节被继承到Y、Z后呢？它已经完全失去了它存在的意义，为什么？因为Y、Z各
自拥有一个虚基类指针，它们的大小不是0。既然这一字节在Y、Z中毫无意义，那么就没
必要留着。也就是说vs2010对它们进行了优化，优化的结果是去掉了那一个字节,而
Lippman的法国读者的编译器显然没有做到这一点。

当我们现在再来看A的时候，一切就不是问题了。对于那位Lippman的法国读者来说，A的
大小是共享的X实体1字节,X和Y的大小分别减去虚基类带来的内存空间，都是4。A的总计
大小为9，alignment以后就是12了。而对于vs2010来说，那个一字节被优化后，A的大小
为8，也不需再进行alignment操作。

### 总结

影响C++类的大小的三个因素：

-	支持特殊功能所带来的额外负担（对各种virtual的支持）。
-	编译器对特殊情况的优化处理。
-	alignment操作，即内存对齐。


[^注1]:	关于更多的memory alignment（内存对齐）的知识见[VC内存对齐准则（Memory alignment）]( http://www.roading.org/develop/cpp/vc%E5%86%85%E5%AD%98%E5%AF%B9%E9%BD%90%E5%87%86%E5%88%99%EF%BC%88memory-alignment%EF%BC%89.html)
