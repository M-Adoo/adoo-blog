---
title: Python 基础入门笔记(4)
date: 2012-05-02 17:12
categories: A byte of python
tags: 
	- python
	- 笔记
override_permailink: /develop/python/python-基础入门笔记4
---

作为一门面向对象语言，类和对象是 python的一个重要的概念。关于什么是面向对象和什么是面向对象过程，这里不做赘言。
面向对象基本思想上python 并没有和C++有太大异同，这里主要对一些语法和细节上的东西做一些记录。但 python 与 C++
在对象的范围上有很大不同， python的对象定义更广义——**python认为万物皆对象，即便类也是一个对象**。

在 python中数据成员被称为字段(fields)，而函数成员被称为方法。依照我一贯的理解，数据成员用来描述对象的属性，而函数成员可以被看作对象的行为。

python中对象的字段既可以是其它类型的对象**也可以是与自己相同类型的对象**。这种对象的自包含看上去很奇怪，理论上这一点是无法实现的
——如果一个A类型的对象包含了另一个A类型的对象，那么被A类型包含的那个对象也应该包含一个A类型的对象，这种包含关系将无止境。
而python之所以支持，这不得不说 python的另一特性——**在 python中变量实质上是一个对对象的引用，而不是对象本身。**

下面定义了一个简单的类,之后的文字将围绕这个例子来展开。

	```python
	class Person:
		population=0                 #标记1

		def __init__(self,name):
			self.name=name           #标记2
			Person.population +=1    
		def __del__(self):
			Person.population-=1   
		def sayHi(self):
			print("I'm",self.name)    
		@staticmethod                #标记3
		def howMany():            
			print('The population is',Person.population)
	```

### **类变量和实例变量**

Person类中标记1定义了一个类变量，所谓类变量是指这个变量是属于类的，等同于C++中类的静态数据成员。类变量的引用应通过类名进行,如
Person.population .

实例变量指的是这个变量是属于实例的，如标记2所在行中的name。在类的成员函数中所有的类变量应通过类名引用，而所有的成员变量应通过
self引用,否则将定义一个新的变量或引起引用错误。

### \_\_init\_\_方法和\_\_del\_\_方法

\_\_init\_\_方法用来对对象的初始化，一些初始化操作应该放在这个方法中。它与C++中的构造函数作用类似。
\_\_init\_\_方法在实例化一个新对象被实例化时调用。另外实例化一个新对象时，实参列表是被传给\_\_init\_\_调用。如
Person 类的对象创建应当是这样的： p=Person('Adoo')——\_\_init\_\_除 self外只有一个参数。

\_\_del\_\_方法则在一个对象被删除时调用，因为垃圾收集器的原因这个方法的调用时机并不能被确定。如果想显式调用它，那么用一条
del 语句删除相应的对象。

### 方法(Methods)

python中成员函数的第一个参数是一个特殊的参数，它引用对象本身，一般将之命名为self 。
这个self 其实完全相当于C++ 中的 this 指针。self在成员函数的调用时与C++中this一样不需要被显示赋值，
编译器会自动将调用成员函数的对象作为第一个参数。如`obj.func(arg)`这样的调用实际上被转化为类似`obj.func(object1,arg)`的调用了。

howMany函数实际上是一个静态方法，它属于类的方法而不是属于对象的的方法，这好比C++中的静态函数。定义方式，可以注意标签3。
这里howMany是没有参数的，但假如它有参数的话，它的第一个参数也不会被当作对象的引用，它没有self引用。
一个静态方法的定义除了可以在函数之前加@staticmethod 标签，还可以通过这样的形式：

	```python
    def howMany(): 
        print('The population is',Person.population)
    howMany=staticmethod(howMany)
	```
	
需要注意的几点：

1.  类中的所有成员默认是公有的，但是所有以双下划线开头命名的成员被认为是为私有成员。
2.  关于继承，私有成员不会被继承。python支持单继承也支持多继承。
	在类名后面用一对圆括号将基类名括起来，表示该类是一个继承自基类的类。
	如果是多继承则将基类之间用逗号隔开。
3.  还是关于继承，如果继承类没有定义自己的\_\_init\_\_方法，那么会继承基类的\_\_init\_\_方法，如果继承类定义了\_\_init\_\_方法，那么在继承类的\_\_init\_\_方法中基类的\_\_init\_\_方法并不会被自动调用，必须显示调用它，这是与C++不同的。

参考：a byte of python –v1.92(for python 3.0)

