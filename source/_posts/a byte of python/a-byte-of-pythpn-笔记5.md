---
title: Python 基础入门笔记(5)
date: 2012-05-03 16:12
categories: A byte of python
tags: 
	- python
	- 笔记
override_permailink: /develop/python/python-基础入门笔记5
---

### Pickle

python 支持一些常见模式的文件处理方式，通过read 、readline或 write 函数来读写文件，同时它还支持几种模式的读写方式，这些并没有什么特别的，略去不说。 不过python的文件处理还有一个非常有用的功能——Pickle。

Pickle是python标准库提供的一个模块，它能将任意对象存储到一个文件中， 并还能从这个文件中恢复这个对象，比如：

```python
    import pickle
    fruitlist=['apple','mango','carrot']
    filename='file.ob'
    f=open(filename,'wb')
    #将对象 fruitlist 存储到文件file.ob中
    pickle.dump(fruitlist,f)
    f.close()
    del fruitlist
    #从文件中读取对象
    f=open(filename,'rb')
    storedlist = pickle.load(f)
    print(storedlist)
    f.close()
```
### 异常处理（Exceptions）

    python 中也采用try…catch 类似的语句来捕获错误。看一个例子：

```python
    try:
        text= input('Enter something --> ')
    except EOFError:
        print('Why did you do an EOF on me?')
    except KeyboardInterrupt:
        print('You cancelled the operation.')
    else:
        print('You entered {0}'.format(text)) 
    finally:
        print('This statement must be printed')
```

把有可能引发错误的语句放在 try 块中，except子句则用来处理有可能发生的错误和异常。 except子句可以处理单一的错误或异常，也可以是一组包括在圆括号内的错误/异常。 如果没有给出错误或异常的名称，它会处理所有的错误和异常。 如果一个错误或异常没有被处理，那么python 将会终止程序并打印出错误信息。 else 子句在没有错误或异常出现的情况下才会被执行。 finally子语句则保证不管是有无异常出现它都会执行。我不禁意淫，如果C++中的异常处理也有这样一个语句块就美妙了 ——把资源释放的代码放到这个语句块中间那是再好不过了。

可以用 raise 语句来抛出异常，如 raise EOFError。 raise 语句类似C++ 中的 throw 语句。同样能被raise的异常和错误必须是直接或间接继承自 Exception类。

### 后记

a byte of python 是本不错的 python介绍书。对，是一本介绍书，而不是入门书。 够精简，也够易懂，你大可以花大半天一口气看完这本书，使你对python 有一个大致的了解。 看完这本书，python对不对你的胃口，应该就清楚了。这之后再慎重的决定要不要更深入的学习一下 python 。老实说，这本书我是认为不值得写什么笔记的，但它却让我完全喜欢上了python ，让我决定要深入学习一下它。但近来琐事缠身，是抽不出时间来系统的学习python 的。 至于何时能安排出比较系统的时间来学习 python？一两个月之后，又或许是半年之后，亦未可知。 于是才有了写点笔记的打算，留待真正开始学习python的时候能够快速的温习一下。

参考：a byte of python –v1.92(for python 3.0)