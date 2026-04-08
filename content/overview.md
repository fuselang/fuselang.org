---
title: "Overview"
description: "An overview of the Fuse programming language."
---

Fuse is a statically typed, purely functional language that compiles to native code through GRIN and LLVM. This overview walks through the language from the basics to advanced features.

## Hello World

Every Fuse program starts with a `main` function that returns an `i32` exit code.

{{< fuse >}}
fun main() -> i32
    print("Hello, World!\n")
    0
{{< /fuse >}}

The `print` function outputs a string to standard output. The last expression in the function body is the return value. Here, `0` indicates successful execution.

You can define helper functions and call them from `main`:

{{< fuse >}}
fun println(s: str) -> Unit
    print(s)
    print("\n")
    ()

fun main() -> i32
    println("Hello from Fuse!")
    0
{{< /fuse >}}

Fuse uses **indentation** to define blocks. No braces or `end` keywords are needed. The `Unit` type (and its value `()`) represents "no meaningful value", similar to `void` in other languages.

## Primitives

Fuse provides a small set of primitive types:

| Type | Description |
|------|-------------|
| `i32` | 32-bit signed integer |
| `f32` | 32-bit floating point |
| `str` | String |
| `bool` | Boolean (`true` or `false`) |
| `Unit` | Unit type (value is `()`) |

### Let bindings

Use `let` to bind a value to a name:

{{< fuse >}}
fun main() -> i32
    let x = 5
    let y = x + 1
    let name = "Fuse"
    let pi = 3.14
    let active = true
    0
{{< /fuse >}}

### Operators

{{< fuse >}}
fun main() -> i32
    let sum = 1 + 1          # addition
    let diff = 5 - 3         # subtraction
    let product = 4 * 3      # multiplication
    let quotient = 10 / 2    # division
    let remainder = 7 % 3    # modulo
    0
{{< /fuse >}}

Strings can be concatenated with `+`:

{{< fuse >}}
fun main() -> i32
    let greeting = "Hello " + "World"
    print(greeting)
    0
{{< /fuse >}}

Comparison and logical operators:

{{< fuse >}}
fun main() -> i32
    let a = 1 == 2     # false
    let b = 1 != 2     # true
    let c = 3 < 5      # true
    let d = true && false   # false
    let e = true || false   # true
    0
{{< /fuse >}}

## Algebraic data types

Fuse supports three kinds of algebraic data types: **sum types** (variants), **records** (product types with named fields), and **tuples** (product types with positional fields).

### Sum types

Sum types let you define a type that can be one of several variants:

{{< fuse >}}
type Color:
    Red
    Green
    Blue
{{< /fuse >}}

Variants can carry data, and types can be parameterized with type variables:

{{< fuse >}}
type Option[T]:
    None
    Some(T)
{{< /fuse >}}

Types can refer to themselves, enabling structures like linked lists:

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil
{{< /fuse >}}

### Records

Records are product types where each field has a name:

{{< fuse >}}
type Point:
    x: i32
    y: i32
{{< /fuse >}}

Records can have type parameters:

{{< fuse >}}
type Map[K, V]:
    key: K
    value: V
{{< /fuse >}}

### Tuples

Tuples are product types with unnamed, positional fields:

{{< fuse >}}
type Pair(i32, str)

type Tuple[A, B](A, B)
{{< /fuse >}}

### Type aliases

You can create type aliases for convenience:

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil

type Ints = List[i32]
{{< /fuse >}}

## Functions

Functions are defined with the `fun` keyword, followed by the name, parameters with types, and a return type.

{{< fuse >}}
fun sum(x: i32, y: i32) -> i32
    x + y

fun main() -> i32
    let result = sum(5, 3)
    print(int_to_str(result))
    0
{{< /fuse >}}

### Recursive functions

{{< fuse >}}
fun fib(n: i32, a: i32, b: i32) -> i32
    match n:
        0 => b
        _ => fib(n - 1, b, a + b)

fun main() -> i32
    let result = fib(10, 0, 1)
    print(int_to_str(result))
    0
{{< /fuse >}}

### Lambda expressions

Anonymous functions use the `=>` arrow syntax:

{{< fuse >}}
fun main() -> i32
    let f = a => a + 1
    let g = (x, y) => x + y
    print(int_to_str(f(5)))
    0
{{< /fuse >}}

Lambdas are first-class values. They can be passed to functions, stored in variables, and returned from functions.

### Function types

The type of a function is written with `->`:

- `i32 -> i32` takes an `i32`, returns an `i32`
- `(i32, i32) -> i32` takes two `i32`s, returns an `i32`
- `A -> B -> C` curried: takes `A`, returns a function `B -> C`

## Pattern Matching

Pattern matching is a core feature of Fuse, used to inspect and destructure values.

### Matching on literals

{{< fuse >}}
fun describe(x: i32) -> str
    match x:
        1 => "one"
        2 => "two"
        _ => "something else"

fun main() -> i32
    print(describe(2))
    0
{{< /fuse >}}

The `_` pattern matches anything and is used as a catch-all.

### Matching on variants

{{< fuse >}}
type Option[A]:
    None
    Some(A)

fun describe_option(o: Option[i32]) -> str
    match o:
        Some(v) => "has value: " + int_to_str(v)
        None => "empty"

fun main() -> i32
    let o = Some(42)
    print(describe_option(o))
    0
{{< /fuse >}}

### Inline blocks

When a match arm needs multiple expressions, use braces:

{{< fuse >}}
type Option[A]:
    None
    Some(A)

fun main() -> i32
    let o = Some(5)
    match o:
        Some(v) => {
            print("found: ")
            print(int_to_str(v))
            0
        }
        None => 1
{{< /fuse >}}

## Generics

Generics let you write code that works with any type. Fuse uses **monomorphization**: at compile time, generic code is specialized into concrete versions for each type it's used with, so there is no runtime overhead.

{{< fuse >}}
type Option[A]:
    None
    Some(A)

fun is_some[A](o: Option[A]) -> bool
    match o:
        Some(v) => true
        _ => false

fun main() -> i32
    let x = Some(42)
    match is_some(x):
        true => 0
        false => 1
{{< /fuse >}}

In most cases, Fuse's bidirectional type inference figures out the types automatically.

## Traits

Traits (also known as type classes) define shared behavior that types can implement. They enable ad-hoc polymorphism, allowing different types to provide their own implementations of the same interface.

{{< fuse >}}
trait Functor[A]:
    fun map[B](self, f: A -> B) -> Self[B];
{{< /fuse >}}

Methods ending with `;` are **required** and must be provided by implementors. Use `impl Trait for Type` to provide an implementation:

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil

impl List[A]:
    fun fold_right[A, B](as: List[A], z: B, f: (A, B) -> B) -> B
        match as:
            Cons(x, xs) => f(x, List::fold_right(xs, z, f))
            Nil => z

trait Functor[A]:
    fun map[B](self, f: A -> B) -> Self[B];

impl Functor[A] for List[A]:
    fun map[B](self, f: A -> B) -> List[B]
        List::fold_right(self, Nil[B], (h, t) => Cons(f(h), t))
{{< /fuse >}}

### Default implementations

Trait methods can have default implementations:

{{< fuse >}}
type Option[A]:
    None
    Some(A)

trait Monad[A]:
    fun unit[T](a: T) -> Self[T];

    fun flat_map[B](self, f: A -> Self[B]) -> Self[B];

    fun map[B](self, f: A -> B) -> Self[B]
        let f = a => Self::unit(f(a))
        self.flat_map(f)

impl Monad for Option[A]:
    fun unit[T](a: T) -> Option[T]
        Some(a)

    fun flat_map[B](self, f: A -> Option[B]) -> Option[B]
        match self:
            Some(v) => f(v)
            _ => None
{{< /fuse >}}

The `Option` implementation only needs to provide `unit` and `flat_map`. The `map` method is inherited from the default.

## Higher-Order Functions

In Fuse, functions are first-class values. They can be passed as arguments, returned from other functions, and stored in variables.

{{< fuse >}}
fun apply(x: i32, f: i32 -> i32) -> i32
    f(x)

fun main() -> i32
    let result = apply(5, a => a + 1)
    print(int_to_str(result))
    0
{{< /fuse >}}

### Map, filter, and fold

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil

impl List[A]:
    fun fold_right[A, B](as: List[A], z: B, f: (A, B) -> B) -> B
        match as:
            Cons(x, xs) => f(x, List::fold_right(xs, z, f))
            Nil => z

    fun filter[A](self, f: A -> bool) -> List[A]
        List::fold_right(self, Nil[A], (h, t) => {
            match f(h):
                true => Cons(h, t)
                false => t
        })

    fun sum(l: List[i32]) -> i32
        List::fold_right(l, 0, (acc, b) => acc + b)

trait Functor[A]:
    fun map[B](self, f: A -> B) -> Self[B];

impl Functor[A] for List[A]:
    fun map[B](self, f: A -> B) -> List[B]
        List::fold_right(self, Nil[B], (h, t) => Cons(f(h), t))

fun main() -> i32
    let l = Cons(2, Cons(3, Nil))
    let result = l.map(v => v + 1).filter(e => e > 3)
    let s = List::sum(result)
    print(int_to_str(s))
    0
{{< /fuse >}}

## Methods

Methods are functions attached to a type via `impl` blocks.

### Instance methods

Methods that take `self` as their first parameter are called with dot syntax:

{{< fuse >}}
type Option[A]:
    None
    Some(A)

impl Option[A]:
    fun map[B](self, f: A -> B) -> Option[B]
        match self:
            Some(v) => Some(f(v))
            _ => None

fun main() -> i32
    let o = Some(5)
    let o1 = o.map(a => a + 1)
    match o1:
        Some(v) => {
            print(int_to_str(v))
            0
        }
        None => 1
{{< /fuse >}}

### Static methods

Methods without `self` are static and are called using `Type::method()` syntax:

{{< fuse >}}
type List[A]:
    Cons(h: A, t: List[A])
    Nil

impl List[A]:
    fun fold_right[A, B](as: List[A], z: B, f: (A, B) -> B) -> B
        match as:
            Cons(x, xs) => f(x, List::fold_right(xs, z, f))
            Nil => z

    fun append[A](l1: List[A], l2: List[A]) -> List[A]
        List::fold_right(l1, l2, (h, t) => Cons(h, t))

fun main() -> i32
    let a = Cons(1, Cons(2, Nil))
    let b = Cons(3, Nil)
    let c = List::append(a, b)
    0
{{< /fuse >}}

## Do Notation

Do notation provides syntactic sugar for chaining operations that may fail or produce effects. It desugars into calls to `flat_map`.

{{< fuse >}}
type Option[A]:
    None
    Some(A)

trait Monad[A]:
    fun unit[T](a: T) -> Self[T];

    fun flat_map[B](self, f: A -> Self[B]) -> Self[B];

    fun map[B](self, f: A -> B) -> Self[B]
        let f = a => Self::unit(f(a))
        self.flat_map(f)

impl Monad for Option[A]:
    fun unit[T](a: T) -> Option[T]
        Some(a)

    fun flat_map[B](self, f: A -> Option[B]) -> Option[B]
        match self:
            Some(v) => f(v)
            _ => None

fun main() -> i32
    let x = Some(1)
    let y = Some(2)
    let z = Some(3)
    let result = {
        do:
            i <- x
            j <- y
            k <- z
            i + j + k
    }
    match result:
        Some(v) => v
        _ => 0
{{< /fuse >}}

The `<-` operator binds the value inside a monadic context. If any step produces `None`, the whole chain short-circuits to `None`.
