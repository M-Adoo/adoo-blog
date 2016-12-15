---
title: C++对象面面观
date: 2011-11-11 19:36
categories: 深度探索C++对象模型
tags:
    - c++
    - Inside The C++ Object Model
override_permailink: /develop/cpp/c对象面面观
---

学习C++应该看过不少关于C与C++的口水贴，以及关于各种对比C与C++效率比较的帖子，
最有影响力的恐怕当属linus对C++的炮轰——《[糟糕程序员的垃圾语言][]》。但无论如
何，我正喜欢着这样一种垃圾，我当然对linus充满敬意，但这不妨碍我口食垃圾而对其
仰慕。

无需太在意站在山巅的巨人们的言论，每个人都有不同的道路来追求真理。与其听着Linus
的嗤笑之声，不妨跟随Lippman一起探索C++对象模型的“内心世界”。若要对事物褒贬，总
得先对其了解。唯有了解才能有负责的发声。

——仅以此区区百余字为之前记。

### C++的额外成本

C++较之C的最大区别，无疑在于面向对象。类相较于C的struct不仅只包含了数据，同时还
包括了对于数据的操作。在语言层面上C++带来了很多面向对象的新特性，类、继承、多态
等等。新特性使得C++更加强大，但同时却伴随着空间布局和存取时间的额外成本。作为一
个以效率为目标的语言，C++对于面向对象的实现，其实不大，这些额外成本主要由
virtual引起，包括：

-   virtual function 机制，用来支持“执行期绑定”。
-   virtual base class ——虚基类机制，以实现共享虚基类的 subobject。

除此之外C++没有太多理由比C迟缓。

### 三种对象模型

C++类包含两种数据成员：静态数据成员和非静态数据成员；同时包含成员函数，静态函数
和虚函数三种成员函数，这些机制在C++对象是如何被表现的？下面有三种模型可以用以表
现它们——简单对象模型、表格驱动对象模型以及C++对象模型。也许你没兴趣去了解有几种
方式可以实现C++的对象模型，只想了解C++对象模型。然则，C++对象模型是在前两种对象
模型上发展而来的，甚至于局部上直接用到前两种对象模型。

假定有一个Point类，我们将用三种对象模型来表现它。Point类如下:

```cpp
class Point  
{  
public:  
    Point( float xval ); 
    virtual ~Point();      
    float x() const;  
    static int PointCount();  

protected:  
    virtual ostream&  print( ostream &os ) const;
    float _x;  

    static int _point_count;  
};  
```

### 简单对象模型

简单对象模型：一个C++对象存储了所有指向成员的指针，而成员本身不存储在对象中。也
就是说不论数据成员还是成员函数，也不论这个是普通成员函数还是虚函数，它们都存储
在对象本身之外，同时对象保存指向它们的指针。

![简单对象模型][simple-object-model]
 
简单对象模型对于编译器来说虽然极尽简单,但同时付出的代价是空间和执行期的效率.显而
易见的是对于每一个成员都要额外搭上一个指针大小的空间以及对于每成员的操作都增加了
一个间接层。因此C++并没有采用这样一种对象模型，但是被用到了C++中“指向成员的指针”
的概念当中。

### 表格驱动对象模型

![表格对象模型][table-object-model]

表格驱动模型则更绝，它将对象中所有的成员都抽离出来在外建表，而对象本身只存储指向
这个表的指针。右图可以看到，它将所有的数据成员抽离出来建成数据成员表，将所有的函
数抽取出来建成一张函数成员表，而对象本身只保持一个指向数据成员表的指针。

侯大大认为，在对象与成员函数表中间应当加一个虚箭头，他认为这是Lippman的疏漏之处，
应当在对象中保存指向函数成员表的指针。

然而我在这儿还是保留原书（而非译本）的截图，因为以我之拙见，不保存指向成员函数表
的指针也没有妨碍。因为形如`float Point::x()`的成员函数实际上相当于`float x(Point*)`
类型的普通函数，因此保存指向成员函数表的指针当属多此一举。

当然C++也没有采用这一种对象模型，但C++却以此模型作为支持虚函数的方案。

### C++对象模型

所有的非静态数据成员存储在对象本身中。所有的静态数据成员、成员函数（包括静态与非
静态）都置于对象之外。另外，用一张虚函数表（virtual table)存储所有指向虚函数的指
针，并在表头附加上一个该类的type\_info对象，在对象中则保存一个指向虚函数表的指
针。如下图：

![C++的对象模型][C++-object-model]

### class和struct

按照lippman的意思是，struct仅仅是给想学习C++的C程序员攀上高峰少一点折磨。但遗憾的
是当我开始学C++的时候这个问题给我带来更多的疑惑。以我的认识class与struct仅限一个
默认的权限（后者为public前者为private）的不同。有时我甚至觉得只有一点畸形，他们不
应当如此的相像，我甚至认为struct不应该被扩充，仅仅保存它在C中的原意就好了。[^注1]

### 一个有意思的C技巧（但别在C++中使用）

在C中将一个一个元素的数组放在struct的末尾，可以令每个struct的对象拥有可变数组。
看代码：

```c
struct mumble {  
    /* stuff */  
    char pc[ 1 ];  
};  
// grab a string from file or standard input  
// allocate memory both for struct & string  
struct mumble *pmumb1 = ( struct mumble* )  
    malloc(sizeof(struct mumble)+strlen(string)+1);  
strcpy( &mumble.pc, string );  
```

这是一个很有意思的小技巧，但是别在C++中使用。因为C++的内存布局相对复杂。例如被继
承，有虚函数… 问题将不可避免的发生。

### 三种编程典范

-   程序模型
-   ADT模型
-   面向对象模型

纯粹使用一种典范编程，有莫大的好处，如果混杂多种典范编程有可能带来意想不到的后果
，例如将继承类的对象赋值给基类对象，而妄想实现多态，便是一种ADT模型和面向对象模型
混合编程带来严重后果的例子。

### 一个类的对象的内存大小包括：

-   所有非静态数据成员的大小。
-   由内存对齐而填补的内存大小。
-   为了支持virtual有内部产生的额外负担。

如下类：

```cpp
class ZooAnimal {  
public:  
    ZooAnimal();  
    virtual ~ZooAnimal();  
    virtual void rotate();  
protected:  
    int loc;  
    String name;  
};  
```

在32位计算机上所占内存为16字节：int四字节，String8字节（一个表示长度的整形，一个
指向字符串的指针），以及一个指向虚函数表的指针vptr。对于继承类则为基类的内存大小
加上本身数据成员的大小。在cfront中其内存布局如下图：   

![对象的内存布局][object-memory-layout]

[糟糕程序员的垃圾语言]: http://blog.csdn.net/turingbook/article/details/1775488
[simple-object-model]: http://www.roading.org/images/2011-11/image_thumb10.png
[table-object-model]: http://www.roading.org/images/2011-11/image11_thumb1.png
[C++-object-model]: http://www.roading.org/images/2011-11/image17_thumb1.png
[object-memory-layout]: http://www.roading.org/images/2011-12/image21_thumb.png

[^注1]: 实际上struct还要复杂一点，它有时表现的会和C struct完全一样，有时则会成为
class的胞兄弟。