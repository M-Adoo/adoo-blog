---
title: Python 基础入门笔记(1)
date: 2012-04-24 17:25
categories: A byte of python
tags: 
	- python
	- 笔记
override_permailink: /develop/python/python-语法基础笔记1
---
### 内建类型

python 中提供的内建类型大概与C++中提供的相仿，却更简洁。

数值方面的内建类型有整型、浮点型、和复数类型三种。在C++中虽然也有复数类型，但却是由标准库提供的。另外，python中整数的表示就是整形，没有如C++中的长整型短整形之说。浮点数的表示也没有浮点型和双精度型的区分。

字符串则可以分为字符串(string)和原生字符串(raw string)两种类型。可以如同
C++ 一般用一对双引号来指定一个字符串，如 "This is a
string"。在python中单引号(‘)与双引号(“)拥有相同的功能——一对单引号也可以表示一个字符串，如` 'This is a string' `。

对于一个多行的字符串，可以用转义字符来表示，例如`'This is the first line.\nThis is the second line.' `，但是python同时提供了一种更友好的方式，用三引号('''或""")来表示一个多行的字符串，如：

	```python
	''' this is a multi-line string.
	this is the second line.
	"what your name ?" I asked.
	he said "My name is ***"
	'''
	```

上面介绍有单引号、双引号、三引号三种引号。当用其中一种来指定一个字符串时，可以在字符串中直接使用另外两种引号，例如上面的多行字符串中可以直接使用
`"`，而无需写成 `/"`。这是因为字符串可以找到正确的结尾，而不会被提前截断。


字符串无需再赘言，原生字符串可以在字符串之前加上一个r或者R来表示，例如`r'\nThis is a raw string'`。原生字符串不会对字符串进行任何特殊处理，例如`r'\nThis is a raw string'`中的`\n`不会被转义处理，而是直接代表`\`和`n`两个字符。

python 没有char类型。

### 变量

python的变量命名规则与C++类似。定义上却有很大不同，定义一个python变量，直接给它赋值就可以了，并不需要声明它的数据类型，变量的类型决定于初始化它的对象类型。C++11中的`auto`关键词有类似作用，不过实质上是不一样的。实例：

	```python
	s=''' this is a multi-line string.
	this is the second line.'''
	print(s)
	i=5
	print(i)
	```

python中一切事物皆为对象，即便是内建类型也是对象，这是与C++不同的。

### 代码书写约定

python
隐式约定每一物理行表示一行语句，所以python中的一行语句写完不需以分号结束，虽然在语句末尾加上分号也无伤大雅，但画蛇添足的事多做无益。但是如果要将多行语句写在同一物理行，那么则必须用逗号分开。如果某行语句过长，想写在两行，则可以使用连接符`\\`。实例：

	```python
	#将多条语句写在同一物理行
	i=5; print(i);i=i+1;print(i)
	#将一行语句写在多个物理行。
	s='this is a string. \\
	This continue the string'
	print(s)
	```

当行中使用了圆括号、方括号或波形括号的时候，不需要用`\\`来连接多行,这种情况被称为隐式行连接。

缩进：每行开始的缩进在python中相当重要，python中并不用大括号或者begin、end类似的关键词来界定语句块，缩进才是它的标准。换言之，行首的缩进量决定了语句的分组，同一层级的语句必须要有相同的缩进量。python支持空格符和制表符来表示缩进，但确保只使用其中一种来表示缩进，千万不要混搭使用。

### 表达式

python的一些操作符大体上与C++一致，下面罗列几种与C++有差异的操作符。

-   乘法运算`*`，对字符串也能进行乘法运算，如`'a'*3` 返回`'aaa'`.
-   求幂运算符`**`，`x**y` 表示求x的y此幂，例如`2**3`的返回值为8.
-   除法运算`/`，与C++不同,整数之间的除法会返回小数，如1/2返回小数0.5而不是0.
-   floor division(地板除？)运算符`//` ，返回`x//y`结果中的整数部分。如`6//5`返回1.
-   按位异或操作符`\^`,如`3\^2`返回1，`5\^3`返回6。
-   按位反转操作符`\~`，一元运算。`\~x`返回`-(x+1)`，也就是说`\~5`的结果为-6.
-   `not`运算符，一元运算，求逻辑非。
-   `and`运算符，求逻辑与，对应C++中`&&`
-   `or`运算符，求逻辑或，对应C++中`||`

* 运算符的与表达式的更多介绍: <http://www.python.org/\~gbrandl/build/html/reference/expressions.html>
* 运算符在表达式的优先级列表: <http://www.python.org/\~gbrandl/build/html/reference/expressions.html>

###控制流

python
有一种分支结构语句——if语句。但不存在switch语句。两种循环结构语句——while
和for语句，没有do …while语句。有点奇妙的是所有者三种语句都提供一个可选的else分支语句，没错不仅if语句有else分支，while与for也有else分支。

if语句中可以将一个嵌套的if…else…if…else语句合并成if…elif…else语句，后者可以很好的替代switch语句。if语句的实例：

	```python
	number=22
	guess=int(input("Enter a number:"))
	if guess==number:  
	   print("you guessed it")
	elif guess < number :    
	   prinnt("no, it is a little higher than that")
	else:  
	   print("no it is a little lower than that")
	```

实际上相当于：

	```python
	number = 22
	guess = int(input("Enter a number:"))
	if guess==number:
	    print("you guessed it")
	else:
	    if guess < number :
		print("no, it is a little higher than that")
	    else:
		print("no it is a little lower than that")
	```

要注意两点：
*	判断表达式不需要括号;
*	每一个分支语句之前需要冒号。

python中循环结构的一个比较鲜明的特点就是多了一个else分支，这个else在循环完成后执行。

while循环的实例：

	```python
	count=5
	flag=True
	while flag:
	    if count!=0:
		print("count: {0}".format(count))
		count -=1
	    else:
		flag=False
	else:
	    print("The while loop is over.")
	```

for循环的实例：

	```python
	for i in range(1,5):
	    print("i:{0}".format(i))
	else:
	    print("the for loop is over")
	```

从语法上来讲，for与while给了我一些不同的感觉，虽然都是循环控制语句，但给人的感觉是while更趋向于条件控制的循环，而for则更倾向于迭代循环。

python中也有break与continue语句与C++中的没有区别。要注意的是如果循环是以break语句跳出的话，那么else分支也会被跳过。

注：这篇笔记我主要重点记录一些 python在语法上与C++的一些异同点，以及我认为自己需要留意的地方，所以他仅仅是一篇笔记。

参考：a byte of python –v1.92(for python 3.0) 以及pyhon.org关于python3.2的很小部分文档。

