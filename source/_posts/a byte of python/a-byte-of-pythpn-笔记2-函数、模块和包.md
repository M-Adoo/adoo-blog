---
title: Python 基础入门笔记(2)——函数、模块和包
date: 2012-04-29 15:27
categories: A byte of python
tags: 
	- python
	- 代码组织
	- 笔记
override_permailink: /develop/python/python-基础入门笔记2函数、模块和包
---

函数、模块和包对于代码的复用都有非常重要的意义，当然面向对象中的类其实在代码的复用性上也有举足轻重的地位。前天睡前看了《a byte of python》中关于函数、模块和包的这个部分，今天又查了查官网文档以及网上的其它一些资料，把一些疑惑给解决。现在写一下关于这部分的笔记，用以加强记忆同时以备后用。

### 函数

python 中用关键字def来定义函数。一个完整的函数定义应该以关键字def
开始后面紧跟着函数名和用括号括起来的形参列表，并以一个冒号作为该行的结尾，紧跟着则是函数的代码块。实例：
	
	```python
	def printMax(a , b):
	    if a>b:
		print(a,'is maximin')
	    elif a==b:
		print(a,'is equal to',b)
	    else:
		print(b,'is maximum')
	```

**Python同样支持为参数提供一个默认值**，函数在调用时有默认值的形参是可选的，也就是说这样的参数可以不用给它提供实参。这在很多情况下都非常有用，比方一个窗口的创建函数——拥有很多形参来设定窗口的属性，但通常创建一个窗口可能只有两三个属性需要特别设定，其它都可以用默认值。Python的默认参数与C++的默认参数我感觉是一样的。都要求提供默认值的形参处于形参队列的末尾，换句话说，提供默认值得形参之后不能有不提供默认值的形参。其原因在于在调用函数时，用实参对形参赋值一般都是按位置顺序进行的。

说到“实参对形参赋值一般是按位置顺序进行的(这样的参数叫做位置参数，译自positional arguments)”，则不能不提一提**关键字参数（Keyword Aruguments）。**所谓关键字参数是指，可以显示的按形参名赋值实参，而并非根据形参的位置顺序。比方`printMax(b=5,a=10)`。当然，这个例子并没有体现出关键字参数的价值，其价值在于可以明确指出参数的角色。比方有一个文件内容拷贝函数`copyFile(to,from)` ——将文件 from 中的内容拷贝到文件to中。使用类似的函数的时候，使用者必须记住参数的顺序，但如果支持关键字参数的话，则不必关心位置顺序，将正确的文件名赋值给正确的形参就OK。

python 中**可变形参(VarArgs Parameters)**的概念非常清晰，在一个函数之前加上`*`号或者`**`号就表示这个形参代表了个数不确定的参数，如

	```python
	def sum(*numbers):
	    result=0
	    for number in numbers :
		result+=number
	    return resultprint( sum(1,2,3,4,5) )
	```

上面的代码将会输出：15。 函数sum的形参number之前有`*`号标记，表明number是一个可变形参，实际代表的参数数目由调用时传入的实参数目决定。原理很简单，一个可变形参，如numbers, 会将从它那一点开始的所有**位置实参(positional arguments)**收集为一个 numbers列表。形参之前用两个星号`**`标记，同样表示一个可变形参，只是双星号的可变形参是将将从它自己开始的位置实参都收集为一个字典(dictionary)。队列(list)和字典(dictionary)都是python提供的基本数据结构。有趣的一点是 python
中的可变形参并不一定要放在形参队列的末尾，这就带来了一种副产品
Keywords-only parameters，请看:

	```python
	def sum(*numbers,desc):
	    result=0
	    for number in numbers :
		result+=int(number)
	    print(desc,result)
	```

但上面的例子中的 desc形参只能以关键字参数的方式进行调用了。调用方法如下：

	```python
	#正确的调用
	sum(1,2,3,4,5, desc='The sum of my salary is：')
	#错误的调用，实参'The sum of my salary is：'也会被收入numbers中
	sum(1,2,3,4,5,'The sum of my salary is：'
	```

如果一个函数没有提供显示的返回语句，python 会隐式的提供一条返回语句
return None 。None 是 python 中的一个特殊类型，表示没有任何东西。

### 模块

python既支持python语言写的模块同时也支持多种其它语言写的模块。这儿只看最简单的python写的模块，而不管其它。**一个扩展名为.py的文件其实就是一个python模块**。模块能被其它程序导入并使用它的功能，例如下面对准库的使用：

	```python
	#file: C:\Users\Adoo-\Desktop\using_sys.pyimport sys
	print('The command line arguments are:')
	for i in sys.argv:
	    print(i)print('\n\nThe PYTHONPATH is', sys.path)
	```

输出结果：
	
	```
	The command line arguments are:
	C:\Users\Adoo-\Desktop\using_sys.pyThe PYTHONPATH is
	 ['C:\\Users\\Adoo-\\Desktop', 'C:\\Python32\\Lib\\idlelib', 
	'C:\\windows\\SYSTEM32\\python32.zip', 
	'C:\\Python32\\DLLs', 'C:\\Python32\\lib', 
	'C:\\Python32', 'C:\\Python32\\lib\\site-packages']
	```

上例中用一条import语句来告诉python我们想使用sys模块。对于一个使用用python
编写的模块而言，当python执行 **import 语句时,python 解释器会从sys.path中列出的路径中查找**，如果找到了就会执行模块中包含的语句，然后这个模块就可以用了。模块的初始化操作只会在第一次被导入时执行。模块被导入后就可以通过点操作符来使用模块中的函数或变量，如sys.argv或
sys.path。

要注意，要使用一个模块，必须确保这个模块所在的路径包含在sys.path中。所以，要么将你的模块复制到sys.path列出的路径中的一个去，要么把你的模块路径加入到sys.path中。执行文件所在的当前路径会被自动添加到sys.path中。

**form … import 语句：**用 from sys import argv语句可以直接导入sys模块中的argv变量，而且只导入argv.此时sys中的argv可以直接使用，而不用通过sys.argv的方式引用。使用`from sys import *`语句可以导入sys中的所有公有的和非双下划线开头的名字，不过这肯定不是一种好的习惯——容易造成名字冲突，如C++中的using namespace 语句。

模块中**内置一个`__name__`属性**。如果一个模块是被`import` 的, 那么
`__name__`的值通常为去除模块扩展名的文件名。如果模块式独立运行的(也就是说它是主模块)`__name__`的值将是'`__main__'。`

导入一个模块相对来说比较费时，所以 Python提供了一种**以.pyc为扩展名的按字节编译的文件**.当模块被第一次导入时，如果python具有当前路径的写入权限，.pyc
文件会被创建在与模块文件相同路径下。有.pyc文件将会非常有利，当下次从其它程序再导入这个模块时，会快得多。因为导入模块的一些必要处理已经做好了。另外.pyc文件也是平台无关的。

**dir()函数返回包含指定模块中所有名字的队列（list）**，注意用 import 语句导入的名字也在其中。在不提供参数给dir()的情况下，将返回包含当前模块的所有名字的队列。dir()函数其实可以作用于任何对象。

**可以用一个del 语句删除一个变量或者名字**，被`del`删除的名字或变量，在之后的语句里将不可以被访问。

### 包

包其实就是用文件夹将模块组织起来，不过文件夹下必须要一个\_\_init\_\_.py文件，只有文件夹下有一个名为\_\_init\_\_.py的文件，该文件夹才会被当作一个包看待。但\_\_init\_\_.py文件可以是空的。

可以用 `from…import…`语句来导入包中的相关模块。要注意的一点是，假如有一个名为package的包，那么`from package import *`语句并不会如你想象的导入包中所有模块。它只导入在\_\_init\_\_.py中\_\_all\_\_属性中所列出的模块。例如，当\_\_init\_\_.py中\_\_all\_\_的定义如下：

```python
	__all__ = ['mould1','moudle2','moudle3']
```

那么，from package import \* 只会导入mould1、moudle2和moudle3三个模块。

参考：a byte of python –v1.92(for python 3.0) 以及pyhon.org关于python3.2的很小部分文档。以及这篇博客：<http://pydoing.blogspot.com/2011/02/python-package.html>
