---
title: Python 基础入门笔记(3)——内建数据结构
date: 2012-05-01 15:11
categories: A byte of python
tags: 
	- data structure
	- python
	- 笔记
override_permailink: /develop/python/python-基础入门笔记3
---

Python 有四个内建的数据结构——list、tuple、dictionary、set。

### 列表（List）

list 是一个可以在其中存储一系列项目的数据结构。list
的项目之间需用逗号分开，并用一对中括号括将所有的项目括起来，以表明这是一个
list 。下例用以展示 list 的一些基本操作：

	```python
	#定义一个 list 对象 shoplist：
	shoplist= ['mango','apple','bananaa']
	#获得一个 shoplist 的长度
	print('Shoplist have',len(shoplist),'items')
	#访问shoplist中的对象
	print('The 3rd item in shoplist is',shoplist[2])
	#往 shoplist 中插入对象
	shoplist.append('pear')
	#从 shoplist 中删除一个项目
	del shoplist[0]#对 shoplist 进行排序
	shoplist.sort()
	#遍历整个shoplist中的项目
	print('These items are :',end=' ')
	for item in shoplist :
	    print(item,end=' ')

输出结果为：

	```python
	Shoplist have 3 items
	The 3rd item in shoplist is bananaa
	These items are : apple bananaa pear 

关于上面的代码有几点要注意的是:

-   可以往 shoplist 中加入任何类型的对象，也就是说，并不要求一个 list
    中的项目具有相同类型。你甚至可以往 shoplist 中插入一个list。
-   排序函数作用于本身，
    而不是返回一个副本，这与字符串类型是不同的，因为字符串不可修改。
-   print 函数的end关键字参数用来指定输入完成之后的输出，默认是换行符，上面的代码用空格符替代换行符。

### 元组(Tuple)

Tuple 在用法与概念上与 list 没有多大差别，可以将 tuple 看做是一个只读版list。也就是说tuple一经定义便不能被修改——不能添加和删除对象，也不能修改tuple中的对象。

tuple中的项同样应该用逗号分开，并用圆括号将这些项目括起来以表是是一个tuple。这个圆括号是可选的，也就是说可以用以下两种方式定义一个tuple:

	```python
	tuple1='apple','banana'
	tuple2=('apple','banana')

不过省掉那对圆括号不见得是什么好的习惯。另外当tuple只有一个项时，第一项之后必须有一个逗号，该情况下应该这样定义`mytuple=('apple',)`。这似乎是一个古怪的约束，但是假如没有这个逗号，不带括号定义的tuple就变成了`mytuple='apple'`这明显具有二义性。

### 字典(Dictionary)

字典可以看做是一组键-值(key-value)对的集合。键必须是唯一的，而每一个键关联着一个值。key必须是一个不可变的对象(如：tuple、数值型、字符串)。还要注意的是，在字典中的键值对并没有以任何方式进行排序。

一个字典的定义应该照这样的格式`d={key1 : value1, key2 : value2, key3:vlue3}`。键和值之间用冒号分隔，而键值对之间用逗号相隔，再用大括号将所有的键值对括起来。一些基本操作如下：

	```python
	#字典的定义
	ab= { 'Swaroop' : 'swaroop@swaroopch.com',
	      'Larry' : 'larry@wall.org',
	      'Matsumoto' : 'matz@ruby-lang.org',
	      'Spammer' : 'spammer@hotmail.com' }
	#通过键来获取值
	print("Swaroop's address is",ab['Swaroop'])
	#删除一个键值对
	del ab['Swaroop']
	#遍历字典
	for name, address in ab.items() :
	    print('contact {0} at {1}'.format(name,address))
	#往字典中增加一个键值对
	ab['Adoo']='liuxiaodongxiao@hotmail.com'
	#判断字典中是否存在某键,也可以用 if ab.has_key('Adoo')
	if 'Adoo' in ab:
	    print("Adoo's address is",ab['Adoo'])

输出的结果为：

	Swaroop's address is swaroop@swaroopch.com
	contact Matsumoto at matz@ruby-lang.org
	contact Larry at larry@wall.org
	contact Spammer at spammer@hotmail.com
	Adoo's address is liuxiaodongxiao@hotmail.com

### 序列(Sequences)

上面介绍的三种内建数据结构都是序列，索引操作是序列的一个基本操作。通过下标操作可以直接访问序列中的对象。上面虽然已经演示了下标操作——队列和元组用数字下标，字典用关键字下标。

序列的下标是从0开始的，上面的例子中只使用了下标为正数的情况，其实下标还可以为负数，如-1,-2,-3…。负数下标表示的意义为反方向的位置，如`shoplist[-1]`返回的是shoplist的倒数第一个项目。

序列不但支持负数下标还支持双下标，这对双下标表示一个区间。如shoplist[0:3]返回的是一个hoplist中从下标为1到下标为3之前的子序列副本。注意这个区间是一对半闭半开的区间。这种操作被称作切片操作(slicing operation)。如果切片操作的第二个下标超出了序列的范围，那么切片操作会到序列的末尾终止。切片操作中的两个下标都有默认值，第一个的默认值为0，第二个的大小为序列的长度。

还可以给切片操作提供第三个参数，第三个参数代表切片操作的步长，它的默认值是1。步长代表了项与项之间的间距，比方`name[0:10:3]`,返回的就是name中下标为0，3，6，9组成的子序列。

### 集合(set)

集合是无序简单对象的聚集。当你只关注一个对象是否存在于聚集中，而不管它存在的顺序或在出现的次数时，则适宜用集合。基本功能：判断是否是集合的成员、一个集合是不是另一个集合的子集、获取两个集合的交集等等。实例：

	```python
	#定义一个集合,要使用set函数
	s=set(['briza','russia','india'])
	#判断对象是否在集合中
	if 'india' in s:
	    print("india is in ?",'india' in s)sc=s.copy()#往集合中添加对象
	sc.add('china')
	#从集合中删除对象
	sc.remove('russia')
	#求两个集合的交集，也可以使用 s.intersection(sc)
	print(s & sc)

输出的结果：

	india is in ? True
	{'briza', 'india'}

参考：a byte of python –v1.92(for python 3.0)

