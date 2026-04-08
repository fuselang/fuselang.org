---
title: "Fuse Programming Language"
---

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil

trait Functor[A]:
    fun map[B](self, f: A -> B) -> Self[B];

impl List[A]:
    fun fold[A, B](l: List[A], z: B, f: (B, A) -> B) -> B
        match l:
            Cons(h, t) => List::fold(t, f(z, h), f)
            Nil => z

    fun sum(l: List[i32]) -> i32
        List::fold(l, 0, (a, b) => a + b)

impl Functor[A] for List[A]:
    fun map[B](self, f: A -> B) -> List[B]
        List::fold(self, Nil[B], (t, h) => Cons(f(h), t))

fun main() -> i32
    let l = Cons(1, Cons(2, Cons(3, Nil)))
    let l2 = l.map(x => x * 2)
    let s = List::sum(l2)
    print(int_to_str(s))
    0
{{< /fuse >}}
