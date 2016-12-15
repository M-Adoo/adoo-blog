---
title: Qt Quick 笔记（2）——用户界面相关
date: 2012-02-24 15:34
categories: QT
tags:
    - qml
    - QT
    - qt quick
    - 笔记
override_permailink: /Qt/about-ui
---

### Nested ELements

在QML中的 UI 元素是以树形结构组织的,因此“*Elements are often nested*”——也就是说，
一个元素可以包含很多个其它元素。

一个例子：

```qml
import QtQuick 1.1 
Rectangle{
    width: 400 ; height: 300
    color:"gray"
    Rectangle{
        x:50; y: 50
        width:300; height: 200
        color: "lightblue"
        Rectangle{
            x:50 ; y: 50
            width: 200 ; height: 100;
            color:"red"
        }
    }
}
```

上例中浅蓝色和红色的矩形都是“Nested Element”，通过右边的显示效果可以看出，每一个
“Nested Element”设定的位置都是相对于父元素的，而不是绝对位置。

### Graphical Elements

三种要讨论的元素： Colors, gradients and images。通过这三种元素可以创建起具有吸
引力的 UI 。

#### Colors:可以用三种方式来设置：

-   直接用一个颜色名字的字符串来表示：例如 "red","blue"",lightblue"…
-   直接用一个6位的十六进制字符串来表示：例如`#ff00ff`，六位中每两位代表三原色中
    的一种，其顺序为红绿蓝。
-   使用一个函数来进行设置。如：Qt.rgba(0, 0.75, 0 , 1)。其中四个参数的范围应该
    都在0到1之间。前三个参数表示三原色，后一个参数表示**不**透明度。  

三种方法的实例：

```qml
    import QtQuick 1.1 
    Item{
        width:150;  height: 50
        Rectangle{
            width:50; height: 50
            color: "red"
        }
        Rectangle{
            x:50 ; y:0
            width: 50 ; height:50;
            color: "#00ff00"
        }
        Rectangle{
            x:100 ; y: 0
            width: 50 ; height: 50;
            color:Qt.rgba(0,0,1,1)
        }
    }

#### Images

可以看下面一个关于图像的实例，这个实例将呈现一幅图片，并且在点击图片的时候会将图
片放大两倍并以右下角为轴心旋转45度。

    ```qml
    import QtQuick 1.1
    Rectangle {
        width: 200 ; height: 200
        color: "gray"
       Image{
           anchors.centerIn: parent
           source: "../捕获.PNG"
           transformOrigin: Item.Center
           MouseArea{
               anchors.fill: parent
               onClicked: {
                   parent.scale=2
                   parent.rotation=45
               }
           }
       }
    }

Image的长宽由图像决定。其路径用source来设定，可以用绝对路径也可以使用相对路径，
当然网路图片也是可以的。”../”表示父级目录。用scale来设定放大的倍数，用
tansformOrigin 来设定旋转的轴心。rotation可以用来设定旋转的度数。  

#### Gradient

实例：
    
    ```qml
    import QtQuick 1.1
    Rectangle {
        width: 200 ; height: 400
        gradient: Gradient{
            GradientStop{
                position: 0.0
                color: "blue"
            }
            GradientStop{
                position: 1.0
                color:  "black"
            }
        }
    }

如上例所示，可以用一个gradient属性来设置渐变。用Gradient来作为其值。Gradient可以
包含一个或更多的GradientStop 。每一个GradientStop包含一个position属性和一个color
属性。position属性的值，只能从0到1。

设置gradient属性后，color属性将被覆盖掉。

官方推荐使用渐变的图片来代替gradient，因为gradient会占用大量的cpu，并且渐变的效
果可能并没有你期望的那么生动。

### 文本

qml中的文本既可以用来呈现文本，同时也能进行文本的输入。

用 Text 来简单呈现文本：

    ```qml
    import QtQuick 1.1
    Rectangle {
        width: 200 ; height: 100
        color: "gray"
        Text{
            text: "<h1>我本将心向明月，奈何明月照沟渠。</h1>"
            font.family: "楷体"
            color:"white"
        }
    }

Text 支持简单的文本呈现，同时它也支持富文本的显示。如上例中我就用了
`<h1>…</h1>`这对标签。

用 TextInput 来接受文本的录入：

    ```qml
    import QtQuick 1.1
    Rectangle{
        width: 300; height: 200;
        color:"black"
        TextInput{
            color: "white"
            width: 200;
            font.pixelSize: 16
            text:"举杯邀明月，对影成三人..."
        }
    }

一个很简单的文本输入控件，没有任何的装饰。如果没有设置它的宽度的时候，其宽度会
随着字串的长度而改变。

### Anchors

我们知道可以用x与y属性来确定元素相对于其父亲的位置。使用Anchors则是另外一个重要
的布局手段，Anchors 主要用来定位和对齐元素。

位置示意图：(另外还有centerIn和fill)

![位置示意图][anchors]

一个实例：直接关联到其父

    ```qml
    import QtQuick 1.1
    Rectangle {
        width: 200 ;    height: 150
        color: "lightblue"
        Rectangle{
            width: 50;  height: 50
            color:"gray"
            anchors.centerIn: parent
        }
    }

也可以关联到其父亲的Anchors,此时这样写:`anchors.right: parent.right`不需要(也不
能)这样：`anchors.right : parent.anchors.right`

Anchors 也可以用来对边缘留白,示意图如下：

![][margin]

用法则与上面的 right ,left 之类的如出一辙。

摘录一段关于 Anchors 的忠告，以及使用策略。

> #### Hints and Tips – Anchors
>
> -   Anchors can only be used with parent and sibling items
> -   Anchors work on constraints
>     -   some items need to have well-defined positions and sizes
>     -   items without default sizes should be anchored to fixed
>         orwell-defined items
>
> -   Anchors creates dependencies on geometries of other items
>     -   creates an order in which geometries are calculated
>     -   avoid creating circular dependencies
>
>     -   e.g., parent!child!parent
>
> -   Margins are only used if the corresponding anchors are used
>     -   e.g.,leftMarginneedsleftto be defined
>
> #### Strategies for Use – Anchors
>
> Identify item with different roles in the user interface:
>
> -   Fixed items
>     -   make sure these have id properties defined
>     -   unless these items can easily be referenced as parent items
>
> -   Items that dominate the user interface
>     -   make sure these have id properties defined
>
> -   Items that react to size changes of the dominant items
>     -   give these anchors that refer to the dominant or fixed items
>
参考资料：[Qt Quick for C++ Developers][]


[anchors]: http://www.roading.org/images/2012-02/image_thumb8.png
[margin]: http://www.roading.org/images/2012-02/image_thumb10.png
[Qt Quick for C++ Developers]: http://qt.nokia.com/learning/online/training/materials/qt-essentials-qt-quick-edition
