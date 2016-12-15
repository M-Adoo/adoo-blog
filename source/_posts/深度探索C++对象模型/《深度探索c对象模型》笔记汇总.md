---
title: 《深度探索C++对象模型》笔记汇总
date: 2011-12-09 22:03
categories: 深度探索C++对象模型
tags: 
    - Inside The C++ Object Model
    - 笔记
override_permailink: /develop/cpp/《深度探索c对象模型》笔记汇总
---

-   [01. 总结——亦为引言](http://www.roading.org/develop/cpp/%E6%B7%B1%E5%BA%A6%E6%8E%A2%E7%B4%A2c%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B/%E6%80%BB%E7%BB%93%E4%BA%A6%E4%B8%BA%E5%BC%95%E8%A8%80.html)

### 第1章 关于对象(Object Lessons)

-   [02. C++对象面面观](http://www.roading.org/develop/cpp/c%E5%AF%B9%E8%B1%A1%E9%9D%A2%E9%9D%A2%E8%A7%82.html)

### 第2章 构造函数语意学(The Semantics of constructors)

-   [03. 深入C++构造函数](http://www.roading.org/develop/cpp/%E6%B7%B1%E5%85%A5c%E9%BB%98%E8%AE%A4%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0.html)
-   [04. 拷贝构造函数(Copy Constructor)](http://www.roading.org/develop/cpp/%E6%8B%B7%E8%B4%9D%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%EF%BC%88copy-constuctor%EF%BC%89.html)
-   [05. 命名返回值优化和成员初始化队列](http://www.roading.org/develop/cpp/%E5%91%BD%E5%90%8D%E8%BF%94%E5%9B%9E%E5%80%BC%E4%BC%98%E5%8C%96%E5%92%8C%E6%88%90%E5%91%98%E5%88%9D%E5%A7%8B%E5%8C%96%E9%98%9F%E5%88%97.html)

### 第3章 Data语意学（The Semantics of Data）

-   [06. C++类对象的大小](http://www.roading.org/develop/cpp/c%E7%B1%BB%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%A4%A7%E5%B0%8F.html)
-   [07. VC内存对齐准则（Memory alignment）](http://www.roading.org/develop/cpp/vc%E5%86%85%E5%AD%98%E5%AF%B9%E9%BD%90%E5%87%86%E5%88%99%EF%BC%88memory-alignment%EF%BC%89.html)
-   [08. C++对象的数据成员](http://www.roading.org/develop/cpp/c%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%95%B0%E6%8D%AE%E6%88%90%E5%91%98.html)

### 第4章 Function语意学（The Semantics of Function）

-   [09. C++之成员函数调用](http://www.roading.org/develop/cpp/c%E4%B9%8B%E6%88%90%E5%91%98%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8.html)
-   [10. C++之虚函数(Virtual Member Functions)](http://www.roading.org/develop/cpp/c%E4%B9%8B%E8%99%9A%E5%87%BD%E6%95%B0virtual-member-functions.html)

### 第5章 构造、解构、拷贝 语意学（Semantics of Construction，Destruction，and Copy）

-   [11. 几点类设计原则](http://www.roading.org/develop/cpp/%E5%87%A0%E7%82%B9%E7%B1%BB%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99.html)
-   [12. 构造、复制、析构语意学](http://www.roading.org/develop/cpp/%E6%9E%84%E9%80%A0%E3%80%81%E5%A4%8D%E5%88%B6%E3%80%81%E6%9E%90%E6%9E%84%E8%AF%AD%E6%84%8F%E5%AD%A6.html)

### 第6章 执行期语意学（Runting Semantics）

-   [13. new expression、operator new 和 placement new——三个“妞（new）”的故事（1）](http://www.roading.org/develop/cpp/new-expression%E3%80%81operator-new-%E5%92%8C-placement-new%E4%B8%89%E4%B8%AA%E5%A6%9E%EF%BC%88new%EF%BC%89%E7%9A%84%E6%95%85%E4%BA%8B%EF%BC%881%EF%BC%89.html)
-   [14. new expression、operator new 和 placement new——三个“妞（new）”的故事（2）](http://www.roading.org/develop/cpp/new-expression%E3%80%81operator-new-%E5%92%8C-placement-new%E4%B8%89%E4%B8%AA%E5%A6%9E%EF%BC%88new%EF%BC%89%E7%9A%84%E6%95%85%E4%BA%8B%EF%BC%882%EF%BC%89.html)
-   [15. new expression、operator new 和 placement new——三个“妞（new）”的故事（3）](http://www.roading.org/develop/cpp/new-expression%E3%80%81operator-new-%E5%92%8C-placement-new%E4%B8%89%E4%B8%AA%E5%A6%9E%EF%BC%88new%EF%BC%89%E7%9A%84%E6%95%85%E4%BA%8B%EF%BC%883%EF%BC%89.html)
-   [16. 对象的构造和析构](http://www.roading.org/develop/cpp/%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%9E%84%E9%80%A0%E5%92%8C%E6%9E%90%E6%9E%84.html)
-   [17. 临时性对象(Temporary Objects)](http://www.roading.org/develop/cpp/%E4%B8%B4%E6%97%B6%E6%80%A7%E5%AF%B9%E8%B1%A1temporary-objects.html)

### 第7章 站在对象模型的类端（On the Cusp of the Object Model）

-   [18. 模板二事](http://www.roading.org/develop/cpp/%E6%A8%A1%E6%9D%BF%E4%BA%8C%E4%BA%8B.html)
-   [19. EH & RTTI](http://www.roading.org/develop/cpp/eh-rtti.html)