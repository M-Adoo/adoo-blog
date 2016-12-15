---
title: Chapter 10 Exercises and Problems (2)
date: 2011-11-06 17:28
categories: Introduction to Algorithm -third edition
tags: 
	- Exercises
	- 算法导论
override_permailink: /algorithm/introductiontoalgorithm/chapter-10-exercises-and-problems-2
---

### Exercises 10.3-4

>It is often desirable to keep all elements of a doubly linked list compact >in storage, using, for example, the first *m* index locations in the >multiple-array representation. (This is the case in a paged, virtual-memory >computing environment.) Explain how the procedures ALLOCATE-OBJECT and FREE->OBJECT can be implemented so that therepresentation is compact. Assume that >there are no pointers to elements of the linked list outside the list >itself. (*Hint:* Use the array implementation of a stack.)

**Solutions:**
用栈来管理空闲资源，并且使得链表的内存紧凑，这表明栈中的空闲资源也是紧凑的，因为若空闲资源不是紧凑的，那分配出去的资源肯定也不是紧凑的。其次，这个栈每一次出栈的资源必然是位置最靠近已分配资源的，这也就是说明该栈中存储的所有空闲资源在位置上是有序的。总而言之，这个问题实质是要我们这样做：对于该双向链表的资源的管理，总是分配最靠近双向链表的空闲资源，而回收时总是回收位置最靠近空闲资源栈的资源。

具体操作为，对于资源分配，直接出栈即可。对于资源回收，应当先将其交换到位置最靠近资源回收栈的节点再回收。

资源分配的伪代码：
	
```c
Allocate_Object()
	if(Stack-Empty(free) )
			error "overflow"
	return Pop(free)
```

资源回收的伪代码：

```c
Free_Object(x)
	last_node = Top(free)-1
	//remove the x 
	List_Delete(x)
	//replace last_node by x
	x.key = last_node.key
	last_node.prev.next = x
	last.node.next.prev = x
	x.prev = last.prev
	x.next = last.next
	//free last_node;
	Push(free,x)
```

### Exercises 10.3-5

>Let *L* be a doubly linked list of length *m* stored in arrays *key*,
>*prev*, and *next* of length *n*. Suppose that these arrays are managed
>by ALLOCATE-OBJECT and FREE-OBJECT procedures that keep a doubly linked
>free list *F*. Suppose further that of the *n* items, exactly *m* are on
>list *L* and *n-m* are on the free list. Write a procedure
>COMPACTIFY-LIST(*L*, *F*) that, given the list *L* and the free list
>*F*, moves the items in *L* so that they occupy array positions 1,
>2,..., *m* and adjusts the free list *F* so that it remains correct,
>occupying array positions *m* + 1, *m* + 2,..., *n*. The running time of
>your procedure should be Θ(*m*), and it should use only a constant
>amount of extra space. Give a careful argument for the correctness of
>your procedure.

**Solutions：**遍历双向链表，依次将它的节点交换到数组的前m个位置即可，在交换时需要提供一个额外的节点。

### Problems 10-2: Mergeable heaps using linked lists

>A ***mergeable heap*** supports the following operations: MAKE-HEAP
>(which creates an empty mergeable heap), INSERT, MINIMUM, EXTRACT-MIN,
>and UNION[^1].Show how to implement mergeable heaps using linked lists in
>each of the following cases. Try to make each operation as efficient as
>possible. Analyze the running time of each operation in terms of the
>size of the dynamic set(s) being operated on.
>1.  Lists are sorted.
>2.  Lists are unsorted.
>3.  Lists are unsorted, and dynamic sets to be merged are disjoint.

*Solution:**想了快一个小时，没找到什么思路，留待高手来教我。

[^1]:Because we have defined a mergeable heap to support MINIMUM and
EXTRACT-MIN, we can also refer to it as a ***mergeable min-heap***.
Alternatively, if it supported MAXIMUM and EXTRACT-MAX, it would be a
***mergeable max-heap***.

