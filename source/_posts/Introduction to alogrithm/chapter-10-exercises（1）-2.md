---
title: Chapter 10 Exercises（1）
date: 2011-11-05 14:49
categories: Introduction to Algorithm -third edition
tags:
	- Exercises
	- 算法导论
	- 笔记
override_permailink: /algorithm/introductiontoalgorithm/chapter-10-exercises（1）-2
---

### Exercises 10.1-2★

>Explain how to implement two stacks in one array *A*[*1* ‥ *n*] in such a
>way that neither stack overflows unless the total number of elements in
>both stacks together is *n*. The PUSH and POP operations should run in
>*O*(1) time.

**Solution:**令两个栈的栈底为一个数组的两端，这样的话可以充分利用整个数组，直到两个栈顶相遇。关键在于怎么样来判断两个栈顶是否相遇，两种思路。

**思路一**：设置哨兵（Sentinel）：在栈顶的下一个位置存储一个特殊值来作为警戒线，这如同告诉另一个栈，到这个地方就是我的领地了，别再过来，哨兵随着栈的大小而移动，需要注意的是哨兵在移动到新的位置的过程中，需将原来的哨兵撤销。示图：

![][边界模式]

这种方式哨兵需占有两个空间，实际的空间利用为n-2而不是n.

**思路二**：与思路一相反，思路二将所有的未利用空间全部标记为“未利用空间”——用无穷表示。栈的任何一次Pop操作以后，都需将原来的栈顶标记为未使用空间。在Push操作之前，先判断栈顶之后的元素是否为未使用空间。如下图示：

![][占领模式]

两种不同的思路，恰恰如同大国奉行的国土攻守政策，思路一主防——凡是我过领土，派兵进驻边境，阻止外国倾入。思路二主攻——凡是无主领地，我便派兵占领。南海问题是一种怎么样的政策？

### Exercises 10.1-6★

>Show how to implement a queue using two stacks. Analyze the running time
>of the queue operations.

**Solutions:**我将这个问题概括为桶饼模型：给俩个与饼同大的小桶，往桶中放饼，要求你在拿饼的时候将先放进去的饼给拿出来。很显然，先放的饼在桶底，无法直接拿出，我们只能借助于另一个桶——把桶中的饼到往另一个桶中，原来桶底的饼就到了最上面，可以直接拿到了。

完整的步骤为：将一个桶设为放饼桶，另一个桶设为取饼桶。所有的放饼操作都在放饼桶进行，并保证放饼之前，所有的饼已经都在放饼桶，若不在将取饼桶的饼倒入放饼桶，所有的取饼操作都在取饼桶进行，取饼之前将放饼桶的饼倒入取饼桶。

以此模型类推，Dequeue和EnQueue操作的复杂度都为O(n).当连续进行Dequeue或连续进行EnQueue操作时，它们的复杂度为1。

### Exercises 10.1-7★

>Show how to implement a stack using two queues. Analyze the running time
>of the stack operations.

**Solution:**我一开始在纸上划了几个图，想快速找出方法，但总想不到可行办法，其实无形中忽略了问题的本质。栈的本质在于后进先出，抓住这一点问题就很快解决了。这个题的实质就是要得到队列的最后一个元素，那么我们直接拿出前n-1不就可以了。

具体步骤：
1.	对于插入操作，将数据插入到有数据的那一个队列，若两队列都没有，随便插入一个队列。
2.	对于出栈操作，将有数据的一个队列中的数据一个个第拿出放入另一个队列，直到拿到最后一个，该数就是要出栈的数。

算法复杂度，入栈复杂度为O(1),出栈复杂度O(n)。

### Exercises 10.2-7★

>Give a Θ(*n*)-time nonrecursive procedure that reverses a singly linked list >of *n* elements. The procedure should use no more than constant storage >beyond that needed for the list itself.

**Soulutions:**在深信服笔试的时候好像做过这个题目，今天看到了特意再做一遍。要在*O*(n)的时间用非递归的方法使得单向线性表转向，要求空间复杂度为*O*(1)。反向嘛，所有的节点next指针指向前面的节点即可。但是有一点要注意的是将next指向它之前的节点的话，会有信息丢失，也就是说，此时你不知道了原来的next指向哪个节点了，迭代就无法继续，所以我们要用另外的空间来保存这些信息。

伪代码：

```c
ReverseList(L)
	if(L.head == NIL || L.head->next == NIL)
		return L; 
	Pre_OP = L.head; //the previous node of the opera node; 
	Op=head->next; //Op contain the opera node 
	Pre_OP->next=NIL; //let the head point to the NIL,then head be the tail  
	while(Op!= NIL) 
		Next_OP = Op->next
		Op->next =Pre_OP
		L.head = Op
		Pre_op = Op 
		Op = Next_OP
		
retutn L; 16 
```
	
### Exercises 10.2-8: ★

>Explain how to implement doubly linked lists using only one pointer
>value *np*[*x*] per item instead of the usual two (*next* and *prev*).
>Assume that all pointer values can be interpreted as *k*-bit integers,
>and define *np*[*x*] to be *np*[*x*] = *next*[*x*] XOR *prev*[*x*], the
>*k*-bit "exclusive-or" of *next*[*x*] and *prev*[*x*]. (The value NIL is
>represented by 0.) Be sure to describe what information is needed to
>access the head of the list. Show how to implement the SEARCH, INSERT,
>and DELETE operations on such a list. Also show how to reverse such a
>list in *O*(1) time.

**Solution:**这个题目比较有意思，用一个指针来实现一个双向链表。通常来讲我们实现一个双向链表每个节点有两个指针。在这儿的一个指针其实存储的是两个指针的信息——next和pre两个指针的按位异或。问题的关键在于如何将np解析成pre和next指针，这样我们就将问题转化为了一个普通的双向链表了。

由于是按位异或操作，只要将pre与next中任意一个与np进行一次按位异或操作就可以得到另一个了。而head的pre为0，那么可以得到head的next指针了，而`head->next->pre==head`,那么`head->next->next==head XOR head->next->np`，依次类推。这样就可以实现对这个一个指针的双向链表进行遍历了。需要的信息仅为指向表头的指针。

Search函数的伪代码：

```c
Search(L,k)
	x=L.head 
	next=x XOR NIL 
	while(x!=NIL && x.key!=k)
		p=x XOR next.np
		x=next
		next=p 
return x
```

Delete与Insert操作的伪代码略。

*show how to reverse such a list in O(1)
time.*在没有存储尾节点的情况下在O(1)时间内似乎无法办到，如果有存储尾节点的话，这倒是好办，直接head与tail交换即可（也可能我没有理解好题意）。


[边界模式]: http://www.roading.org/images/2011-11/2ad0ba5fcd7b_thumb.jpg
[占领模式]: http://www.roading.org/images/2011-11/11_thumb.jpg
