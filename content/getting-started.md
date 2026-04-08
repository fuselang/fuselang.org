---
title: "Get Started"
description: "Install the Fuse toolchain and write your first program."
---

## Install the Fuse toolchain

Run the installer to get everything you need:

```
curl -fsSL https://fuselang.github.io/fuse/fuseup | sh
```

This installs the complete toolchain:

- **fuse** compiler
- **grin** compiler (whole-program optimizer)
- **LLVM** tools (clang, opt, llc)
- **Boehm GC** (garbage collector)
- **Runtime** files

Supported platforms: Linux (x86_64) and macOS (ARM64).

After installation, open a new terminal or source your shell profile, then verify:

```
fuse --version
```

## Write your first program

Create a file called `hello.fuse`:

{{< fuse >}}
fun main() -> i32
    print("Hello from Fuse!\n")
    0
{{< /fuse >}}

Every Fuse program has a `main` function that returns an `i32` exit code. The `print` function writes to standard output. The last expression is the return value.

## Check and compile

You can check your program for type errors without compiling:

```
fuse check hello.fuse
```

To compile to a native executable:

```
fuse build hello.fuse
```

This produces `hello.out`, a native binary. Run it:

```
./hello.out
```

You should see:

```
Hello from Fuse!
```

## A more complete example

Create a file called `option.fuse` that shows off sum types, generics, pattern matching, and methods:

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

Compile and run it:

```
fuse build option.fuse
./option.out
```

Output: `6`

## Next steps

Continue to the [Overview]({{< relref "/overview" >}}) to learn the language through annotated examples.
