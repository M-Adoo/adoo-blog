---
title: Qt Quick 笔记（1）：初识 Qt Quick
date: 2012-02-23 16:45
categories: QT
tags: qml, QT, qt quick
override_permailink: /develop/cpp/qt/初识-qt-quick
---

### 废语开篇

在大二的时候思索着学习一界面库，为此煞费脑经。其中有试过十来天的Qt学习,不过最后为
WPF而沦陷，确实WPF界面与逻辑的分离让我很是向往。不过可惜的是WPF并不原生支持与C++
的交互，以致我不得不学习一些C\# 。又四处求医问药——获得native code与manage code交互
的良方。这之间寻寻觅觅，虽然也算终于达成所愿——可以用C++与WPF 来完成一些小程序编写
了。但是这注定是一种非主流的配置，主流与否，我虽然不在意。只是结果并不如我想的那般
理想。用C++与WPF来开发并没有带来效率的提升以及逻辑的简化——这些成本都被转移到了他们
之间的交互上，更大的成本其实在于学习的代价——C\#、C++/cli 、P/invoke… 有意思的是似乎
转了一圈，又要回到QT上来。为什么要回到QT? 没有太多理由——公司用的最主要的界面库就是
Qt。当然这一切并未有让我有哪怕些须遗憾。我一直坚信，所有的弯路都有其价值。何况win8
确切会支持C++与xaml的交互——我已经尝试了一下。但是对于相关的系统学习可能要推后一些了。
而Qt会是接下来不短一段时间的主旋律了。不过可喜之处在于，Qt Quick 甚合我意。

### What is Qt Quick ？

看一下诺基亚的介绍：

> Qt Quick is a UI creation technology designed to enable developers and UI 
> designers to work together to create animated, touch-enabled UIs and applications.

简而言之，Qt Quick将界面与逻辑很好的分离。[更多…][]

Qt Quick有以下组成部分：

-   QML: 一种用来撰写界面的声明式语言，很简单，很像CSS.
-   Qt Viewer: 用来加载qml文件。
-   Qt Declarative Module:一个 Qt 库中的新模块，用它可以很好的使得QML与 C++交互。

### What is QML?

qml是一种被设计为用来描述用户界面的声明式语言：包括用户界面的摸样和以及行为。在
qml的世界中，UI元素被组织成树形结构，UI元素可以包含其许多子元素，但却只有一个父
亲。

一个简单的例子：

    ```qml
    import QtQuick 1.1
    Rectangle{
        width: 200; height: 150
        color: "lightblue"
    }

上面的代码声明了一个矩形，并设定了它的长宽以及颜色，其效果图如下。

![示意图][Pic1]

import可以用来导入相关模块，这儿要使用Qt quick的功能，自然要导入相关模块。后面跟的
1.1是版本号。规定版本号的优势在于可以只导入对应的版本。因此程序中只能使用对应版本的
功能。这样一来就可以使得程序不受旧版本或新版本的影响。在新版本发布后也保存了对旧版
本的支持。

声明了一个Rectangle元素，紧接着的{}表示在其中的属性都属于描述Rectangle。可直接用属
性的名字和值来设定属性：`name: value `。属性之间用换行符或分号来分隔。注释的方式与
C++相同，可以用 “//”与“/\* … \*/ ”两种形式。

QML中的元素（elements）可以分为可视化元素和不可见元素：

-   所有的可视化元素都继承自item, 它们一般都有关于位置和尺寸的属性。像Recatangle 、
    Text 、InputText…
-   不可见元素有states、transitions…

元素拥有一些属性，同时属性用以描述元素。当然，也可以对元素扩展一些自定义的属性。

[更多…]: http://qt.nokia.com/products/library/qt-quick
[Pic1]: http://www.roading.org/images/2012-02/image_thumb.png
