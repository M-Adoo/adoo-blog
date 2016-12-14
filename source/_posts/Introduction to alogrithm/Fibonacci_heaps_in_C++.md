---
title: 斐波那契堆的C++实现
date: 2012-10-1
categories: Introduction to Algorithm -third edition
tags: 算法导论,Fibonacci heaps, 笔记
override_permailink: /algorithm/fibonacci-heaps-in-cpp
---

时间过的真是快，都是七月份写的代码了，两个多月了。

	//-------------------------------------------------------------------------
	//filename: fibonacciHeaps.h
	//Author:   Adoo
	//date:		2012/7/16
	//Description:Implement Fibonacci Heaps by C++
	//-------------------------------------------------------------------------
	#ifndef FIBONACCIHEAP_HPP
	#define FIBONACCIHEAP_HPP
	#include<algorithm>

	template<typename T>
	class FibonacciHeap{
	public:
		struct node{
			T value;
			node* parent;
			node* child;
			node* left;
			node* right;
			bool mark;
			int  degree;
		
			node(T t_value=T()):value(t_value),parent(NULL),child(NULL),
				left(this),right(this),mark(false),degree(0)
			{}
		};

	public:
		FibonacciHeap():min(NULL),size(0){
		}

		node* insert(T value){
			node* pn= new node(value);
			if(min==NULL)
				min=pn;
			else{
				//insert the new node to circular doubly list;
				insertToList(min,pn);
				if(min->value > pn->value)
					min=pn;
			}
			size+=1;
			return pn;
		}

		bool empty(){
			return NULL==min;
		}

		node* minmum(){
			return min;
		}
	
		node* extract_min(){
			//As soon as the min node been extract,the node is no relation with the object;
			//User who extrat the node should release it;
			node* z=min;
			if(z!= NULL){
				while( z ->child != NULL){
					node* pn = extract_node(z->child);
					insertToList(min,pn);
				}
				if (z == z->right){
					min=NULL;
				}
				else{
					min = z->right;
					z = extract_node(z); 
					consolidate();
				}
				size -= 1;
			}
			return z;
		}
	
		void merge(FibonacciHeap & fib)
		{
			if (this->min != NULL)
			{
				if (fib.min != NULL)
				{
					min->right->left = fib.min->left;
					fib.min->left->right = min->right;
					min->right = fib.min;
					fib.min ->left = min;
					if(min->value > fib.min->value)
						min = fib.min;
				}
				size += fib.size;
			}
			else
				min = fib.min;

			fib.min = NULL;
		}
	
		bool decrease_key(node* x, T value)
		{
			if(x->value < value)
				return false;
			x->value = value;
			node* p= x->parent;
			if (p != NULL && x->value < p->value)
			{
				x=extract_node(x);
				insertToList(min, x);
				cascading_cut(p);
			}
			if(x->value < min->value)
				min = x;
			return true;
		}

		void delete_node(node* pn){
			decrease_key(pn, numeric_limits<T>::min() );
			pn = extract_min();
			delete pn;
			pn = NULL;
		}
	
		~FibonacciHeap(){
			//release resource
			while (min != NULL && min != min->right)
			{
				node* tmp=min;
				min=min->right;
				extract_node(tmp);
				release_node(tmp);
			}
			release_node(min);
			min = NULL;
		}
	private:
		void release_node(node * x)
		{
			if(x != NULL)
			{
				while (x->child != NULL)
				{
					node* tmp=extract_node(x->child);
					release_node(tmp);
				}
				delete x;
				x= NULL;
			}
		}

		void insertToList(node* pos, node* pn ){
			if(pos!=NULL){
				pos->right->left=pn;
				pn->right=pos->right;
				pos->right=pn;
				pn->left=pos;
				pn->parent=pos->parent;
				if (pos->parent != NULL)
					pos->parent->degree += 1;
			}
		}
	
		node* extract_node(node* pn){
		//提取结点，对结构来说安全。
		//但只是简单的用其右兄弟代替它。
			if (pn == NULL)
				return NULL;
			if(pn->parent != NULL){
				pn->mark=false;
				if (pn->right != pn)
					pn->parent->child = pn->right;
				else
					pn->parent->child = NULL;
			
				if (pn->parent->parent != NULL)
					pn->parent->mark=true;
				pn->parent->degree -=1;
				pn->parent=NULL;
			}
			if (pn->left != pn){
				pn->left->right = pn->right;
				pn->right->left = pn->left;

				pn->left=pn;
				pn->right=pn;
			}
			pn->mark=false;
			return pn;
		};
	
		void consolidate(){
			using std::log;
			if(min == NULL)
				return;
			const float base = 2;
			const float arg = static_cast<float>(size);
			const int max=log(arg)/log(base) + 1;
			node **A=new node*[max];
			for(int i=0; i!=max; ++i){
				A[i]=NULL;
			}

			node *pn=min;
			int degree= pn->degree;
			while (pn != A[degree]){
				if(A[degree] != NULL){
					//若遇到度数相同的结点，则将A中的该结点链接到迭代器结点上。
					if (A[degree]->value < pn->value){
						std::swap(A[degree],pn);
					}
					if (pn->child == NULL){
						A[degree]=extract_node(A[degree]);
						pn->child = A[degree];
						A[degree]->parent = pn;
						pn->degree +=1;
					}	
					else{
						A[degree] = extract_node(A[degree]);
						insertToList(pn->child, A[degree]);
					}
					A[degree]=NULL;
				}
				else{
					A[degree]=pn;
					pn=pn->right;
				}
				degree= pn->degree;
			};
			min=NULL;
			for (int i= 0; i!= max; ++i){
				if (A[i] != NULL)
					if (min==NULL)
						min=A[i];
					else
						if (A[i]->value < min-> value)
							min=A[i];
			}
			delete A;
		}

		void cascading_cut(node *x)
		{
			node* p = x->parent;
			if (p != NULL)
			{
				if(p->mark == false)
					p->mark = true;
				else{
					extract_node(x);
					insertToList(min, x);

					cascading_cut(p);
				}
			}
		}
		node* min;
		int size;
	};
	#endif

