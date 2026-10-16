# C# × Unity 完全知识手册（从零基础到进阶）

> 面向 **Unity 游戏开发方向** 的 C# 全量知识点总结。
> 覆盖：语言基础 → 面向对象 → 委托/事件/LINQ → 泛型/反射/特性/异常 → 现代 C# 特性 → Unity 脚本运行时 → 引擎各子系统 → 性能与内存 → 设计模式 → 工程化。
> 每个知识点都给出可直接运行的代码示例与 Unity 实战用法，并标注 Unity 的版本支持情况。

### 阅读约定

- `[SerializeField]` 这类行内代码块为 Unity 特性/API。
- 代码示例默认位于 Assets/Scripts/ 下的普通 .cs 文件（MonoBehaviour 需要挂到 GameObject 上才会执行）。
- 版本标注以当前主流 LTS（2020.3 / 2021.3 / 2022.3 / Unity 6）为准；涉及 API 变更处均标注了起始版本。

---

## 目录

1. [第 0 章 学习路线与运行环境](#第-0-章-学习路线与运行环境)
2. [第 1 章 C# 语言与类型系统基石](#第-1-章-c-语言与类型系统基石)
3. [第 2 章 变量、运算符与流程控制](#第-2-章-变量运算符与流程控制)
4. [第 3 章 面向对象（OOP）](#第-3-章-面向对象oop)
5. [第 4 章 委托、事件、Lambda 与 LINQ](#第-4-章-委托事件lambda-与-linq)
6. [第 5 章 泛型、反射、特性与异常](#第-5-章-泛型反射特性与异常)
7. [第 6 章 现代 C# 特性（C# 6 → 9）与 Unity 支持矩阵](#第-6-章-现代-c-特性c-6--9与-unity-支持矩阵)
8. [第 7 章 Unity 脚本运行时核心](#第-7-章-unity-脚本运行时核心)
9. [第 8 章 Unity 引擎子系统](#第-8-章-unity-引擎子系统)
10. [第 9 章 性能与内存](#第-9-章-性能与内存unity-特有的-c-陷阱)
11. [第 10 章 架构与设计模式](#第-10-章-架构与设计模式)
12. [第 11 章 工程化：测试、调试、构建](#第-11-章-工程化测试调试构建)
13. [附录 A 高频 API 速查表](#附录-a-高频-api-速查表)
14. [附录 B 易错点清单](#附录-b-易错点清单checklist)
15. [附录 C 自检报告](#附录-c-api-与知识点自检报告)

---

## 第 0 章 学习路线与运行环境

### 0.1 为什么 Unity 选择 C#

| 原因 | 说明 |
| --- | --- |
| 托管运行时 | Mono / IL2CPP 提供 GC 与跨平台 JIT/AOT，用 C# 写业务逻辑效率高 |
| 生态成熟 | 大量插件、SDK、开源库都是 C# |
| 与引擎绑定 | Unity 用 C# 暴露引擎 API；底层（物理、渲染、动画）是 C++ |
| 可 AOT 化 | IL2CPP 把 IL 转成 C++ 再编译为原生代码，满足 iOS/主机禁止 JIT 的要求 |

### 0.2 Unity 的 C# 版本对照表（务必记住）

| Unity 版本 | 内置 C# 版本 | .NET API 兼容级别 | 备注 |
| --- | --- | --- | --- |
| 2017.x | C# 6 | .NET 3.5 / 4.x 可选 | 老项目 |
| 2018.3 | C# 7.3 | .NET 4.x Equivalent | 现代基线 |
| 2019.4 LTS | C# 7.3 | .NET Standard 2.0 / 4.x | 同上 |
| 2020.2 | C# 8.0 | .NET Standard 2.1 / 4.x | 默认接口方法不可用 |
| 2021.2+ | C# 9.0 | .NET Standard 2.1 / 4.x | record、init、模式匹配增强 |
| Unity 6（6000.x） | C# 9.0 | .NET Standard 2.1 | 仍是 C# 9 |

**关键结论**

- C# 8 的 **默认接口实现（DIM, Default Interface Methods）在 Unity 中不可用**，因为 Mono/Roslyn 组合未启用该特性。
- C# 8 的 **可空引用类型（NRT）** 可用（需要 `csc.rsp` / 项目设置开启），但 Unity 自带代码未标注，会产生大量警告，项目里通常关闭。
- C# 9 的 `record`、`init`、目标类型 `new`、`with` 表达式在 **Unity 2021.2+** 可用。
- C# 10/11 的 `record struct`、原始字符串、文件作用域命名空间等 **Unity 暂不支持**。

切换 API 兼容级别：`Edit → Project Settings → Player → Other Settings → Api Compatibility Level`。

### 0.3 学习路线（游戏方向）

```
阶段 1（1~2 周）  语法与类型系统              → 第 1、2 章
阶段 2（2~3 周）  面向对象 + 委托事件          → 第 3、4 章
阶段 3（1~2 周）  泛型 / 反射 / LINQ           → 第 4、5 章
阶段 4（2 周）     现代 C# + Unity 生命周期    → 第 6、7 章
阶段 5（3 周）     各子系统实践（物理/动画/UI/资源）→ 第 8 章
阶段 6（持续）     性能、架构、工程化           → 第 9、10、11 章
```

### 0.4 命名规范（Unity 官方 + .NET 通用）

| 元素 | 规范 | 示例 |
| --- | --- | --- |
| 类 / 结构 / 枚举 | PascalCase | `PlayerController`、`DamageInfo` |
| 接口 | 前缀 I + PascalCase | `IDamageable` |
| 方法 | PascalCase，动词开头 | `TakeDamage()` |
| 公有属性 | PascalCase | `public int Health { get; set; }` |
| 私有 / 受保护字段 | 下划线 + camelCase | `private float _moveSpeed;` |
| 局部变量 / 参数 | camelCase | `int hitCount` |
| 常量 | PascalCase 或全大写 | `const float MaxSpeed` |
| 泛型参数 | T + PascalCase | `TItem`、`TKey` |

> **重点**：Unity 的 `[SerializeField]` 可以让 private 字段出现在 Inspector，
> 所以养成 private + 下划线小驼峰的习惯，不要为了 Inspector 可见就滥用 public 字段。

---

## 第 1 章 C# 语言与类型系统基石

### 1.1 值类型 vs 引用类型（最重要的地基）

#### 概念

- **值类型（Value Type）**：变量内直接保存数据本身。赋值 = 拷贝内容。
  包含 `struct`、`enum`、所有数值类型、`bool`、`char`、`decimal`、`DateTime`，
  以及 Unity 的 `Vector2/Vector3/Vector2Int/Vector3Int/Quaternion/Color/Color32/Rect/Bounds/Matrix4x4/Ray/RaycastHit/Plane/BoundsInt` 等。
- **引用类型（Reference Type）**：变量保存指向堆上对象的引用。赋值 = 拷贝引用。
  包含 `class`、`interface`、`delegate`、`string`、`object`、数组，
  以及 `UnityEngine.Object` 及其派生（`GameObject`、`Transform`、`MonoBehaviour`、`ScriptableObject`、`Texture2D`、`Material` …）。

```csharp
using UnityEngine;

public class ValueVsReference : MonoBehaviour
{
    private void Start()
    {
        // ---------- 值类型：赋值即拷贝 ----------
        Vector3 a = new Vector3(1f, 0f, 0f);
        Vector3 b = a;            // 拷贝了三个 float
        b.x = 999f;
        Debug.Log(a.x);           // 1   （a 不受影响）

        // ---------- 引用类型：赋值即共享 ----------
        var list1 = new System.Collections.Generic.List<int> { 1, 2, 3 };
        var list2 = list1;        // 两者指向同一个 List 对象
        list2.Add(4);
        Debug.Log(list1.Count);   // 4

        // ---------- Unity 特有：Transform 是引用类型 ----------
        var t1 = transform;
        var t2 = transform;
        Debug.Log(ReferenceEquals(t1, t2)); // True，是同一个组件实例
    }
}
```

#### 返回 struct 的属性不能被直接改成员（CS1612）

```csharp
// ❌ 编译错误 CS1612：无法修改 Transform.position 的返回值，因为它不是变量
// transform.position.x = 5f;

// ✅ 写法一：取出、改、写回
Vector3 p = transform.position;
p.x = 5f;
transform.position = p;

// ✅ 写法二：使用内置 API（推荐，只有一次 native 调用）
transform.Translate(5f, 0f, 0f, Space.World);
```

> **CS1612 是 Unity 新手最常见的编译错误**：所有返回 struct 的属性（`position`、`rotation`、`localScale`、`color`、`center`…）
> 都不能直接修改成员的子成员。数组元素 `arr[i].x = 1f` 是允许的（数组元素是变量），属性返回值不是变量。

#### 隐式拷贝与 `in` 参数

`Vector3`、`Quaternion`、`Color`、`Bounds` 按值拷贝（3~16 个 float）。高频路径可用只读引用参数避免拷贝。

```csharp
// 每次调用拷贝一个 Vector3
void MoveToOld(Vector3 target) { }

// C# 7.2+ 的只读引用参数：零拷贝，且内部不能修改参数
void MoveToNew(in Vector3 target)
{
    // target.x = 1f;   // ❌ 编译错误，in 参数是只读的
    Vector3 local = target;   // 需要修改就先拷贝一份
}

// 调用时可以省略 in
MoveToNew(transform.position);
```

> `in` 对引用类型没有意义（引用本身就是 4/8 字节）；只对 struct 有价值。
> 注意：**不能用 `in` 修饰协程方法或事件处理器这类需要特定签名的场景**。

#### 装箱（Boxing）与拆箱（Unboxing）

把值类型放进 `object` 就会在堆上分配一个箱子，这是 Unity 里 GC 压力的重要来源。

```csharp
int hp = 100;

object boxed = hp;          // 装箱：堆分配一次
int back = (int)boxed;      // 拆箱：类型检查 + 取值

// Unity 中常见的隐式装箱场景
Debug.Log("HP = " + hp);                        // string 拼接：int → object → string
var list = new System.Collections.ArrayList();
list.Add(hp);                                   // 非泛型容器
string s = string.Format("{0}", hp);            // params object[] 装箱
Debug.LogFormat("HP = {0}", hp);                // 同上，params object[] 会装箱
```

**避免方式**

```csharp
// 1) 用泛型集合代替 ArrayList
var list = new System.Collections.Generic.List<int>();

// 2) 用已格式化好的字符串，或用 ToString 显式转换避免 object 转换
Debug.Log("HP = " + hp.ToString());   // 仍有字符串分配，但少了装箱

// 3) 高频日志用条件编译彻底去掉
[System.Diagnostics.Conditional("UNITY_EDITOR")]
private static void LogVerbose(string msg) => Debug.Log(msg);
```

> **判断是否装箱的实用方法**：在 Profiler 的 `GC Alloc` 列观察，或者用 Unity 的
> `Window → Analysis → Profiler → Memory → Detailed → GC Alloc`。
> 说明一点：`Debug.LogFormat(string, params object[])` 由于 `params object[]`，值类型实参**仍会装箱**。

#### struct 与 class 的选型

```csharp
// 适合 struct：小（≤16 字节）、不可变、生命周期短、数量大
public readonly struct DamageInfo
{
    public readonly float Amount;
    public readonly Vector3 HitPoint;
    public readonly int AttackerId;

    public DamageInfo(float amount, Vector3 hitPoint, int attackerId)
    {
        Amount = amount;
        HitPoint = hitPoint;
        AttackerId = attackerId;
    }
}

// 适合 class：需要继承、需要引用语义、体积大、需要 null 语义
public class Enemy
{
    public string Name;
    public float Hp;
}
```

> Unity 的 `Vector3` 是 struct（12 字节），大小合适。
> 但**不要**把大数组塞进 struct：struct 拷贝是整块内存复制，会比引用慢得多。
> 另外 struct 作为 `Dictionary` 的键时要注意默认相等性基于**逐字段比较**，且不要用可变 struct 做键。

### 1.2 预定义类型与字面量

| C# 关键字 | .NET 类型 | 大小 | 范围 / 精度 |
| --- | --- | --- | --- |
| `bool` | System.Boolean | 1 字节 | true / false |
| `byte` | System.Byte | 1 | 0 ~ 255 |
| `sbyte` | System.SByte | 1 | -128 ~ 127 |
| `short` | System.Int16 | 2 | -32,768 ~ 32,767 |
| `ushort` | System.UInt16 | 2 | 0 ~ 65,535 |
| `int` | System.Int32 | 4 | -2,147,483,648 ~ 2,147,483,647 |
| `uint` | System.UInt32 | 4 | 0 ~ 4,294,967,295 |
| `long` | System.Int64 | 8 | ±9.22e18 |
| `ulong` | System.UInt64 | 8 | 0 ~ 1.84e19 |
| `float` | System.Single | 4 | ±3.4e38，约 7 位有效数字 |
| `double` | System.Double | 8 | ±1.7e308，约 15~16 位有效数字 |
| `decimal` | System.Decimal | 16 | ±7.9e28，28~29 位有效数字 |
| `char` | System.Char | 2 | UTF-16 码元 |
| `string` | System.String | 引用 | 不可变 UTF-16 序列 |

```csharp
int a = 100;
long b = 100L;
ulong c = 100UL;
float f = 1.5f;      // 必须加 f，否则 1.5 默认是 double
double d = 1.5;
decimal m = 1.5m;
uint u = 10u;
int hex = 0xFF;      // 255
int bin = 0b1010;    // 10（C# 7+）
int sep = 1_000_000; // 下划线分隔符（C# 7+）
char ch = 'A';
string s = "hello";
```

**Unity 特有注意点**

```csharp
// 浮点数比较要用近似或平方距离，不要用 ==
if (Mathf.Approximately(a, b)) { }
if (Vector3.Distance(pos, target) < 1.0f) { }
if ((pos - target).sqrMagnitude < 1.0f) { }   // 少一次开方，更快

// ❌ 浮点误差会让下面这行的行为不可预测
// if (transform.position == targetPos) { }
```

> `Mathf.Approximately` 的实际实现是 `Mathf.Abs(b - a) < Mathf.Max(1E-06f * Mathf.Max(Mathf.Abs(a), Mathf.Abs(b)), Mathf.Epsilon * 8f)`，
> **对非常大的数值不可靠**，工程上更常用自定义 epsilon：`(a - b).sqrMagnitude < 0.0001f`。

### 1.3 类型转换

```csharp
// 1) 隐式转换（安全，不丢信息）
int i = 100;
long l = i;          // int → long
double dd = i;       // int → double

// 2) 显式转换（可能丢精度）
double pi = 3.14159;
int truncated = (int)pi;      // 3，向零截断（不是四舍五入）
int rounded = Mathf.RoundToInt((float)pi);   // 3（Unity 推荐）
// Mathf.RoundToInt 用的是 banker's rounding 变体：0.5 → 0，1.5 → 2，2.5 → 2
// 需要严格四舍五入用 Math.Floor(x + 0.5f)

// 3) 溢出检查
byte b1 = (byte)300;                     // 300 % 256 = 44，静默溢出
try { byte b2 = checked((byte)300); }    // 抛 OverflowException
catch (System.OverflowException) { }

// 4) 字符串 ↔ 数值
int.Parse("123");                          // 失败抛 FormatException
bool ok = int.TryParse("abc", out int r);  // 失败返回 false，r = 0

// Unity 项目务必用 InvariantCulture
float.TryParse("1.5",
    System.Globalization.NumberStyles.Float,
    System.Globalization.CultureInfo.InvariantCulture,
    out float safe);

// 5) 引用类型转换
Enemy e = someObject as Enemy;    // 失败返回 null，不抛异常
if (e != null) { }

if (someObject is Enemy e2) { }   // 模式匹配（C# 7+），一次检查不用转两次
```

> **为什么必须用 InvariantCulture**：在德语/法语等区域设置下，小数点为逗号，
> `float.Parse("1.5")` 在某些区域会被解析为 15 或抛异常。存档、配置、网络数据解析一律用固定区域。

### 1.4 可空类型 Nullable&lt;T&gt;

```csharp
int? maybeHp = null;

if (maybeHp.HasValue) { int v = maybeHp.Value; }
int safe = maybeHp ?? 0;                       // null 合并运算符
int safe2 = maybeHp.GetValueOrDefault(-1);     // 带默认值

// ?. 空条件运算符
string name = player?.DisplayName;             // player 为 null 时返回 null
int? len = name?.Length;

// ?[] 空索引
int? first = array?[0];

// ??= 空合并赋值（C# 8，Unity 2020.2+）
someList ??= new System.Collections.Generic.List<int>();
```

> **Unity 关键陷阱**：Unity 的序列化系统**不支持** `Nullable<T>` 字段在 Inspector 显示。
> 想表达"可选数值"，用一个 bool + float 的组合，或者用哨兵值（如 `-1`）。

**可空引用类型（NRT）**：C# 8 特性，需要在项目里开启（`Nullable` 上下文）。Unity 中可用但会产生大量第三方警告。

```csharp
#nullable enable
public class Foo
{
    public string? OptionalName;                 // 允许 null
    public string RequiredName = string.Empty;   // 不允许 null（未初始化会有警告）
}
#nullable restore
```

### 1.5 object 与 System.Object 的四个成员

```csharp
public class Item
{
    public int Id;
    public string Name = "";

    // 1) ToString：默认返回类型全名，建议重写
    public override string ToString() => "Item(" + Id + ", " + Name + ")";

    // 2) Equals：值语义相等比较
    public override bool Equals(object obj) => obj is Item other && other.Id == Id;

    // 3) GetHashCode：必须与 Equals 保持一致
    public override int GetHashCode() => Id.GetHashCode();

    // 4) MemberwiseClone 是 protected，用于浅拷贝
    public Item ShallowCopy() => (Item)MemberwiseClone();
}
```

> **铁律**：重写 `Equals` 必须重写 `GetHashCode`，否则 `Dictionary`/`HashSet` 行为异常
> （两个"相等"的对象哈希不同，会被放进不同的桶，查找失败）。
> 同时也建议实现 `IEquatable<T>` 以避免与 `object` 比较时的装箱。

**浅拷贝 vs 深拷贝**

```csharp
// 浅拷贝：引用字段仍指向同一对象
var shallow = original.MemberwiseClone();

// 深拷贝（Unity 常用做法）：序列化往返
string json = JsonUtility.ToJson(original);
var deep = JsonUtility.FromJson<MyData>(json);
```

### 1.6 常量、只读、静态

```csharp
public class Config
{
    // 编译期常量：值会被嵌入调用方的 IL
    public const float Gravity = 9.81f;

    // 运行期只读：可以在静态构造函数中赋值
    public static readonly Vector3 WorldUp = Vector3.up;

    // 实例只读字段：只能在声明处或构造函数里赋值
    private readonly int _id;

    public Config(int id) { _id = id; }
}
```

**const vs static readonly 的实际差异**

```csharp
// 假设 A.dll 定义 public const int Max = 10;
// B.dll 引用 A.dll 并使用 Config.Max
// 把 A 里的 Max 改成 20，只重编译 A.dll → B.dll 里仍然是 10！
// 因为 const 在编译期被"内联"进了 B.dll。

// 跨程序集（Assembly Definition）共享的数值，用 static readonly
public static readonly int Max = 10;
```

> **Unity 实践**：游戏可调参数建议放 `ScriptableObject`，代码常量用 `static readonly`。
> `const` 只用于永远不变的东西（如 `Mathf.PI` 之类）。

### 1.7 字符串与不可变性

```csharp
string a = "hello";
string b = a;
b += " world";      // 没有改 a，b 指向了新对象
Debug.Log(a);       // hello
Debug.Log(b);       // hello world
```

**字符串拼接的性能问题**

```csharp
// ❌ 每帧拼接会产生大量临时字符串
void Update()
{
    label.text = "Score: " + score + " / Time: " + time;
}

// ✅ 用 StringBuilder 复用（每次 Clear，不重新分配）
private readonly System.Text.StringBuilder _sb = new System.Text.StringBuilder(64);

void UpdateScore()
{
    _sb.Clear();
    _sb.Append("Score: ").Append(score).Append(" / Time: ").Append(time);
    label.SetText(_sb);   // TMP_Text.SetText(StringBuilder) 零分配（TextMeshPro）
}
```

**常用字符串 API**

```csharp
string s = "  Hello, Unity World!  ";

s.Trim();                        // 去首尾空白
s.TrimStart(); s.TrimEnd();
s.ToUpper(); s.ToLower();
s.Contains("Unity");             // bool
s.StartsWith("  He");            // bool
s.EndsWith("!  ");
s.IndexOf("Unity");              // int，找不到返回 -1
s.LastIndexOf('o');
s.Substring(2, 5);               // 从下标 2 取 5 个字符
s.Split(',');                    // string[]
s.Replace("World", "C#");
s.Length;                        // UTF-16 码元数

string[] parts = s.Split(new[] { ',' }, System.StringSplitOptions.RemoveEmptyEntries);
string joined = string.Join("|", parts);

// 补零 / 格式化
int level = 7;
string padded = level.ToString("D3");        // 007
float hpRatio = 0.5f;
string pct = hpRatio.ToString("P0");         // 50%（受区域设置影响）
string money = 1234.5f.ToString("N2");       // 1,234.50（受区域设置影响）
string fixedNum = 1.23456f.ToString("F2", System.Globalization.CultureInfo.InvariantCulture); // 1.23

// 字符串插值（C# 6+）
string msg = "Level " + level.ToString("D3") + " HP " + hpRatio.ToString("P0");
string msg2 = $"Level {level:D3} HP {hpRatio:P0}";
string msg3 = $"{player.Name} 的等级是 {level}";

// 逐字字符串（不转义反斜杠）
string path = `"C:/Users/Public/game.log";

// AsSpan 系列 API：无分配查找（.NET Standard 2.1，Unity 2021+）
int idx = s.AsSpan().IndexOf('U');
```

> **性能提示**：`string.Format` / 插值会产生一次分配（以及可能的装箱）。
> 高频路径用 `StringBuilder` + `TMP_Text.SetText()`，或者用 `ZString`、`Unity.Collections.FixedString`。

**UTF-16 与代理对**

```csharp
string emoji = "😀";
Debug.Log(emoji.Length);                                  // 2（代理对占 2 个 char）

var info = new System.Globalization.StringInfo(emoji);
Debug.Log(info.LengthInTextElements);                      // 1（真正的"字符"数）

// 安全截断（避免把代理对切成两半导致乱码）
string SafeTruncate(string value, int maxTextElements)
{
    var info = new System.Globalization.StringInfo(value);
    int n = Mathf.Min(maxTextElements, info.LengthInTextElements);
    return info.SubstringByTextElements(0, n);
}
```

### 1.8 数组与常用集合

#### 数组

```csharp
int[] arr = new int[5];
int[] arr2 = { 1, 2, 3 };
int[] arr3 = new int[] { 1, 2, 3 };

int[,] grid = new int[3, 4];        // 多维数组（内存连续）
int[][] jagged = new int[3][];      // 交错数组（每行长度可变）
jagged[0] = new int[] { 1, 2 };

System.Array.Sort(arr);
System.Array.Reverse(arr);
System.Array.Resize(ref arr, 10);                   // 实际是新建 + 拷贝
int index = System.Array.IndexOf(arr, 3);
int found = System.Array.FindIndex(arr, x => x > 2);
System.Array.Clear(arr, 0, arr.Length);             // 置为默认值
int len = arr.Length;                               // 属性，不是方法
int total = arr.GetLength(0);                       // 多维用 GetLength
```

> **注意**：`Array.Length` 是数组属性；`List<T>.Count` 是属性；`string.Length` 是属性。
> 而 `Dictionary<K,V>.Count` 也是属性。`Length` 与 `Count` 混用是常见笔误来源。

**Unity 中数组是零 GC 友好容器**

```csharp
using UnityEngine;

public class GroundCheck : MonoBehaviour
{
    // 预分配数组，复用
    private readonly RaycastHit[] _hits = new RaycastHit[16];

    private bool IsGrounded()
    {
        // RaycastNonAlloc 不会分配数组，返回命中的数量
        int count = Physics.RaycastNonAlloc(
            transform.position, Vector3.down, _hits, 0.5f);

        for (int i = 0; i < count; i++)
        {
            if (_hits[i].collider.CompareTag("Ground")) return true;
        }
        return false;
    }
}
```

> 对比：`Physics.RaycastAll` 每次调用都新建 `RaycastHit[]`，是 GC 常客。
> Unity 2022.1+ 还提供了接受 `Span<RaycastHit>` / `List<RaycastHit>` 的物理查询重载（物理批查询 API），可进一步规避数组分配。

#### List&lt;T&gt;

```csharp
var list = new System.Collections.Generic.List<int>(16);   // 预分配容量
list.Add(1);
list.AddRange(new[] { 2, 3 });
list.Insert(0, 0);
list.Remove(3);              // 按值删第一个匹配项，返回 bool
list.RemoveAt(0);            // 按下标删
list.RemoveAll(x => x > 10); // 返回删除数量
list.Contains(2);
list.IndexOf(2);
list.Sort();
list.Clear();                // 清空但保留 Capacity
list.TrimExcess();           // 收缩 Capacity 到 Count（一次性开销）
int[] copy = list.ToArray();
int count = list.Count;      // 不是 Length
```

> **Unity 优化点**：`List<T>` 的 `Capacity` 只增不减。频繁 Clear + Add 的场景应复用同一个 List，
> 不要每次 new，也不要每次 TrimExcess。

#### Dictionary&lt;TKey,TValue&gt;

```csharp
var dict = new System.Collections.Generic.Dictionary<string, int>(64);
dict["hp"] = 100;              // 索引器：键不存在则新增
dict.Add("mp", 50);            // 键已存在会抛 ArgumentException
dict.TryAdd("atk", 10);        // .NET Standard 2.1 / Unity 2021+，不抛异常

if (dict.TryGetValue("hp", out int hp)) { }
if (dict.ContainsKey("hp")) { }
if (dict.ContainsValue(100)) { }
dict.Remove("hp");

foreach (var kv in dict)
{
    Debug.Log(kv.Key + " = " + kv.Value);
}
```

**Unity 关键陷阱：遍历中不能修改集合**

```csharp
foreach (var kv in dict)
{
    // dict.Remove(kv.Key);  // ❌ InvalidOperationException: Collection was modified
}

// ✅ 做法一：先收集再删
var toRemove = new System.Collections.Generic.List<string>(dict.Count);
foreach (var kv in dict) if (kv.Value <= 0) toRemove.Add(kv.Key);
for (int i = 0; i < toRemove.Count; i++) dict.Remove(toRemove[i]);

// ✅ 做法二：对 List 反向遍历删除（安全且零分配）
for (int i = list.Count - 1; i >= 0; i--)
{
    if (list[i].IsDead) list.RemoveAt(i);
}
```

**容易踩的坑：用 Vector3 做键**

```csharp
// Vector3 的 Equals 使用浮点比较，容易不精确命中
var d = new System.Collections.Generic.Dictionary<Vector3, int>();
d[new Vector3(0.1f + 0.2f, 0f, 0f)] = 1;
// d[new Vector3(0.3f, 0f, 0f)]  → 可能查不到！

// ✅ 用 Vector2Int / Vector3Int 做网格键
var grid = new System.Collections.Generic.Dictionary<Vector2Int, int>();
grid[new Vector2Int(Mathf.RoundToInt(x), Mathf.RoundToInt(z))] = 1;
```

#### HashSet / Queue / Stack / LinkedList

```csharp
var set = new System.Collections.Generic.HashSet<int>();
set.Add(1);
set.Contains(1);                    // O(1)
set.UnionWith(new[] { 2, 3 });      // 并集
set.IntersectWith(new[] { 1 });     // 交集
set.ExceptWith(new[] { 1 });        // 差集

var queue = new System.Collections.Generic.Queue<string>();
queue.Enqueue("a");
string first = queue.Dequeue();     // 弹出队首
string peek = queue.Peek();         // 只看不弹
int qc = queue.Count;

var stack = new System.Collections.Generic.Stack<int>();
stack.Push(1);
int top = stack.Pop();

var linked = new System.Collections.Generic.LinkedList<int>();
linked.AddLast(1);
linked.AddFirst(0);
// 适合频繁中间插删；Unity 里少用，内存不连续、缓存不友好
```

#### 集合选型速查

| 需求 | 容器 | 复杂度 |
| --- | --- | --- |
| 定长、最省内存、零 GC | `T[]` | 索引 O(1) |
| 动态增删、顺序访问 | `List<T>` | Add 均摊 O(1)，RemoveAt O(n) |
| 键值查找 | `Dictionary<K,V>` | 均摊 O(1) |
| 去重 / 集合运算 | `HashSet<T>` | 均摊 O(1) |
| 先进先出 | `Queue<T>` | O(1) |
| 后进先出 | `Stack<T>` | O(1) |
| 有序键值 | `SortedDictionary<K,V>` | O(log n) |
| 双端链表 | `LinkedList<T>` | 已知节点 O(1) |
| 只读包装 | `ReadOnlyCollection<T>` | 同底层 |
| 多线程只读 | `IReadOnlyList<T>` | 接口 |

#### Unity NativeContainer（进阶）

```csharp
using Unity.Collections;
using Unity.Jobs;

// 非托管内存数组，可在 Job 中使用，不产生 GC
var data = new NativeArray<int>(1024, Allocator.TempJob);
try
{
    for (int i = 0; i < data.Length; i++) data[i] = i;
    // 可以把 data 交给 IJobParallelFor
}
finally
{
    data.Dispose();   // 必须释放，否则泄漏并报错
}
```

> 需要 `Unity.Collections` 包（Unity 2018.1+ 的 Jobs 包；Unity 2020+ 内置）。
> `Allocator` 常见取值：`Temp`（一帧内有效）、`TempJob`（4 帧内有效）、`Persistent`（手动释放）。

### 1.9 var、匿名类型、元组

```csharp
// var 是编译期推断的强类型，不是弱类型
var v = new Vector3(1, 0, 0);       // 编译后就是 Vector3
// var n = 0; n = "abc";            // ❌ 编译错误

// 匿名类型：只读，编译器生成
var anon = new { Name = "Sword", Damage = 10 };
Debug.Log(anon.Name);
// Unity 注意：匿名类型无法序列化，不能出现在 Inspector

// 元组（C# 7+，Unity 2018.3+）
(string name, int level) player = ("Hero", 5);
Debug.Log(player.name + " Lv" + player.level);

// 解构
var (n2, l2) = player;

// 返回多个值
public (bool success, int value) TryGet()
{
    return (true, 42);
}

// 丢弃符号（C# 7+）
var (_, levelOnly) = player;
```

> **Unity 提醒**：`ValueTuple` 在 IL2CPP 下可用，但作为 MonoBehaviour 字段无法序列化显示在 Inspector。
> 元组适合临时传值，不适合长期数据模型。

---


## 第 2 章 变量、运算符与流程控制

### 2.1 变量作用域与生命周期

```csharp
public class ScopeDemo
{
    private int _field = 1;              // 字段：随对象实例存活
    private static int _staticField;     // 静态字段：随类型存活（进程级）

    public void Method(int param)        // 参数：随方法调用
    {
        int local = 2;                   // 局部变量：随方法调用（栈上或寄存器）

        {
            int inner = 3;               // 块作用域
            Debug.Log(inner);
        }
        // Debug.Log(inner);             // ❌ 编译错误：超出作用域

        for (int i = 0; i < 3; i++)
        {
            // i 只在 for 内有效
        }
        // int local = 5;                // ❌ 编译错误：同一方法内不能重复声明同名局部变量
    }
}
```

**作用域规则要点**

| 规则 | 说明 |
| --- | --- |
| 局部变量必须先赋值后使用 | `int x; Debug.Log(x);` 会编译错误 CS0165 |
| 字段有默认值 | `int` → 0，`bool` → false，引用类型 → null |
| 局部变量没有默认值 | 编译器强制初始化，这也是它比字段更安全的地方 |
| 嵌套作用域不能同名 | C# 不允许局部变量遮蔽外层同名局部变量（与 C++ 不同） |
| 静态字段生命周期 = 域（AssemblyLoadContext） | Unity 里约等于整个进程 |

**Unity 生命周期相关：静态引用必须手动清理**

```csharp
using UnityEngine;

public class MyManager : MonoBehaviour
{
    private static MyManager _instance;

    private void Awake()
    {
        _instance = this;
    }

    private void OnDestroy()
    {
        // 场景切换销毁对象后，_instance 变为"假 null"（详见第 7 章）
        // 必须手动置空，否则下次进入场景拿到的是已销毁对象
        if (_instance == this) _instance = null;
    }
}
```

> Unity 中 `static` 字段**不会**随场景卸载重置。做热重载/域重载（Enter Play Mode Options 关闭 Domain Reload）时，
> 静态状态会残留，这是 Play 模式下"数据不干净"的最常见原因。

### 2.2 运算符全表

```csharp
int a = 7, b = 3;

// ---- 算术 ----
int add = a + b;      // 10
int sub = a - b;      // 4
int mul = a * b;      // 21
int div = a / b;      // 2   ← 整数除法，向零截断
int mod = a % b;      // 1
a++; a--; ++a; --a;

float ratio = (float)a / b;   // 2.3333... 必须显式转换，否则先做整数除法

// ---- 比较 ----
bool c1 = a > b;   // true
bool c2 = a >= b;
bool c3 = a == b;
bool c4 = a != b;

// ---- 逻辑（短路求值）----
bool x = true, y = false;
bool and = x && y;    // x 为 false 时不再计算 y
bool or = x || y;     // x 为 true 时不再计算 y
bool not = !x;

// ---- 位运算（整数）----
int and2 = a & b;     // 7 & 3 = 0111 & 0011 = 0011 = 3
int or2 = a | b;      // 7
int xor = a ^ b;      // 4
int inv = ~a;         // -8（补码按位取反）
int shl = a << 1;     // 14
int shr = a >> 1;     // 3（对有符号数，正数是逻辑右移）

// ---- 复合赋值 ----
a += 1; a -= 1; a *= 2; a /= 2; a %= 2;
a &= 1; a |= 1; a ^= 1; a <<= 1; a >>= 1;

// ---- 三元与 null ----
string result = a > b ? "bigger" : "smaller";
string s = null;
string t = s ?? "default";
int? len = s?.Length;
```

**运算符优先级（从高到低，常用部分）**

```text
1.  ()  []  .  ?.  ++/--（后缀）
2.  ++/--（前缀）  !  ~  (T)强制转换
3.  *  /  %
4.  +  -
5.  <<  >>
6.  <  >  <=  >=  is  as
7.  ==  !=
8.  &
9.  ^
10. |
11. &&
12. ||
13. ?:
14. =  +=  -=  *=  /=  %=  ??=
```

> **实践建议**：复杂表达式一律加括号。Unity 代码里最容易出错的组合是
> `a & b == 0` （实际是 `a & (b == 0)`，因为 `==` 优先级高于 `&`），应该写成 `(a & b) == 0`。

#### 位标志：用 int 当开关集合

```csharp
using UnityEngine;

[System.Flags]
public enum StatusEffect
{
    None    = 0,
    Poison  = 1 << 0,   // 1
    Burn    = 1 << 1,   // 2
    Freeze  = 1 << 2,   // 4
    Stun    = 1 << 3,   // 8
    All     = ~0        // 全部位
}

public class StatusTester
{
    public void Test()
    {
        StatusEffect s = StatusEffect.Poison | StatusEffect.Freeze;

        // 判断是否包含（必须与 0 比较，不能直接 if (flag)）
        bool hasPoison = (s & StatusEffect.Poison) != 0;   // true

        // 添加
        s |= StatusEffect.Burn;

        // 移除（用 ~ 取反再与）
        s &= ~StatusEffect.Poison;

        // 切换
        s ^= StatusEffect.Stun;

        // 判断包含全部
        bool hasBoth = (s & (StatusEffect.Burn | StatusEffect.Stun)) == (StatusEffect.Burn | StatusEffect.Stun);
    }
}
```

> `[System.Flags]` 让枚举在 Unity Inspector 里显示为可多选的 Bit Mask 下拉框，策划配置非常好用。
> 枚举的底层类型默认是 `int`，超过 32 个标志位需要显式声明 `: long`。

**Unity 的 LayerMask 就是同一套机制**

```csharp
// LayerMask 内部就是一个 int 掩码
int groundMask = LayerMask.GetMask("Ground", "Wall");
int groundLayer = LayerMask.NameToLayer("Ground");     // 返回层号（0~31），失败返回 -1
string layerName = LayerMask.LayerToName(8);

// 把掩码转成层号（用于调试）
int count = 0;
for (int i = 0; i < 32; i++)
{
    if ((groundMask & (1 << i)) != 0) count++;
}

// 判断某个层是否在掩码里
bool inMask = (groundMask & (1 << gameObject.layer)) != 0;
```

#### is / as / typeof / nameof

```csharp
// is：类型判断（C# 7+ 可同时声明变量）
if (someObj is Enemy enemy) { enemy.Hp -= 10f; }
if (someObj is Enemy) { var e = (Enemy)someObj; }      // 老写法，会转两次

// as：安全转换，失败返回 null（只适用于引用类型和可空类型）
Enemy e2 = someObj as Enemy;

// typeof：获取 Type 对象（编译期）
System.Type t = typeof(Enemy);

// nameof：获取标识符名字（编译期字符串，零开销）
Debug.Log(nameof(Enemy));              // "Enemy"
Debug.Log(nameof(Enemy.Hp));           // "Hp"

// 实用：属性变更通知
private float _hp;
public float Hp
{
    get => _hp;
    set
    {
        _hp = value;
        Debug.Log(nameof(Hp) + " changed to " + value);   // 重构安全，不会写错字符串
    }
}
```

### 2.3 条件语句

```csharp
int hp = 50;

if (hp <= 0)
{
    // 死亡
}
else if (hp < 30)
{
    // 危险
}
else
{
    // 正常
}

// switch 语句
switch (hp)
{
    case 0:
        Debug.Log("dead");
        break;
    case var h when h < 30:          // C# 7 模式 + when 守卫
        Debug.Log("critical");
        break;
    default:
        break;
}

// 多 case 共享逻辑（穿透）
int code = 1;
switch (code)
{
    case 1:
    case 2:
    case 3:
        Debug.Log("low");
        break;      // 必须有 break / return / goto case
    case 4:
        goto case 1;   // 显式穿透
    default:
        break;
}

// switch 表达式（C# 8，Unity 2020.2+）
string tier = hp switch
{
    <= 0 => "dead",
    < 30 => "critical",
    < 70 => "normal",
    _    => "healthy"
};
```

**性能说明**：整数 `switch` 通常被编译器优化为跳转表（O(1)）；字符串 `switch` 是哈希比较；
`if-else` 链是顺序比较。分支很多时优先用 `switch` 或查表（数组/字典）。

### 2.4 循环语句

```csharp
// ---- for：已知次数 ----
for (int i = 0; i < 10; i++)
{
    Debug.Log(i);
}

// 反向遍历（删除元素时安全）
for (int i = list.Count - 1; i >= 0; i--) { }

// ---- foreach：遍历集合 ----
foreach (var item in someList) { }

// ---- while ----
int n = 0;
while (n < 10) { n++; }

// ---- do-while：至少执行一次 ----
do { n--; } while (n > 0);

// ---- break / continue ----
for (int i = 0; i < 10; i++)
{
    if (i == 3) continue;   // 跳过本次迭代
    if (i == 7) break;      // 结束整个循环
}
```

**foreach 的 GC 行为（Unity 高频面试点）**

| 遍历对象 | 枚举器类型 | 是否产生 GC |
| --- | --- | --- |
| `int[]` 数组 | 编译器特殊处理为索引循环 | 否 |
| `List<T>` | 结构体枚举器 `List<T>.Enumerator` | 否（值类型，栈上） |
| `Dictionary<K,V>` | 结构体枚举器 | 否（Unity 2018+ 的 .NET 4.x 下） |
| `IEnumerable<T>` 接口变量 | 引用类型枚举器 | **是**（装箱 + 堆分配） |
| LINQ 查询结果（`Where` 等） | 迭代器类 | **是** |

```csharp
// ✅ 零 GC：直接遍历具体集合类型
foreach (int v in intArray) { }
foreach (int v in intList) { }

// ⚠️ 有 GC：接口变量使结构体枚举器被装箱
System.Collections.Generic.IEnumerable<int> seq = intList;
foreach (int v in seq) { }

// ⚠️ 有 GC：LINQ 迭代器 + 闭包
foreach (var e in enemies.Where(e => e.Hp > 0)) { }

// 结论：直接对 List<T>/Dictionary<K,V>/数组 foreach 是安全的，
//       一旦经过接口或 LINQ 就会产生堆分配。
```

> Unity 2021+ 的 Roslyn 版本下，编译器对 `foreach` 做了更多优化（如 `Memory<T>` 的 `GetEnumerator`），
> 但"接口变量导致装箱"这条规则在所有版本都成立。

### 2.5 参数传递：值、ref、out、in

```csharp
// ---- 值传递（默认）----
void Modify(int x) { x = 999; }        // 调用方不受影响

// ---- ref：引用传递，进方法前必须已初始化，可读可写 ----
void Swap(ref int a, ref int b)
{
    int t = a; a = b; b = t;
}

// ---- out：引用传递，必须在方法内赋值，用于返回多个值 ----
bool TryGetMaxHp(out int maxHp)
{
    maxHp = 100;
    return true;
}

// ---- in：只读引用（C# 7.2+），避免大 struct 拷贝，内部不可修改 ----
float SqrMagnitude(in Vector3 v) => v.x * v.x + v.y * v.y + v.z * v.z;

// ---- 使用 ----
int p = 1, q = 2;
Swap(ref p, ref q);                    // p=2, q=1

if (TryGetMaxHp(out int mh)) { }       // C# 7 内联声明
if (int.TryParse("12", out var parsed)) { }   // var 推断

Vector3 pos = new Vector3(3f, 4f, 0f);
float sq = SqrMagnitude(in pos);       // in 可以省略不写
```

**Unity 中 ref 的实战用法**

```csharp
// 1) 避免连续访问 transform.position（每次都是 native 调用 + struct 拷贝）
// ❌ 慢：三次 native 调用
// transform.position = new Vector3(transform.position.x + 1, transform.position.y, transform.position.z);

// ✅ 快：取出 → 改 → 写回
Vector3 p2 = transform.position;
p2.x += 1f;
transform.position = p2;

// ✅ 更快：直接用内置 API
transform.Translate(1f, 0f, 0f, Space.World);

// 2) 用 ref 让工具方法就地修改 struct
public static void ClampToBounds(ref Vector3 v, Bounds b)
{
    v.x = Mathf.Clamp(v.x, b.min.x, b.max.x);
    v.y = Mathf.Clamp(v.y, b.min.y, b.max.y);
    v.z = Mathf.Clamp(v.z, b.min.z, b.max.z);
}

// 3) 用是 readonly ref 返回（C# 7.2），避免大数组元素拷贝
private readonly float[] _data = new float[1024];
public ref readonly float GetSample(int i) => ref _data[i];
```

> **不能对属性使用 ref**：`ref transform.position` 是**编译错误**（属性不是变量，没有存储位置）。
> 这也是为什么 Unity 大量使用 `Transform.SetPositionAndRotation` 这样的"一次调用改两个值"API。

### 2.6 params、可选参数与命名参数

```csharp
// params：可变参数，调用时会分配数组
void LogAll(params object[] args)
{
    foreach (var a in args) Debug.Log(a);
}
LogAll(1, "two", 3.0f);      // 编译器生成 new object[]{...}，值类型会装箱

// 可选参数：必须放在参数列表最后
void Spawn(string id, int count = 1, float delay = 0f)
{
    Debug.Log("spawn " + id + " x" + count + " after " + delay);
}
Spawn("enemy");                        // count=1, delay=0
Spawn("enemy", 3);                     // delay=0
Spawn("enemy", 3, 1.5f);

// 命名参数：可任意顺序，大幅提升可读性
Spawn("enemy", delay: 1.5f, count: 2);
```

> **性能提示**：`params` 每次调用都会分配新数组。高频路径（每帧）不要用 `params` API，
> 或者提供几个固定参数的重载。Unity 自己的 `Debug.Log` 就有多个重载来减少这类开销。

---


## 第 3 章 面向对象（OOP）

### 3.1 类与对象

```csharp
using UnityEngine;

public class Weapon
{
    // ---------- 字段 ----------
    private string _name;          // 私有字段，惯性下划线命名
    private int _damage;

    // 静态字段：所有实例共享
    private static int _totalCreated;

    // ---------- 构造函数 ----------
    public Weapon(string name, int damage)
    {
        _name = name;
        _damage = damage;
        _totalCreated++;
    }

    // 静态构造函数：在类型第一次被使用前执行一次，且只执行一次
    static Weapon()
    {
        _totalCreated = 0;
        // 注意：静态构造函数里不要访问其他类型的静态成员的执行顺序假设
    }

    // ---------- 属性 ----------
    public string Name
    {
        get { return _name; }
        private set { _name = value; }     // 外部只读，内部可写
    }

    public int Damage { get; private set; }              // 自动属性

    public bool IsBroken => _damage <= 0;                // 表达式体只读属性（C# 6+）

    public static int TotalCreated => _totalCreated;     // 静态只读属性

    // ---------- 方法 ----------
    public virtual int Attack() => _damage;

    public override string ToString() => "Weapon(" + _name + ", " + _damage + ")";

    // ---------- 索引器 ----------
    private readonly int[] _upgrades = new int[3];
    public int this[int index]
    {
        get => _upgrades[index];
        set => _upgrades[index] = value;
    }
}

public class WeaponDemo : MonoBehaviour
{
    private void Start()
    {
        var w = new Weapon("Sword", 10);
        Debug.Log(w.Attack());              // 10
        Debug.Log(Weapon.TotalCreated);     // 1

        w[0] = 5;
        Debug.Log(w[0]);                    // 5
    }
}
```

**class 的成员类型总览**

| 成员 | 说明 |
| --- | --- |
| 字段 field | 状态存储 |
| 常量 const | 编译期常量 |
| 属性 property | 封装字段访问 |
| 方法 method | 行为 |
| 构造函数/静态构造函数 | 初始化 |
| 索引器 indexer | 用 `obj[i]` 访问 |
| 事件 event | 观察者模式 |
| 运算符重载 operator | 自定义运算 |
| 嵌套类型 | 内部类 |
| 终结器 finalizer（`~ClassName()`） | 非托管资源清理（Unity 中基本不用） |

**运算符重载示例**

```csharp
public readonly struct GridPos
{
    public readonly int X;
    public readonly int Y;

    public GridPos(int x, int y) { X = x; Y = y; }

    public static GridPos operator +(GridPos a, GridPos b) => new GridPos(a.X + b.X, a.Y + b.Y);
    public static GridPos operator -(GridPos a, GridPos b) => new GridPos(a.X - b.X, a.Y - b.Y);
    public static bool operator ==(GridPos a, GridPos b) => a.X == b.X && a.Y == b.Y;
    public static bool operator !=(GridPos a, GridPos b) => !(a == b);

    // 重载 == 必须一起重写 Equals 和 GetHashCode
    public override bool Equals(object obj) => obj is GridPos o && this == o;
    public override int GetHashCode() => (X * 397) ^ Y;
}
```

> Unity 的 `Vector2Int` 就是这种设计。自定义 struct 重载 `==` 时**必须**同时重写 `Equals` 和 `GetHashCode`，
> 否则编译器会给出警告 CS0660/CS0661，并且 `Dictionary` 行为不正确。

### 3.2 访问修饰符

| 修饰符 | 可见范围 |
| --- | --- |
| `public` | 任何地方 |
| `private` | 仅本类（类成员默认） |
| `protected` | 本类与派生类 |
| `internal` | 同一程序集（Unity = 同一 Assembly Definition 或默认 Assembly-CSharp） |
| `protected internal` | 同程序集 **或** 派生类 |
| `private protected` | 同程序集 **且** 派生类（C# 7.2+） |

```csharp
public class Base
{
    public int A = 1;
    private int _b = 2;
    protected int C = 3;
    internal int D = 4;
    protected internal int E = 5;
    private protected int F = 6;
}
```

> **Unity 重要**：Unity 会把 `public` 字段自动序列化并显示在 Inspector。
> 所以 `public` 既扩大了可见性，又改变了序列化行为。业务数据尽量用 `[SerializeField] private`。
>
> 另外，`public` 字段在 Inspector 里的名字是字段名的"美化版"（`_maxHp` 显示为 "Max Hp"），
> 改名会导致已保存的预制体/场景数据丢失引用，所以**上线后不要随便改字段名**。

### 3.3 封装、继承、多态

```csharp
using UnityEngine;

// ---------- 抽象基类：不能实例化，可以带实现 ----------
public abstract class Actor : MonoBehaviour
{
    public string ActorName { get; protected set; }
    public float Hp { get; protected set; }

    public abstract void Tick(float dt);           // 必须被子类实现

    public virtual void TakeDamage(float dmg)      // 可以被子类覆盖
    {
        Hp -= dmg;
        if (Hp <= 0f) OnDeath();
    }

    protected virtual void OnDeath()
    {
        Debug.Log(ActorName + " died");
    }
}

// ---------- 派生类 ----------
public sealed class PlayerActor : Actor        // sealed：不能再被继承
{
    [SerializeField] private float _moveSpeed = 5f;

    private void Awake()
    {
        ActorName = "Player";
        Hp = 100f;
    }

    public override void Tick(float dt)
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(h, 0f, v) * (_moveSpeed * dt), Space.World);
    }

    public override void TakeDamage(float dmg)
    {
        base.TakeDamage(dmg * 0.8f);              // 调用基类实现（减伤 20%）
    }

    protected override void OnDeath()
    {
        base.OnDeath();
        // 玩家死亡额外逻辑
    }
}
```

> **Unity 重要提醒**：继承自 `MonoBehaviour` 的抽象类**不能**挂到 GameObject 上（Unity 会拒绝），
> 但可以作为 `[SerializeField]` 字段的类型来接收子类实例——这是 Unity 里"多态序列化"的标准做法。

**this 与 base**

```csharp
public class Derived : Base
{
    public int Value;

    public Derived(int value)
    {
        Value = value;
    }

    public Derived() : this(0) { }             // this(...) 调用同类其他构造函数

    public Derived(string s) : base(s) { }     // base(...) 调用基类构造函数

    public void Show()
    {
        Debug.Log(base.ToString());            // 调用基类实现
        Debug.Log(this.Value);                 // 当前实例
    }
}
```

### 3.4 抽象类 vs 接口

```csharp
// ---------- 接口 ----------
public interface IDamageable
{
    float CurrentHp { get; }
    bool IsDead { get; }
    void TakeDamage(float amount);
}

public interface IHealable : IDamageable        // 接口可以继承接口
{
    void Heal(float amount);
}

// ---------- 一个类可以实现多个接口 ----------
public class Crate : MonoBehaviour, IHealable
{
    [SerializeField] private float _hp = 30f;

    public float CurrentHp => _hp;
    public bool IsDead => _hp <= 0f;

    public void TakeDamage(float amount) => _hp -= amount;
    public void Heal(float amount) => _hp += amount;
}

// ---------- 用接口解耦（Unity 核心技巧）----------
public class Weapon : MonoBehaviour
{
    [SerializeField] private float _damage = 10f;

    public void Fire(Vector3 origin, Vector3 dir)
    {
        // TryGetComponent 支持接口类型 T，且不产生 GC（Unity 2019.2+）
        if (Physics.Raycast(origin, dir, out RaycastHit hit, 100f))
        {
            if (hit.collider.TryGetComponent(out IDamageable target))
            {
                target.TakeDamage(_damage);
            }
        }
    }
}
```

**选型对照表**

| 维度 | 接口 interface | 抽象类 abstract class |
| --- | --- | --- |
| 多重实现 | ✅ 可实现多个接口 | ❌ 只能继承一个类 |
| 实例字段 | ❌ 不能有 | ✅ 可以有 |
| 构造函数 | ❌ 没有 | ✅ 有 |
| 方法实现 | ❌ 除静态方法外不能有（C# 8 DIM **Unity 不支持**） | ✅ 可以有默认实现 |
| 访问修饰符 | 成员默认 public | 任意 |
| Unity Inspector 引用 | ❌ 不能直接序列化 | ✅ 可以（抽象类字段可拖入子类实例） |
| 适用场景 | 能力契约（可被伤害、可交互、可存档） | 同类事物的公共基类（敌人、UI 面板） |

> **Unity 关键限制**：Inspector 的引用字段**不能是接口类型**：
>
> ```csharp
> // ❌ Inspector 里拖不进来
> [SerializeField] private IDamageable _target;
>
> // ✅ 方案一：用 MonoBehaviour / ScriptableObject 抽象类
> [SerializeField] private Actor _target;
>
> // ✅ 方案二：用 MonoBehaviour 存引用，运行时转换
> [SerializeField] private MonoBehaviour _targetBehaviour;
> private IDamageable Target => _targetBehaviour as IDamageable;
> ```

### 3.5 属性（Property）深入

```csharp
public class PlayerStats : MonoBehaviour
{
    [SerializeField] private int _level = 1;
    [SerializeField] private float _hp = 100f;
    [SerializeField] private float _maxHp = 100f;

    public event System.Action<int> LevelChanged;

    // 带校验与事件的属性
    public int Level
    {
        get => _level;
        set
        {
            int clamped = Mathf.Max(1, value);
            if (clamped == _level) return;        // 值没变就不触发事件
            _level = clamped;
            LevelChanged?.Invoke(_level);
        }
    }

    public float Hp
    {
        get => _hp;
        set => _hp = Mathf.Clamp(value, 0f, _maxHp);
    }

    public float MaxHp => _maxHp;

    public float HpPercent => _maxHp <= 0f ? 0f : _hp / _maxHp;

    // init 访问器（C# 9，Unity 2021.2+）：只能在对象初始化时赋值
    public string PlayerId { get; init; } = "";
}

// 使用
var stats = new PlayerStats { PlayerId = "p001" };   // 变量名随意，示例而已
// stats.PlayerId = "p002";   // ❌ 编译错误：init 属性只能在初始化时赋值
```

**Unity 序列化与属性的关系**

```csharp
// ❌ 自动属性不会出现在 Inspector（Unity 默认只序列化字段）
public int Health { get; set; }

// ✅ 方案一：手动字段 + 属性（最通用，所有版本都支持）
[SerializeField] private int _health;
public int Health { get => _health; set => _health = value; }

// ✅ 方案二：[field: SerializeField]（C# 7.3 的字段目标特性，Unity 2019+ 可用）
[field: SerializeField] public int Health { get; private set; }
```

> **重要**：`[field: SerializeField]` 依赖 C# 7.3 的 `field:` 目标特性，Unity 2018.3 之后语法可用，
> 但在部分版本上出现过"不显示 / 重复序列化"的问题。**老项目与团队协作场景建议统一用方案一**，行为最可预期。

### 3.6 多态的实现细节：virtual / override / new / sealed

```csharp
using UnityEngine;

public class Animal
{
    public virtual void Speak() => Debug.Log("...");
}

public class Dog : Animal
{
    public override void Speak() => Debug.Log("Woof");
}

public class Cat : Animal
{
    public new void Speak() => Debug.Log("Meow");   // new：隐藏，不是多态
}

public class PolyDemo : MonoBehaviour
{
    private void Start()
    {
        Animal a1 = new Dog();
        a1.Speak();          // Woof  —— 虚方法表动态派发，走 Dog 的实现

        Animal a2 = new Cat();
        a2.Speak();          // ...   —— new 只做静态隐藏，仍走 Animal 的实现！

        Cat c = new Cat();
        c.Speak();           // Meow  —— 静态类型是 Cat，走 Cat 的实现
    }
}
```

| 对比项 | `override` | `new` |
| --- | --- | --- |
| 机制 | 虚方法表（vtable）动态派发 | 编译期按变量的静态类型解析 |
| 基类引用调用 | 执行子类实现 | 执行基类实现 |
| 在 Unity 中的使用 | 覆盖 Update 逻辑、AI 状态基类 | 几乎不用，容易埋 bug |
| 编译警告 | 无 | CS0108 警告（提示隐藏了基类成员） |

**sealed override：切断后续继承链的虚调用**

```csharp
public class FastEnemy : Animal
{
    public sealed override void Speak() => Debug.Log("Fast!");
    // 之后任何类都不能再 override Speak
}
```

> **性能**：虚方法调用比直接调用多一些间接寻址，但在现代 CPU 的分支预测下基本可忽略。
> Unity 里真正值得优化的是 `Update` 数量、`GetComponent` 调用、每帧字符串分配，而不是虚方法。

### 3.7 静态类与扩展方法

```csharp
using UnityEngine;

public static class MathUtil
{
    // 重映射：把 value 从 [inMin, inMax] 线性映射到 [outMin, outMax]
    public static float Remap(float value, float inMin, float inMax, float outMin, float outMax)
    {
        return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
    }
}

// 扩展方法：必须是静态类中的静态方法，第一个参数前加 this
public static class TransformExtensions
{
    public static Vector3 Flat(this Vector3 v) => new Vector3(v.x, 0f, v.z);

    public static Vector3 WithY(this Vector3 v, float y) => new Vector3(v.x, y, v.z);

    public static float SqrDistanceTo(this Vector3 a, Vector3 b) => (a - b).sqrMagnitude;

    // 递归查找子物体（Unity 没有内置的 FindChild 按名递归）
    public static Transform FindRecursive(this Transform parent, string name)
    {
        for (int i = 0; i < parent.childCount; i++)
        {
            Transform child = parent.GetChild(i);
            if (child.name == name) return child;
            Transform result = child.FindRecursive(name);
            if (result != null) return result;
        }
        return null;
    }

    // 清空所有子物体（对象池回池常用）
    public static void DestroyAllChildren(this Transform parent)
    {
        for (int i = parent.childCount - 1; i >= 0; i--)
        {
            Object.Destroy(parent.GetChild(i).gameObject);
        }
    }
}

// 使用：像调用实例方法一样调用
public class ExtDemo : MonoBehaviour
{
    private void Start()
    {
        Vector3 flat = transform.position.Flat();
        float d2 = transform.position.SqrDistanceTo(Vector3.zero);
        Transform t = transform.FindRecursive("Head");
        Debug.Log(flat + " " + d2 + " " + t);
    }
}
```

> **扩展方法是编译期的语法糖**：编译后就是 `TransformExtensions.Flat(transform.position)`。
> 因此：
> - 不能访问私有成员；
> - 不能参与多态（不覆盖实例方法，只会在实例方法不存在时被选中）；
> - 如果与实例方法同名同签名，**实例方法优先**。

### 3.8 嵌套类、部分类、分部方法

```csharp
// ---------- 部分类：把一个类拆到多个文件 ----------
// 文件 1：PlayerController.State.cs
public partial class PlayerController
{
    private int _hp = 100;
    private bool _isGrounded;
}

// 文件 2：PlayerController.Move.cs
public partial class PlayerController
{
    private void ApplyDamage(int v) => _hp -= v;
}

// ---------- 嵌套类：逻辑上属于外层 ----------
public class SaveSystem : MonoBehaviour
{
    // [System.Serializable] 让它在 Inspector 里可展开编辑
    [System.Serializable]
    public class SaveData
    {
        public int Level;
        public string PlayerName;
        public float PlayTime;
        public Vector3 LastPosition;
    }

    public SaveData Data = new SaveData();
}

// ---------- 分部方法（C# 9 支持访问修饰符与返回值）----------
public partial class Notification
{
    partial void OnCreated();                       // 声明
}

public partial class Notification
{
    partial void OnCreated() { }                    // 实现（不实现则调用被编译器移除）
}
```

**Unity 中 `[System.Serializable]` 的规则（很容易踩坑）**

| 类型 | 能否在 Inspector 序列化 |
| --- | --- |
| `int/float/bool/string/enum` | ✅ |
| `Vector2/Vector3/Vector4/Quaternion/Color/Rect/Bounds` | ✅ |
| `GameObject/Component/MonoBehaviour` 引用 | ✅ |
| `UnityEngine.Object` 及其派生（`Material/Texture/AudioClip`…） | ✅ |
| `List<T>` / `T[]`（T 可序列化） | ✅ |
| `Dictionary<K,V>` | ❌（需要 ISerializationCallbackReceiver 或 Odin） |
| `interface` 类型字段 | ❌ |
| `Nullable<T>` / 多态（抽象类字段存子类实例除外） | ❌ |
| `static` / `const` / `readonly` 字段 | ❌ |
| 属性（无 backing field 暴露） | ❌ |
| 嵌套 `class` 且带 `[System.Serializable]` | ✅ |
| `struct` 且带 `[System.Serializable]` | ✅（值类型字段，直接内联） |
| 自定义 `class` 不带 `[System.Serializable]` | ❌ |

```csharp
// Dictionary 想序列化，用 ISerializationCallbackReceiver 手动转换
[System.Serializable]
public class SerializableDictionary : UnityEngine.ISerializationCallbackReceiver
{
    [SerializeField] private System.Collections.Generic.List<string> _keys = new();
    [SerializeField] private System.Collections.Generic.List<int> _values = new();

    private readonly System.Collections.Generic.Dictionary<string, int> _dict = new();

    public void OnBeforeSerialize()
    {
        _keys.Clear();
        _values.Clear();
        foreach (var kv in _dict) { _keys.Add(kv.Key); _values.Add(kv.Value); }
    }

    public void OnAfterDeserialize()
    {
        _dict.Clear();
        for (int i = 0; i < _keys.Count && i < _values.Count; i++) _dict[_keys[i]] = _values[i];
    }

    public bool TryGetValue(string key, out int value) => _dict.TryGetValue(key, out value);
    public void Set(string key, int value) => _dict[key] = value;
}
```

### 3.9 对象初始值设定项与集合初始值设定项

```csharp
public class Enemy
{
    public string Name;
    public int Level;
    public System.Collections.Generic.List<string> Tags = new System.Collections.Generic.List<string>();
}

// 对象初始化器
var e = new Enemy
{
    Name = "Slime",
    Level = 1,
    Tags = { "water", "cute" }     // 集合初始化器：不是赋值，是调用 Add
};

// 带参构造 + 初始化器
var e2 = new Enemy { Name = "Goblin", Level = 5 };

// 匿名对象（不可序列化）
var info = new { Name = "Sword", Damage = 10 };
```

### 3.10 资源释放：IDisposable 与 using

虽然 Unity 的托管对象靠 GC，但**非托管资源**（文件句柄、网络流、NativeArray）需要显式释放。

```csharp
using System;
using System.IO;
using UnityEngine;

public class FileLogger : IDisposable
{
    private readonly StreamWriter _writer;
    private bool _disposed;

    public FileLogger(string path)
    {
        _writer = new StreamWriter(path, append: true);
    }

    public void Log(string msg) => _writer.WriteLine(msg);

    // 手动释放
    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _writer?.Dispose();          // 递归释放内部资源
    }
}

public class Usage : MonoBehaviour
{
    private void Start()
    {
        // using 语句：离开作用域自动调用 Dispose（即使抛异常）
        using (var logger = new FileLogger(Application.persistentDataPath + "/log.txt"))
        {
            logger.Log("hello");
        }

        // C# 8 的 using 声明（Unity 2020.2+），作用域结束时释放
        // using var logger2 = new FileLogger("path");
    }
}
```

> **GC 与资源释放是两件事**：GC 只管托管内存。`NativeArray`、`RenderTexture`、`ComputeBuffer` 这类
> 一定要手动 `Dispose()` / `Release()`。Unity 的 `NativeArray` 在 Editor 退出时如果没释放会报
> "A Native Collection has not been disposed" 警告。

---

## 第 4 章 委托、事件、Lambda 与 LINQ

### 4.1 委托（Delegate）

委托是"类型安全的方法引用"，可以理解为 C# 的函数指针，但带类型检查且支持多播。

```csharp
using UnityEngine;

// ---------- 1) 自定义委托类型 ----------
public delegate void DamageHandler(int amount, string source);

public class Health
{
    public DamageHandler OnDamage;

    public void ApplyDamage(int amount, string source)
    {
        OnDamage?.Invoke(amount, source);   // ?. 保证无订阅者时不抛 NullReferenceException
    }
}

public class DelegateDemo : MonoBehaviour
{
    private void LogDamage(int amount, string source)
    {
        Debug.Log(amount + " from " + source);
    }

    private void Start()
    {
        var h = new Health();

        // 方法组赋值
        h.OnDamage += LogDamage;

        // 匿名方法
        h.OnDamage += delegate (int a, string s) { Debug.Log("anon " + a); };

        // Lambda
        h.OnDamage += (a, s) => Debug.Log("lambda " + a);

        h.ApplyDamage(10, "fire");   // 三个处理器依次执行

        // 移除（必须与添加时是同一个委托实例/方法组）
        h.OnDamage -= LogDamage;

        // 清空
        h.OnDamage = null;
    }
}
```

**内置泛型委托（优先使用，避免自己声明）**

| 委托 | 签名 | 用途 |
| --- | --- | --- |
| `System.Action` | `void ()` | 无参无返回 |
| `System.Action<T1,…>` | `void (T1,…)` | 最多 16 个参数，无返回 |
| `System.Func<TResult>` | `TResult ()` | 有返回 |
| `System.Func<T1,…,TResult>` | `TResult (T1,…)` | 有参数有返回 |
| `System.Predicate<T>` | `bool (T)` | 条件判断（List.Find 等） |
| `System.Comparison<T>` | `int (T,T)` | 比较器（List.Sort） |
| `System.Converter<TInput,TOutput>` | `TOutput (TInput)` | 转换（Array.ConvertAll） |
| `System.EventHandler` | `void (object, EventArgs)` | .NET 传统事件 |

```csharp
using UnityEngine;

public class DelegateBuiltins : MonoBehaviour
{
    private void Start()
    {
        System.Action a0 = () => Debug.Log("no args");
        System.Action<int> a1 = x => Debug.Log(x);
        System.Action<int, string, float> a3 = (x, y, z) => Debug.Log(x + y + z);

        System.Func<int> f0 = () => 1;
        System.Func<int, string> f1 = x => x.ToString();
        System.Func<int, int, bool> f2 = (x, y) => x > y;

        System.Predicate<int> p = x => x > 5;
        System.Comparison<Enemy> cmp = (x, y) => x.Hp.CompareTo(y.Hp);

        a0(); a1(1); a3(1, "a", 1f);
        Debug.Log(f0() + f1(2) + f2(1, 2));
        Debug.Log(p(10));
    }
}

public class Enemy { public float Hp; }
```

**多播委托的返回值：只取最后一个**

```csharp
System.Func<int> f = () => 1;
f += () => 2;
f += () => 3;
Debug.Log(f());   // 3

// 想拿到全部结果，用 GetInvocationList
System.Delegate[] list = f.GetInvocationList();
foreach (var d in list)
{
    Debug.Log(((System.Func<int>)d)());
}
```

**委托的 GC 问题（Unity 重点）**

```csharp
// ❌ 每次调用都创建一个新的 Comparison 委托对象
void Update()
{
    enemies.Sort((a, b) => a.Hp.CompareTo(b.Hp));   // 每帧分配
}

// ✅ 缓存成静态字段（不捕获任何外部状态，编译器也会自动缓存为静态字段）
private static readonly System.Comparison<Enemy> HpComparison =
    (a, b) => a.Hp.CompareTo(b.Hp);

void Update()
{
    enemies.Sort(HpComparison);   // 零分配
}
```

> **闭包分配规则（必须记住）**
> - Lambda 只使用**静态方法/静态字段**或不捕获任何外部状态 → 编译器缓存委托实例，**零分配**。
> - Lambda 捕获了**局部变量** → 生成一个闭包类实例（堆分配）**每次创建**。
> - Lambda 捕获了 **this**（访问实例字段或调用实例方法）→ 生成一个包装 `this` 的闭包，**每次创建**。
> - 因此 `Update` 里的 lambda 是 GC 的头号来源之一。

### 4.2 事件（Event）

`event` 是对委托字段的封装：**外部只能 `+=` / `-=`，不能赋值、不能调用**。

```csharp
using UnityEngine;

public class PlayerHealth : MonoBehaviour
{
    [SerializeField] private float _maxHp = 100f;
    private float _hp;

    // 事件声明
    public event System.Action<float, float> HpChanged;   // (current, max)
    public event System.Action Died;

    private void Awake() => _hp = _maxHp;

    public void TakeDamage(float amount)
    {
        if (_hp <= 0f) return;

        _hp = Mathf.Max(0f, _hp - amount);
        HpChanged?.Invoke(_hp, _maxHp);

        if (_hp <= 0f) Died?.Invoke();
    }
}

// ---------- 订阅方 ----------
public class HpBar : MonoBehaviour
{
    [SerializeField] private PlayerHealth _health;
    [SerializeField] private UnityEngine.UI.Image _fill;

    // 用 OnEnable/OnDisable 成对订阅，避免内存泄漏和"调用已销毁对象"
    private void OnEnable() => _health.HpChanged += HandleHpChanged;
    private void OnDisable() => _health.HpChanged -= HandleHpChanged;

    private void HandleHpChanged(float current, float max)
    {
        _fill.fillAmount = max <= 0f ? 0f : current / max;
    }
}
```

**为什么必须成对取消订阅（Unity 最常见的泄漏）**

```text
PlayerHealth 的事件列表里保存着 HpBar.HandleHpChanged 的委托
  ↑ 这个委托持有 HpBar 实例的引用
  ↓
HpBar 被 Destroy 后，引用仍然存在 → GC 无法回收 → 内存泄漏
  ↓
如果 PlayerHealth 继续触发事件 → 调用已销毁的 HpBar → MissingReferenceException
```

**C# event vs UnityEvent**

| 对比项 | C# `event` | `UnityEvent` |
| --- | --- | --- |
| Inspector 可配置 | ❌ | ✅ 可视化连线 |
| 性能 | 更快（直接委托调用） | 稍慢（内部列表 + 反射/委托） |
| 序列化 | 不序列化 | 可在运行时序列化（编辑器里保存的是持久化调用） |
| 参数限制 | 任意泛型 | 泛型版最多 4 个参数 |
| 返回值 | 可以有（多播取最后一个） | 无返回值 |
| 适用场景 | 代码内部模块解耦、高频事件 | 策划配置、美术连线、UI 按钮 |

```csharp
using UnityEngine;
using UnityEngine.Events;

public class Interactable : MonoBehaviour
{
    [Header("事件配置")]
    public UnityEvent OnInteract;                     // 无参
    public UnityEvent<int> OnScore;                   // 泛型版（2020.1+ 在 Inspector 可配置）
    public UnityEvent<string, float> OnMessage;       // 两个参数

    private void OnMouseDown()
    {
        OnInteract?.Invoke();
    }
}

// ---------- 代码绑定 ----------
public class InteractBinder : MonoBehaviour
{
    [SerializeField] private Interactable _target;
    private UnityAction _cachedHandler;      // 保存引用才能移除

    private void Start()
    {
        _cachedHandler = () => Debug.Log("interacted");
        _target.OnInteract.AddListener(_cachedHandler);
        _target.OnScore.AddListener(score => Debug.Log(score));
    }

    private void OnDestroy()
    {
        _target.OnInteract.RemoveListener(_cachedHandler);
        _target.OnInteract.RemoveAllListeners();   // 或直接清空
    }
}
```

> **UnityEvent 陷阱**：`AddListener` 传 lambda 时**无法用 `RemoveListener` 移除**（每次 lambda 都是新对象）。
> 必须先把 lambda 存到 `UnityAction` 变量里，或者用 `RemoveAllListeners()`。

### 4.3 Lambda 表达式

```csharp
// 表达式 lambda
System.Func<int, int> square = x => x * x;

// 语句 lambda
System.Action<int> print = x =>
{
    int doubled = x * 2;
    Debug.Log(doubled);
};

// 多参数
System.Func<int, int, int> add = (a, b) => a + b;

// 显式参数类型（少见，重载解析有歧义时有用）
System.Func<int, int> inc = (int x) => x + 1;

// 静态 lambda（C# 9，Unity 2021.2+）：编译期保证不捕获，零分配
System.Func<int, int> pure = static x => x + 1;

// 作为方法参数
list.Find(x => x.Id == 3);
list.ForEach(x => Debug.Log(x));
list.RemoveAll(x => x.Hp <= 0f);
```

**循环变量捕获的经典 bug**

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

public class ClosureDemo : MonoBehaviour
{
    private void Start()
    {
        // ❌ for 的循环变量是共享的（C# 5 之后仍如此）
        var actions = new List<Action>();
        for (int i = 0; i < 3; i++)
        {
            actions.Add(() => Debug.Log(i));   // 全部输出 3
        }
        foreach (var a in actions) a();

        // ✅ 引入局部副本
        actions.Clear();
        for (int i = 0; i < 3; i++)
        {
            int captured = i;
            actions.Add(() => Debug.Log(captured));   // 0, 1, 2
        }
        foreach (var a in actions) a();

        // ✅ foreach 的迭代变量在 C# 5+ 是每次迭代独立拷贝，没有这个问题
        actions.Clear();
        foreach (int item in new[] { 0, 1, 2 })
        {
            actions.Add(() => Debug.Log(item));       // 0, 1, 2
        }
        foreach (var a in actions) a();
    }
}
```

### 4.4 LINQ

需要 `using System.Linq;`

```csharp
using System.Linq;
using System.Collections.Generic;
using UnityEngine;

public class LinqDemo : MonoBehaviour
{
    private class Enemy
    {
        public int Id;
        public string Name;
        public string Type;
        public float Hp;
        public int Level;
        public bool IsBoss;
        public int WeaponId;
    }

    private class Weapon { public int Id; public float Damage; }

    private List<Enemy> enemies = new List<Enemy>();
    private List<Weapon> weapons = new List<Weapon>();

    private void Start()
    {
        // ---------- 筛选与投影 ----------
        List<Enemy> alive = enemies.Where(e => e.Hp > 0f).ToList();
        string[] names = enemies.Select(e => e.Name).ToArray();
        var indexed = enemies.Select((e, index) => new { e.Name, index }).ToList();
        var flat = enemies.SelectMany(e => e.Name.Split(' ')).ToList();

        // ---------- 排序 ----------
        List<Enemy> sorted = enemies.OrderBy(e => e.Level)
                                    .ThenByDescending(e => e.Hp)
                                    .ToList();

        // ---------- 聚合 ----------
        int totalLevel = enemies.Sum(e => e.Level);
        float avgHp = enemies.Average(e => e.Hp);
        int maxLevel = enemies.Max(e => e.Level);
        int bossCount = enemies.Count(e => e.IsBoss);
        float product = enemies.Select(e => e.Hp).Aggregate(1f, (acc, v) => acc * v);

        // ---------- 查找 ----------
        Enemy first = enemies.FirstOrDefault(e => e.IsBoss);
        Enemy single = enemies.SingleOrDefault(e => e.Id == 1);   // 多个匹配会抛异常
        Enemy last = enemies.LastOrDefault();
        bool anyAlive = enemies.Any(e => e.Hp > 0f);
        bool allAlive = enemies.All(e => e.Hp > 0f);
        bool noneDead = !enemies.Any(e => e.Hp <= 0f);
        Enemy at2 = enemies.ElementAtOrDefault(2);

        // ---------- 集合运算 ----------
        List<string> types = enemies.Select(e => e.Type).Distinct().ToList();
        var union = list1.Union(list2).ToList();
        var except = list1.Except(list2).ToList();
        var intersect = list1.Intersect(list2).ToList();
        var zip = list1.Zip(list2, (a, b) => a + b).ToList();

        // ---------- 分组 ----------
        var groups = enemies.GroupBy(e => e.Type);
        foreach (var g in groups)
        {
            Debug.Log(g.Key + ": " + g.Count());
            foreach (var e in g) Debug.Log("  " + e.Name);
        }

        // ---------- 查询语法（LINQ Query Syntax）----------
        var joined = from e in enemies
                     join w in weapons on e.WeaponId equals w.Id
                     where e.Hp > 0f
                     orderby w.Damage descending
                     select new { e.Name, w.Damage };

        // ---------- 分页 ----------
        List<Enemy> page = enemies.OrderBy(e => e.Id).Skip(10).Take(10).ToList();

        // ---------- 转字典 / Lookup ----------
        Dictionary<int, Enemy> byId = enemies.ToDictionary(e => e.Id, e => e);
        ILookup<string, Enemy> lookup = enemies.ToLookup(e => e.Type);

        // ---------- 生成 ----------
        List<int> range = Enumerable.Range(0, 10).ToList();          // 0..9
        List<string> repeat = Enumerable.Repeat("x", 3).ToList();
        List<Enemy> empty = Enumerable.Empty<Enemy>().ToList();
    }

    private List<int> list1 = new List<int>();
    private List<int> list2 = new List<int>();
}
```

**延迟执行（Deferred Execution）—— 必须理解**

```csharp
var query = enemies.Where(e => e.Hp > 0f);   // 此时没有执行任何筛选！

enemies.Add(new Enemy { Hp = 1f });          // 修改源集合

foreach (var e in query) { }                 // 真正遍历时才执行，看到的是最新的集合

// 想立刻求值（快照），加 ToList / ToArray / Count() / First()
var snapshot = enemies.Where(e => e.Hp > 0f).ToList();
```

> **延迟执行带来的经典 bug**：把一个 LINQ 查询存起来，之后反复遍历，每次结果可能不同；
> 或者源集合被修改后，查询抛出 `InvalidOperationException`（集合已修改）。

**Unity 中 LINQ 的性能问题**

```csharp
// ❌ 每帧 LINQ：多次 GC 分配（迭代器对象、闭包、结果 List）
private void Update()
{
    Enemy target = enemies.Where(e => e.Hp > 0f)
                          .OrderBy(e => (e.transform.position - transform.position).sqrMagnitude)
                          .FirstOrDefault();

    if (target != null) Attack(target);
}

// ✅ 手写循环：零 GC，速度更快
private Enemy FindNearestAlive()
{
    Enemy best = null;
    float bestSqr = float.MaxValue;
    Vector3 myPos = transform.position;

    for (int i = 0; i < _enemies.Count; i++)
    {
        Enemy e = _enemies[i];
        if (e == null || e.Hp <= 0f) continue;

        float d2 = (e.transform.position - myPos).sqrMagnitude;
        if (d2 < bestSqr) { bestSqr = d2; best = e; }
    }
    return best;
}
```

> **实战建议**：
> - 初始化、编辑器工具、存档读写 → 放心用 LINQ，可读性优先。
> - 每帧 `Update`、物理回调、渲染相关 → 禁用 LINQ，手写循环。
> - 确需 LINQ 语义又要性能 → 用 `ZString`、`StructLinq`、`ZLinq` 等零分配库。

---


## 第 5 章 泛型、反射、特性与异常

### 5.1 泛型（Generics）

泛型让类型成为参数，**编译期**就完成类型检查，同时避免装箱与强制转换。

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

// ---------- 泛型类 ----------
public class ObjectPool<T> where T : class
{
    private readonly Stack<T> _pool = new Stack<T>();
    private readonly Func<T> _factory;
    private readonly Action<T> _onGet;
    private readonly Action<T> _onRelease;

    public ObjectPool(Func<T> factory, Action<T> onGet = null, Action<T> onRelease = null, int prewarm = 0)
    {
        _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        _onGet = onGet;
        _onRelease = onRelease;

        for (int i = 0; i < prewarm; i++) _pool.Push(_factory());
    }

    public T Get()
    {
        T item = _pool.Count > 0 ? _pool.Pop() : _factory();
        _onGet?.Invoke(item);
        return item;
    }

    public void Release(T item)
    {
        _onRelease?.Invoke(item);
        _pool.Push(item);
    }

    public int Count => _pool.Count;
}

// ---------- 泛型方法 ----------
public static class GameObjectExtensions
{
    public static T GetOrAddComponent<T>(this GameObject go) where T : Component
    {
        if (go.TryGetComponent(out T c)) return c;
        return go.AddComponent<T>();
    }
}

// ---------- 泛型接口 ----------
public interface IRepository<T>
{
    T Get(int id);
    void Add(T item);
    IEnumerable<T> All();
}

// ---------- 使用 ----------
public class PoolDemo : MonoBehaviour
{
    private ObjectPool<Bullet> _pool;

    private void Start()
    {
        _pool = new ObjectPool<Bullet>(
            factory: () => new Bullet(),
            onGet: b => b.gameObject.SetActive(true),
            onRelease: b => b.gameObject.SetActive(false),
            prewarm: 20);

        var bullet = _pool.Get();
        _pool.Release(bullet);

        var rb = gameObject.GetOrAddComponent<Rigidbody>();   // 扩展方法用泛型
    }
}

public class Bullet { public GameObject gameObject; }
```


**泛型约束全表**

| 约束 | 含义 | 备注 |
| --- | --- | --- |
| `where T : struct` | 必须是值类型 | 不含 `Nullable<T>` |
| `where T : class` | 必须是引用类型 | |
| `where T : notnull` | 不可为空（C# 8） | 参考类型 |
| `where T : unmanaged` | 非托管类型（C# 7.3） | 可用于指针，如 `where T : unmanaged` |
| `where T : new()` | 必须有无参公共构造函数 | **必须放在约束列表最后** |
| `where T : BaseClass` | 必须是某类或其派生 | |
| `where T : IInterface` | 必须实现接口 | 可写多个 |
| `where T : U` | 与另一类型参数的关系 | 裸类型约束 |
| `where T : default` | C# 9，用于 `override` 消除歧义 | |

```csharp
// 多约束组合
public static T Create<T>() where T : Component, new()
{
    return new T();
}

// unmanaged 允许指针操作
public static unsafe int SizeOf<T>() where T : unmanaged
{
    return sizeof(T);
}
```


**实战：泛型单例基类**

```csharp
using UnityEngine;

public abstract class MonoSingleton<T> : MonoBehaviour where T : MonoSingleton<T>
{
    private static T _instance;
    private static readonly object _lock = new object();

    public static T Instance
    {
        get
        {
            if (_instance != null) return _instance;

            lock (_lock)
            {
                if (_instance != null) return _instance;

                _instance = FindObjectOfType<T>();
                if (_instance == null)
                {
                    var go = new GameObject(typeof(T).Name);
                    _instance = go.AddComponent<T>();
                }
                return _instance;
            }
        }
    }

    protected virtual void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);     // 场景里出现重复实例时销毁后来的
            return;
        }
        _instance = (T)this;
        DontDestroyOnLoad(gameObject);
    }

    protected virtual void OnDestroy()
    {
        if (_instance == this) _instance = null;
    }
}

public class AudioManager : MonoSingleton<AudioManager>
{
    public void PlayBgm(string name) { }
}
```


> **API 版本提醒**：`Object.FindObjectOfType<T>()` 从 **Unity 2023.1** 起被标记 `[Obsolete]`，
> 新 API 是 `Object.FindFirstObjectByType<T>()`（返回第一个）和 `Object.FindAnyObjectByType<T>()`（更快，任意一个）。
> 2020~2022 用 `FindObjectOfType` 即可，写新项目建议用新 API 并加版本宏。
> 另外，`FindObjectOfType` 在 2020.1+ 有重载 `FindObjectOfType<T>(bool includeInactive)`。

**协变与逆变**

```csharp
// 协变 out：把"更具体的"赋给"更抽象的"
System.Collections.Generic.IEnumerable<object> objs = new System.Collections.Generic.List<string>();

// 逆变 in：把"更抽象的"赋给"更具体的"
System.Action<object> baseAction = o => { };
System.Action<string> strAction = baseAction;    // ✅ 逆变

// 自定义协变接口
public interface IProducer<out T> { T Produce(); }

// 自定义逆变接口
public interface IConsumer<in T> { void Consume(T item); }
```


> **规则**：`out` 类型参数只能出现在输出位置（返回值），`in` 只能出现在输入位置（参数）。
> `IList<T>` 既是输入又是输出，所以既不能 `in` 也不能 `out`，这是它不能协变的原因。

### 5.2 反射（Reflection）

反射是在运行时检查和操作类型的能力。

```csharp
using System;
using System.Reflection;
using UnityEngine;

public class ReflectTarget
{
    public int PublicField = 1;
    private int _privateField = 2;
    public int PublicProperty { get; set; } = 3;
    public static string StaticField = "s";

    public void PublicMethod(int x) { Debug.Log("called " + x); }
    private void PrivateMethod() { Debug.Log("private"); }
}

public class ReflectionDemo : MonoBehaviour
{
    private void Start()
    {
        Type t = typeof(ReflectTarget);

        // ---------- 基本信息 ----------
        Debug.Log(t.FullName);                 // 完整类型名（含命名空间）
        Debug.Log(t.Name);                     // 简单名
        Debug.Log(t.IsClass);
        Debug.Log(t.IsAbstract);
        Debug.Log(t.IsEnum);
        Debug.Log(t.BaseType?.Name);
        Debug.Log(t.Namespace);
        Debug.Log(t.Assembly.GetName().Name);  // 所在程序集

        // ---------- 字段 ----------
        const BindingFlags Flags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance;
        foreach (FieldInfo f in t.GetFields(Flags))
        {
            Debug.Log(f.Name + " : " + f.FieldType.Name);
        }

        // ---------- 属性 / 方法 / 事件 ----------
        PropertyInfo prop = t.GetProperty("PublicProperty");
        MethodInfo method = t.GetMethod("PublicMethod");
        MethodInfo privMethod = t.GetMethod("PrivateMethod", BindingFlags.NonPublic | BindingFlags.Instance);

        // ---------- 创建实例 ----------
        object instance = Activator.CreateInstance(t);

        // ---------- 调用方法 ----------
        method.Invoke(instance, new object[] { 5 });
        privMethod.Invoke(instance, null);

        // ---------- 读写字段 ----------
        FieldInfo privField = t.GetField("_privateField", Flags);
        Debug.Log(privField.GetValue(instance));     // 2
        privField.SetValue(instance, 99);
        Debug.Log(privField.GetValue(instance));     // 99

        // ---------- 静态成员 ----------
        FieldInfo sf = t.GetField("StaticField");
        Debug.Log(sf.GetValue(null));                // 静态字段传 null

        // ---------- 特性读取 ----------
        object[] attrs = t.GetCustomAttributes(inherit: true);
        Debug.Log(attrs.Length);
    }
}
```


**Unity 中反射的典型用途**

```csharp
using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;

// ---------- 1) 用特性标记 + 反射批量注册系统 ----------
[AttributeUsage(AttributeTargets.Class)]
public class GameSystemAttribute : Attribute
{
    public int Order { get; }
    public GameSystemAttribute(int order = 0) => Order = order;
}

[GameSystem(10)]
public class CombatSystem { }

[GameSystem(20)]
public class SaveSystem { }

public static class SystemRegistry
{
    public static List<Type> DiscoverAll()
    {
        var result = new List<Type>();
        Assembly asm = typeof(SystemRegistry).Assembly;

        foreach (Type t in asm.GetTypes())     // 注意：GetTypes 会分配数组，别在热路径调用
        {
            if (!t.IsClass || t.IsAbstract) continue;
            var attr = t.GetCustomAttribute<GameSystemAttribute>();
            if (attr != null) result.Add(t);
        }

        result.Sort((a, b) =>
            a.GetCustomAttribute<GameSystemAttribute>().Order
                .CompareTo(b.GetCustomAttribute<GameSystemAttribute>().Order));

        return result;
    }
}

// ---------- 2) 编辑器菜单 ----------
#if UNITY_EDITOR
using UnityEditor;
public static class MyEditorMenu
{
    [MenuItem("Tools/My Tool/Run")]
    private static void Run() => Debug.Log("run from menu");
}
#endif
```


**反射的性能优化**

```csharp
using System;
using System.Reflection;

public class FastReflection
{
    // 反射 Invoke 比直接调用慢 100~1000 倍，而且每次调用都有装箱与 object[] 分配

    // ---------- 方案一：缓存 MemberInfo ----------
    private static readonly MethodInfo CachedMethod =
        typeof(ReflectTarget).GetMethod("PublicMethod");

    // ---------- 方案二：缓存委托（推荐，接近直接调用的性能）----------
    private static Action<ReflectTarget, int> _fastAction;

    static FastReflection()
    {
        MethodInfo m = typeof(ReflectTarget).GetMethod("PublicMethod");
        _fastAction = (Action<ReflectTarget, int>)Delegate.CreateDelegate(
            typeof(Action<ReflectTarget, int>), m);
    }

    public static void CallFast(ReflectTarget t) => _fastAction(t, 5);

    // ---------- 方案三：表达式树（可支持更复杂的场景）----------
    // ---------- 方案四：IL Emit（最强但最复杂，IL2CPP 下受限）----------
}
```


> **IL2CPP 的重要限制**：IL2CPP 是 AOT 编译。泛型实例只在**编译期被引用过**的情况下才会生成代码。
> 如果只在反射里用到 `Foo<Bar>`，AOT 阶段可能不生成该实例 → 运行时抛出 `ExecutionEngineException`
> 或返回 `null` MethodInfo。解决办法：
> 1. 在代码里显式"实例化"一次（`if (false) { new Foo<Bar>(); }` 这种 dummy 调用）；
> 2. 加 `[UnityEngine.Scripting.Preserve]` 特性；
> 3. 在 `link.xml` 中保留类型/程序集（详见第 11 章）。

### 5.3 特性（Attribute）

特性是给元数据打标记的机制。

```csharp
using System;
using UnityEngine;

// ---------- 定义特性 ----------
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method,   // 可应用的目标
                AllowMultiple = true,                                // 是否可重复应用
                Inherited = true)]                                   // 是否被派生类继承
public class SkillAttribute : Attribute
{
    public string Id { get; }
    public float Cooldown { get; }

    // 特性参数只能是编译期常量（基本类型、string、Type、枚举、数组）
    public SkillAttribute(string id, float cooldown = 1f)
    {
        Id = id;
        Cooldown = cooldown;
    }
}

// ---------- 应用 ----------
[Skill("fireball", 3f)]
[Skill("icebolt", 2f)]
[Serializable]
public class Mage
{
    [Skill("heal")]
    public void Heal() { }
}

// ---------- 读取 ----------
public class AttributeReader : MonoBehaviour
{
    private void Start()
    {
        // 取类上的全部 Skill 特性
        object[] attrs = typeof(Mage).GetCustomAttributes(typeof(SkillAttribute), true);
        foreach (SkillAttribute a in attrs)
        {
            Debug.Log(a.Id + " cd=" + a.Cooldown);
        }

        // 取单个（不存在返回 null）
        SkillAttribute single = typeof(Mage).GetCustomAttribute<SkillAttribute>();
        Debug.Log(single?.Id);

        // 取方法上的
        var m = typeof(Mage).GetMethod("Heal");
        Debug.Log(m.GetCustomAttribute<SkillAttribute>()?.Id);
    }
}
```


**Unity 常用内置特性全表**

| 特性 | 作用 | 备注 |
| --- | --- | --- |
| `[SerializeField]` | 私有字段暴露到 Inspector | 最常用 |
| `[SerializeReference]` | 序列化多态/接口（2019.3+） | 见下方详解 |
| `[HideInInspector]` | public 字段不在 Inspector 显示 | 但字段仍被序列化 |
| `[System.NonSerialized]` | 完全不参与序列化 | |
| `[Range(min,max)]` | 数值滑块 | 仅 float/int |
| `[Min(v)]` | 最小值硬限制 | 2019.1+ |
| `[Tooltip("...")]` | 悬停提示 | |
| `[Header("...")]` | Inspector 分组标题 | |
| `[Space(pixels)]` | 分组间距 | |
| `[TextArea(min,max)]` | 多行文本 | |
| `[Multiline(lines)]` | 多行（不自动换行） | |
| `[Delayed]` | 输入完成（回车/失焦）才提交 | |
| `[ColorUsage(hdr, alpha)]` | 颜色选择器配置 | 2018.1+ |
| `[GradientUsage(hdr)]` | 渐变配置 | 2018.1+ |
| `[RequireComponent(typeof(X))]` | 自动添加依赖组件 | 类特性 |
| `[DisallowMultipleComponent]` | 禁止同物体挂多个 | 类特性 |
| `[ExecuteInEditMode]` | 编辑模式也执行生命周期 | 类特性 |
| `[ExecuteAlways]` | 编辑模式 + 预制体预览 + Play | 2018.1+ |
| `[AddComponentMenu("A/B")]` | AddComponent 菜单路径 | 类特性 |
| `[ContextMenu("名称")]` | 组件右上角菜单 | 方法特性 |
| `[ContextMenuItem("名","方法名")]` | 字段右键菜单 | 字段特性 |
| `[CreateAssetMenu(...)]` | 右键创建 ScriptableObject | 类特性 |
| `[System.Flags]` | 枚举按位组合 | |
| `[System.Obsolete("...")]` | 标记弃用（可 error=true） | |
| `[RuntimeInitializeOnLoadMethod(类型)]` | 运行时初始化钩子 | 静态方法 |
| `[UnityEngine.Scripting.Preserve]` | 防止 IL2CPP 剥离 | 见第 11 章 |
| `[FormerlySerializedAs("旧名")]` | 字段改名后保留已存数据 | 强烈推荐 |
| `[SelectionBase]` | 在场景里点击子物体时选中父物体 | |
| `[HelpURL("...")]` | 组件文档链接 | |
| `[AssemblyIsEditorAssembly]` | 标记整个程序集为编辑器程序集 | |

**综合示例：一个策划友好的组件**

```csharp
using UnityEngine;

[DisallowMultipleComponent]
[RequireComponent(typeof(Rigidbody))]
[AddComponentMenu("Game/Enemies/Enemy Config")]
public class EnemyConfig : MonoBehaviour
{
    [Header("基础属性")]
    [Tooltip("敌人的显示名字")]
    [SerializeField] private string _displayName = "Slime";

    [Header("战斗属性")]
    [Range(1f, 1000f)]
    [SerializeField] private float _maxHp = 100f;

    [Min(0f)]
    [SerializeField] private float _moveSpeed = 3.5f;

    [Space(12)]
    [TextArea(2, 5)]
    [SerializeField] private string _description;

    [Header("引用")]
    [SerializeField] private Animator _animator;

    // 字段改名但保留已有场景/预制体数据
    [FormerlySerializedAs("_oldSpeed")]
    [SerializeField] private float _speed = 3f;

    [ContextMenu("重置默认值")]
    private void ResetToDefault()
    {
        _maxHp = 100f;
        _speed = 3f;
    }

    // 组件首次添加或 Inspector 中 Reset 时调用
    private void Reset()
    {
        _maxHp = 100f;
    }

    // 在 Inspector 里修改值时调用（仅编辑器）
    private void OnValidate()
    {
        _maxHp = Mathf.Max(1f, _maxHp);
        _moveSpeed = Mathf.Max(0f, _moveSpeed);
    }
}
```


**SerializeReference：真正的多态序列化（2019.3+）**

```csharp
using System;
using UnityEngine;

[Serializable]
public abstract class SkillEffect
{
    public string Id;
    public abstract void Apply(GameObject target);
}

[Serializable]
public class DamageEffect : SkillEffect
{
    public float Amount = 10f;
    public override void Apply(GameObject target) { /* 扣血 */ }
}

[Serializable]
public class HealEffect : SkillEffect
{
    public float Amount = 10f;
    public override void Apply(GameObject target) { /* 回血 */ }
}

public class Skill : MonoBehaviour
{
    // [SerializeReference] 会按实际类型序列化（包含子类）
    // Inspector 里可以下拉选择 DamageEffect / HealEffect
    [SerializeReference] public SkillEffect Effect;

    // 对比：普通 [SerializeField] 的多态字段会被序列化成基类，子类字段全丢失
    // [SerializeField] public SkillEffect BrokenEffect;

    // 更强大：接口类型 + [SerializeReference] 也能序列化（2019.3+）
    [SerializeReference] public IComparable Anything;
}
```


> **重要区别**：
> - `[SerializeField]` 用在抽象类字段上，Unity 会按**声明的类型**序列化，子类新增字段丢失。
> - `[SerializeReference]` 保存实际类型和字段，支持多态与接口，但**不能用于 struct**，
>   且字段不能是 `UnityEngine.Object` 引用（那是另一套引用序列化系统）。

### 5.4 异常处理

```csharp
using System;
using UnityEngine;

public class ExceptionDemo : MonoBehaviour
{
    private void Start()
    {
        try
        {
            GameObject go = GameObject.Find("NotExist");
            go.SetActive(false);                    // NullReferenceException
        }
        catch (NullReferenceException e)
        {
            Debug.LogError("空引用：" + e.Message);
        }
        catch (Exception e) when (e.Message.Contains("timeout"))   // 异常筛选器（C# 6+）
        {
            Debug.LogError("超时：" + e.Message);
        }
        catch (Exception e)
        {
            Debug.LogException(e);                  // 保留堆栈
            throw;                                  // 重新抛出（保留原始堆栈）
        }
        finally
        {
            // 无论是否异常都会执行，用于释放资源
        }
    }
}
```


**常用异常类型**

| 异常 | 触发场景 |
| --- | --- |
| `NullReferenceException` | 访问 null 的成员 |
| `IndexOutOfRangeException` | 数组/List 下标越界 |
| `ArgumentNullException` | 传了 null 给不允许 null 的参数 |
| `ArgumentException` | 参数非法（如 Dictionary.Add 重复键） |
| `InvalidOperationException` | 状态不允许该操作（遍历中改集合） |
| `KeyNotFoundException` | Dictionary 索引器取不存在的键 |
| `FormatException` | `int.Parse` 格式错误 |
| `OverflowException` | `checked` 溢出 |
| `NotSupportedException` | 平台/类型不支持 |
| `FileNotFoundException` | IO 文件不存在 |
| `MissingReferenceException` | **Unity 特有**：访问已销毁的对象 |
| `MissingComponentException` | **Unity 特有**：`GetComponent` 失败后访问返回对象 |
| `UnassignedReferenceException` | **Unity 特有**：Inspector 引用没赋值 |

**自定义异常**

```csharp
using System;

public class ConfigLoadException : Exception
{
    public string FilePath { get; }

    public ConfigLoadException(string path, string message) : base(message)
    {
        FilePath = path;
    }

    public ConfigLoadException(string path, string message, Exception inner)
        : base(message, inner)
    {
        FilePath = path;
    }
}
```


**Unity 异常实践**

```csharp
// ✅ 用 TryXxx 模式表达"预期内的失败"
public bool TryLoadConfig(string path, out Config cfg)
{
    cfg = null;
    if (!System.IO.File.Exists(path)) return false;

    try
    {
        cfg = JsonUtility.FromJson<Config>(System.IO.File.ReadAllText(path));
        return cfg != null;
    }
    catch (Exception e)
    {
        Debug.LogWarning("配置加载失败：" + path + "，" + e.Message);
        return false;
    }
}

// ❌ 不要用异常做正常流程控制
// ❌ 不要 catch (Exception) 后什么都不做（吞异常是 bug 的温床）

// ---------- 全局异常捕获 ----------
private void OnEnable()
{
    Application.logMessageReceived += OnLog;
}

private void OnDisable()
{
    Application.logMessageReceived -= OnLog;
}

private void OnLog(string condition, string stackTrace, LogType type)
{
    if (type == LogType.Exception || type == LogType.Error)
    {
        // 上报到日志系统 / 崩溃收集
        // 注意：Application.logMessageReceived 必须在主线程调用 Unity API
    }
}
```


> **线程安全提醒**：`Application.logMessageReceived` 在异常发生的线程上被调用。
> 如果在后台线程里直接调用 Unity API（如 `Debug.Log` 之外的东西）会报错。
> 需要回到主线程处理时，用线程安全队列 + `Update` 消费，或 `logMessageReceivedThreaded` + 加锁。

**Burst / Job 中不能使用异常**

```csharp
// ❌ Burst 编译的方法里不允许 try/catch
// [BurstCompile]
// struct MyJob : IJob { public void Execute() { try { } catch { } } }

// ✅ Job 里用返回错误码 / 写入 NativeArray 的错误标记来表达失败
```


---

## 第 6 章 现代 C# 特性（C# 6 → 9）与 Unity 支持矩阵

### 6.1 支持矩阵（务必对照项目版本）

| 特性 | C# 版本 | Unity 最低版本 | 备注 |
| --- | --- | --- | --- |
| 字符串插值 `$"..."` | 6 | 2017.1 | |
| 表达式体成员 `=>` | 6 | 2017.1 | |
| `nameof` | 6 | 2017.1 | |
| 空条件运算符 `?.` | 6 | 2017.1 | |
| `using static` | 6 | 2017.1 | |
| 异常筛选器 `when` | 6 | 2017.1 | |
| `out var` 内联声明 | 7 | 2018.3 | |
| 元组 `(a, b)` 与解构 | 7 | 2018.3 | |
| 模式匹配 `is T t`、`case T t` | 7 | 2018.3 | |
| 局部函数 | 7 | 2018.3 | |
| 数字分隔符 `1_000` | 7 | 2018.3 | |
| 二进制字面量 `0b1010` | 7 | 2018.3 | |
| `ref` 局部变量与返回 | 7 | 2018.3 | |
| `throw` 表达式 | 7 | 2018.3 | |
| `in` 只读参数 | 7.2 | 2018.3 | |
| `readonly struct` | 7.2 | 2018.3 | |
| `ref readonly` 返回 | 7.2 | 2018.3 | |
| `stackalloc` 初始值设定 | 7.3 | 2018.3 | |
| `unmanaged` 约束 | 7.3 | 2018.3 | |
| `AttributeTargets` 增强（field/property） | 7.3 | 2018.3 | `[field: SerializeField]` |
| `??=` 空合并赋值 | 8 | 2020.2 | |
| `using` 声明（无大括号） | 8 | 2020.2 | |
| `switch` 表达式 | 8 | 2020.2 | |
| `static` 局部函数 | 8 | 2020.2 | |
| 索引与范围 `^1`、`1..3` | 8 | 2020.2 | 需要 `Index`/`Range` 类型（Unity 2021 有） |
| 可空引用类型 `string?` | 8 | 2020.2 | 需开启 `#nullable` |
| 默认接口实现（DIM） | 8 | **不支持** | Mono 未实现 |
| `record` / `record class` | 9 | 2021.2 | |
| `init` 访问器 | 9 | 2021.2 | |
| `with` 表达式 | 9 | 2021.2 | |
| 目标类型 `new`（`Point p = new();`） | 9 | 2021.2 | |
| 顶层语句 | 9 | **不适用** | Unity 没有 Program.Main |
| 模式匹配增强 `is not null`、`and`/`or` | 9 | 2021.2 | |
| `static` lambda | 9 | 2021.2 | |
| 分部方法扩展（返回值/修饰符） | 9 | 2021.2 | |
| 原生整数 `nint` | 9 | 2021.2 | |
| 文件作用域命名空间 | 10 | **不支持** | |
| `record struct` | 10 | **不支持** | |
| 原始字符串 `"""..."""` | 11 | **不支持** | |
| 必需成员 `required` | 11 | **不支持** | |

### 6.2 逐个特性详解与示例

#### 字符串插值与格式化

```csharp
int level = 7;
float hp = 0.5f;

// 基础插值
string s1 = "Level " + level + " HP " + hp.ToString("P0");

// 格式化说明符
string s2 = $"Level {level:D3} HP {hp:P0}";      // Level 007 HP 50%

// 对齐（正数左对齐，负数右对齐）
string s3 = $"[{level,5:D3}]";                   // [  007]

// 表达式
string s4 = $"{level * 2}";

// 条件
string s5 = $"{(hp > 0.3f ? "safe" : "danger")}";

// 逐字 + 插值（C# 8 起 $ 和 ` 顺序可交换）
string path = $@"C:/Game/Level{level}.dat";
```


> 注意：`$` 插值字符串在编译时可能被优化为 `string.Concat` 或 `string.Format`；
> 值类型会装箱（当走 `string.Format` 路径时）。高频路径用 `StringBuilder` 或 `ZString`。

#### 表达式体成员

```csharp
using UnityEngine;

public class ExpressiveDemo : MonoBehaviour
{
    private int _hp = 100;

    // 属性
    public int Hp => _hp;

    // 方法
    public float GetPercent(float max) => _hp / max;

    // 构造函数
    public ExpressiveDemo() : this(100) { }
    public ExpressiveDemo(int hp) => _hp = hp;

    // 索引器
    private readonly int[] _data = new int[4];
    public int this[int i] => _data[i];

    // 终结器（不常用）
    ~ExpressiveDemo() { }
}
```


#### nameof

```csharp
using UnityEngine;

public class NameofDemo : MonoBehaviour
{
    [SerializeField] private float _speed = 5f;

    private void Start()
    {
        Debug.Log(nameof(_speed));                    // "_speed"（注意有下划线）
        Debug.Log(nameof(NameofDemo));                // "NameofDemo"
        Debug.Log(nameof(transform.position));        // "position"（取最后一个标识符）
        Debug.Log(nameof(System.Collections.Generic.List<int>));   // "List"

        // 实用：属性变更通知、资源路径校验
        Validate(nameof(_speed), _speed);
    }

    private void Validate(string fieldName, float value)
    {
        if (value < 0f) Debug.LogWarning(fieldName + " 不能为负");
    }
}
```


#### 模式匹配

```csharp
using System;
using UnityEngine;

public class PatternDemo : MonoBehaviour
{
    private object _payload;

    private void Start()
    {
        // ---------- 类型模式 ----------
        if (_payload is string str) Debug.Log(str.Length);

        // ---------- 常量模式 ----------
        if (_payload is 42) Debug.Log("is forty-two");

        // ---------- null 模式 ----------
        if (_payload is null) Debug.Log("null");

        // ---------- 属性模式（C# 8）----------
        if (_payload is Vector3 { x: 0f } v) Debug.Log("on YZ plane: " + v);

        // ---------- 递归/关系模式（C# 9）----------
        int hp = 50;
        if (hp is > 0 and < 30) Debug.Log("critical");
        if (hp is <= 0 or >= 100) Debug.Log("edge");
        if (_payload is not null) Debug.Log("not null");

        // ---------- 位置模式（需要 Deconstruct）----------
        var (a, b) = (1, 2);
        if ((a, b) is (1, 2)) Debug.Log("matched");

        // ---------- switch 表达式（C# 8）----------
        string tier = hp switch
        {
            <= 0 => "dead",
            < 30 => "critical",
            < 70 => "normal",
            _ => "healthy"
        };

        // ---------- 带 when 的 switch ----------
        string desc = _payload switch
        {
            int i when i > 100 => "big int",
            int _ => "int",
            string { Length: 0 } => "empty string",
            Vector3 vec => "vector " + vec,
            null => "null",
            _ => "unknown"
        };
        Debug.Log(desc);
    }
}

// 带 Deconstruct 的类型
public class Point
{
    public int X { get; }
    public int Y { get; }
    public Point(int x, int y) { X = x; Y = y; }
    public void Deconstruct(out int x, out int y) { x = X; y = Y; }
}
```


#### 局部函数

```csharp
using UnityEngine;

public class LocalFunctionDemo : MonoBehaviour
{
    private void Start()
    {
        Debug.Log(Sum(10));

        // 局部函数：定义在方法内部，可以访问外层变量
        int Sum(int n)
        {
            int total = 0;
            for (int i = 1; i <= n; i++) total += i;
            return total;      // 55
        }

        // 静态局部函数（C# 8）：保证不捕获闭包，零分配
        static int Square(int x) => x * x;
        Debug.Log(Square(4));

        // 局部函数 vs Lambda：
        // 局部函数是"方法"，不产生委托分配（除非转成委托）
        // Lambda 每次执行都会创建委托对象（未缓存时）
    }
}
```


#### ref 局部与 ref return

```csharp
using UnityEngine;

public class RefDemo : MonoBehaviour
{
    private readonly float[] _samples = new float[256];

    private void Start()
    {
        // ref 局部变量：直接引用数组元素，避免拷贝
        ref float first = ref _samples[0];
        first = 42f;
        Debug.Log(_samples[0]);        // 42

        // ref readonly 返回：只读访问，不拷贝
        ref readonly float s = ref GetSample(5);
        Debug.Log(s);

        // 使用场景：大 struct 数组元素的原地修改
        Vector3[] points = new Vector3[10];
        ref Vector3 p = ref points[3];
        p.x = 1f;                      // 直接改数组元素，无拷贝
    }

    private ref float GetSample(int index) => ref _samples[index];
}
```


> `ref` 用在 Unity 的 struct 数组（如 `Vector3[]` 顶点数组）上能显著减少拷贝。

#### using 声明与 switch 表达式（C# 8）

```csharp
using System.IO;
using UnityEngine;

public class ModernSyntaxDemo : MonoBehaviour
{
    private void SaveAll()
    {
        // C# 8 的 using 声明：作用域（方法）结束时自动 Dispose
        using var writer = new StreamWriter(Application.persistentDataPath + "/save.json");
        writer.WriteLine("{}");
        // 方法结束时自动释放
    }

    private string GetGrade(int score) => score switch
    {
        >= 90 => "A",
        >= 80 => "B",
        >= 60 => "C",
        _ => "F"
    };
}
```


#### record 与 init（C# 9，Unity 2021.2+）

```csharp
using UnityEngine;

// record：引用类型，自带值相等、ToString、with 支持
public record PlayerProfile(string Name, int Level);

public record WeaponData
{
    public string Id { get; init; } = "";
    public float Damage { get; init; }
    public float CritRate { get; init; }

    // record 也支持自定义方法
    public float ExpectedDamage => Damage * (1f + CritRate);
}

public class RecordDemo : MonoBehaviour
{
    private void Start()
    {
        var p1 = new PlayerProfile("Hero", 5);
        var p2 = new PlayerProfile("Hero", 5);

        Debug.Log(p1 == p2);                        // True —— record 是值相等
        Debug.Log(p1.ToString());                   // PlayerProfile { Name = Hero, Level = 5 }

        // with 表达式：基于现有实例创建修改后的副本
        var p3 = p1 with { Level = 6 };
        Debug.Log(p3);

        // 解构
        var (name, level) = p1;
        Debug.Log(name + " " + level);

        // init：
        // new WeaponData { Id = "sword", Damage = 10f };   ✅
        // w.Damage = 20f;                                   ❌ 编译错误
    }
}
```


> **Unity 注意**：`record` 不能被 Unity 序列化（没有 `[System.Serializable]` 支持，且编译器生成的字段是只读 init 属性）。
> 它适合做纯数据 DTO、编辑器工具、游戏逻辑层的不可变数据。
> 另外 `record` 在 IL2CPP 下完全可用（Unity 2021.2+）。

#### 目标类型 new（C# 9）

```csharp
using System.Collections.Generic;
using UnityEngine;

public class TargetTypedNewDemo : MonoBehaviour
{
    private void Start()
    {
        // C# 8 及以前
        List<int> a = new List<int>();
        Vector3 b = new Vector3(1f, 2f, 3f);

        // C# 9：目标类型推导（Unity 2021.2+）
        List<int> c = new();
        Vector3 d = new(1f, 2f, 3f);
        Dictionary<string, List<int>> e = new();

        Debug.Log(c.Count + "" + d + e.Count);
    }
}
```


#### static lambda 与防止闭包

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

public class StaticLambdaDemo : MonoBehaviour
{
    private void Start()
    {
        var list = new List<int> { 3, 1, 2 };

        // ❌ 捕获 this / 局部变量 → 每次分配闭包
        int offset = 10;
        list.Sort((x, y) => (x + offset).CompareTo(y + offset));

        // ✅ static lambda（C# 9）：编译期禁止捕获，零分配
        list.Sort(static (x, y) => x.CompareTo(y));

        // ✅ 用静态比较器缓存
        list.Sort(IntComparer);
    }

    private static int IntComparer(int x, int y) => x.CompareTo(y);
}
```


### 6.3 Unity 中的 `csc.rsp` 与语言级别配置

Unity 允许在项目里放 `Assets/csc.rsp` 文件给 C# 编译器传参：

```text
# Assets/csc.rsp
-langversion:9.0
-nowarn:0169,0649
-nullable:enable
```


> **警告**：`-langversion` 只能下调或对齐 Unity 支持的版本，**不能**开启 Unity 不支持的语法
> （例如把语言版本调到 11 并不会让 `record struct` 可用，反而可能编译失败）。
> 常见用途是 `-nowarn` 关闭某些警告、`-nullable` 开启可空引用类型。

---


## 第 7 章 Unity 脚本运行时核心

### 7.1 MonoBehaviour 的全部生命周期回调

这是 Unity 开发最核心的一张表。

```text
                    ┌──────────────────────────────────────┐
                    │            脚本实例被创建              │
                    └──────────────────────────────────────┘
                                      │
                            ┌─────────▼─────────┐
                            │   Reset()         │  编辑器：组件被添加或点 Reset 时（仅编辑器）
                            └─────────┬─────────┘
                            ┌─────────▼─────────┐
                            │   Awake()         │  对象被实例化时（即使组件被禁用也调用一次）
                            └─────────┬─────────┘
                            ┌─────────▼─────────┐
                            │   OnEnable()      │  组件/物体 enabled 变为 true（可能多次）
                            └─────────┬─────────┘
                  ┌───────────────────▼───────────────────┐
                  │        Start()（第一帧 Update 前）      │  只调用一次，且只在该组件处于启用状态时调用
                  └───────────────────┬───────────────────┘
                                      │
       ┌──────────────────────────────┴──────────────────────────────┐
       │                    每帧循环（帧循环）                          │
       │  FixedUpdate()  → 物理（固定时间步，可能一帧 0~N 次）             │
       │  OnTriggerXXX / OnCollisionXXX  → 紧随物理步之后触发            │
       │  Update()       → 每帧一次                                  │
       │  yield null / WaitForEndOfFrame 协程恢复                     │
       │  LateUpdate()   → 每帧一次（相机跟随）                         │
       │  OnWillRenderObject → 渲染                                   │
       │  OnGUI()        → 立即模式 GUI（每帧多次，性能差）               │
       │  OnDrawGizmos() → 场景视图绘制（仅编辑器/开发构建）               │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                            ┌─────────▼─────────┐
                            │   OnDisable()     │  组件/物体被禁用
                            └─────────┬─────────┘
                            ┌─────────▼─────────┐
                            │  OnDestroy()      │  对象被销毁（场景卸载/切场景/程序退出）
                            └───────────────────┘
                            ┌───────────────────┐
                            │ OnApplicationQuit │  应用退出（在 OnDestroy 前）
                            └───────────────────┘
```

```csharp
using UnityEngine;

public class LifecycleDemo : MonoBehaviour
{
    // ---------- 实例化阶段 ----------
    private void Awake()
    {
        // 1) 最早的生命周期，即使脚本组件被 disabled 也会执行
        // 2) 同物体上的多个组件，Awake 顺序不确定（除非在 Script Execution Order 里设置）
        // 3) 适合：初始化自身引用、缓存 GetComponent、初始化数据结构
        Debug.Log("Awake");
    }

    private void OnEnable()
    {
        // 组件或物体 enable 变 true 时调用，可能被多次调用（反复开关）
        // 适合：事件订阅、启用轮询
        Debug.Log("OnEnable");
    }

    private void Start()
    {
        // 第一帧 Update 之前调用一次（受物体/组件 enabled 影响：只有启用时才会调）
        // 适合：需要别的对象 Awake 完成后的初始化、依赖注入
        Debug.Log("Start");
    }

    // ---------- 每帧循环 ----------
    private void FixedUpdate()
    {
        // 固定时间步（默认 0.02s = 50Hz），与帧率无关
        // 适合：所有 Rigidbody / Rigidbody2D 的物理操作、力、速度
        // 注意：输入检测不要放这里（会丢输入）
    }

    private void Update()
    {
        // 每帧一次，帧间隔可变（Time.deltaTime）
        // 适合：输入检测、计时器、非物理移动、状态机
    }

    private void LateUpdate()
    {
        // 所有 Update 之后调用
        // 适合：相机跟随（保证目标已经移动完毕）、IK 修正、UI 跟随世界物体
    }

    // ---------- 物理回调 ----------
    private void OnCollisionEnter(Collision collision) { }
    private void OnCollisionStay(Collision collision) { }
    private void OnCollisionExit(Collision collision) { }
    private void OnTriggerEnter(Collider other) { }
    private void OnTriggerStay(Collider other) { }
    private void OnTriggerExit(Collider other) { }

    // ---------- 渲染与 GUI ----------
    private void OnWillRenderObject() { }
    private void OnRenderObject() { }
    private void OnGUI()
    {
        // 立即模式 GUI，每帧可能调用多次（Layout 和 Repaint）
        // 只推荐用于调试工具，正式 UI 用 UGUI / UI Toolkit
    }
    private void OnDrawGizmos()
    {
        // 场景视图绘制（编辑器，或开发构建的 Gizmos 开关）
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, 1f);
    }
    private void OnDrawGizmosSelected()
    {
        // 只在选中对象时绘制
    }

    // ---------- 销毁阶段 ----------
    private void OnDisable()
    {
        // 组件被禁用或物体被禁用时调用
        // 必须与 OnEnable 成对取消订阅
        Debug.Log("OnDisable");
    }

    private void OnDestroy()
    {
        // 对象被销毁、场景卸载、退出播放模式时调用
        Debug.Log("OnDestroy");
    }

    private void OnApplicationQuit()
    {
        // 应用退出（编辑器停止播放、发布版关闭）
        Debug.Log("OnApplicationQuit");
    }

    private void OnApplicationPause(bool pauseStatus)
    {
        // 移动端切后台/回前台
    }

    private void OnApplicationFocus(bool hasFocus) { }

    // ---------- 编辑器专用 ----------
    private void Reset()
    {
        // 组件首次添加或 Inspector 点 Reset 时
    }

    private void OnValidate()
    {
        // Inspector 中修改值时（含进入播放模式前）
    }

    private void OnBecameVisible() { }
    private void OnBecameInvisible() { }
}
```

> **重要细节 1（Start 的时机）**：`Start` 在对象第一次启用后的"那一帧的 Update 之前"执行。
> 如果对象在本帧的 Update 之后才被 `Instantiate` 出来，它的 `Start` 会在**下一帧**才执行。
>
> **重要细节 2（Awake 顺序）**：同一物体上多个 `MonoBehaviour` 的 `Awake` 调用顺序是**未定义**的，
> 除非用 `Edit → Project Settings → Script Execution Order` 显式排序。跨物体的顺序同样不确定。
> 依赖其他对象初始化的逻辑放 `Start`，不要放 `Awake`。
>
> **重要细节 3（OnDestroy 的时机）**：退出播放模式时，`OnDestroy` 会执行；但如果对象是"当前帧被销毁的"，
> `OnDestroy` 可能延迟到帧末（实际上是立即调用，但 `Destroy` 标记的 native 对象在当前帧结束才真正释放）。

### 7.2 GameObject 与 Component

```csharp
using UnityEngine;

public class GameObjectDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- 创建与销毁 ----------
        GameObject go = new GameObject("Enemy");
        GameObject child = new GameObject("Head");
        child.transform.SetParent(go.transform, false);   // worldPositionStays: false

        Object.Destroy(go);                    // 帧末销毁（推荐）
        Object.Destroy(go, 2f);                // 延迟 2 秒销毁
        Object.DestroyImmediate(child);        // 立即销毁（仅编辑器/加载场景时用，运行时慎用）

        // ---------- 查找 ----------
        GameObject byName = GameObject.Find("Enemy");                 // 全局按名找，慢
        GameObject byTag = GameObject.FindGameObjectWithTag("Player");// 全局按标签找，快一些
        GameObject[] all = GameObject.FindGameObjectsWithTag("Enemy");
        Transform t = transform.Find("Head");                         // 只找直接子物体

        // ---------- 状态与激活 ----------
        go.SetActive(false);                   // 关闭整个物体（含所有组件）
        bool active = go.activeSelf;           // 自身是否激活
        bool inHierarchy = go.activeInHierarchy;// 在层级中是否实际激活（父链都激活）

        // ---------- 组件操作 ----------
        var rb = go.AddComponent<Rigidbody>();
        var box = go.GetComponent<BoxCollider>();
        var allColliders = go.GetComponents<Collider>();
        var childColliders = go.GetComponentsInChildren<Collider>();          // 含自身
        var childOnly = go.GetComponentsInChildren<Collider>(includeInactive: true);
        var parentColliders = go.GetComponentsInParent<Collider>();

        // 安全获取（Unity 2019.2+，不产生 GC）
        if (go.TryGetComponent(out Rigidbody rb2)) { }

        // 移除组件
        Object.Destroy(box);

        // ---------- 标签与层 ----------
        go.tag = "Enemy";                      // 标签必须先在 Tag Manager 里定义
        go.layer = LayerMask.NameToLayer("Enemy");
        bool isEnemy = go.CompareTag("Enemy"); // 比 go.tag == "Enemy" 更安全（不分配字符串）

        // ---------- 场景间保持 ----------
        Object.DontDestroyOnLoad(go);

        // ---------- 启用/禁用组件 ----------
        var light = go.GetComponent<Light>();
        if (light != null) light.enabled = false;
    }
}
```

**性能对照：查找 API 的开销**

| API | 速度 | 说明 |
| --- | --- | --- |
| 直接引用（`[SerializeField]`） | 最快 | **首选** |
| `GetComponent<T>()` | 快 | 组件缓存为引用后可避免 |
| `TryGetComponent<T>()` | 快 | 同上，不分配 |
| `transform.Find("名字")` | 中等 | 只搜直接子级，字符串比较 |
| `GameObject.FindGameObjectWithTag` | 较慢 | 遍历场景内所有对象 |
| `GameObject.Find("名字")` | 最慢 | 遍历整个场景 |
| `FindObjectOfType<T>()` | 最慢 | 遍历所有对象的所有组件 |
| `Resources.Load` | 慢 | 加载整个 Resources 目录索引 |

> **铁律**：不要在 `Update` 里调用任何 `Find` / `GetComponent`。
> 在 `Awake` 里缓存到字段。

**组件缓存的标准写法**

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class CachedRefs : MonoBehaviour
{
    [SerializeField] private Transform _target;      // 尽量在 Inspector 里连好

    private Rigidbody _rb;
    private Animator _anim;
    private Collider _col;

    private void Awake()
    {
        // 一次获取，全程复用
        _rb = GetComponent<Rigidbody>();
        _anim = GetComponent<Animator>();
        _col = GetComponent<Collider>();

        // 也可以用 TryGetComponent 避免空引用
        if (!TryGetComponent(out _rb))
        {
            Debug.LogError(name + " 缺少 Rigidbody", this);   // 第二个参数定位到具体对象
        }
    }
}
```

### 7.3 Transform 与层级

```csharp
using UnityEngine;

public class TransformDemo : MonoBehaviour
{
    private void Start()
    {
        Transform t = transform;

        // ---------- 位置 ----------
        Vector3 world = t.position;              // 世界坐标
        Vector3 local = t.localPosition;         // 相对父物体坐标
        Vector3 lossy = t.lossyScale;            // 实际世界缩放（受父链影响）
        Vector3 ls = t.localScale;               // 局部缩放

        // ---------- 旋转 ----------
        Quaternion q = t.rotation;               // 世界旋转
        Quaternion lq = t.localRotation;         // 局部旋转
        Vector3 euler = t.eulerAngles;           // 世界欧拉角
        Vector3 leuler = t.localEulerAngles;     // 局部欧拉角

        // ---------- 方向 ----------
        Vector3 fwd = t.forward;                 // 世界空间的前（Z 轴）
        Vector3 right = t.right;                 // 世界空间的右（X 轴）
        Vector3 up = t.up;                       // 世界空间的上（Y 轴）

        // ---------- 移动与旋转 ----------
        t.position = new Vector3(1f, 2f, 3f);    // 直接设置（会强制位置，穿透物体会穿模）
        t.Translate(0f, 0f, 1f, Space.Self);     // 沿自身 Z 前进 1 米
        t.Translate(Vector3.forward * Time.deltaTime, Space.World);

        t.Rotate(0f, 90f, 0f, Space.Self);       // 旋转 90 度
        t.Rotate(Vector3.up, 45f, Space.World);
        t.LookAt(Vector3.zero);                  // 让 Z 轴指向目标点
        t.RotateAround(Vector3.zero, Vector3.up, 30f * Time.deltaTime);   // 绕某点旋转

        // 一次设置位置和旋转（比逐个设更快，只有一次同步）
        t.SetPositionAndRotation(new Vector3(0f, 0f, 0f), Quaternion.identity);
        t.SetLocalPositionAndRotation(Vector3.zero, Quaternion.identity);  // 2022.1+

        // ---------- 层级 ----------
        t.SetParent(newParent, worldPositionStays: true);   // 保持世界坐标不变
        t.SetParent(newParent, worldPositionStays: false);  // 直接变成局部坐标（UI 常用）
        Transform parent = t.parent;
        Transform root = t.root;
        int childCount = t.childCount;
        Transform c0 = t.GetChild(0);
        int siblingIndex = t.GetSiblingIndex();
        t.SetAsFirstSibling();
        t.SetAsLastSibling();
        t.SetSiblingIndex(2);

        // ---------- 坐标转换（非常常用）----------
        Vector3 worldPoint = t.TransformPoint(new Vector3(0f, 0f, 1f));   // 局部 → 世界
        Vector3 localPoint = t.InverseTransformPoint(worldPoint);         // 世界 → 局部
        Vector3 worldDir = t.TransformDirection(Vector3.forward);         // 局部方向 → 世界
        Vector3 localDir = t.InverseTransformDirection(worldDir);

        // ---------- 批量操作子物体（推荐用 Transform 而不是 GameObject）----------
        for (int i = 0; i < t.childCount; i++)
        {
            Transform child = t.GetChild(i);
            // 注意：不要在循环里 Destroy 子物体，会导致 childCount 变化
        }
    }
}
```

> **重要 API 说明**：
> - `Transform.TransformPoint` 用于把本地坐标转成世界坐标，UI 里把世界位置转屏幕/画布坐标时非常常用。
> - `RectTransformUtility.WorldToScreenPoint` 用于 UI 坐标转换。
> - `Camera.main` 内部是 `FindGameObjectWithTag("MainCamera")` 的封装，**每帧调用会有开销**，应缓存。

**世界坐标 → 屏幕坐标 → UI 坐标**

```csharp
using UnityEngine;

public class WorldToUI : MonoBehaviour
{
    [SerializeField] private Camera _uiCamera;      // Canvas 为 Screen Space - Camera 时使用
    [SerializeField] private RectTransform _canvasRect;
    [SerializeField] private RectTransform _marker; // 跟随世界物体的 UI 标记
    [SerializeField] private Transform _worldTarget;

    private void LateUpdate()
    {
        // 世界坐标 → 屏幕坐标
        Vector3 screenPos = Camera.main.WorldToScreenPoint(_worldTarget.position);

        // 在相机背后就隐藏
        if (screenPos.z < 0f)
        {
            _marker.gameObject.SetActive(false);
            return;
        }
        _marker.gameObject.SetActive(true);

        // 屏幕坐标 → UI 局部坐标
        if (RectTransformUtility.ScreenPointToLocalPointInRectangle(
                _canvasRect, screenPos, _uiCamera, out Vector2 localPoint))
        {
            _marker.anchoredPosition = localPoint;
        }
    }
}
```

### 7.4 Instantiate / Destroy 与对象池

```csharp
using UnityEngine;

public class SpawnDemo : MonoBehaviour
{
    [SerializeField] private GameObject _enemyPrefab;
    [SerializeField] private Transform _spawnPoint;

    private void Start()
    {
        // ---------- 三种 Instantiate 重载 ----------
        // 1) 只给预制体
        GameObject a = Instantiate(_enemyPrefab);

        // 2) 指定父物体（第 3 个参数 true = 保持世界坐标）
        GameObject b = Instantiate(_enemyPrefab, _spawnPoint.position, _spawnPoint.rotation, transform);

        // 3) 带父物体但保持局部坐标（UI 常用）
        GameObject c = Instantiate(_enemyPrefab, transform, worldPositionStays: false);

        // 泛型版本：直接返回组件类型
        Enemy e = Instantiate(_enemyPrefab).GetComponent<Enemy>();

        // ---------- 销毁 ----------
        Destroy(a);
        Destroy(a, 1.5f);          // 1.5 秒后销毁
        DestroyImmediate(a);       // 立即销毁（仅推荐编辑器脚本 / 加载阶段）
    }
}

public class Enemy : MonoBehaviour { }
```

**为什么需要对象池**

`Instantiate` / `Destroy` 的代价：
1. 分配堆内存（GameObject + 组件 + 托管包装对象）；
2. 触发 GC（销毁产生垃圾）；
3. 实例化时要执行 `Awake` / `OnEnable` / `Start`，重置状态；
4. 频繁创建销毁造成内存碎片。

**一个完整可用的对象池实现**

```csharp
using System.Collections.Generic;
using UnityEngine;

public class ObjectPool<T> where T : Component
{
    private readonly T _prefab;
    private readonly Transform _parent;
    private readonly Stack<T> _stack = new Stack<T>();
    private readonly int _maxSize;
    private readonly List<T> _all = new List<T>();     // 用于统一回收

    public ObjectPool(T prefab, Transform parent = null, int prewarm = 0, int maxSize = 1024)
    {
        _prefab = prefab;
        _parent = parent;
        _maxSize = maxSize;

        for (int i = 0; i < prewarm; i++)
        {
            T item = Object.Instantiate(_prefab, _parent);
            item.gameObject.SetActive(false);
            _stack.Push(item);
            _all.Add(item);
        }
    }

    public T Get(Vector3 position, Quaternion rotation)
    {
        T item;
        if (_stack.Count > 0)
        {
            item = _stack.Pop();
            item.transform.SetPositionAndRotation(position, rotation);
        }
        else
        {
            item = Object.Instantiate(_prefab, position, rotation, _parent);
            _all.Add(item);
        }

        item.gameObject.SetActive(true);

        // 通知对象"被取出"（需要对象实现接口）
        if (item is IPoolable poolable) poolable.OnSpawn();
        return item;
    }

    public void Release(T item)
    {
        if (item == null) return;

        if (item is IPoolable poolable) poolable.OnDespawn();

        item.gameObject.SetActive(false);
        item.transform.SetParent(_parent, false);

        if (_stack.Count < _maxSize) _stack.Push(item);
        else Object.Destroy(item.gameObject);
    }

    public void ReleaseAll()
    {
        for (int i = 0; i < _all.Count; i++)
        {
            if (_all[i] != null && _all[i].gameObject.activeSelf) Release(_all[i]);
        }
    }
}

public interface IPoolable
{
    void OnSpawn();
    void OnDespawn();
}

// ---------- 使用 ----------
public class Bullet : MonoBehaviour, IPoolable
{
    private float _life;
    private ObjectPool<Bullet> _pool;

    public void SetPool(ObjectPool<Bullet> pool) => _pool = pool;

    public void OnSpawn()
    {
        _life = 3f;
    }

    public void OnDespawn()
    {
        // 清理状态：速度、拖尾、音效等
    }

    private void Update()
    {
        transform.Translate(Vector3.forward * (20f * Time.deltaTime));
        _life -= Time.deltaTime;
        if (_life <= 0f) _pool.Release(this);
    }
}
```

> **Unity 2021+ 内置方案**：`UnityEngine.Pool.ObjectPool<T>`（命名空间 `UnityEngine.Pool`）已经内置了对象池，
> 用法与上面的实现类似：`new ObjectPool<Bullet>(createFunc, actionOnGet, actionOnRelease, actionOnDestroy, collectionCheck, defaultCapacity, maxSize)`。
> 新项目可以直接用它。

### 7.5 协程（Coroutine）深入

协程是"分帧执行的方法"，由 Unity 的更新循环驱动。

```csharp
using System.Collections;
using UnityEngine;

public class CoroutineDemo : MonoBehaviour
{
    private void Start()
    {
        // 启动协程
        Coroutine handle = StartCoroutine(MyRoutine());

        // 停止单个协程
        StopCoroutine(handle);

        // 停止本脚本上所有协程
        StopAllCoroutines();

        // 注意：物体被 SetActive(false) 时，其上的协程会被停止！
        // 重新激活后需要重新启动
    }

    private IEnumerator MyRoutine()
    {
        Debug.Log("第一帧：" + Time.frameCount);

        yield return null;                                  // 下一帧（Update 之后恢复）
        Debug.Log("第二帧：" + Time.frameCount);

        yield return new WaitForSeconds(1f);                // 1 秒（受 Time.timeScale 影响）
        yield return new WaitForSecondsRealtime(1f);        // 真实 1 秒（不受 timeScale 影响）
        yield return new WaitForFixedUpdate();              // 等到下一个 FixedUpdate 之后
        yield return new WaitForEndOfFrame();               // 等到本帧渲染结束（截图/读像素用）

        // 等待条件成立
        yield return new WaitUntil(() => Input.GetKeyDown(KeyCode.Space));
        yield return new WaitWhile(() => transform.position.y > 0f);

        // 等待另一个协程结束
        yield return StartCoroutine(OtherRoutine());

        // 等待异步操作（UnityWebRequest / Addressables 等实现了 IEnumerator 或 CustomYieldInstruction）
        // yield return UnityWebRequest.Get(url).SendWebRequest();

        Debug.Log("结束");
    }

    private IEnumerator OtherRoutine()
    {
        yield return new WaitForSeconds(0.5f);
    }
}
```

**yield 指令对照表**

| yield 指令 | 恢复时机 | 是否受 timeScale 影响 |
| --- | --- | --- |
| `yield return null` | 下一帧的 Update 之后 | 否 |
| `yield return new WaitForSeconds(t)` | t 秒（缩放后） | ✅ 是 |
| `yield return new WaitForSecondsRealtime(t)` | t 秒（真实时间） | 否 |
| `yield return new WaitForFixedUpdate()` | 下一个 FixedUpdate 之后 | ✅ 是 |
| `yield return new WaitForEndOfFrame()` | 本帧渲染结束后 | 否 |
| `yield return new WaitUntil(predicate)` | 条件为 true 后 | 否 |
| `yield return new WaitWhile(predicate)` | 条件为 false 后 | 否 |
| `yield return someCoroutine` | 该协程结束后 | — |
| `yield break;` | 立即结束协程 | — |

> **WaitForEndOfFrame 的关键限制**：
> 1. 在**编辑器**里如果 Game 视图不可见（窗口被最小化/切到别的标签页），`WaitForEndOfFrame` 不会触发，协程会挂起。
>    这是"截图协程卡住"的常见原因。
> 2. 只能在协程中使用，且必须在渲染完成后读取屏幕像素（`ScreenCapture.CaptureScreenshotAsTexture` 也依赖此）。

**协程的实现原理与常见陷阱**

```csharp
using System.Collections;
using UnityEngine;

public class CoroutinePitfalls : MonoBehaviour
{
    // ---------- 陷阱 1：闭包捕获 ----------
    private IEnumerator SpawnWithDelay(GameObject prefab, int count)
    {
        for (int i = 0; i < count; i++)
        {
            // ✅ 每次都新建对象，安全
            Instantiate(prefab, transform.position + Vector3.right * i, Quaternion.identity);
            yield return new WaitForSeconds(0.2f);
        }
    }

    // ⚠️ 如果缓存了 WaitForSeconds 对象可以复用（减少 GC）
    private readonly WaitForSeconds _wait02 = new WaitForSeconds(0.2f);

    private IEnumerator SpawnCached(GameObject prefab, int count)
    {
        for (int i = 0; i < count; i++)
        {
            Instantiate(prefab, transform.position + Vector3.right * i, Quaternion.identity);
            yield return _wait02;          // 复用同一个 WaitForSeconds，减少分配
        }
    }

    // ---------- 陷阱 2：物体被禁用后协程停止 ----------
    public void DisableObject()
    {
        gameObject.SetActive(false);       // 所有协程立刻停止，且不会恢复
    }

    // ---------- 陷阱 3：Destroy 后协程仍在跑 ----------
    // 协程的宿主是 MonoBehaviour，宿主销毁 → 协程停止。
    // 但如果协程里持有别的对象（如 this.transform.childCount），
    // 在宿主销毁后仍被别的机制回调，就会 MissingReferenceException。

    // ---------- 陷阱 4：无法 try-catch yield ----------
    // ❌ 不允许在 try-catch 中 yield return（C# 语言限制）
    // ✅ 可以把风险代码包在单独的方法里
    private IEnumerator SafeRoutine()
    {
        yield return null;
        TryDoRiskyWork();
    }

    private void TryDoRiskyWork()
    {
        try { /* 风险代码 */ }
        catch (System.Exception e) { Debug.LogException(e); }
    }

    // ---------- 陷阱 5：无法获取协程的返回值 ----------
    // 需要返回值时用回调或 Action
    private IEnumerator LoadWithCallback(System.Action<int> onDone)
    {
        yield return new WaitForSeconds(1f);
        onDone(42);
    }

    private void UseCallback()
    {
        StartCoroutine(LoadWithCallback(result => Debug.Log("loaded " + result)));
    }
}
```

**WaitForSeconds 的缓存优化**

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class WaitCache
{
    private static readonly Dictionary<float, WaitForSeconds> _cache = new Dictionary<float, WaitForSeconds>();

    public static WaitForSeconds Get(float seconds)
    {
        // 量化到 0.05 秒，避免浮点键过多
        float key = Mathf.Round(seconds * 20f) / 20f;
        if (!_cache.TryGetValue(key, out WaitForSeconds w))
        {
            w = new WaitForSeconds(key);
            _cache[key] = w;
        }
        return w;
    }
}

public class CachedWaitDemo : MonoBehaviour
{
    private IEnumerator Fire()
    {
        while (true)
        {
            // 复用同一个 WaitForSeconds，减少每次 new 的 GC
            yield return WaitCache.Get(0.1f);
        }
    }
}
```

> **注意**：`WaitForSeconds` 每次 `new` 都会分配一个小对象。高频循环协程（每 0.1 秒）在长时间运行时
> 会产生可观的 GC。缓存是标准优化手法。

**传统协程 vs async/await vs UniTask**

| 维度 | Coroutine | async/await + Task | UniTask |
| --- | --- | --- | --- |
| 是否分配 GC | 每次 StartCoroutine 有少量分配 | Task 每次分配较多 | 无分配（struct） |
| 返回值 | ❌ 不能返回 | ✅ 可以 | ✅ 可以 |
| 异常传播 | ❌ 只能靠 Debug.Log | ✅ 传播到 await 处 | ✅ 传播 |
| 取消 | StopCoroutine | CancellationToken | CancellationToken |
| 线程 | 主线程 | 可能是线程池 | 主线程（PlayerLoop 集成） |
| 依赖 | 内置 | 内置（.NET 4.x / Standard 2.1） | 需要安装 UniTask 包 |
| 适用 | 简单延时、序列动画 | IO 密集、网络 | 现代 Unity 项目首选 |

### 7.6 async / await 与 Task

```csharp
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

public class AsyncDemo : MonoBehaviour
{
    private CancellationTokenSource _cts;

    private void Start()
    {
        _cts = new CancellationTokenSource();
        _ = LoadAsync(_cts.Token);
    }

    private void OnDestroy()
    {
        _cts?.Cancel();      // 对象销毁时取消任务，避免回调到已销毁对象
        _cts?.Dispose();
    }

    private async Task LoadAsync(CancellationToken token)
    {
        // ⚠️ await 之后可能回到线程池线程（普通 Task），不能直接调用 Unity API！
        string json = await Task.Run(() => System.IO.File.ReadAllText("data.json"), token);

        if (token.IsCancellationRequested) return;
        if (this == null) return;      // 对象可能已被销毁

        // ✅ 回到主线程后再调用 Unity API
        await SwitchToMainThread();
        Debug.Log(json.Length);
    }

    // Unity 没有内置 SynchronizationContext 回到主线程的便捷方式，
    // 常见做法：用 UniTask 的 SwitchToMainThread()，或者用下面的自建方式
    private Task SwitchToMainThread()
    {
        var tcs = new TaskCompletionSource<bool>();
        // 用一个 MonoBehaviour 的 Update 轮询是不可行的（只能在主线程），
        // 正规做法是用 SynchronizationContext 捕获：
        System.Threading.SynchronizationContext ctx = System.Threading.SynchronizationContext.Current;
        if (ctx != null) ctx.Post(_ => tcs.SetResult(true), null);
        else tcs.SetResult(true);
        return tcs.Task;
    }
}
```

> **Unity 的 async/await 重点规则**：
> 1. Unity 的主线程有 `UnitySynchronizationContext`，`async void Start()` 里的 `await` 在**没有**
>    配置 `ConfigureAwait(false)` 时会回到主线程；一旦用了 `ConfigureAwait(false)` 或 `Task.Run`，就会在线程池线程。
> 2. **在线程池线程上调用任何 Unity API 都会抛异常**（"can only be called from the main thread"）。
> 3. `async void` 的异常无法被捕获（会直接崩）。除非是事件处理器，否则一律用 `async Task`。
> 4. 对象被销毁后，await 回来继续执行会抛 `MissingReferenceException`，必须用 `CancellationToken` 或
>    `if (this == null) return;` 做防御。
> 5. 推荐用 **UniTask**（Cysharp 出品）替代原生 Task，它零分配且与 Unity 的 PlayerLoop 集成，
>    还有 `UniTask.Yield()`、`AsyncLinq`、`CancellationToken` 的原生支持。

---


## 第 8 章 Unity 引擎子系统

### 8.1 脚本执行顺序

**默认顺序（同一帧内）**

```text
1. 所有脚本的 Awake()
2. 所有脚本的 OnEnable()
3. 所有脚本的 Start()（在第一次 Update 前）
4. 物理模拟（FixedUpdate → 物理碰撞回调）
5. 输入事件（OnMouseXXX、Input System 回调）
6. 协程中 yield null / WaitForSeconds 的恢复
7. 所有脚本的 Update()
8. 动画（Animator 的 Update）
9. 所有脚本的 LateUpdate()
10. 渲染（OnWillRenderObject、OnPreCull、OnPreRender、OnRenderObject、OnPostRender、OnGUI、OnDrawGizmos）
11. 帧末：WaitForEndOfFrame 恢复、Destroy 的延迟销毁生效
12. 进入下一帧
```

**同一物体上多个组件的执行顺序**

- **未定义**！不要依赖 `Awake`/`Update` 的先后。
- 想控制顺序，两种方式：
  1. `Edit → Project Settings → Script Execution Order` 里给脚本设置优先级（数值越小越早，默认 0）；
  2. 在脚本类上加 `[DefaultExecutionOrder(-100)]` 特性（Unity 5.6+）。

```csharp
using UnityEngine;

[DefaultExecutionOrder(-200)]   // 负数 = 更早执行
public class EarlyScript : MonoBehaviour
{
    private void Awake() { Debug.Log("我先"); }
}

[DefaultExecutionOrder(200)]    // 正数 = 更晚执行
public class LateScript : MonoBehaviour
{
    private void Start() { Debug.Log("我后"); }
}
```

> **实战建议**：游戏初始化用"显式调用"而不是依赖执行顺序。
> 例如写一个 `GameBootstrap` 脚本，在 `Awake` 里按顺序手动初始化各个系统，比依赖 Unity 的顺序更可靠。

### 8.2 输入系统

#### 旧输入系统（Input Manager）

```csharp
using UnityEngine;

public class LegacyInputDemo : MonoBehaviour
{
    [SerializeField] private float _speed = 5f;

    private void Update()
    {
        // ---------- 按键 ----------
        if (Input.GetKeyDown(KeyCode.Space)) { }       // 这一帧按下
        if (Input.GetKey(KeyCode.W)) { }               // 持续按下
        if (Input.GetKeyUp(KeyCode.Space)) { }         // 这一帧抬起

        // ---------- 轴（连续值，用于移动）----------
        float h = Input.GetAxis("Horizontal");          // -1..1，带平滑
        float v = Input.GetAxis("Vertical");
        float rawH = Input.GetAxisRaw("Horizontal");    // 不带平滑，-1/0/1

        Vector3 dir = new Vector3(h, 0f, v);
        transform.Translate(dir * (_speed * Time.deltaTime), Space.World);

        // ---------- 鼠标 ----------
        Vector3 mp = Input.mousePosition;               // 屏幕坐标（左下角原点）
        if (Input.GetMouseButtonDown(0)) { }            // 左键按下
        if (Input.GetMouseButton(1)) { }                // 右键持续
        float scroll = Input.mouseScrollDelta.y;
        float mx = Input.GetAxis("Mouse X");
        float my = Input.GetAxis("Mouse Y");

        // ---------- 触摸（移动端）----------
        if (Input.touchCount > 0)
        {
            Touch t = Input.GetTouch(0);
            switch (t.phase)
            {
                case TouchPhase.Began: break;
                case TouchPhase.Moved: break;
                case TouchPhase.Ended: break;
            }
            Vector2 pos = t.position;
        }

        // ---------- 其他 ----------
        if (Input.anyKeyDown) { }
        if (Input.GetButtonDown("Fire1")) { }
        Input.ResetInputAxes();
    }
}
```

> **旧输入系统的注意点**：
> - 轴的名称（"Horizontal"、"Vertical"、"Fire1" 等）在 `Project Settings → Input Manager` 里配置。
> - `Input.GetAxis` 有平滑处理，`GetAxisRaw` 没有；**移动端摇杆建议用 Raw**。
> - 旧系统在**新版 Input System** 启用时会报 `InvalidOperationException`，两者不能同时用
>   （除非在 `Player Settings → Active Input Handling` 里选 "Both"）。

#### 新输入系统（Input System 包，1.0+）

```csharp
// 需要 Package Manager 安装 "Input System"，并把 Active Input Handling 切到 Input System 或 Both
using UnityEngine;
using UnityEngine.InputSystem;

public class NewInputDemo : MonoBehaviour
{
    [SerializeField] private float _speed = 5f;

    private void Update()
    {
        // ---------- 设备直读（最简单，无需配置）----------
        Keyboard kb = Keyboard.current;
        Mouse mouse = Mouse.current;
        Gamepad pad = Gamepad.current;

        if (kb != null)
        {
            if (kb.wKey.isPressed) { }
            if (kb.spaceKey.wasPressedThisFrame) { }
            if (kb.spaceKey.wasReleasedThisFrame) { }
        }

        if (mouse != null)
        {
            Vector2 screenPos = mouse.position.ReadValue();
            Vector2 delta = mouse.delta.ReadValue();
            float scroll = mouse.scroll.ReadValue().y;
            if (mouse.leftButton.wasPressedThisFrame) { }
        }

        if (pad != null)
        {
            Vector2 stick = pad.leftStick.ReadValue();     // -1..1
            if (pad.buttonSouth.wasPressedThisFrame) { }
            pad.SetMotorSpeeds(0.5f, 0.5f);                // 震动（用完后调 pad.PauseHaptics() / ResetHaptics()）
        }

        // 移动
        Vector2 move = ReadMove();
        transform.Translate(new Vector3(move.x, 0f, move.y) * (_speed * Time.deltaTime), Space.World);
    }

    private Vector2 ReadMove()
    {
        Vector2 result = Vector2.zero;
        if (Keyboard.current != null)
        {
            var kb = Keyboard.current;
            if (kb.aKey.isPressed) result.x -= 1f;
            if (kb.dKey.isPressed) result.x += 1f;
            if (kb.sKey.isPressed) result.y -= 1f;
            if (kb.wKey.isPressed) result.y += 1f;
        }
        if (Gamepad.current != null)
        {
            result += Gamepad.current.leftStick.ReadValue();
        }
        return Vector2.ClampMagnitude(result, 1f);
    }
}
```

**InputAction 用法（推荐方式，支持按键重映射）**

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class InputActionDemo : MonoBehaviour
{
    // 在 Inspector 里配置，或代码创建
    [SerializeField] private InputActionAsset _actions;

    private InputAction _moveAction;
    private InputAction _jumpAction;

    private void Awake()
    {
        // 从 Asset 里按名字找
        _moveAction = _actions.FindAction("Player/Move");
        _jumpAction = _actions.FindAction("Player/Jump");
    }

    private void OnEnable()
    {
        _moveAction.Enable();
        _jumpAction.Enable();

        // 事件订阅方式（推荐，不用每帧轮询）
        _jumpAction.performed += OnJump;
        _jumpAction.canceled += OnJumpCanceled;
    }

    private void OnDisable()
    {
        _jumpAction.performed -= OnJump;
        _jumpAction.canceled -= OnJumpCanceled;

        _moveAction.Disable();
        _jumpAction.Disable();
    }

    private void Update()
    {
        // 轮询方式
        Vector2 move = _moveAction.ReadValue<Vector2>();
        transform.Translate(new Vector3(move.x, 0f, move.y) * (5f * Time.deltaTime), Space.World);
    }

    private void OnJump(InputAction.CallbackContext ctx)
    {
        Debug.Log("jump! phase=" + ctx.phase);     // Started / Performed / Canceled
    }

    private void OnJumpCanceled(InputAction.CallbackContext ctx) { }
}
```

> **Input System 要点**：
> - `InputAction.CallbackContext` 的 `phase` 有三种：`Started`（按下）、`Performed`（触发阈值达成）、`Canceled`（松开）。
> - 输入回调在 `Update` **之前**触发。
> - 安装 Input System 后，`PlayerInput` 组件可以自动生成 C# 类（`Generate C# Class`），
>   比手写字符串更安全。

### 8.3 物理系统

#### Rigidbody 核心

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class PhysicsDemo : MonoBehaviour
{
    private Rigidbody _rb;

    [SerializeField] private float _moveForce = 10f;
    [SerializeField] private float _jumpForce = 5f;

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();

        // ---------- 常用属性 ----------
        _rb.mass = 1f;                                  // 质量（kg）
        _rb.drag = 0.5f;                                // 线性阻力（Unity 6 中改名为 linearDamping）
        _rb.angularDrag = 0.05f;                        // 角阻力（Unity 6 中为 angularDamping）
        _rb.useGravity = true;
        _rb.isKinematic = false;                        // 运动学：不受物理影响，但仍能触发碰撞
        _rb.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;
        _rb.interpolation = RigidbodyInterpolation.Interpolate;   // 渲染平滑（消除抖动）
        _rb.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;  // 高速物体防穿模
    }

    private void FixedUpdate()
    {
        // ---------- 施力（必须放 FixedUpdate）----------
        // ForceMode 四种：
        //   Force        —— 持续力（受质量影响，默认），质心
        //   Acceleration —— 加速度（忽略质量）
        //   Impulse      —— 瞬间冲量（受质量影响），常用于跳跃/击退
        //   VelocityChange —— 瞬间速度变化（忽略质量）
        _rb.AddForce(Vector3.forward * _moveForce);                                  // 默认 Force
        _rb.AddForce(Vector3.up * _jumpForce, ForceMode.Impulse);
        _rb.AddTorque(Vector3.up * 5f, ForceMode.Force);
        _rb.AddExplosionForce(100f, transform.position, 5f, 0.5f, ForceMode.Impulse); // 爆炸

        // ---------- 直接改速度（同样只在 FixedUpdate）----------
        Vector3 v = _rb.velocity;                 // Unity 2023.3+ 推荐用 linearVelocity
        v.x = 5f;
        _rb.velocity = v;

        // ---------- 位置/旋转（kinematic 或需要硬同步时）----------
        _rb.MovePosition(transform.position + Vector3.forward * (2f * Time.fixedDeltaTime));
        _rb.MoveRotation(Quaternion.Euler(0f, 45f, 0f));

        // ---------- 查询 ----------
        Vector3 vel = _rb.velocity;
        float speed = vel.magnitude;
        bool sleeping = _rb.IsSleeping();
        _rb.WakeUp();
    }
}
```

> **API 变更提醒**：Unity **2023.3（即 Unity 6 的开发代号分支）** 起：
> - `Rigidbody.velocity` → `Rigidbody.linearVelocity`
> - `Rigidbody.drag` → `Rigidbody.linearDamping`
> - `Rigidbody.angularDrag` → `Rigidbody.angularDamping`
> 旧名仍可用但会给出过时警告。写跨版本代码时可用 `#if UNITY_6000_0_OR_NEWER` 宏。

**Velocity vs AddForce vs MovePosition 的选择**

| 需求 | 用法 |
| --- | --- |
| 角色移动（有物理反馈） | `AddForce` 或直接改 `velocity` |
| 精确、可控的角色移动（推荐手感） | 自定义 CharacterController，或 kinematic + `MovePosition` |
| 传送（需要触发碰撞事件） | `rb.position = xxx;` + 手动 `Physics.SyncTransforms()` |
| 跳跃 | `AddForce(Vector3.up * jumpForce, ForceMode.Impulse)` |
| 击退 | `AddForce(dir * knockback, ForceMode.VelocityChange)` |
| 平台/电梯 | kinematic Rigidbody + `MovePosition` |

#### 碰撞体与触发器

```csharp
using UnityEngine;

public class CollisionDemo : MonoBehaviour
{
    // ---------- 碰撞（需要 Collider + 至少一边有非运动学 Rigidbody）----------
    private void OnCollisionEnter(Collision collision)
    {
        // 相对速度（用于计算伤害）
        float impact = collision.relativeVelocity.magnitude;

        // 接触点法线（用于弹孔、贴花方向）
        ContactPoint contact = collision.GetContact(0);
        Vector3 point = contact.point;
        Vector3 normal = contact.normal;

        // 对方信息
        GameObject other = collision.gameObject;
        Rigidbody otherRb = collision.rigidbody;         // 可能为 null
        Collider otherCol = collision.collider;
        int contactCount = collision.contactCount;
    }

    private void OnCollisionStay(Collision collision) { }
    private void OnCollisionExit(Collision collision) { }

    // ---------- 触发器（Collider 勾选 Is Trigger）----------
    // 注意：一方是 Trigger，或者任意一方是 Kinematic Rigidbody → 只会触发 Trigger 回调
    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Pickup"))
        {
            // other.attachedRigidbody 可能是 null
        }
    }

    private void OnTriggerStay(Collider other) { }
    private void OnTriggerExit(Collider other) { }

    // ---------- 2D 版本（Physics2D）----------
    private void OnCollisionEnter2D(Collision2D collision) { }
    private void OnTriggerEnter2D(Collider2D other) { }
}
```

**碰撞检测矩阵（决定谁会触发什么）—— 必须记住**

| | 静态 Collider | Rigidbody Collider | Kinematic Rigidbody Collider | Trigger Collider |
| --- | --- | --- | --- | --- |
| **静态 Collider** | ❌ | ✅ 碰撞 | ❌ | ❌ |
| **Rigidbody Collider** | ✅ 碰撞 | ✅ 碰撞 | ✅ 碰撞 | ✅ 触发 |
| **Kinematic Rigidbody Collider** | ❌ | ✅ 碰撞 | ❌ | ✅ 触发 |
| **Trigger Collider** | ❌ | ✅ 触发 | ✅ 触发 | ❌ |

> 记忆口诀：**静态物体之间永远不碰撞**；**Trigger 只与其他 Trigger 不触发**；
> **Kinematic 之间不碰撞**（除非 `Physics.queriesHitBackfaces` 之类设置，默认不碰撞）。

#### 射线检测与查询

```csharp
using UnityEngine;

public class RaycastDemo : MonoBehaviour
{
    [SerializeField] private LayerMask _groundMask;
    private readonly RaycastHit[] _hitBuffer = new RaycastHit[16];      // 预分配

    private void Update()
    {
        // ---------- 基础射线 ----------
        if (Physics.Raycast(transform.position, Vector3.down, out RaycastHit hit, 5f, _groundMask))
        {
            Debug.Log("命中 " + hit.collider.name + " 在 " + hit.point);
            Debug.Log("距离 " + hit.distance + " 法线 " + hit.normal);
            Debug.Log("物体 " + hit.collider.gameObject + " 刚体 " + hit.rigidbody);
        }

        // 从摄像机发射（点击拾取）
        if (Camera.main != null && Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit h2, 100f))
            {
                Debug.Log("点到了 " + h2.collider.name);
            }
        }

        // ---------- 零 GC 版本（推荐热路径）----------
        int count = Physics.RaycastNonAlloc(transform.position, Vector3.down, _hitBuffer, 5f, _groundMask);
        for (int i = 0; i < count; i++)
        {
            Debug.Log(_hitBuffer[i].collider.name);
        }

        // ---------- 形状检测 ----------
        // 球形范围（AOE）
        Collider[] hits = Physics.OverlapSphere(transform.position, 5f, _groundMask);
        int n = Physics.OverlapSphereNonAlloc(transform.position, 5f, new Collider[32], _groundMask);

        // 球形投射（有半径的射线，用于弹道）
        if (Physics.SphereCast(transform.position, 0.5f, Vector3.forward, out RaycastHit sh, 20f))
        {
            Debug.Log("球形投射命中 " + sh.collider.name);
        }

        // 盒投射（角色移动检测）
        if (Physics.BoxCast(transform.position, Vector3.one * 0.5f, Vector3.forward,
                            out RaycastHit bh, Quaternion.identity, 2f))
        {
            Debug.Log("盒投射命中 " + bh.collider.name);
        }

        // 胶囊检测
        Collider[] capsuleHits = Physics.OverlapCapsule(transform.position,
            transform.position + Vector3.up * 2f, 0.5f);
    }

    // ---------- Physics.Raycast 的参数说明 ----------
    // Physics.Raycast(
    //     Vector3 origin,            // 起点
    //     Vector3 direction,         // 方向（会自动归一化）
    //     out RaycastHit hitInfo,    // 命中信息
    //     float maxDistance,         // 最大距离（默认 Infinity）
    //     int layerMask,             // 层掩码（默认 DefaultRaycastLayers = 除 Ignore Raycast 外的所有层）
    //     QueryTriggerInteraction    // 是否命中触发器：UseGlobal / Collide / Ignore
    // )
}
```

**层与碰撞矩阵**

```csharp
using UnityEngine;

public class LayerDemo : MonoBehaviour
{
    private void Start()
    {
        // 层的名字必须在 Project Settings → Tags and Layers 里定义
        int playerLayer = LayerMask.NameToLayer("Player");     // 返回层号，未定义返回 -1
        string name = LayerMask.LayerToName(playerLayer);

        // 掩码
        int mask = LayerMask.GetMask("Ground", "Wall");
        int singleBit = 1 << playerLayer;

        // 判断物体是否在掩码中
        bool inMask = (mask & (1 << gameObject.layer)) != 0;

        // ---------- 运行时屏蔽两层之间的碰撞 ----------
        Physics.IgnoreLayerCollision(LayerMask.NameToLayer("Player"), LayerMask.NameToLayer("Debris"), true);

        // ---------- 屏蔽特定两个碰撞体 ----------
        Physics.IgnoreCollision(colliderA, colliderB, true);

        // ⚠️ IgnoreLayerCollision 不会立即生效于已存在的接触对，
        //    必要时用 Physics.SyncTransforms() 或重启物理查询
    }
}
```

> **Physics.OverlapSphere 与 LayerMask 的坑**：`LayerMask.GetMask` 返回的是包含所有指定层的掩码；
> 如果传空字符串会返回 0（什么都不命中）。Inspector 里的 LayerMask 字段显示为下拉框。

#### 物理材质与关节

```csharp
using UnityEngine;

public class PhysicsMaterialDemo : MonoBehaviour
{
    private void Start()
    {
        // 运行时创建物理材质
        var mat = new PhysicMaterial("Bouncy")
        {
            dynamicFriction = 0.2f,
            staticFriction = 0.4f,
            bounciness = 0.9f,
            bounceCombine = PhysicMaterialCombine.Maximum,
            frictionCombine = PhysicMaterialCombine.Average
        };

        var col = GetComponent<Collider>();
        if (col != null) col.material = mat;

        // 注意：2D 用的是 PhysicsMaterial2D（无 staticFriction）
        // var mat2d = new PhysicsMaterial2D("Friction2D") { friction = 0.4f, bounciness = 0.1f };
    }
}
```

> **重要说明**：Unity 6（6000.x）中 `PhysicMaterial` 已被重命名为 **`PhysicsMaterial`**（`PhysicMaterial` 仍作为过时别名保留）。
> `Collider.sharedMaterial` 与 `Collider.material` 的区别：`material` 会**克隆**材质实例（每个对象一份），
> `sharedMaterial` 不会克隆（共享）。想改单个物体的材质用 `material`，想批量共用用 `sharedMaterial`。

### 8.4 时间系统

```csharp
using UnityEngine;

public class TimeDemo : MonoBehaviour
{
    private void Update()
    {
        // ---------- 常用 ----------
        float dt = Time.deltaTime;                 // 上一帧到本帧的秒数（受 timeScale 影响）
        float udt = Time.unscaledDeltaTime;        // 不受 timeScale 影响
        float fixedDt = Time.fixedDeltaTime;       // 固定步长（默认 0.02）
        float time = Time.time;                    // 从游戏开始到现在的秒数（受 timeScale 影响）
        float utime = Time.unscaledTime;           // 不受 timeScale
        float tsl = Time.timeSinceLevelLoad;       // 从场景加载到现在
        int frames = Time.frameCount;              // 总帧数
        float realtime = Time.realtimeSinceStartup;// 从应用启动到现在

        // ---------- 帧率 ----------
        float fps = 1f / Time.unscaledDeltaTime;   // 瞬时帧率
        // 或平滑帧率（推荐）
        _smoothFps = Mathf.Lerp(_smoothFps, 1f / Time.unscaledDeltaTime, 0.1f);

        // ---------- 时间缩放（暂停/慢动作）----------
        // Time.timeScale = 0f;      // 完全暂停（注意：FixedUpdate 不再执行）
        // Time.timeScale = 0.5f;    // 慢动作
        // Time.timeScale = 1f;      // 正常
    }

    private float _smoothFps;

    private void FixedUpdate()
    {
        // 固定时间步里用 fixedDeltaTime
        transform.Translate(Vector3.forward * (5f * Time.fixedDeltaTime));

        // 是否在固定时间步内（协程中判断）
        bool inFixed = Time.inFixedTimeStep;
    }

    private void Start()
    {
        // ---------- 配置 ----------
        // Time.fixedDeltaTime = 0.02f;                     // 物理步长（也可在 Project Settings → Time 里设）
        // Time.maximumDeltaTime = 0.333f;                  // 单帧最大时间（防止卡顿后物理爆炸）
        // Time.timeScale = 1f;
        // Time.captureFramerate = 30;                      // 录制视频用：强制每帧 1/30 秒
    }
}
```

> **timeScale = 0 的坑**：
> - `FixedUpdate` 不再执行，物理冻结；
> - `WaitForSeconds` 永远不返回（用 `WaitForSecondsRealtime`）；
> - `Time.deltaTime` 为 0，任何 `* Time.deltaTime` 的移动都停止；
> - 动画 Animator 默认停止（可用 `Animator.updateMode = AnimatorUpdateMode.UnscaledTime` 让它继续）。
> - UI 动画如果不想被暂停，也要用 unscaled 版本。

**帧率无关的两种写法**

```csharp
// ❌ 与帧率相关（60fps 和 30fps 表现完全不同）
void Update() { transform.Translate(Vector3.forward * 5f); }

// ✅ 乘 deltaTime（线性运动）
void Update() { transform.Translate(Vector3.forward * (5f * Time.deltaTime)); }

// ✅ 指数衰减（拖尾、平滑跟随）—— 必须用 Pow，不能直接乘 deltaTime
float SmoothFactor(float halfLife)
{
    return 1f - Mathf.Pow(0.5f, Time.deltaTime / halfLife);
}

// ✅ 用 Lerp 做平滑（注意 Lerp 的 t 直接乘 deltaTime 是"常见但不精确"的写法）
transform.position = Vector3.Lerp(transform.position, target.position, 1f - Mathf.Exp(-10f * Time.deltaTime));

// ✅ 物理相关一律放 FixedUpdate，用 fixedDeltaTime
void FixedUpdate() { _rb.MovePosition(_rb.position + Vector3.forward * (5f * Time.fixedDeltaTime)); }
```

### 8.5 数学库

#### Mathf

```csharp
using UnityEngine;

public class MathfDemo : MonoBehaviour
{
    private void Start()
    {
        float x = -3.7f;

        // ---------- 绝对值与符号 ----------
        Mathf.Abs(x);            // 3.7
        Mathf.Sign(x);           // -1
        Mathf.Abs(-3);           // 也有 int 重载

        // ---------- 取整 ----------
        Mathf.Floor(x);          // -4（向下）
        Mathf.Ceil(x);           // -3（向上）
        Mathf.Round(x);          // -4（四舍六入五成双：0.5 → 0，1.5 → 2，2.5 → 2）
        Mathf.RoundToInt(x);     // int
        Mathf.FloorToInt(x);
        Mathf.CeilToInt(x);
        Mathf.Truncate(3.7f);    // 3（向零截断）

        // ---------- 限制 ----------
        Mathf.Clamp(15f, 0f, 10f);       // 10
        Mathf.Clamp01(1.5f);             // 1
        Mathf.Min(1f, 2f);
        Mathf.Max(1f, 2f);

        // ---------- 插值 ----------
        Mathf.Lerp(0f, 10f, 0.5f);        // 5（自动 Clamp01 的 t）
        Mathf.LerpUnclamped(0f, 10f, 1.5f); // 15（不限制 t）
        Mathf.InverseLerp(0f, 10f, 5f);   // 0.5（反求 t）
        Mathf.MoveTowards(0f, 10f, 2f * Time.deltaTime);   // 匀速靠近，不会过冲
        Mathf.SmoothStep(0f, 1f, 0.5f);   // 平滑插值（两端速度慢）
        Mathf.SmoothDamp(current, target, ref velocity, smoothTime);
        Mathf.PingPong(Time.time * 2f, 5f);   // 0..5 来回
        Mathf.Repeat(Time.time, 1f);          // 0..1 循环（取模，负数也能正确处理）

        // ---------- 幂与根 ----------
        Mathf.Pow(2f, 10f);       // 1024
        Mathf.Sqrt(16f);          // 4
        Mathf.Exp(1f);            // e
        Mathf.Log(8f, 2f);        // 3（以 2 为底）
        Mathf.Log10(100f);        // 2

        // ---------- 三角函数（参数是弧度！）----------
        Mathf.Sin(Mathf.PI / 2f);        // 1
        Mathf.Cos(0f);                   // 1
        Mathf.Tan(Mathf.PI / 4f);        // 1
        Mathf.Asin(1f);                  // PI/2
        Mathf.Atan2(1f, 1f);             // PI/4（比 Atan 更精确，能区分象限）

        // ---------- 角度与弧度 ----------
        Mathf.Deg2Rad;                   // 0.01745...
        Mathf.Rad2Deg;                   // 57.29...
        float rad = 90f * Mathf.Deg2Rad;
        float deg = Mathf.PI * Mathf.Rad2Deg;

        // ---------- 近似比较 ----------
        Mathf.Approximately(0.1f + 0.2f, 0.3f);   // true（内部用 Epsilon 缩放比较）

        // ---------- 常量 ----------
        Mathf.PI;         // 3.14159...
        Mathf.Infinity;
        Mathf.NegativeInfinity;
        Mathf.Epsilon;    // 最小正数（float.Epsilon）
        Mathf.NaN;

        // ---------- 噪声（程序化生成）----------
        float n = Mathf.PerlinNoise(0.5f, 0.5f);  // 0..1 之间的平滑随机
    }
}
```

> `Mathf.Round` 使用 **银行家舍入（round half to even）**：`Mathf.Round(0.5f) == 0`，`Mathf.Round(1.5f) == 2`。
> 需要传统四舍五入用 `Mathf.Floor(x + 0.5f)`。

#### Vector 系列

```csharp
using UnityEngine;

public class VectorDemo : MonoBehaviour
{
    private void Start()
    {
        Vector3 a = new Vector3(1f, 2f, 3f);
        Vector3 b = new Vector3(4f, 5f, 6f);

        // ---------- 基本运算 ----------
        Vector3 sum = a + b;
        Vector3 diff = a - b;
        Vector3 scaled = a * 2f;
        Vector3 divided = a / 2f;
        Vector3 neg = -a;

        // ---------- 常用属性 ----------
        float len = a.magnitude;            // 长度（会开方）
        float sqrLen = a.sqrMagnitude;      // 平方长度（更快，比较大小用这个）
        Vector3 norm = a.normalized;        // 单位向量（不修改 a）
        a.Normalize();                      // 就地归一化

        // ---------- 静态属性 ----------
        Vector3.zero;      // (0,0,0)
        Vector3.one;       // (1,1,1)
        Vector3.up;        // (0,1,0)
        Vector3.down;      // (0,-1,0)
        Vector3.left;      // (-1,0,0)
        Vector3.right;     // (1,0,0)
        Vector3.forward;   // (0,0,1)
        Vector3.back;      // (0,0,-1)

        // ---------- 距离 ----------
        float d = Vector3.Distance(a, b);
        float d2 = (a - b).sqrMagnitude;    // 只比较远近时用这个

        // ---------- 点积与叉积 ----------
        float dot = Vector3.Dot(a.normalized, b.normalized);   // 1 = 同向，-1 = 反向，0 = 垂直
        Vector3 cross = Vector3.Cross(a, b);                   // 垂直两向量（左手坐标系）
        float angle = Vector3.Angle(a, b);                     // 无符号夹角（0~180）
        float signedAngle = Vector3.SignedAngle(a, b, Vector3.up); // 带符号夹角

        // ---------- 投影与反射 ----------
        Vector3 proj = Vector3.Project(b, a);              // b 在 a 上的投影
        Vector3 onPlane = Vector3.ProjectOnPlane(b, Vector3.up);  // b 在平面上的投影
        Vector3 reflect = Vector3.Reflect(a.normalized, Vector3.up); // 反射方向（弹射）

        // ---------- 插值 ----------
        Vector3 lerped = Vector3.Lerp(a, b, 0.5f);         // 线性插值（t 自动 Clamp01）
        Vector3 slerped = Vector3.Slerp(a, b, 0.5f);       // 球面插值（保持长度，方向旋转）
        Vector3 moved = Vector3.MoveTowards(a, b, 1f * Time.deltaTime);
        Vector3 rotated = Vector3.RotateTowards(a, b, 1f * Time.deltaTime, 2f);
        Vector3 smoothed = Vector3.SmoothDamp(a, b, ref _velocity, 0.3f);

        // ---------- 其他 ----------
        Vector3 clamped = Vector3.ClampMagnitude(a, 2f);   // 限制最大长度
        Vector3 scaledV = Vector3.Scale(a, b);             // 分量相乘
        Vector3 minV = Vector3.Min(a, b);
        Vector3 maxV = Vector3.Max(a, b);

        // ---------- 2D / Int 变体 ----------
        Vector2 v2 = new Vector2(1f, 2f);
        Vector3Int vi = new Vector3Int(1, 2, 3);
        Vector2Int v2i = new Vector2Int(1, 2);
        Debug.Log(v2 + "" + vi + v2i + sum + diff + scaled + divided + neg);
        Debug.Log(len + sqrLen + norm + d + d2 + dot + cross + angle + signedAngle);
        Debug.Log(proj + onPlane + reflect + lerped + slerped + moved + rotated + smoothed + clamped + scaledV + minV + maxV);
    }

    private Vector3 _velocity;
}
```

> **重要提醒**：`Vector3.Lerp(a, b, t)` 的 `t` 会被自动 `Clamp01`，而 `Vector3.LerpUnclamped` 不会。
> 用 `Lerp` 做"每帧靠近"时，`t` 应该是 `1f - Mathf.Exp(-k * Time.deltaTime)` 才能做到真正的帧率无关。

#### Quaternion（四元数）

```csharp
using UnityEngine;

public class QuaternionDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- 创建 ----------
        Quaternion identity = Quaternion.identity;                     // 无旋转
        Quaternion fromEuler = Quaternion.Euler(0f, 90f, 0f);          // 欧拉角 → 四元数
        Quaternion look = Quaternion.LookRotation(Vector3.forward, Vector3.up);  // 朝向
        Quaternion axis = Quaternion.AngleAxis(45f, Vector3.up);       // 绕轴旋转
        Quaternion fromTo = Quaternion.FromToRotation(Vector3.up, transform.up);

        // ---------- 属性 ----------
        Vector3 euler = fromEuler.eulerAngles;    // 四元数 → 欧拉角
        Quaternion inv = Quaternion.Inverse(fromEuler);   // 逆旋转
        Quaternion normalizedQ = fromEuler.normalized;

        // ---------- 运算 ----------
        // 旋转叠加：先自转再公转（顺序很重要！）
        Quaternion combined = Quaternion.Euler(0f, 90f, 0f) * Quaternion.Euler(30f, 0f, 0f);

        // 旋转一个向量（四元数 * 向量）
        Vector3 rotatedDir = fromEuler * Vector3.forward;

        // ---------- 插值 ----------
        Quaternion slerp = Quaternion.Slerp(identity, fromEuler, 0.5f);    // 球面插值（推荐）
        Quaternion lerp = Quaternion.Lerp(identity, fromEuler, 0.5f);      // 线性插值（更快，但可能不匀速）
        Quaternion rot = Quaternion.RotateTowards(identity, fromEuler, 90f * Time.deltaTime);

        // ---------- 角度 ----------
        float angle = Quaternion.Angle(identity, fromEuler);   // 两个旋转之间的夹角（度）
        float dot = Quaternion.Dot(identity, fromEuler);

        // ---------- 实用：让物体朝着目标旋转 ----------
        Vector3 dir = (Vector3.zero - transform.position).normalized;
        if (dir != Vector3.zero)
        {
            Quaternion target = Quaternion.LookRotation(dir, Vector3.up);
            transform.rotation = Quaternion.Slerp(transform.rotation, target, 5f * Time.deltaTime);
        }

        Debug.Log(look + "" + axis + fromTo + euler + inv + normalizedQ + combined + rotatedDir);
        Debug.Log(slerp + "" + lerp + rot + angle + dot);
    }

    // ---------- 2D 场景：只绕 Z 轴旋转 ----------
    private void FaceTarget2D(Transform self, Transform target)
    {
        Vector3 diff = target.position - self.position;
        float angleDeg = Mathf.Atan2(diff.y, diff.x) * Mathf.Rad2Deg;
        self.rotation = Quaternion.Euler(0f, 0f, angleDeg - 90f);
    }
}
```

> **四元数必须知道的几点**：
> 1. 万向节死锁：欧拉角在 ±90° 俯仰时会失去一个自由度，**四元数没有这个问题**。
> 2. 四元数**不能直接相加**，叠加要用乘法（`q1 * q2` 表示先应用 q1 再应用 q2，具体顺序与坐标系约定有关）。
> 3. `transform.rotation` 与 `transform.eulerAngles` 互相转换有精度损失，频繁往返会累积误差。
> 4. 判断"是否转向到位"用 `Quaternion.Angle(a, b) < 1f`，不要用 `==`。

#### Random 与随机数

```csharp
using UnityEngine;

public class RandomDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- UnityEngine.Random ----------
        float f = Random.value;                       // 0.0 ~ 1.0（含 0 含 1）
        float range = Random.Range(0f, 10f);          // float：含 0，含 10
        int i = Random.Range(0, 10);                  // int：含 0，**不含 10**（[0,10)）
        Vector2 v2 = Random.insideUnitCircle;         // 单位圆内随机点
        Vector3 v3 = Random.insideUnitSphere;         // 单位球内随机点
        Vector3 onSphere = Random.onUnitSphere;       // 单位球表面随机点
        Quaternion q = Random.rotation;               // 随机旋转
        Quaternion qU = Random.rotationUniform;       // 均匀分布随机旋转（更均匀）
        Color c = Random.ColorHSV();                  // 随机颜色
        Color c2 = Random.ColorHSV(0f, 1f, 0.8f, 1f, 0.8f, 1f, 0.5f, 1f); // 限制饱和度/亮度/透明度

        // ---------- 固定随机种子（可复现，做关卡生成必备）----------
        Random.InitState(12345);      // 之后每次运行序列一致
        // 也可以在 Project Settings → Player → Other Settings 里设 Seed

        // ---------- 从数组随机取 ----------
        var pool = new[] { "a", "b", "c" };
        string pick = pool[Random.Range(0, pool.Length)];

        // ---------- 权重随机（加权抽取）----------
        int weighted = WeightedPick(new[] { 1f, 3f, 6f });   // 权重越大越容易抽中

        // ---------- 洗牌（Fisher-Yates）----------
        Shuffle(pool);

        Debug.Log(f + range + i + v2 + v3 + onSphere + q + qU + c + c2);
    }

    private int WeightedPick(float[] weights)
    {
        float total = 0f;
        for (int k = 0; k < weights.Length; k++) total += weights[k];

        float r = Random.value * total;
        for (int k = 0; k < weights.Length; k++)
        {
            r -= weights[k];
            if (r <= 0f) return k;
        }
        return weights.Length - 1;
    }

    private void Shuffle<T>(T[] array)
    {
        for (int k = array.Length - 1; k > 0; k--)
        {
            int j = Random.Range(0, k + 1);
            (array[k], array[j]) = (array[j], array[k]);   // C# 7 元组交换
        }
    }
}
```

> **三个 Random 的区别**：
> - `UnityEngine.Random`：全局静态，使用方便，但无法多线程使用。
> - `System.Random`：可以 `new Random(seed)` 创建独立实例，适合分模块/多线程。
> - `Unity.Mathematics.Random`：struct 实现，可在 Burst/Job 中使用（需要 `Unity.Mathematics` 包）。
>
> **联机游戏注意**：不要用 `Random` 决定游戏逻辑（不同步），要用可同步的确定性随机（种子 + 帧号）。

---


### 8.6 序列化与存档

Unity 的序列化系统有两套：
1. **Unity 序列化**（Inspector 显示、预制体、场景文件、ScriptableObject 资源）；
2. **运行时序列化**（`JsonUtility`、`BinaryFormatter`、第三方库）——用于存档与网络。

#### JsonUtility（Unity 内置）

```csharp
using UnityEngine;

[System.Serializable]
public class SaveData
{
    public int Level;
    public string PlayerName;
    public float PlayTime;
    public Vector3 LastPosition;
    public int[] UnlockedIds;
    public System.Collections.Generic.List<string> Flags = new System.Collections.Generic.List<string>();
}

public class SaveSystem : MonoBehaviour
{
    private string SavePath => System.IO.Path.Combine(Application.persistentDataPath, "save.json");

    public void Save(SaveData data)
    {
        // toJson 第二个参数 prettyPrint：是否格式化（方便调试，但体积更大）
        string json = JsonUtility.ToJson(data, prettyPrint: true);
        System.IO.File.WriteAllText(SavePath, json);
        Debug.Log("已保存到 " + SavePath);
    }

    public SaveData Load()
    {
        if (!System.IO.File.Exists(SavePath)) return new SaveData();
        string json = System.IO.File.ReadAllText(SavePath);
        return JsonUtility.FromJson<SaveData>(json);
    }

    // ---------- 覆盖已有对象（避免新建）----------
    public void LoadInto(SaveData target)
    {
        if (!System.IO.File.Exists(SavePath)) return;
        JsonUtility.FromJsonOverwrite(System.IO.File.ReadAllText(SavePath), target);
    }
}
```

**JsonUtility 的限制（必须知道）**

| 限制 | 说明 |
| --- | --- |
| 只支持 `[System.Serializable]` 类/struct | 不支持 `Dictionary`、`Nullable`、接口、多态 |
| 不支持顶层数组 | `JsonUtility.FromJson<int[]>()` 会失败，需要包一层 |
| 只序列化 **public 字段** 和 `[SerializeField] private` 字段 | 属性不参与 |
| 不支持 `null` 与默认值的区分 | `int` 默认 0，`string` 默认 "" |
| 不支持循环引用 | 会无限递归/报错 |
| 不支持 `DateTime`（可转成 string/long） | |
| 性能一般 | 大量数据建议用 Newtonsoft.Json 或 MessagePack |

```csharp
// 顶层数组的包装写法
[System.Serializable]
public class IntArrayWrapper { public int[] Items; }

// 使用
var wrapper = new IntArrayWrapper { Items = new[] { 1, 2, 3 } };
string json = JsonUtility.ToJson(wrapper);
```

> **第三方替代**：`Newtonsoft.Json`（Json.NET，Unity 官方 package 也有）、`MessagePack-CSharp`（二进制、极快）、
> `OdinSerializer`（支持多态与循环引用）、`System.Text.Json`（Unity 2021+ 的 .NET Standard 2.1 可用但受限）。

#### PlayerPrefs

```csharp
using UnityEngine;

public class PrefsDemo : MonoBehaviour
{
    private void Start()
    {
        // 存
        PlayerPrefs.SetInt("Level", 5);
        PlayerPrefs.SetFloat("Volume", 0.8f);
        PlayerPrefs.SetString("PlayerName", "Hero");
        PlayerPrefs.Save();                       // 手动落盘（否则退出时才写）

        // 取（带默认值）
        int level = PlayerPrefs.GetInt("Level", 1);
        float vol = PlayerPrefs.GetFloat("Volume", 1f);
        string name = PlayerPrefs.GetString("PlayerName", "Unknown");

        // 判断存在与删除
        bool has = PlayerPrefs.HasKey("Level");
        PlayerPrefs.DeleteKey("Level");
        PlayerPrefs.DeleteAll();

        // 存储位置
        // Windows 注册表 HKCU\Software\<CompanyName>\<ProductName>
        // macOS/Linux: ~/Library/Preferences 或 ~/.config/unity3d/<Company>/<Product>
        // Android: /data/data/<package>/shared_prefs/
        // iOS: /Library/Preferences/<bundleid>.plist
        Debug.Log(level + name + has + vol);
    }
}
```

> **PlayerPrefs 不适合存大量数据/密码**：它是明文（注册表/plist），且**没有加密**，
> 而且每次 `SetXxx` 都要写磁盘。大存档用文件 + `Application.persistentDataPath`。

**路径 API 对照**

| API | 用途 | 平台 |
| --- | --- | --- |
| `Application.dataPath` | 游戏数据目录（只读） | 全平台 |
| `Application.persistentDataPath` | 可读写、不会被清理（**存档首选**） | 全平台 |
| `Application.streamingAssetsPath` | 随包资源（只读；Android 上在 APK 里，需 UnityWebRequest 读取） | 全平台 |
| `Application.temporaryCachePath` | 临时缓存（可能被系统清理） | 全平台 |
| `Application.consoleLogPath` | 日志文件路径 | 全平台 |

> **Android 的 StreamingAssets 是大坑**：`File.ReadAllText(Application.streamingAssetsPath + "/x.json")`
> 在 Android 上**失败**（因为是 APK 内的压缩文件）。必须用 `UnityWebRequest.Get(path)` 读取。

### 8.7 ScriptableObject

ScriptableObject 是"可序列化的数据容器资产"，常用于配置表、全局数据、事件通道。

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "EnemyConfig", menuName = "Game/Enemy Config", order = 0)]
public class EnemyConfig : ScriptableObject
{
    [Header("基础")]
    public string Id;
    public string DisplayName;

    [Header("数值")]
    public float MaxHp = 100f;
    public float MoveSpeed = 3f;
    public float AttackDamage = 10f;

    [Header("视觉")]
    public GameObject Prefab;
    public Sprite Icon;

    // ScriptableObject 支持方法（相当于数据 + 行为）
    public float GetDps(float attackInterval)
    {
        return attackInterval <= 0f ? 0f : AttackDamage / attackInterval;
    }

    // 编辑器下修改值时调用
    private void OnValidate()
    {
        MaxHp = Mathf.Max(1f, MaxHp);
        MoveSpeed = Mathf.Max(0f, MoveSpeed);
    }
}

// ---------- 使用 ----------
public class Enemy : MonoBehaviour
{
    [SerializeField] private EnemyConfig _config;

    private float _hp;

    private void Awake()
    {
        _hp = _config.MaxHp;
        Debug.Log("生成 " + _config.DisplayName);
    }
}
```

**运行时创建 ScriptableObject**

```csharp
using UnityEngine;

public class RuntimeSoDemo : MonoBehaviour
{
    private void Start()
    {
        // 运行时创建（不写入资产）
        var cfg = ScriptableObject.CreateInstance<EnemyConfig>();
        cfg.Id = "slime";
        cfg.MaxHp = 50f;
        Debug.Log(cfg.GetDps(1f));
    }
}
```

**ScriptableObject 的典型用途**

| 用途 | 说明 |
| --- | --- |
| 配置表 | 一个敌人/道具/技能一个 .asset，策划可编辑 |
| 全局数据容器 | 例如"玩家存档数据""游戏设置"（注意：**运行时改动不会持久化**，除非在编辑器里改） |
| 事件通道 | 用 SO 承载 `UnityEvent`，实现模块间零引用通信 |
| 枚举的"带数据版本" | 比 enum 更强，可以在 Inspector 里拖拽引用 |
| 编辑器工具数据 | 生成器配置 |

> **关键特性**：
> 1. ScriptableObject 实例在**编辑器**中对 .asset 的修改会**持久化**；在 **Play 模式**下运行时修改会保留到退出 Play（因为共享同一个实例对象），但不会写回资产文件。
> 2. 打包后 SO 是只读的，运行时修改只在内存中有效，重启就丢。
> 3. SO 引用可以跨场景/预制体共享，非常适合做"数据总线"，但也意味着它**不能被 GC 回收**（常驻内存）。

### 8.8 资源加载（Resources / AssetBundle / Addressables）

#### Resources（简单但被官方不推荐）

```csharp
using UnityEngine;

public class ResourcesDemo : MonoBehaviour
{
    private void Start()
    {
        // 加载单个资源（路径不带扩展名）
        Texture2D tex = Resources.Load<Texture2D>("Textures/PlayerIcon");
        GameObject prefab = Resources.Load<GameObject>("Prefabs/Enemy");

        // 加载文件夹下所有
        Object[] all = Resources.LoadAll("Configs", typeof(ScriptableObject));

        // 异步加载
        ResourceRequest req = Resources.LoadAsync<GameObject>("Prefabs/Enemy");
        req.completed += op =>
        {
            GameObject go = op.asset as GameObject;
            Instantiate(go);
        };

        // 卸载
        Resources.UnloadAsset(tex);          // 卸载单个资源（仅非 GameObject/Component）
        Resources.UnloadUnusedAssets();      // 卸载所有无引用资源（开销大，会触发 GC）

        Debug.Log(prefab + all.Length);
    }
}
```

> **官方明确建议不要用 Resources**：
> - 所有 Resources 目录下的资源都会被打进一个巨大的序列化文件，**无论是否用到**；
> - 启动时加载该索引，造成启动变慢与内存浪费；
> - 无法做资源热更与依赖管理。
> **替代**：小项目用 Addressables 或直接引用，中大型项目一律 Addressables。

#### AssetBundle（底层 API，了解即可）

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class AssetBundleDemo : MonoBehaviour
{
    private IEnumerator LoadFromFile()
    {
        string path = System.IO.Path.Combine(Application.streamingAssetsPath, "enemies");

        // 方式一：本地文件同步加载
        AssetBundleCreateRequest req = AssetBundle.LoadFromFileAsync(path);
        yield return req;

        AssetBundle bundle = req.assetBundle;
        if (bundle == null)
        {
            Debug.LogError("Bundle 加载失败");
            yield break;
        }

        // 加载资源（同步）
        GameObject prefab = bundle.LoadAsset<GameObject>("EnemyPrefab");
        Instantiate(prefab);

        // 异步加载
        AssetBundleRequest assetReq = bundle.LoadAssetAsync<GameObject>("BossPrefab");
        yield return assetReq;
        Instantiate(assetReq.asset);

        // ---------- 依赖：必须先加载依赖 bundle，否则资源会显示为紫色/丢失 ----------
        AssetBundle manifest = AssetBundle.LoadFromFile(
            System.IO.Path.Combine(Application.streamingAssetsPath, "StreamingAssets"));
        AssetBundleManifest mf = manifest.LoadAsset<AssetBundleManifest>("AssetBundleManifest");
        string[] deps = mf.GetAllDependencies("enemies");
        foreach (string d in deps)
        {
            // 逐个加载依赖
        }

        // ---------- 卸载 ----------
        // unloadAllLoadedObjects = false：只释放 bundle 文件本身，已加载的资源仍可用
        // unloadAllLoadedObjects = true ：连资源一起释放（谨慎使用，可能导致引用变 null）
        bundle.Unload(false);
    }

    // ---------- 从网络加载 ----------
    private IEnumerator LoadFromWeb(string url)
    {
        using (UnityWebRequest www = UnityWebRequestAssetBundle.GetAssetBundle(url))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError(www.error);
                yield break;
            }

            AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(www);
            GameObject prefab = bundle.LoadAsset<GameObject>("Enemy");
            Instantiate(prefab);
        }
    }
}
```

> **API 版本提醒**：Unity 2020.2+ 推荐用 `www.result == UnityWebRequest.Result.Success`；
> 旧的 `www.isNetworkError / www.isHttpError` 已废弃。

#### Addressables（现代方案）

需要安装 `com.unity.addressables` 包。

```csharp
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public class AddressablesDemo : MonoBehaviour
{
    [SerializeField] private AssetReferenceGameObject _enemyRef;   // Inspector 里可拖拽的引用
    [SerializeField] private AssetReferenceSprite _iconRef;

    private AsyncOperationHandle<GameObject> _handle;

    private void Start()
    {
        // ---------- 按地址加载（异步）----------
        Addressables.LoadAssetAsync<GameObject>("Enemy").Completed += handle =>
        {
            if (handle.Status == AsyncOperationStatus.Succeeded)
            {
                Instantiate(handle.Result);
            }
        };

        // ---------- 用 AssetReference（更安全，能自动收集依赖）----------
        _enemyRef.InstantiateAsync().Completed += h =>
        {
            if (h.Status == AsyncOperationStatus.Succeeded)
            {
                GameObject go = h.Result;
                // ... 使用
            }
        };

        // ---------- 实例化（会自动加载 + 实例化）----------
        Addressables.InstantiateAsync("Enemy", transform.position, Quaternion.identity);

        // ---------- 批量加载标签下的所有资源 ----------
        Addressables.LoadAssetsAsync<GameObject>("enemies", obj =>
        {
            Debug.Log("加载到 " + obj.name);
        });

        // ---------- 下载依赖（热更必备）----------
        // Addressables.GetDownloadSizeAsync(key)
        // Addressables.DownloadDependenciesAsync(key)
    }

    private async Task LoadWithAsyncAwait()
    {
        AsyncOperationHandle<GameObject> handle = Addressables.LoadAssetAsync<GameObject>("Enemy");
        GameObject prefab = await handle.Task;
        Instantiate(prefab);

        // 用完必须释放，否则内存泄漏
        Addressables.Release(handle);
    }

    private void OnDestroy()
    {
        if (_handle.IsValid()) Addressables.Release(_handle);
    }
}
```

**三种资源方案对比**

| 方案 | 优点 | 缺点 | 推荐场景 |
| --- | --- | --- | --- |
| `Resources` | 最简单，同步/异步 | 全量打包，启动慢，无法热更 | 原型、小工具 |
| `AssetBundle` | 灵活、可热更、可控依赖 | 依赖管理复杂，易出错 | 需要精细控制的团队 |
| `Addressables` | 自动依赖、可热更、可远程 | 学习成本、引用计数要小心 | **现代项目首选** |
| 直接引用（Inspector） | 零代码、最快 | 无法动态加载 | 必用资源（预制体、配置） |
| `AssetDatabase`（仅编辑器） | 编辑器工具最快 | 运行时不可用 | 编辑器工具 |

### 8.9 场景管理与跨场景数据

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneDemo : MonoBehaviour
{
    // ---------- 静态方式加载 ----------
    public void LoadSync()
    {
        SceneManager.LoadScene("Level2");                          // 按名
        SceneManager.LoadScene(1);                                 // 按 Build Settings 索引
    }

    // ---------- 异步加载（推荐，可做加载条）----------
    public IEnumerator LoadAsync()
    {
        AsyncOperation op = SceneManager.LoadSceneAsync("Level2");
        op.allowSceneActivation = false;              // 先别切，等加载条走完

        while (!op.isDone)
        {
            // progress 到 0.9 就卡住（因为 0.9~1.0 是等待激活）
            float progress = Mathf.Clamp01(op.progress / 0.9f);
            // 更新 UI 进度条

            if (op.progress >= 0.9f)
            {
                // 等玩家点击继续
                op.allowSceneActivation = true;
            }
            yield return null;
        }

        Debug.Log("加载完成");
    }

    // ---------- 附加场景（多场景编辑 + 叠加）----------
    public IEnumerator LoadAdditive()
    {
        yield return SceneManager.LoadSceneAsync("UI", LoadSceneMode.Additive);
        Scene uiScene = SceneManager.GetSceneByName("UI");
        SceneManager.SetActiveScene(uiScene);
        // 也可以把对象移动到另一个场景
        // SceneManager.MoveGameObjectToScene(go, uiScene);
    }

    public void UnloadAdditive()
    {
        SceneManager.UnloadSceneAsync("UI");
    }

    private void Start()
    {
        // ---------- 场景信息 ----------
        Scene current = SceneManager.GetActiveScene();
        Debug.Log(current.name + " " + current.buildIndex + " " + current.isLoaded);

        int count = SceneManager.sceneCount;

        // ---------- 事件 ----------
        SceneManager.sceneLoaded += OnSceneLoaded;
        SceneManager.sceneUnloaded += OnSceneUnloaded;
        SceneManager.activeSceneChanged += OnActiveSceneChanged;
    }

    private void OnDestroy()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
        SceneManager.sceneUnloaded -= OnSceneUnloaded;
        SceneManager.activeSceneChanged -= OnActiveSceneChanged;
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode) { }
    private void OnSceneUnloaded(Scene scene) { }
    private void OnActiveSceneChanged(Scene prev, Scene next) { }
}
```

> **跨场景数据传递的三种方式**：
> 1. **静态类 / 静态字段**：简单，但不受场景卸载影响（注意手动清理）。
> 2. **`DontDestroyOnLoad` 的持久对象**：适合管理器（GameManager、AudioManager）。
> 3. **ScriptableObject**：优雅，但要注意 Play 模式下的状态残留。

### 8.10 UI：UGUI 与 TextMeshPro

#### UGUI 核心组件操作

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;   // TextMeshPro

public class UIDemo : MonoBehaviour
{
    [Header("基础组件")]
    [SerializeField] private Image _icon;
    [SerializeField] private TMP_Text _titleText;
    [SerializeField] private Slider _hpBar;
    [SerializeField] private Button _startButton;
    [SerializeField] private Toggle _soundToggle;
    [SerializeField] private Dropdown _qualityDropdown;
    [SerializeField] private TMP_InputField _nameInput;
    [SerializeField] private ScrollRect _scrollRect;
    [SerializeField] private RectTransform _content;

    [Header("列表项预制体")]
    [SerializeField] private GameObject _itemPrefab;

    private readonly List<GameObject> _items = new List<GameObject>();

    private void Start()
    {
        // ---------- Image ----------
        _icon.sprite = Resources.Load<Sprite>("Icons/sword");
        _icon.color = new Color(1f, 1f, 1f, 0.5f);
        _icon.type = Image.Type.Filled;              // 需要设置 fillMethod / fillAmount
        _icon.fillAmount = 0.75f;
        _icon.raycastTarget = false;                 // 不需要点击的图片设为 false，减少射线检测

        // ---------- TextMeshPro ----------
        _titleText.text = "Hello";
        _titleText.color = Color.red;
        _titleText.fontSize = 48f;
        // 零分配设置文本（高频更新用这个）
        _titleText.SetText("Score: {0}", score);

        // ---------- Slider ----------
        _hpBar.minValue = 0f;
        _hpBar.maxValue = 100f;
        _hpBar.value = 75f;
        _hpBar.onValueChanged.AddListener(v => Debug.Log(v));

        // ---------- Button ----------
        _startButton.onClick.AddListener(OnStartClicked);
        _startButton.interactable = false;

        // ---------- Toggle ----------
        _soundToggle.isOn = true;
        _soundToggle.onValueChanged.AddListener(OnSoundChanged);

        // ---------- Dropdown ----------
        _qualityDropdown.ClearOptions();
        _qualityDropdown.AddOptions(new List<string> { "Low", "Medium", "High" });
        _qualityDropdown.value = 2;
        _qualityDropdown.onValueChanged.AddListener(OnQualityChanged);

        // ---------- InputField ----------
        _nameInput.text = "Player";
        _nameInput.onValueChanged.AddListener(s => Debug.Log(s));

        // ---------- 动态列表 ----------
        BuildList(20);
        _scrollRect.verticalNormalizedPosition = 1f;   // 滚到顶部
    }

    private int score = 0;

    private void BuildList(int count)
    {
        // 清空
        for (int i = 0; i < _items.Count; i++) Destroy(_items[i]);
        _items.Clear();

        for (int i = 0; i < count; i++)
        {
            GameObject go = Instantiate(_itemPrefab, _content);
            var label = go.GetComponentInChildren<TMP_Text>();
            if (label != null) label.SetText("Item {0}", i);
            _items.Add(go);
        }
    }

    private void OnStartClicked() { }
    private void OnSoundChanged(bool on) { }
    private void OnQualityChanged(int index) { }

    private void OnDestroy()
    {
        _startButton.onClick.RemoveListener(OnStartClicked);
        _soundToggle.onValueChanged.RemoveListener(OnSoundChanged);
        _hpBar.onValueChanged.RemoveAllListeners();
    }
}
```

**UGUI 性能要点**

| 问题 | 解决 |
| --- | --- |
| Canvas 重建（Rebuild）开销大 | 拆分 Canvas（频繁变化的元素单独一个 Canvas）；避免同帧大量元素改动 |
| 布局（Layout）重建 | 避免嵌套 `LayoutGroup`；高频变化的列表不要用 `VerticalLayoutGroup` |
| 射线检测（Raycast）开销 | 关闭装饰元素的 `raycastTarget` |
| 长列表实例化开销 | 对象池 + 复用可视区域 item（滚动列表虚拟化） |
| 文本更新分配 | 用 `TMP_Text.SetText(format, args)` 而不是 `text = string.Format` |
| 图集（Atlas）切换 | 同一 Canvas 下尽量用同一个 Sprite Atlas 的图，减少 DrawCall |

> **Canvas 重建原理**：任何 UI 元素的顶点/材质/层级变化都会把所在 Canvas 标记为 Dirty，
> 下一帧整个 Canvas 的所有元素会被重新生成网格。所以：
> **把会变化的元素（血条、分数）与静态元素（背景、边框）放到不同的 Canvas 下**。

#### UI Toolkit（现代 UI，Unity 2021.2+ 可在运行时使用）

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class UIToolkitDemo : MonoBehaviour
{
    // 需要把 UIDocument 组件挂到 GameObject 上，并指定 UXML + PanelSettings
    [SerializeField] private UIDocument _document;

    private Label _title;
    private Button _startButton;
    private ProgressBar _hpBar;

    private void OnEnable()
    {
        VisualElement root = _document.rootVisualElement;

        // 按名字查找元素（UXML 里设置的 name 属性）
        _title = root.Q<Label>("title-label");
        _startButton = root.Q<Button>("start-button");
        _hpBar = root.Q<ProgressBar>("hp-bar");

        // 事件绑定
        _startButton.clicked += OnStartClicked;

        // 样式类（类似 CSS）
        _title.AddToClassList("highlight");
        _title.text = "Hello UI Toolkit";

        // 手动创建元素（也可以完全用代码构建 UI）
        var container = new VisualElement();
        container.style.flexDirection = FlexDirection.Row;
        container.style.justifyContent = Justify.SpaceBetween;
        container.style.paddingTop = 8;
        container.style.paddingBottom = 8;
        container.style.backgroundColor = new Color(0.1f, 0.1f, 0.1f, 0.8f);

        var newLabel = new Label("动态添加的文本");
        newLabel.style.color = Color.white;
        container.Add(newLabel);
        root.Add(container);

        // 注册回调
        root.RegisterCallback<ClickEvent>(evt => Debug.Log("点击了 " + evt.target));
    }

    private void OnDisable()
    {
        if (_startButton != null) _startButton.clicked -= OnStartClicked;
    }

    private void OnStartClicked()
    {
        _hpBar.value = 50f;
        Debug.Log("start");
    }
}
```

**UGUI vs UI Toolkit**

| 维度 | UGUI | UI Toolkit |
| --- | --- | --- |
| 运行时支持 | ✅ 全版本 | ✅ 2021.2+（早期仅编辑器） |
| 布局 | RectTransform + LayoutGroup | Flexbox（CSS 风格） |
| 样式 | 每个组件上设置 | USS 样式表，可复用 |
| 世界空间 UI | ✅ 原生支持 | ❌ 需要 RenderTexture 方案 |
| 3D UI / 跟随物体 | ✅ | 需要额外处理 |
| 性能 | 可优化得很好 | 一般更好（少 DrawCall 合并问题） |
| 编辑器 UI | ❌ | ✅ 官方编辑器 UI 已全面迁移 |
| 学习价值 | ✅ 现存项目大量使用 | ✅ 新项目与工具开发 |

> **结论**：**运行时游戏 UI 目前仍以 UGUI + TextMeshPro 为主**，UI Toolkit 更适合编辑器工具
> 以及对性能要求极高的纯面板 UI。

### 8.11 动画

#### Animator（Mecanim）

```csharp
using UnityEngine;

public class AnimationDemo : MonoBehaviour
{
    private Animator _anim;
    private static readonly int SpeedHash = Animator.StringToHash("Speed");        // 缓存哈希，避免字符串比较
    private static readonly int IsJumpingHash = Animator.StringToHash("IsJumping");
    private static readonly int AttackHash = Animator.StringToHash("Attack");
    private static readonly int JumpStateHash = Animator.StringToHash("Base Layer.Jump");

    private void Awake()
    {
        _anim = GetComponent<Animator>();
    }

    private void Update()
    {
        // ---------- 设置参数 ----------
        _anim.SetFloat(SpeedHash, 5f);
        _anim.SetFloat(SpeedHash, 5f, 0.1f, Time.deltaTime);   // 带阻尼平滑过渡
        _anim.SetBool(IsJumpingHash, true);
        _anim.SetInteger("ComboIndex", 2);
        _anim.SetTrigger(AttackHash);                // 一次性触发

        // ---------- 播放指定状态（跳过状态机）----------
        _anim.Play("Idle", layer: 0, normalizedTime: 0f);
        _anim.CrossFade("Run", 0.2f);                // 0.2 秒过渡
        _anim.CrossFadeInFixedTime("Jump", 0.1f);

        // ---------- 查询状态 ----------
        AnimatorStateInfo info = _anim.GetCurrentAnimatorStateInfo(0);
        bool isRunning = info.IsName("Run");
        bool isTagged = info.IsTag("Attack");
        float normalized = info.normalizedTime;      // 归一化时间（>1 表示已循环过）
        float length = info.length;

        AnimatorStateInfo next = _anim.GetNextAnimatorStateInfo(0);
        bool inTransition = _anim.IsInTransition(0);

        // 获取当前动画剪辑的剩余时间
        // （没有直接的 API，常用 length * (1 - normalizedTime) 估算）

        Debug.Log(isRunning + "" + isTagged + normalized + length + next + inTransition);
    }

    // ---------- 动画事件（在 Animation 窗口里添加，或代码接收）----------
    // 名称必须与 Animation 窗口里配置的函数名一致，参数只能是 float/int/string/object/AnimationEvent
    private void OnAttackHit() { Debug.Log("命中判定"); }
    private void OnFootstep(int footIndex) { Debug.Log("脚步 " + footIndex); }
    private void OnAnimationEventGeneric(AnimationEvent evt) { Debug.Log(evt.stringParameter); }

    // ---------- IK（反向动力学）----------
    private void OnAnimatorIK(int layerIndex)
    {
        // 需要 Animator 勾选 IK Pass
        _anim.SetIKPositionWeight(AvatarIKGoal.RightHand, 1f);
        _anim.SetIKPosition(AvatarIKGoal.RightHand, _ikTarget.position);
        _anim.SetIKRotationWeight(AvatarIKGoal.RightHand, 1f);
        _anim.SetIKRotation(AvatarIKGoal.RightHand, _ikTarget.rotation);

        // 注视
        _anim.SetLookAtWeight(1f, 0.5f, 1f, 1f, 0.5f);
        _anim.SetLookAtPosition(_lookTarget.position);
    }

    private void OnAnimatorMove()
    {
        // 用于 Root Motion 的手动控制（需要勾选 Apply Root Motion 并按需关闭）
        // transform.position += _anim.deltaPosition;
        // transform.rotation *= _anim.deltaRotation;
    }

    [SerializeField] private Transform _ikTarget;
    [SerializeField] private Transform _lookTarget;
}
```

> **Animator 性能要点**：
> - 用 `Animator.StringToHash` 缓存参数名，避免每帧字符串哈希。
> - 空状态机（没有动画的 Animator）也有开销，用完要禁用。
> - `Animator.cullingMode` 默认 `CullUpdateTransforms`，远处不用渲染的动画被裁剪，但状态机还在跑。
>   想彻底停掉用 `CullCompletely`。
> - 大量简单动画（UI、飘字）用 **Animation** 组件或手写 Tween 比 Animator 便宜得多。

### 8.12 音频

```csharp
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class AudioDemo : MonoBehaviour
{
    [SerializeField] private AudioClip _bgm;
    [SerializeField] private AudioClip _sfx;
    private AudioSource _source;

    private void Awake()
    {
        _source = GetComponent<AudioSource>();

        // ---------- 配置 ----------
        _source.clip = _bgm;
        _source.loop = true;
        _source.volume = 0.8f;
        _source.pitch = 1f;                    // 音调（0.5 = 慢速，2 = 快速）
        _source.spatialBlend = 0f;             // 0 = 2D，1 = 3D
        _source.playOnAwake = false;

        // 3D 音效设置
        _source.spatialBlend = 1f;
        _source.rolloffMode = AudioRolloffMode.Linear;
        _source.minDistance = 1f;              // 音量衰减起始距离
        _source.maxDistance = 30f;             // 超出后静音（Logarithmic 模式下还会衰减）
        _source.dopplerLevel = 0f;             // 多普勒效应，2D 游戏设为 0
    }

    private void Start()
    {
        _source.Play();
    }

    // ---------- 一次性播放（不用管理 AudioSource）----------
    public void PlayOneShot(AudioClip clip, float volume = 1f, Vector3 position = default)
    {
        // 方式一：AudioSource.PlayOneShot（同一个 source 可叠加播放）
        _source.PlayOneShot(clip, volume);

        // 方式二：世界坐标播放一次（自动创建临时 AudioSource 并销毁）
        AudioSource.PlayClipAtPoint(clip, position, volume);
    }

    // ---------- 音量控制 ----------
    public void SetVolumes()
    {
        AudioListener.volume = 0.5f;                       // 全局（慎用，通常细化到 AudioMixer）
        // AudioMixer 的用法：
        // mixer.SetFloat("MasterVolume", Mathf.Log10(value) * 20f);   // 线性 → dB
    }

    private void StopAll()
    {
        _source.Stop();
        _source.Pause();
        _source.UnPause();
    }

    private void Update()
    {
        // 当前播放状态与进度
        if (_source.isPlaying)
        {
            float t = _source.time;                // 当前播放秒数
            float norm = _source.timeSamples / (float)_source.clip.samples;
            Debug.Log(t + " " + norm + _sfx.name);
        }
    }
}
```

> **音量转 dB 的公式**：`volumeDb = Mathf.Log10(linearVolume) * 20f`。
> 直接给 AudioMixer 设 0~1 的线性值会得到错误的听感（因为 dB 是对数）。
> `0.5` 线性 → `-6dB`。

### 8.13 编辑器扩展（提高开发效率的关键）

```csharp
#if UNITY_EDITOR

using UnityEditor;
using UnityEngine;
using System.Collections.Generic;

// ---------- 1) 菜单项 ----------
public static class ToolsMenu
{
    [MenuItem("Tools/Game/打印选中对象")]
    private static void PrintSelection()
    {
        foreach (GameObject go in Selection.gameObjects)
        {
            Debug.Log(go.name, go);
        }
    }

    // 快捷键：% = Ctrl/Cmd，# = Shift，& = Alt
    [MenuItem("Tools/Game/快速操作 %#g")]
    private static void QuickAction() { }

    // 验证函数：控制菜单是否可用
    [MenuItem("Tools/Game/需要选中对象")]
    private static void NeedSelection() { }

    [MenuItem("Tools/Game/需要选中对象", true)]
    private static bool NeedSelectionValidate() => Selection.activeGameObject != null;
}

// ---------- 2) 自定义窗口 ----------
public class BatchRenamerWindow : EditorWindow
{
    private string _prefix = "Obj_";
    private int _startIndex = 0;

    [MenuItem("Tools/Game/批量重命名窗口")]
    private static void Open()
    {
        var window = GetWindow<BatchRenamerWindow>("批量重命名");
        window.minSize = new Vector2(300f, 120f);
        window.Show();
    }

    private void OnGUI()
    {
        GUILayout.Label("批量重命名选中对象", EditorStyles.boldLabel);

        _prefix = EditorGUILayout.TextField("前缀", _prefix);
        _startIndex = EditorGUILayout.IntField("起始编号", _startIndex);

        if (GUILayout.Button("执行"))
        {
            GameObject[] targets = Selection.gameObjects;
            Undo.RecordObjects(targets, "批量重命名");        // 支持 Ctrl+Z

            for (int i = 0; i < targets.Length; i++)
            {
                targets[i].name = _prefix + (_startIndex + i).ToString("D3");
                EditorUtility.SetDirty(targets[i]);
            }
            AssetDatabase.SaveAssets();
        }
    }
}

// ---------- 3) 自定义 Inspector ----------
[CustomEditor(typeof(EnemyConfig))]
public class EnemyConfigEditor : Editor
{
    public override void OnInspectorGUI()
    {
        // 绘制默认 Inspector
        DrawDefaultInspector();

        var cfg = (EnemyConfig)target;

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("快捷操作", EditorStyles.boldLabel);

        if (GUILayout.Button("计算 DPS"))
        {
            Debug.Log("DPS = " + cfg.GetDps(1f));
        }
    }
}

// ---------- 4) PropertyDrawer ----------
public class RenameAttribute : PropertyAttribute
{
    public string Prefix;
    public RenameAttribute(string prefix) => Prefix = prefix;
}

[CustomPropertyDrawer(typeof(RenameAttribute))]
public class RenameDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        var attr = (RenameAttribute)attribute;
        label.text = attr.Prefix + label.text;
        EditorGUI.PropertyField(position, property, label, true);
    }
}

// ---------- 5) 资源后处理（导入自动化）----------
public class TextureImportPostprocessor : AssetPostprocessor
{
    private void OnPreprocessTexture()
    {
        // 只对特定目录下的贴图生效
        if (!assetPath.Contains("/Textures/UI/")) return;

        var importer = (TextureImporter)assetImporter;
        importer.textureType = TextureImporterType.Sprite;
        importer.mipmapEnabled = false;
        importer.maxTextureSize = 1024;
    }
}

// ---------- 6) 构建前/后处理 ----------
public class BuildHook
{
    [InitializeOnLoadMethod]
    private static void OnLoad()
    {
        // 编辑器加载时执行一次
    }
}

#endif
```

> **编辑器代码必须放在 `Editor` 文件夹或标了 `Editor` 平台的 Assembly Definition 里**，
> 并用 `#if UNITY_EDITOR` 包裹，否则打包会失败。

### 8.14 调试工具

```csharp
using UnityEngine;

public class DebugDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- 日志 ----------
        Debug.Log("普通信息");
        Debug.LogWarning("警告");
        Debug.LogError("错误");                       // 会中断 Console 的 "Error Pause"
        Debug.LogException(new System.Exception("异常"));

        // 第二个参数：点击日志时高亮的对象
        Debug.Log("这条日志关联到当前物体", this);
        Debug.Log("关联到某个组件", GetComponent<Collider>());

        // ---------- 格式化 ----------
        Debug.LogFormat("HP={0} MP={1}", 100, 50);    // 注意会装箱
        Debug.LogWarningFormat("低血量 {0}", 10);

        // ---------- 条件编译（发布版自动剔除）----------
        Debug.Assert(transform != null, "transform 为空");

        // ---------- 绘制调试图形 ----------
        Debug.DrawLine(transform.position, transform.position + Vector3.up * 2f, Color.red);
        Debug.DrawRay(transform.position, Vector3.forward * 5f, Color.green, 1f);  // 持续 1 秒
        Debug.Break();                                 // 暂停编辑器（慎用）

        // ---------- 手绘 Gizmos（OnDrawGizmos 中）----------
    }

    private void OnDrawGizmos()
    {
        // 线框
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, 5f);
        Gizmos.DrawWireCube(transform.position, Vector3.one);

        // 实心
        Gizmos.color = new Color(1f, 0f, 0f, 0.3f);
        Gizmos.DrawSphere(transform.position, 1f);

        // 射线与网格
        Gizmos.DrawRay(transform.position, Vector3.forward * 3f);
        // Gizmos.DrawMesh(mesh, position, rotation, scale);
    }
}
```

**Profiler 使用要点**

| 模块 | 关注点 |
| --- | --- |
| CPU Usage | `Scripts`（自己代码）、`Physics`、`Rendering`、`GC.Alloc` 峰值 |
| GC Alloc 列 | 任何"每帧分配"都是优化目标，理想是 Update 里 0 B |
| Rendering | DrawCall、SetPass Call、批次 |
| Memory | 纹理、网格、托管堆、非托管 |
| Deep Profile | 逐方法耗时（开销极大，只在排查时用） |
| Profile Analyzer | 对比两个 Profiler 抓取的差异（package） |

---


### 8.15 摄像机与渲染基础

```csharp
using UnityEngine;

[RequireComponent(typeof(Camera))]
public class CameraDemo : MonoBehaviour
{
    private Camera _cam;

    private void Awake()
    {
        _cam = GetComponent<Camera>();

        // ---------- 核心参数 ----------
        _cam.fieldOfView = 60f;                        // 透视相机 FOV（度）
        _cam.nearClipPlane = 0.3f;                     // 近裁剪面（太小会导致 Z-Fighting）
        _cam.farClipPlane = 1000f;                     // 远裁剪面
        _cam.orthographic = false;                     // true = 正交（2D / 小地图常用）
        _cam.orthographicSize = 5f;                    // 正交模式下可视高度的一半
        _cam.aspect = 16f / 9f;
        _cam.depth = 0f;                               // 多相机时的渲染顺序（小的先渲染）
        _cam.cullingMask = LayerMask.GetMask("Default", "Player");   // 只渲染指定层
        _cam.clearFlags = CameraClearFlags.Skybox;     // Skybox / SolidColor / Depth / Nothing
        _cam.backgroundColor = Color.black;
        _cam.targetTexture = null;                     // 渲染到 RenderTexture 时设置
    }

    private void Update()
    {
        // ---------- 坐标转换（高频使用）----------
        Vector3 screen = _cam.WorldToScreenPoint(transform.position);       // 世界 → 屏幕
        Vector3 world = _cam.ScreenToWorldPoint(new Vector3(Input.mousePosition.x,
                                                            Input.mousePosition.y, 10f));  // 屏幕 → 世界
        Vector3 vp = _cam.WorldToViewportPoint(transform.position);         // 世界 → 视口（0~1）
        Ray ray = _cam.ScreenPointToRay(Input.mousePosition);               // 屏幕 → 射线

        // 判断目标是否在视锥内
        Vector3 p = _cam.WorldToViewportPoint(transform.position);
        bool visible = p.z > 0f && p.x >= 0f && p.x <= 1f && p.y >= 0f && p.y <= 1f;
        bool onScreen = visible;

        // 判断包围盒是否可见（更省）
        var bounds = new Bounds(transform.position, Vector3.one);
        Plane[] planes = GeometryUtility.CalculateFrustumPlanes(_cam);
        bool inFrustum = GeometryUtility.TestPlanesAABB(planes, bounds);

        Debug.Log(onScreen + "" + inFrustum + "" + screen + world + vp + ray);
    }

    // ---------- 渲染到纹理（小地图 / 后视镜 / 头像）----------
    [SerializeField] private Camera _minimapCam;
    [SerializeField] private RenderTexture _minimapRT;

    public void CaptureMinimap()
    {
        _minimapCam.targetTexture = _minimapRT;
        _minimapCam.Render();      // 手动渲染一帧（开销较大，不要每帧调用）
        _minimapCam.targetTexture = null;
    }
}
```

> **Camera.main 的实现**：它等价于 @FindGameObjectWithTag("MainCamera").GetComponent<Camera>()@，
> 从 Unity 2020.2 起有内部缓存，但**仍然比直接缓存字段慢**。在 @Update@ 中务必缓存。
> 另外，游戏中禁用/销毁主相机后 @Camera.main@ 会返回 null。

### 8.16 光照与材质

```csharp
using UnityEngine;

public class LightingDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- 光源 ----------
        Light light = GetComponent<Light>();
        if (light != null)
        {
            light.type = LightType.Directional;        // Directional / Point / Spot / Area（Baked）
            light.color = Color.white;
            light.intensity = 1f;
            light.range = 10f;                         // Point / Spot 有效
            light.spotAngle = 45f;                     // Spot 有效
            light.shadows = LightShadows.Soft;         // None / Hard / Soft
            light.shadowStrength = 0.8f;
            light.renderMode = LightRenderMode.Auto;   // Auto / ForcePixel / ForceVertex
        }

        // ---------- 材质 ----------
        Renderer rend = GetComponent<Renderer>();
        if (rend != null)
        {
            // material 会克隆一份实例（改它只影响自己）
            Material mat = rend.material;
            // sharedMaterial 不克隆（改它会影响所有使用该材质的对象）
            Material shared = rend.sharedMaterial;

            // 常用设置
            mat.color = Color.red;
            mat.SetColor("_Color", Color.red);
            mat.SetFloat("_Metallic", 0.5f);
            mat.SetFloat("_Glossiness", 0.8f);
            mat.SetTexture("_MainTex", null);
            mat.SetVector("_Offset", new Vector4(0f, 0f, 0f, 0f));
            mat.SetInt("_ZWrite", 1);
            mat.EnableKeyword("_EMISSION");
            mat.renderQueue = 3000;

            // 获取属性（注意：属性不存在时返回默认值，不报错）
            float metallic = mat.GetFloat("_Metallic");
            Color c = mat.GetColor("_Color");

            Debug.Log(shared + metallic + " " + c);
        }

        // ---------- 材质属性块（MaterialPropertyBlock，避免材质克隆）----------
        // ✅ 大量对象需要各自不同颜色时，用 MPB 比 rend.material 高效得多
        var mpb = new MaterialPropertyBlock();
        mpb.SetColor("_Color", Color.green);
        if (rend != null) rend.SetPropertyBlock(mpb);

        // ---------- 全局着色器属性 ----------
        Shader.SetGlobalFloat("_GlobalTime", Time.time);
        Shader.SetGlobalColor("_GlobalTint", Color.white);

        // 注意：Shader 名称在打包后可能被剥离，要加进 Always Included Shaders 或用 Shader.Find 的替代方案
        Shader s = Shader.Find("Standard");
        Debug.Log(s);
    }
}
```

> **@rend.material@ 的性能陷阱**：每次访问 @material@ 都会**克隆一份材质实例**（并产生 GC）。
> 在 @Update@ 里写 @rend.material.color = ...@ 会每帧创建一个材质！
> 正确做法：
> 1. 初始化时取出 @Material@ 缓存到字段；
> 2. 只改颜色等少量属性时用 @MaterialPropertyBlock@；
> 3. 静态物体直接改 @sharedMaterial@（编辑器/加载阶段一次性完成）。

### 8.17 粒子系统与特效

```csharp
using UnityEngine;

public class ParticleDemo : MonoBehaviour
{
    [SerializeField] private ParticleSystem _ps;

    private void Start()
    {
        // ---------- 播放控制 ----------
        _ps.Play();
        _ps.Pause();
        _ps.Stop(withChildren: true, stopBehavior: ParticleSystemStopBehavior.StopEmittingAndClear);
        _ps.Clear();

        // ---------- 运行时修改（主模块）----------
        ParticleSystem.MainModule main = _ps.main;
        main.startLifetime = 1.5f;
        main.startSpeed = 5f;
        main.startSize = 0.5f;
        main.startColor = Color.red;
        main.maxParticles = 200;
        main.simulationSpace = ParticleSystemSimulationSpace.World;   // 世界空间（拖尾用）
        main.loop = false;

        // ---------- 发射模块 ----------
        ParticleSystem.EmissionModule emission = _ps.emission;
        emission.rateOverTime = 20f;
        emission.enabled = true;

        // 用 Emit 精确发射若干个（爆点、命中特效）
        _ps.Emit(50);

        // ---------- 形状模块 ----------
        ParticleSystem.ShapeModule shape = _ps.shape;
        shape.shapeType = ParticleSystemShapeType.Sphere;
        shape.radius = 1f;

        // ---------- 速度/大小随生命周期变化 ----------
        ParticleSystem.VelocityOverLifetimeModule vel = _ps.velocityOverLifetime;
        vel.enabled = true;

        ParticleSystem.SizeOverLifetimeModule size = _ps.sizeOverLifetime;
        size.enabled = true;

        // ---------- 查询 ----------
        bool playing = _ps.isPlaying;
        int count = _ps.particleCount;
        float duration = _ps.main.duration;

        // ParticleSystem.Particle[] 读取（规模大时慎用）
        var buffer = new ParticleSystem.Particle[256];
        int n = _ps.GetParticles(buffer);
        Debug.Log(playing + "" + count + duration + n);
    }

    // ---------- 特效播完自动回收（对象池）----------
    public void PlayOneShotAndRecycle()
    {
        _ps.Clear();
        _ps.Play();
        float life = _ps.main.duration + _ps.main.startLifetime.constantMax;
        Destroy(gameObject, life);
    }
}
```

> **性能要点**：
> - 粒子的开销主要在 **Overdraw**（半透明重叠）和 **粒子数量**，而不是 C# 侧。
> - 每帧访问 @_ps.main@ / @_ps.emission@ 等模块结构体有开销，应缓存或只在需要时访问。
> - 大量同类特效走对象池，不要反复 @Instantiate@ / @Destroy@。
> - 移动端建议使用 Simple / Mobile 着色器的粒子材质，并用 Particle System 的 Culling Mode。

### 8.18 2D 游戏专用 API

```csharp
using UnityEngine;

public class TwoDDemo : MonoBehaviour
{
    [SerializeField] private SpriteRenderer _spriteRenderer;
    [SerializeField] private Rigidbody2D _rb2d;
    [SerializeField] private Animator _anim;

    private void Start()
    {
        // ---------- Sprite ----------
        _spriteRenderer.sprite = null;
        _spriteRenderer.color = new Color(1f, 1f, 1f, 0.5f);
        _spriteRenderer.flipX = true;                  // 左右翻转（比负缩放更安全）
        _spriteRenderer.sortingLayerName = "Characters";
        _spriteRenderer.sortingOrder = 10;
        _spriteRenderer.spriteSortPoint = SpriteSortPoint.Pivot;

        // ---------- Rigidbody2D ----------
        _rb2d.gravityScale = 3f;
        _rb2d.bodyType = RigidbodyType2D.Dynamic;      // Dynamic / Kinematic / Static
        _rb2d.freezeRotation = true;                   // 防止角色翻倒
        _rb2d.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
        _rb2d.interpolation = RigidbodyInterpolation2D.Interpolate;
        _rb2d.linearVelocity = new Vector2(5f, 0f);    // Unity 6 起；旧版为 velocity
        _rb2d.AddForce(Vector2.up * 5f, ForceMode2D.Impulse);

        // ---------- 2D 射线 ----------
        RaycastHit2D hit = Physics2D.Raycast(transform.position, Vector2.down, 1f,
                                             LayerMask.GetMask("Ground"));
        if (hit.collider != null)
        {
            Debug.Log("落地于 " + hit.point + " 法线 " + hit.normal);
        }

        // 2D 范围检测
        Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, 3f);
        Debug.Log(hits.Length);
    }

    // ---------- 2D 物理回调 ----------
    private void OnCollisionEnter2D(Collision2D collision) { }
    private void OnTriggerEnter2D(Collider2D other) { }
}
```

> **2D 项目的重要设置**：
> - @Edit → Project Settings → Editor → Default Behavior Mode@ 设为 @2D@（新建场景默认正交相机）。
> - Sprite 的 @Pixels Per Unit@（默认 100）决定 1 个世界单位等于多少像素。
> - 2D 排序：@Sorting Layer@（层级）+ @Order in Layer@（同层内顺序）+ @Z 轴位置@（正交相机下也影响排序，视 Shader 而定）。
> - **2D 性能技巧**：用 Sprite Atlas 合并图集减少 DrawCall。

### 8.19 寻路（NavMesh）

需要 @AI Navigation@（旧版为内置 Navigation 窗口）包。

```csharp
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class NavMeshDemo : MonoBehaviour
{
    private NavMeshAgent _agent;
    [SerializeField] private Transform _target;

    private void Awake()
    {
        _agent = GetComponent<NavMeshAgent>();

        // ---------- 常用参数 ----------
        _agent.speed = 3.5f;
        _agent.angularSpeed = 120f;
        _agent.acceleration = 8f;
        _agent.stoppingDistance = 0.5f;              // 距目标多远停下
        _agent.autoBraking = true;
        _agent.radius = 0.5f;
        _agent.height = 2f;
        _agent.obstacleAvoidanceType = ObstacleAvoidanceType.HighQualityObstacleAvoidance;
    }

    private void Update()
    {
        if (_target == null) return;

        // ---------- 简单跟随 ----------
        _agent.SetDestination(_target.position);

        // ---------- 状态查询 ----------
        bool hasPath = _agent.hasPath;
        float remaining = _agent.remainingDistance;
        bool arrived = !_agent.pathPending && remaining <= _agent.stoppingDistance;

        if (arrived)
        {
            // 到达目标
        }

        // ---------- 速度（驱动动画）----------
        float speed01 = _agent.velocity.magnitude / _agent.speed;
        Debug.Log(hasPath + "" + speed01);

        // ---------- 采样最近的可达点（点击地面移动必备）----------
        if (Input.GetMouseButtonDown(0) && Camera.main != null)
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit, 100f))
            {
                if (NavMesh.SamplePosition(hit.point, out NavMeshHit navHit, 2f, NavMesh.AllAreas))
                {
                    _agent.SetDestination(navHit.position);
                }
            }
        }

        // ---------- 停止 / 暂停 ----------
        bool wasStopped = _agent.isStopped;
        _agent.isStopped = false;
    }

    // ---------- 寻路状态：是否有完整路径 ----------
    public bool HasCompletePath()
    {
        if (_agent.pathPending) return false;
        if (_agent.pathStatus != NavMeshPathStatus.PathComplete) return false;
        return true;
    }
}
```

> **NavMesh 使用要点**：
> 1. 场景中的地面需要标记为 @Navigation Static@（勾选 Static 后再 Bake）。
> 2. 动态障碍物用 @NavMeshObstacle@（carve 勾选可实时挖洞）。
> 3. 多区域/多类型（走道、跳跃点）用 @OffMeshLink@ 或 @NavMeshArea@ 配合代价。
> 4. 性能：@NavMeshAgent@ 数量多时开销显著，可关闭远处 Agent 的 @updatePosition@。
> 5. Unity 2023+ 的 AI Navigation 包 API 有变化（@NavMeshSurface@ 取代旧的 Navigation 窗口烘焙）。

### 8.20 网络与联机基础

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class HttpDemo : MonoBehaviour
{
    // ---------- GET ----------
    private IEnumerator GetRequest(string url)
    {
        using (UnityWebRequest req = UnityWebRequest.Get(url))
        {
            req.timeout = 10;
            yield return req.SendWebRequest();

            if (req.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("请求失败：" + req.error + " 状态码 " + req.responseCode);
                yield break;
            }

            string json = req.downloadHandler.text;
            Debug.Log(json);
        }
    }

    // ---------- POST JSON ----------
    [System.Serializable]
    private class LoginRequest
    {
        public string username;
        public string password;
    }

    [System.Serializable]
    private class LoginResponse
    {
        public string token;
        public int code;
    }

    private IEnumerator PostJson(string url, string user, string pass)
    {
        var body = new LoginRequest { username = user, password = pass };
        string json = JsonUtility.ToJson(body);
        byte[] raw = System.Text.Encoding.UTF8.GetBytes(json);

        using (UnityWebRequest req = new UnityWebRequest(url, "POST"))
        {
            req.uploadHandler = new UploadHandlerRaw(raw);
            req.downloadHandler = new DownloadHandlerBuffer();
            req.SetRequestHeader("Content-Type", "application/json");
            req.SetRequestHeader("Authorization", "Bearer YOUR_TOKEN");

            yield return req.SendWebRequest();

            if (req.result == UnityWebRequest.Result.Success)
            {
                var resp = JsonUtility.FromJson<LoginResponse>(req.downloadHandler.text);
                Debug.Log("token = " + resp.token);
            }
        }
    }

    // ---------- 下载文件并缓存 ----------
    private IEnumerator DownloadAsset(string url, string savePath)
    {
        using (UnityWebRequest req = UnityWebRequest.Get(url))
        {
            req.downloadHandler = new DownloadHandlerFile(savePath);
            yield return req.SendWebRequest();

            if (req.result == UnityWebRequest.Result.Success)
                Debug.Log("已下载到 " + savePath);
        }
    }
}
```

**联网方案选型**

| 方案 | 定位 | 说明 |
| --- | --- | --- |
| @UnityWebRequest@ | HTTP 客户端 | 自建服务器通信、下载资源 |
| Netcode for GameObjects | 官方高层网络 | 房间制、NetworkObject/NetworkVariable |
| Mirror | 社区高层网络 | 老牌、稳定、生态好 |
| Photon PUN / Fusion | 商业云服务 | 快速上线，按量计费 |
| FishNet | 开源高层网络 | 性能好、可定制 |
| Netcode for Entities | DOTS 网络 | 大规模同步场景 |

> **完整联机游戏的三大核心**：
> 1. **状态同步**（谁产生真相：服务器权威 vs 客户端预测）；
> 2. **RPC**（远程调用：@[ServerRpc]@ / @[ClientRpc]@）；
> 3. **插值与回滚**（让远端角色平滑、补偿延迟）。
> 单片游戏用 @UnityWebRequest@ + 自建服务即可，不要为了"联机"过早引入完整网络框架。

### 8.21 存档加密与数据安全

```csharp
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

public static class SecureSave
{
    // 注意：客户端密钥永远无法真正保密，这里的目标是"提高修改门槛"，不是绝对安全
    private static readonly byte[] Salt = Encoding.UTF8.GetBytes("ReplaceWithYourOwnSalt16");

    private static string SavePath =>
        Path.Combine(Application.persistentDataPath, "save.dat");

    // ---------- AES 加密 ----------
    public static void SaveEncrypted(string json, string password)
    {
        byte[] plain = Encoding.UTF8.GetBytes(json);
        using (var aes = Aes.Create())
        {
            aes.KeySize = 256;
            using (var derive = new Rfc2898DeriveBytes(password, Salt, 10000))
            {
                aes.Key = derive.GetBytes(32);
                aes.IV = derive.GetBytes(16);
            }

            using (var ms = new MemoryStream())
            {
                ms.Write(aes.IV, 0, aes.IV.Length);        // 把 IV 存到文件头
                using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(plain, 0, plain.Length);
                    cs.FlushFinalBlock();
                }
                File.WriteAllBytes(SavePath, ms.ToArray());
            }
        }
    }

    public static string LoadEncrypted(string password)
    {
        if (!File.Exists(SavePath)) return null;

        byte[] all = File.ReadAllBytes(SavePath);
        using (var aes = Aes.Create())
        {
            aes.KeySize = 256;
            using (var derive = new Rfc2898DeriveBytes(password, Salt, 10000))
            {
                aes.Key = derive.GetBytes(32);
                byte[] iv = new byte[16];
                Array.Copy(all, 0, iv, 0, 16);
                aes.IV = iv;
            }

            using (var ms = new MemoryStream(all, 16, all.Length - 16))
            using (var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read))
            using (var sr = new StreamReader(cs, Encoding.UTF8))
            {
                return sr.ReadToEnd();
            }
        }
    }

    // ---------- 校验和（防篡改，比加密更轻量）----------
    public static string ComputeChecksum(string data, string secretKey)
    {
        using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return Convert.ToBase64String(hash);
        }
    }

    public static bool VerifyChecksum(string data, string checksum, string secretKey)
    {
        string expected = ComputeChecksum(data, secretKey);
        // 固定时间比较，避免时序攻击（重要数据用）
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expected),
            Encoding.UTF8.GetBytes(checksum));
    }
}
```

> **关于安全的正确认知**：客户端代码与密钥**一定能被有心人提取**（反编译、内存抓取）。
> 所以：
> - 单机存档加密只防"随手改存档"，不防"认真破解"；
> - **真正重要的数值（充值、排名、掉落）必须由服务器校验**；
> - 本地只保存必要数据，敏感逻辑放服务端。

### 8.22 常用游戏系统代码模式

#### 第三人称相机跟随（带平滑与碰撞回退）

```csharp
using UnityEngine;

public class ThirdPersonCamera : MonoBehaviour
{
    [SerializeField] private Transform _target;
    [SerializeField] private Vector3 _offset = new Vector3(0f, 1.8f, -4f);
    [SerializeField] private float _followSmoothTime = 0.12f;
    [SerializeField] private float _rotateSpeed = 180f;
    [SerializeField] private LayerMask _collisionMask = ~0;

    private Vector3 _velocity;

    private void LateUpdate()
    {
        if (_target == null) return;

        // 1) 右键拖拽旋转（绕 Y 轴）
        if (Input.GetMouseButton(1))
        {
            float yaw = Input.GetAxis("Mouse X") * _rotateSpeed * Time.deltaTime;
            transform.RotateAround(_target.position, Vector3.up, yaw);
        }

        // 2) 计算期望位置
        Vector3 desired = _target.position + _offset;

        // 3) 相机碰撞回退（防止穿墙）
        Vector3 dir = desired - _target.position;
        float dist = dir.magnitude;
        if (Physics.SphereCast(_target.position, 0.2f, dir.normalized,
                               out RaycastHit hit, dist, _collisionMask,
                               QueryTriggerInteraction.Ignore))
        {
            desired = _target.position + dir.normalized * (hit.distance - 0.1f);
        }

        // 4) 平滑跟随（SmoothDamp 对"跟随"最自然）
        transform.position = Vector3.SmoothDamp(transform.position, desired,
                                                ref _velocity, _followSmoothTime);
        transform.LookAt(_target.position + Vector3.up * 1.5f);
    }
}
```

> **为什么放在 LateUpdate**：角色在 @Update@ 中移动完毕，相机在 @LateUpdate@ 跟随才不会抖动。
> 如果角色在 @FixedUpdate@ 中移动，相机需要做插值（@Rigidbody.interpolation = Interpolate@）来消除抖动。

#### 伤害计算管线（责任链 + 事件）

```csharp
using System;
using UnityEngine;

public class DamagePipeline
{
    // 伤害上下文：贯穿整条管线，各环节读写
    public struct Context
    {
        public GameObject Attacker;
        public GameObject Target;
        public float BaseDamage;
        public float FinalDamage;
        public bool IsCritical;
        public string DamageType;      // "physical" / "fire" / ...
        public bool Cancelled;
    }

    // 每个环节都可以修改 Context 或取消结算
    public interface IModifier
    {
        void Apply(ref Context ctx);
    }

    public class CritModifier : IModifier
    {
        private readonly float _critRate;
        private readonly float _critMultiplier;

        public CritModifier(float critRate, float critMultiplier)
        {
            _critRate = critRate;
            _critMultiplier = critMultiplier;
        }

        public void Apply(ref Context ctx)
        {
            if (UnityEngine.Random.value < _critRate)
            {
                ctx.IsCritical = true;
                ctx.FinalDamage *= _critMultiplier;
            }
        }
    }

    public class ResistanceModifier : IModifier
    {
        private readonly float _resistance01;

        public ResistanceModifier(float resistance01) => _resistance01 = resistance01;

        public void Apply(ref Context ctx)
        {
            ctx.FinalDamage *= (1f - Mathf.Clamp01(_resistance01));
        }
    }

    public class ImmunityModifier : IModifier
    {
        private readonly string _immuneType;
        public ImmunityModifier(string immuneType) => _immuneType = immuneType;

        public void Apply(ref Context ctx)
        {
            if (ctx.DamageType == _immuneType) ctx.Cancelled = true;
        }
    }

    private readonly System.Collections.Generic.List<IModifier> _modifiers =
        new System.Collections.Generic.List<IModifier>(8);

    public void Add(IModifier modifier) => _modifiers.Add(modifier);

    public Context Resolve(Context ctx)
    {
        ctx.FinalDamage = ctx.BaseDamage;

        for (int i = 0; i < _modifiers.Count; i++)
        {
            _modifiers[i].Apply(ref ctx);
            if (ctx.Cancelled) return ctx;      // 责任链可中途中断
        }
        return ctx;
    }
}
```

#### 简单的技能冷却管理

```csharp
using System.Collections.Generic;
using UnityEngine;

public class SkillCooldown
{
    private readonly Dictionary<string, float> _readyTime = new Dictionary<string, float>();

    public bool IsReady(string skillId) =>
        !_readyTime.TryGetValue(skillId, out float readyAt) || Time.time >= readyAt;

    public float RemainingRatio(string skillId, float totalCooldown)
    {
        if (!_readyTime.TryGetValue(skillId, out float readyAt)) return 0f;

        float left = readyAt - Time.time;
        if (left <= 0f) return 0f;
        return Mathf.Clamp01(left / totalCooldown);
    }

    public bool TryUse(string skillId, float cooldown)
    {
        if (!IsReady(skillId)) return false;
        _readyTime[skillId] = Time.time + cooldown;
        return true;
    }

    public void Reset(string skillId) => _readyTime.Remove(skillId);
    public void ResetAll() => _readyTime.Clear();
}
```

> **注意**：用 @Time.time@ 记录冷却意味着 **@Time.timeScale = 0@ 时冷却暂停**。
> 如果希望冷却在暂停时继续走（或按服务器时间），改用 @Time.unscaledTime@ 或服务器时间戳。
> 联机游戏**务必以服务器时间为准**，客户端只做显示预测。

#### 简单的对象状态网络同步思路

```text
客户端预测 + 服务器权威 + 回滚校正（简化版）：

1. 客户端按下移动键 → 本地立即移动（预测），并记录输入与序号
2. 把输入发给服务器
3. 服务器按同样规则模拟，广播权威状态
4. 客户端收到权威状态：
   ├─ 与本地预测一致 → 什么都不做
   └─ 与本地预测不一致 → 回滚到权威状态，重放未确认的输入
5. 其他玩家的角色用插值平滑显示（避免瞬移）
```

---

## 第 9 章 性能与内存（Unity 特有的 C# 陷阱）

### 9.1 托管堆、GC 与 Unity 的内存模型

**内存分区**

```text
┌──────────────────────────────────────────────────────────────┐
│  进程虚拟内存                                                  │
│  ┌───────────────────┐  ┌────────────────────┐  ┌──────────┐ │
│  │ Unity 原生内存      │  │ 托管堆 Managed Heap │  │ 栈 Stack  │ │
│  │ （引擎 C++ 对象）   │  │ （C# 对象 / 装箱）   │  │（值类型） │ │
│  │ 纹理/网格/音频      │  │ GC 管理             │  │ 自动回收  │ │
│  │ GameObject/Transform│  │ Boehm GC           │  │          │ │
│  └───────────────────┘  └────────────────────┘  └──────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Mono 的 GC（Boehm GC）特点**

| 特性 | 说明 |
| --- | --- |
| 类型 | 非分代、非压缩的标记-清除（mark-sweep） |
| 触发 | 托管堆增长超过阈值时自动触发 |
| 停顿 | 全停顿（Stop-The-World），时间与**存活对象数量**正相关 |
| 压缩 | 不压缩，容易产生内存碎片 |
| 堆增长 | 堆只增不减（除非调用 `GC.Collect` 且之后不再分配） |
| 增量 GC | Unity 2019.1+ 支持 Incremental GC，把一次大停顿拆成多次小停顿 |

> **IL2CPP 同样使用 Boehm GC**。所以"GC 压力大 → 明显卡顿"这条规律在 IL2CPP 上一样成立。

**Incremental GC 的配置**

```csharp
using UnityEngine;

public class GcConfigDemo : MonoBehaviour
{
    private void Start()
    {
        // ---------- 运行时控制 ----------
        // GarbageCollector.GCMode = GarbageCollector.Mode.Enabled;   // 默认
        // GarbageCollector.GCMode = GarbageCollector.Mode.Manual;    // 只手动触发
        // GarbageCollector.GCMode = GarbageCollector.Mode.Disabled;  // 完全禁用（危险）

        // 手动触发（会造成明显卡顿，谨慎使用）
        System.GC.Collect();
    }

    // ---------- Player Settings 相关选项 ----------
    // Edit → Project Settings → Player → Other Settings
    //   Use Incremental GC          启用增量 GC（推荐开启）
    //   Incremental GC Time Slice   每次增量切片的时间上限（默认约 3ms）
}
```

> **关键指标**：Profiler 的 `GC Alloc` 列。理想状态是**所有 Update 相关代码每帧 0 B 分配**。
> 哪怕每帧只有 1KB，60 帧/秒 × 3600 秒 = 216MB/小时的垃圾，必然产生周期性卡顿。

### 9.2 每帧 GC 分配的常见来源（必背清单）

| 来源 | 典型代码 | 解决方案 |
| --- | --- | --- |
| 字符串拼接 | `"HP" + hp`、`$"..."` | StringBuilder / TMP SetText / 缓存 |
| 装箱 | 值类型转 object、非泛型集合 | 泛型集合、避免 object 参数 |
| 数组分配 | `Physics.RaycastAll`、`GetComponents<T>()` | `RaycastNonAlloc`、`GetComponents<T>(List<T>)` 重载 |
| 闭包 / Lambda | `list.Sort((a,b) => ...)`（捕获变量时） | 缓存静态比较器、static lambda |
| LINQ | `list.Where(...).ToList()` | 手写循环 |
| 迭代器（yield） | 每次 foreach 一个 IEnumerable | 直接遍历具体集合 |
| params 数组 | `Debug.LogFormat(a,b,c)` | 预格式化或条件编译 |
| 反射 | `method.Invoke()` | 缓存委托 |
| 协程对象 | 每次 `new WaitForSeconds(1f)` | 缓存 WaitForSeconds |
| 枚举转字符串 | `Enum.ToString()` | 缓存字符串 |
| 字符串标签比较 | `go.tag == "Player"` | `go.CompareTag("Player")` |
| Camera.main | 每帧访问 | 缓存到字段 |
| 大量 struct 创建 | 高频构造 Vector3 集合 | 对象池 / NativeArray |
| string.Format | 每帧调用 | 缓存 / ZString |
| GetComponentsInChildren | 每帧调用 | 缓存结果，事件驱动更新 |

**用 Profiler 定位 GC 来源**

```text
Window → Analysis → Profiler
  ├─ CPU Usage 模块
  │    ├─ 选中某一帧，查看 GC.Alloc 列
  │    ├─ 展开 Hierarchy 定位到具体方法
  │    └─ 右键 → Show Related Objects
  └─ Memory 模块
       ├─ Detailed → 查看托管堆快照
       └─ Compare Snapshots（两次快照对比，找内存泄漏）
```

> **Deep Profile 的开销极大**（可能让帧率降 10 倍以上），只在排查问题时短时间开启。
> 更好的做法是用 `ProfilerMarker` API 手动标记关键代码段。

```csharp
using Unity.Profiling;
using UnityEngine;

public class ProfilerMarkerDemo : MonoBehaviour
{
    // 静态只读，避免每次创建（创建 Marker 本身有开销）
    private static readonly ProfilerMarker s_UpdateMarker = new ProfilerMarker("MySystem.Update");
    private static readonly ProfilerMarker s_AiMarker = new ProfilerMarker("MySystem.AI");

    private void Update()
    {
        using (s_UpdateMarker.Auto())        // using 作用域 = 采样区间
        {
            UpdateMovement();
        }

        using (s_AiMarker.Auto())
        {
            UpdateAI();
        }
    }

    private void UpdateMovement() { }
    private void UpdateAI() { }
}
```

### 9.3 性能优化实战模式

#### 模式 1：缓存组件与查找结果

```csharp
using System.Collections.Generic;
using UnityEngine;

// ---------- 反例：每帧做昂贵查找 ----------
public class BadPerf : MonoBehaviour
{
    private void Update()
    {
        var rb = GetComponent<Rigidbody>();                                 // 每帧查找组件
        var cam = Camera.main;                                              // 每帧 FindGameObjectWithTag
        GameObject player = GameObject.Find("Player");                      // 每帧遍历整个场景
        GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");  // 每帧分配数组！
        for (int i = 0; i < enemies.Length; i++) { }

        Debug.Log(rb.ToString() + cam.ToString() + player.ToString());
    }
}

// ---------- 正例：Awake 缓存 + 事件驱动维护列表 ----------
public class GoodPerf : MonoBehaviour
{
    private Rigidbody _rb;
    private Camera _cam;
    private Transform _player;
    private readonly List<GameObject> _enemies = new List<GameObject>(64);

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();
        _cam = Camera.main;                       // 只查一次
        GameObject go = GameObject.Find("Player");
        _player = go != null ? go.transform : null;
    }

    private void Update()
    {
        if (_player == null) return;
        transform.LookAt(_player.position);

        // 遍历已维护好的列表，零查找零分配
        for (int i = 0; i < _enemies.Count; i++)
        {
            if (_enemies[i] == null) continue;
        }
    }

    // 由生成器 / 对象池在创建销毁时调用，而不是每帧查找
    public void RegisterEnemy(GameObject go) { if (!_enemies.Contains(go)) _enemies.Add(go); }
    public void UnregisterEnemy(GameObject go) { _enemies.Remove(go); }
}
```

#### 模式 2：集中式 Update 管理（数百个以上对象时）

```csharp
using System.Collections.Generic;
using UnityEngine;

public interface ITickable
{
    void Tick(float deltaTime);
}

public class TickManager : MonoBehaviour
{
    private static TickManager _instance;

    public static TickManager Instance
    {
        get
        {
            if (_instance == null)
            {
                var go = new GameObject("[TickManager]");
                _instance = go.AddComponent<TickManager>();
                DontDestroyOnLoad(go);
            }
            return _instance;
        }
    }

    private readonly List<ITickable> _tickables = new List<ITickable>(1024);
    private readonly List<ITickable> _pendingAdd = new List<ITickable>(64);
    private readonly List<ITickable> _pendingRemove = new List<ITickable>(64);

    public void Register(ITickable t)
    {
        if (t != null) _pendingAdd.Add(t);       // 延迟到帧末，避免遍历中修改集合
    }

    public void Unregister(ITickable t)
    {
        if (t != null) _pendingRemove.Add(t);
    }

    private void Update()
    {
        if (_pendingAdd.Count > 0) { _tickables.AddRange(_pendingAdd); _pendingAdd.Clear(); }
        if (_pendingRemove.Count > 0)
        {
            for (int i = 0; i < _pendingRemove.Count; i++) _tickables.Remove(_pendingRemove[i]);
            _pendingRemove.Clear();
        }

        float dt = Time.deltaTime;
        for (int i = _tickables.Count - 1; i >= 0; i--)
        {
            _tickables[i].Tick(dt);
        }
    }
}
```

> **说明**：MonoBehaviour 的 Update 是托管 → 原生的跨界调用，每个对象每帧都有成本。
> 数量在几百以内基本无感，上千个就需要考虑集中式管理。
> **重要**：先 Profile 再优化。绝大多数项目的性能瓶颈并不在 Update 数量上。

#### 模式 3：消除字符串与装箱分配

```csharp
using System.Text;
using TMPro;
using UnityEngine;

public class NoStringAlloc : MonoBehaviour
{
    [SerializeField] private TMP_Text _hpLabel;
    [SerializeField] private TMP_Text _scoreLabel;

    private int _hp = 100;
    private int _score;
    private readonly StringBuilder _sb = new StringBuilder(64);

    // ---------- 每帧都分配字符串 ----------
    private void BadUpdate()
    {
        _hpLabel.text = "HP: " + _hp;
        _scoreLabel.text = string.Format("Score: {0}", _score);
    }

    // ---------- TextMeshPro 的零分配重载 ----------
    private void GoodUpdate()
    {
        _hpLabel.SetText("HP: {0}", _hp);
        _scoreLabel.SetText("Score: {0}", _score);
    }

    // ---------- 纯 C# 用 StringBuilder ----------
    public string BuildStatus(int level, int exp)
    {
        _sb.Clear();
        _sb.Append("Lv.").Append(level).Append(" EXP ").Append(exp);
        return _sb.ToString();     // ToString 必然分配一次，无法避免
    }

    // ---------- 数字字符串缓存（UI 高频显示）----------
    private static readonly string[] s_SmallNumbers = BuildNumberCache(1000);

    private static string[] BuildNumberCache(int max)
    {
        var arr = new string[max];
        for (int i = 0; i < max; i++) arr[i] = i.ToString();
        return arr;
    }

    public string FastNumber(int value)
    {
        if (value >= 0 && value < s_SmallNumbers.Length) return s_SmallNumbers[value];
        return value.ToString();
    }
}
```

#### 模式 4：结构体数组与缓存友好（Data-Oriented 思维）

```csharp
using UnityEngine;

// ---------- 引用类型数组：数据分散在堆上，缓存命中率低 ----------
public class UnitClass
{
    public Vector3 Position;
    public float Hp;
    public float Speed;
}

// ---------- 结构体数组：内存连续，遍历快得多 ----------
public struct UnitData
{
    public Vector3 Position;
    public float Hp;
    public float Speed;
}

public class UnitSystem : MonoBehaviour
{
    private UnitData[] _units = new UnitData[10000];

    private void Update()
    {
        float dt = Time.deltaTime;

        // 顺序遍历连续内存，CPU 预取器友好
        for (int i = 0; i < _units.Length; i++)
        {
            // 数组索引是变量，可以直接就地修改
            _units[i].Position += Vector3.forward * (_units[i].Speed * dt);
        }
    }
}
```

**List 中 struct 元素的修改陷阱**

```csharp
using System.Collections.Generic;
using UnityEngine;

public class ListStructTrap : MonoBehaviour
{
    private readonly List<UnitData> _units = new List<UnitData>();

    private void Update()
    {
        // 编译错误 CS1612：List 的索引器返回的是副本，不是变量
        // _units[0].Position += Vector3.one;

        // 正确做法：取出 → 修改 → 写回
        UnitData u = _units[0];
        u.Hp -= 10f;
        _units[0] = u;
    }
}
```

> 这是 `T[]` 与 `List<T>` 的关键差异：**数组索引是变量，List 索引器是方法返回的副本**。
> 高频修改的 struct 集合优先用数组。

---


#### 模式 5：避免每帧调用 GetComponentsInChildren

```csharp
using System.Collections.Generic;
using UnityEngine;

public class HitBoxManager : MonoBehaviour
{
    private readonly List<Collider> _hitBoxes = new List<Collider>(32);

    private void Awake()
    {
        // 只在初始化时收集一次
        Collider[] all = GetComponentsInChildren<Collider>(includeInactive: true);
        for (int i = 0; i < all.Length; i++) _hitBoxes.Add(all[i]);
    }

    public void SetHitBoxesEnabled(bool value)
    {
        for (int i = 0; i < _hitBoxes.Count; i++)
        {
            if (_hitBoxes[i] != null) _hitBoxes[i].enabled = value;
        }
    }
}
```

### 9.4 对象池（Unity 内置）

```csharp
using UnityEngine;
using UnityEngine.Pool;    // Unity 2021.1+

public class BuiltinPoolDemo : MonoBehaviour
{
    [SerializeField] private GameObject _bulletPrefab;

    private ObjectPool<GameObject> _pool;

    private void Awake()
    {
        _pool = new ObjectPool<GameObject>(
            createFunc: () => Instantiate(_bulletPrefab),
            actionOnGet: go => go.SetActive(true),
            actionOnRelease: go => go.SetActive(false),
            actionOnDestroy: go => Destroy(go),
            collectionCheck: true,        // 开发期检测"重复归还"，发布版可设 false
            defaultCapacity: 32,
            maxSize: 256);
    }

    public GameObject Spawn(Vector3 position)
    {
        GameObject go = _pool.Get();
        go.transform.position = position;
        return go;
    }

    public void Despawn(GameObject go) => _pool.Release(go);

    private void OnDestroy() => _pool.Dispose();
}
```

> `UnityEngine.Pool.ObjectPool<T>` 需要 **Unity 2021.1+**。更低版本用第 7.4 节的自建实现。
> **注意**：对象池不是银弹。它适合"高频创建销毁的同类对象"（子弹、特效、飘字），
> 对"低频且生命周期长的对象"（关卡道具）反而增加常驻内存。

### 9.5 Job System、Burst 与 DOTS（高级）

```csharp
using Unity.Burst;
using Unity.Collections;
using Unity.Jobs;
using UnityEngine;

// ---------- 单线程 Job ----------
[BurstCompile]
public struct AddJob : IJob
{
    public NativeArray<float> Data;
    public float Value;

    public void Execute()
    {
        for (int i = 0; i < Data.Length; i++) Data[i] += Value;
    }
}

// ---------- 并行 Job ----------
[BurstCompile]
public struct ParallelAddJob : IJobParallelFor
{
    public NativeArray<float> Data;
    public float Value;

    public void Execute(int index)
    {
        Data[index] += Value;
    }
}

public class JobDemo : MonoBehaviour
{
    private NativeArray<float> _data;
    private JobHandle _handle;

    private void Start()
    {
        _data = new NativeArray<float>(4096, Allocator.Persistent);
    }

    private void Update()
    {
        // 先等待上一帧的 Job 完成（可以放得更晚，让主线程先干别的活）
        _handle.Complete();

        var job = new ParallelAddJob
        {
            Data = _data,
            Value = 0.1f
        };

        // Schedule(数组长度, 每批元素数)；batchCount 通常取 32~64
        _handle = job.Schedule(_data.Length, 64);

        // 也可以建立依赖链：_handle = job.Schedule(dependencyHandle)
    }

    private void LateUpdate()
    {
        _handle.Complete();      // 使用数据前必须 Complete
    }

    private void OnDestroy()
    {
        _handle.Complete();      // 先确保 Job 结束
        if (_data.IsCreated) _data.Dispose();
    }
}
```

**Job System 的硬性约束**

| 约束 | 说明 |
| --- | --- |
| Job 内不能访问托管对象 | 不能 new 类、不能碰 GameObject、不能 Debug.Log、不能 try/catch |
| 只能用 NativeContainer | NativeArray / NativeList / NativeHashMap / NativeQueue 等 |
| Burst 只支持有限 API | 尽量用 Unity.Mathematics（float3、math.sin 等） |
| 必须配平 Dispose | 否则 Editor 报 "Native Collection has not been disposed" |
| Schedule 后要有依赖或 Complete | 否则产生竞态与数据错误 |
| 不能跨 Job 持有引用 | 数据传递只能通过 NativeContainer |

> **Burst 的收益**：SIMD 向量化 + 去除边界检查，纯数学运算通常快 5~20 倍。
> **Job System 的收益**：把计算分散到多核（移动端一般能用到 2~4 核）。

**DOTS / ECS 概念**

```text
传统 GameObject 模式：
    数据（字段）+ 行为（MonoBehaviour）混在一起，对象分散在堆上

DOTS / ECS 模式：
    Entity    —— 只是一个 ID（不是对象）
    Component —— 纯数据 struct（IComponentData），连续存储在 Chunk 中
    System    —— 批量处理某类 Component 的逻辑（无实例状态）
```

```csharp
// ECS 示例（需要 com.unity.entities 包，API 随版本变化较大）
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

// 纯数据组件
public struct MoveSpeed : IComponentData
{
    public float Value;
}

// 系统：批量处理所有带 MoveSpeed 的实体
public partial struct MoveSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        float dt = SystemAPI.Time.DeltaTime;

        foreach (var (transform, speed) in
                 SystemAPI.Query<RefRW<LocalTransform>, RefRO<MoveSpeed>>())
        {
            transform.ValueRW.Position += new float3(0f, 0f, speed.ValueRO.Value * dt);
        }
    }
}
```

> **是否要学 DOTS？** 建议顺序：先把传统 GameObject + C# 优化做扎实（绝大多数项目够用），
> 需要"同屏几万单位"时再学。DOTS 学习曲线陡峭，API 仍在演进，且与大量现有插件不兼容。

### 9.6 平台与运行时差异速查

| 项目 | 说明 |
| --- | --- |
| Mono | 有 JIT，启动快、包体小；支持 Reflection.Emit |
| IL2CPP | AOT 编译为 C++，运行更快；泛型反射、动态代码生成受限 |
| AOT 平台 | iOS、WebGL、大部分主机（禁止 JIT） |
| JIT 平台 | Windows、macOS、Linux、Android（Mono 后端） |
| 值类型泛型与 AOT | 未在代码中显式实例化过的泛型可能缺失，需 dummy 引用或 link.xml |
| WebGL | 默认无多线程；文件 IO 受限；必须用 UnityWebRequest 访问 StreamingAssets |
| iOS | 必须 IL2CPP；Reflection.Emit 不可用；JIT 禁用 |
| Android | 发布建议 IL2CPP；ARM64 必须 IL2CPP；StreamingAssets 在 APK 内 |

---

## 第 10 章 架构与设计模式

### 10.1 单例

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour
{
    private static GameManager _instance;

    public static GameManager Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = FindFirstObjectByType<GameManager>();
                if (_instance == null)
                {
                    var go = new GameObject("[GameManager]");
                    _instance = go.AddComponent<GameManager>();
                    DontDestroyOnLoad(go);
                }
            }
            return _instance;
        }
    }

    private void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(gameObject);

        Initialize();
    }

    private void OnDestroy()
    {
        if (_instance == this) _instance = null;   // 必须手动清理，否则留下"假 null"
    }

    private void Initialize() { }
}
```

> **API 版本提醒**：`FindFirstObjectByType<T>()` / `FindAnyObjectByType<T>()` 是 **Unity 2023.1+** 的新 API；
> 低版本用 `FindObjectOfType<T>()`（2023.1 起被标记过时但仍可用）。
> 生产项目更好的做法是**不要用 Find**，直接在 Inspector 里拖引用或用启动场景注入。

**静态类版本（不需要挂载）**

```csharp
using UnityEngine;

// 适合"无状态工具"，不适合需要 Update 的管理器
public static class SaveSystem
{
    private const string FileName = "save.json";
    private static string SavePath => System.IO.Path.Combine(Application.persistentDataPath, FileName);

    public static void Save(SaveData data)
    {
        System.IO.File.WriteAllText(SavePath, JsonUtility.ToJson(data, true));
    }

    public static SaveData Load()
    {
        if (!System.IO.File.Exists(SavePath)) return new SaveData();
        return JsonUtility.FromJson<SaveData>(System.IO.File.ReadAllText(SavePath));
    }
}

[System.Serializable]
public class SaveData
{
    public int Level;
    public string PlayerName;
}
```

### 10.2 观察者模式 / 事件总线

```csharp
using System;
using System.Collections.Generic;

// ---------- 类型安全的全局事件总线 ----------
public static class EventBus
{
    private static readonly Dictionary<Type, List<Delegate>> s_Handlers =
        new Dictionary<Type, List<Delegate>>();

    public static void Subscribe<T>(Action<T> handler) where T : struct
    {
        Type key = typeof(T);
        if (!s_Handlers.TryGetValue(key, out List<Delegate> list))
        {
            list = new List<Delegate>(4);
            s_Handlers[key] = list;
        }
        list.Add(handler);
    }

    public static void Unsubscribe<T>(Action<T> handler) where T : struct
    {
        if (s_Handlers.TryGetValue(typeof(T), out List<Delegate> list)) list.Remove(handler);
    }

    public static void Publish<T>(T evt) where T : struct
    {
        if (!s_Handlers.TryGetValue(typeof(T), out List<Delegate> list)) return;

        // 反向遍历，支持处理器内部取消订阅
        for (int i = list.Count - 1; i >= 0; i--)
        {
            if (list[i] is Action<T> action) action.Invoke(evt);
        }
    }

    public static void Clear() => s_Handlers.Clear();
}

// ---------- 事件定义（用 struct，避免 GC）----------
public struct PlayerDamagedEvent
{
    public int PlayerId;
    public float Amount;
    public UnityEngine.Vector3 HitPoint;
}

// ---------- 订阅方 ----------
public class DamageNumberSpawner : UnityEngine.MonoBehaviour
{
    private void OnEnable() => EventBus.Subscribe<PlayerDamagedEvent>(OnDamaged);
    private void OnDisable() => EventBus.Unsubscribe<PlayerDamagedEvent>(OnDamaged);

    private void OnDamaged(PlayerDamagedEvent e)
    {
        // 在 e.HitPoint 位置生成飘字
    }
}

// ---------- 发布方 ----------
public class Player : UnityEngine.MonoBehaviour
{
    public void TakeDamage(float dmg, UnityEngine.Vector3 point)
    {
        EventBus.Publish(new PlayerDamagedEvent
        {
            PlayerId = gameObject.GetInstanceID(),
            Amount = dmg,
            HitPoint = point
        });
    }
}
```

> **静态事件总线的三个坑**：
> 1. 关闭 Domain Reload 时静态字典不会自动清理，必须显式重置；
> 2. 订阅必须成对取消，否则监听器泄漏；
> 3. 过度使用会让调用链难以追踪——**模块内部优先用直接引用，跨模块才用总线**。

```csharp
// 解决"关闭 Domain Reload 后静态状态残留"
public static class EventBusInitializer
{
    [UnityEngine.RuntimeInitializeOnLoadMethod(
        UnityEngine.RuntimeInitializeLoadType.SubsystemRegistration)]
    private static void ResetStatics()
    {
        EventBus.Clear();
    }
}
```

### 10.3 状态机

**枚举 + switch（最简单）**

```csharp
using UnityEngine;

public class SimpleStateMachine : MonoBehaviour
{
    private enum State { Idle, Chase, Attack, Dead }

    private State _state = State.Idle;
    private Transform _target;

    private void Update()
    {
        switch (_state)
        {
            case State.Idle:
                if (_target != null) TransitionTo(State.Chase);
                break;

            case State.Chase:
                if (_target == null) TransitionTo(State.Idle);
                else if (Vector3.Distance(transform.position, _target.position) < 2f)
                    TransitionTo(State.Attack);
                else
                    transform.position = Vector3.MoveTowards(
                        transform.position, _target.position, 3f * Time.deltaTime);
                break;

            case State.Attack:
                Debug.Log("攻击！");
                break;

            case State.Dead:
                break;
        }
    }

    private void TransitionTo(State next)
    {
        OnExit(_state);
        _state = next;
        OnEnter(next);
    }

    private void OnEnter(State s) { }
    private void OnExit(State s) { }
}
```

> 适合状态少（≤5 个）、逻辑简单的场景。状态一多，switch 会膨胀成几百行，难以维护。

**类状态机（可扩展，推荐中大型项目）**

```csharp
using UnityEngine;

public interface IState
{
    void OnEnter();
    void OnUpdate(float dt);
    void OnExit();
}

public class StateMachine
{
    public IState Current { get; private set; }

    public void ChangeState(IState next)
    {
        if (next == null || next == Current) return;
        Current?.OnExit();
        Current = next;
        Current.OnEnter();
    }

    public void Tick(float dt) => Current?.OnUpdate(dt);
}

// ---------- 具体状态 ----------
public class IdleState : IState
{
    private readonly Transform _self;
    private readonly Transform _target;
    private readonly StateMachine _fsm;
    private readonly IState _chase;

    public IdleState(Transform self, Transform target, StateMachine fsm, IState chase)
    {
        _self = self; _target = target; _fsm = fsm; _chase = chase;
    }

    public void OnEnter() { }
    public void OnUpdate(float dt)
    {
        if (_target != null) _fsm.ChangeState(_chase);   // 复用已创建的状态实例，零 GC
    }
    public void OnExit() { }
}

public class ChaseState : IState
{
    private readonly Transform _self;
    private readonly Transform _target;
    private readonly StateMachine _fsm;
    private IState _idle;
    private const float Speed = 3f;

    public ChaseState(Transform self, Transform target, StateMachine fsm, IState idle)
    {
        _self = self; _target = target; _fsm = fsm; _idle = idle;
    }

    // 用于回填 idle 引用，避免两个状态互相构造的死循环
    public void SetIdle(IState idle) => _idle = idle;

    public void OnEnter() { }
    public void OnUpdate(float dt)
    {
        if (_target == null) { _fsm.ChangeState(_idle); return; }
        _self.position = Vector3.MoveTowards(_self.position, _target.position, Speed * dt);
    }
    public void OnExit() { }
}

public class FsmUser : MonoBehaviour
{
    [SerializeField] private Transform _target;
    private StateMachine _fsm;

    private void Start()
    {
        _fsm = new StateMachine();

        // 预先创建状态实例并互相引用，切换时零分配
        // 1) 先建 chase（它的 idle 引用稍后回填）
        var chase = new ChaseState(transform, _target, _fsm, null);
        // 2) 再建 idle，把 chase 传进去
        var idle = new IdleState(transform, _target, _fsm, chase);
        // 3) 回填 chase 的 idle 引用（避免循环构造）
        chase.SetIdle(idle);

        _fsm.ChangeState(idle);
    }

    private void Update() => _fsm.Tick(Time.deltaTime);
}
```

> **性能提示**：状态切换时 `new` 一个 State 对象会产生 GC。生产代码应**预创建状态实例**并互相引用。

### 10.4 命令模式（撤销 / 回放）

```csharp
using System.Collections.Generic;
using UnityEngine;

public interface ICommand
{
    void Execute();
    void Undo();
}

public class MoveCommand : ICommand
{
    private readonly Transform _target;
    private readonly Vector3 _offset;
    private Vector3 _previous;

    public MoveCommand(Transform target, Vector3 offset)
    {
        _target = target;
        _offset = offset;
    }

    public void Execute()
    {
        _previous = _target.position;
        _target.position += _offset;
    }

    public void Undo() => _target.position = _previous;
}

public class CommandInvoker
{
    private readonly Stack<ICommand> _history = new Stack<ICommand>();

    public void Execute(ICommand cmd)
    {
        cmd.Execute();
        _history.Push(cmd);
    }

    public void Undo()
    {
        if (_history.Count == 0) return;
        _history.Pop().Undo();
    }
}

public class CommandDemo : MonoBehaviour
{
    private readonly CommandInvoker _invoker = new CommandInvoker();

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.RightArrow))
            _invoker.Execute(new MoveCommand(transform, Vector3.right));

        if (Input.GetKeyDown(KeyCode.Z))
            _invoker.Undo();
    }
}
```

> 用途：回合制战棋的移动撤销、录像回放、网络同步（发送命令而不是状态）。

### 10.5 策略模式

```csharp
using UnityEngine;

public interface IDamageStrategy
{
    float Calculate(float baseDamage, float defense);
}

public class LinearDamage : IDamageStrategy
{
    public float Calculate(float baseDamage, float defense) => Mathf.Max(0f, baseDamage - defense);
}

public class PercentageDamage : IDamageStrategy
{
    public float Calculate(float baseDamage, float defense) => baseDamage * (1f - defense / (defense + 100f));
}

public class TrueDamage : IDamageStrategy
{
    public float Calculate(float baseDamage, float defense) => baseDamage;
}

public class DamageCalculator : MonoBehaviour
{
    private IDamageStrategy _strategy = new LinearDamage();

    public void SetStrategy(IDamageStrategy strategy) => _strategy = strategy;
    public float Compute(float baseDamage, float defense) => _strategy.Calculate(baseDamage, defense);
}
```

> **Unity 变体**：把策略做成 `ScriptableObject`，就能在 Inspector 里为每个敌人配置不同的伤害公式，
> 策划无需改代码。

### 10.6 组合模式（UI 树 / 技能树）

```csharp
using System.Collections.Generic;
using UnityEngine;

public abstract class MenuNode
{
    public string Name;
    protected MenuNode(string name) => Name = name;

    public virtual void Render(int depth) { }
    public virtual void Add(MenuNode node) { }
    public virtual void Remove(MenuNode node) { }
}

public class MenuItem : MenuNode
{
    public MenuItem(string name) : base(name) { }

    public override void Render(int depth) => Debug.Log(new string('-', depth * 2) + Name);
}

public class MenuCategory : MenuNode
{
    private readonly List<MenuNode> _children = new List<MenuNode>();

    public MenuCategory(string name) : base(name) { }

    public override void Add(MenuNode node) => _children.Add(node);
    public override void Remove(MenuNode node) => _children.Remove(node);

    public override void Render(int depth)
    {
        Debug.Log(new string('-', depth * 2) + "[" + Name + "]");
        for (int i = 0; i < _children.Count; i++) _children[i].Render(depth + 1);
    }
}
```

### 10.7 MVC / MVP 在 Unity 中的落地

```text
MVC：
  Model（数据 + 业务） ── Controller（输入处理） ── View（显示）
  问题：View 往往直接读 Model，耦合仍然存在

MVP：（Unity 中最常用）
  View 只暴露接口，Presenter 持有 View 接口 + Model，View 完全不认识 Model
  优点：Presenter 和 Model 是纯 C#，可脱离 Unity 单元测试

MVVM：
  ViewModel 通过数据绑定自动更新 View（UI Toolkit / WPF 支持得更好）
  UGUI 需要自己实现绑定层或用插件
```

```csharp
using System;
using UnityEngine;
using UnityEngine.UI;

// ---------- Model：纯数据与业务规则，不引用 Unity UI ----------
public class InventoryModel
{
    private int _itemCount;
    public int ItemCount => _itemCount;
    public event Action<int> ItemCountChanged;

    public void AddItem(int amount)
    {
        if (amount <= 0) return;
        _itemCount += amount;
        ItemCountChanged?.Invoke(_itemCount);
    }
}

// ---------- View 接口：只声明"能显示什么" ----------
public interface IInventoryView
{
    event Action AddClicked;
    void SetCount(int count);
}

// ---------- View 实现：只负责显示与转发输入 ----------
public class InventoryView : MonoBehaviour, IInventoryView
{
    [SerializeField] private Button _addButton;
    [SerializeField] private Text _countLabel;

    public event Action AddClicked;

    private void Awake()
    {
        _addButton.onClick.AddListener(HandleClick);
    }

    private void OnDestroy()
    {
        // 成对移除（虽然是同一个生命周期，但保持习惯）
        _addButton.onClick.RemoveListener(HandleClick);
    }

    private void HandleClick() => AddClicked?.Invoke();

    public void SetCount(int count) => _countLabel.text = "数量：" + count;
}

// ---------- Presenter：连接 Model 与 View ----------
public class InventoryPresenter : MonoBehaviour
{
    [SerializeField] private InventoryView _view;

    private readonly InventoryModel _model = new InventoryModel();

    private void Start()
    {
        _model.ItemCountChanged += _view.SetCount;
        _view.AddClicked += HandleAddClicked;
        _view.SetCount(_model.ItemCount);      // 初始化显示
    }

    private void OnDestroy()
    {
        _model.ItemCountChanged -= _view.SetCount;
        _view.AddClicked -= HandleAddClicked;
    }

    private void HandleAddClicked() => _model.AddItem(1);
}
```

### 10.8 依赖注入与服务定位

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

// ---------- 简易服务定位器 ----------
public static class ServiceLocator
{
    private static readonly Dictionary<Type, object> s_Services = new Dictionary<Type, object>();

    public static void Register<T>(T service) where T : class => s_Services[typeof(T)] = service;

    public static T Get<T>() where T : class
    {
        if (s_Services.TryGetValue(typeof(T), out object svc)) return (T)svc;
        throw new InvalidOperationException("未注册服务：" + typeof(T).Name);
    }

    public static bool TryGet<T>(out T service) where T : class
    {
        if (s_Services.TryGetValue(typeof(T), out object svc)) { service = (T)svc; return true; }
        service = null;
        return false;
    }

    public static void Clear() => s_Services.Clear();
}

// ---------- 服务契约与实现 ----------
public interface IAudioService
{
    void PlaySfx(string id);
}

public class AudioService : IAudioService
{
    public void PlaySfx(string id) { /* 播放音效 */ }
}

// ---------- 消费者只依赖接口 ----------
public class PlayerController : MonoBehaviour
{
    private IAudioService _audio;

    private void Awake() => _audio = ServiceLocator.Get<IAudioService>();

    public void Jump() => _audio.PlaySfx("jump");
}

// ---------- 启动时注册 ----------
public class Bootstrap : MonoBehaviour
{
    private void Awake() => ServiceLocator.Register<IAudioService>(new AudioService());
    private void OnDestroy() => ServiceLocator.Clear();
}
```

> 服务定位器提供的是**隐式依赖**，滥用会导致调用链难追踪。更严谨的方案是用
> **VContainer / Zenject（Extenject）** 等 DI 框架，支持构造函数注入与生命周期作用域。
> 小型项目直接用 `[SerializeField]` 在 Inspector 拖引用往往是最简单可靠的方案。

### 10.9 设计模式速查（游戏场景）

| 模式 | 游戏场景 | 关键点 |
| --- | --- | --- |
| 单例 | GameManager、AudioManager | 注意"假 null"与静态状态残留 |
| 观察者 / 事件总线 | 成就系统、UI 刷新 | 必须成对取消订阅 |
| 状态机 | 角色 AI、UI 流程、Boss 阶段 | 类状态机比 switch 更易扩展 |
| 命令 | 撤销、录像回放、网络同步 | 需要 Undo 时存好历史 |
| 策略 | 伤害公式、寻路算法、AI 难度 | 可用 ScriptableObject 配置 |
| 组合 | UI 树、技能树、场景图 | 统一处理"单个"和"组合" |
| 装饰器 | 装备/词条加成（攻速 +20%） | 递归包装基类 |
| 工厂 | 怪物生成、道具创建 | 配合配置表 |
| 享元 | 大量相同数据（子弹类型、材质参数） | 用 ScriptableObject 共享 |
| 原型 | 预制体、Instantiate | 注意深拷贝 vs 浅拷贝 |
| 责任链 | 伤害计算管线、输入处理链 | 中途可中断 |
| 对象池 | 子弹、特效、飘字 | 注意对象状态重置 |
| 中介者 | 多系统通信（UI ↔ 战斗 ↔ 音频） | 避免形成上帝对象 |
| 外观 | 把复杂子系统包装成简单接口 | 降低模块间耦合 |
| 组件 | Unity 的核心思想 | 组合优于继承 |

---

## 第 11 章 工程化：测试、调试、构建

### 11.1 程序集定义（Assembly Definition）

**为什么要用 asmdef**

| 收益 | 说明 |
| --- | --- |
| 增量编译 | 只重编译改动的程序集，大幅缩短编译时间 |
| 依赖管理 | 强制显式声明引用，禁止循环依赖 |
| 平台隔离 | 编辑器代码不会被打进包体 |
| 代码可复用 | 可以把纯逻辑程序集单独复用到其他项目 |

**目录结构建议**

```text
Assets/
  Scripts/
    Runtime/
      Game.Core.asmdef          （纯逻辑，无 Unity 依赖，可单测）
      Game.Gameplay.asmdef      （引用 Core）
      Game.UI.asmdef            （引用 Core，不引用 Gameplay）
      Game.Bootstrap.asmdef     （引用以上全部，负责组装）
    Editor/
      Game.Editor.asmdef        （includePlatforms: [Editor]，引用 Runtime）
    Tests/
      EditMode/
        Game.Tests.EditMode.asmdef   （引用 TestAssemblies）
      PlayMode/
        Game.Tests.PlayMode.asmdef
```

**asmdef 文件的 JSON 格式**

```json
{
    "name": "Game.Gameplay",
    "rootNamespace": "Game.Gameplay",
    "references": [
        "Game.Core",
        "Unity.TextMeshPro"
    ],
    "includePlatforms": [],
    "excludePlatforms": [],
    "allowUnsafeCode": false,
    "overrideReferences": false,
    "precompiledReferences": [],
    "autoReferenced": true,
    "defineConstraints": [],
    "versionDefines": [
        {
            "name": "com.unity.inputsystem",
            "expression": "1.0.0",
            "define": "USE_NEW_INPUT"
        }
    ],
    "noEngineReferences": false
}
```

> `versionDefines` 能让代码根据包的版本启用不同的 `#if` 分支，非常实用。
> `noEngineReferences: true` 用于纯 C# 程序集（不能引用 UnityEngine，方便单测与复用）。

### 11.2 单元测试（Unity Test Framework）

**EditMode 测试（纯逻辑，快）**

```csharp
using NUnit.Framework;

// 被测的纯逻辑类（不继承 MonoBehaviour）
public class DamageCalculator
{
    public int Compute(int attack, int defense)
    {
        return System.Math.Max(1, attack - defense);
    }

    public float Clamp01(float value)
    {
        if (value < 0f) return 0f;
        if (value > 1f) return 1f;
        return value;
    }
}

[TestFixture]
public class DamageCalculatorTests
{
    private DamageCalculator _calc;

    [SetUp]                      // 每个测试前执行
    public void SetUp()
    {
        _calc = new DamageCalculator();
    }

    [TearDown]                   // 每个测试后执行
    public void TearDown()
    {
        _calc = null;
    }

    [Test]
    public void Compute_NormalCase_ReturnsDifference()
    {
        Assert.AreEqual(30, _calc.Compute(50, 20));
    }

    [Test]
    public void Compute_DefenseHigherThanAttack_ReturnsOne()
    {
        Assert.AreEqual(1, _calc.Compute(10, 999));
    }

    [TestCase(0f, 0f)]
    [TestCase(1f, 1f)]
    [TestCase(2f, 1f)]
    [TestCase(-1f, 0f)]
    public void Clamp01_ReturnsClampedValue(float input, float expected)
    {
        Assert.AreEqual(expected, _calc.Clamp01(input));
    }

    [Test]
    public void Compute_WhenCalled_DoesNotThrow()
    {
        Assert.DoesNotThrow(() => _calc.Compute(1, 1));
    }
}
```

**PlayMode 测试（涉及 MonoBehaviour 与帧循环）**

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class PlayerHealthPlayModeTests
{
    [UnityTest]
    public IEnumerator TakeDamage_ReducesHp()
    {
        // 创建对象
        var go = new GameObject("Player");
        var health = go.AddComponent<PlayerHealth>();

        yield return null;      // 等一帧，让 Awake/Start 执行

        float before = health.CurrentHp;
        health.TakeDamage(10f);
        Assert.Less(health.CurrentHp, before);

        Object.Destroy(go);
    }

    [UnityTest]
    public IEnumerator Died_EventFires()
    {
        var go = new GameObject("Player");
        var health = go.AddComponent<PlayerHealth>();

        bool died = false;
        health.Died += () => died = true;

        yield return null;

        health.TakeDamage(9999f);
        Assert.IsTrue(died);

        Object.Destroy(go);
    }

    [UnityTest]
    public IEnumerator ObjectPool_ReusesInstance()
    {
        var prefab = new GameObject("Bullet");
        var pool = new ObjectPool<GameObject>(prefab, null, prewarm: 1);

        var a = pool.Get(Vector3.zero, Quaternion.identity);
        pool.Release(a);
        var b = pool.Get(Vector3.zero, Quaternion.identity);

        Assert.AreSame(a, b);       // 复用了同一个实例

        Object.Destroy(prefab);
        yield return null;
    }
}
```

> **测试依赖注入的技巧**：把 `Time`、`Random`、输入等"外部环境"包装成接口传入，
> 纯逻辑就能在 EditMode 下毫秒级跑完，不需要进 Play 模式。

### 11.3 调试与日志

```csharp
using UnityEngine;
using System.Diagnostics;

public class LogDemo : MonoBehaviour
{
    // ---------- 条件编译日志（发布版自动移除调用点）----------
    [Conditional("UNITY_EDITOR")]
    [Conditional("DEVELOPMENT_BUILD")]
    private static void LogVerbose(string msg) => Debug.Log("[Verbose] " + msg);

    private void Start()
    {
        LogVerbose("只在编辑器/开发构建中执行");

        Debug.Log("普通日志");
        Debug.LogWarning("警告");
        Debug.LogError("错误（会中断 Error Pause）");
        Debug.LogFormat("格式化 {0} {1}", 1, 2);
        Debug.Log("<color=red>支持富文本</color>");
        Debug.Log("<b>粗体</b> <i>斜体</i> <size=20>大字</size>");

        // ---------- 断言 ----------
        UnityEngine.Debug.Assert(transform != null, "transform 不应为空");

        // ---------- 绘制 ----------
        Debug.DrawLine(Vector3.zero, Vector3.up * 5f, Color.red);
        Debug.DrawRay(Vector3.zero, Vector3.forward * 3f, Color.green, 2f);
    }
}
```

**记录日志到文件**

```csharp
using System.IO;
using UnityEngine;

public static class FileLogger
{
    private static string LogPath =>
        Path.Combine(Application.persistentDataPath, "game.log");

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    private static void Install()
    {
        Application.logMessageReceived += OnLog;
    }

    private static void OnLog(string condition, string stackTrace, LogType type)
    {
        // 只记录错误与异常，避免日志爆炸
        if (type != LogType.Error && type != LogType.Exception && type != LogType.Assert) return;

        try
        {
            File.AppendAllText(LogPath,
                System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") +
                " [" + type + "] " + condition + "
" + stackTrace + "
");
        }
        catch (System.Exception)
        {
            // 日志系统自身出错时静默处理，避免递归
        }
    }
}
```

> **注意**：`Application.logMessageReceived` 在**主线程**回调（`logMessageReceivedThreaded` 在发生线程）。
> 回调里不能做重活，否则会拖慢每帧。文件写入是同步 IO，建议改成队列 + 独立线程写盘。

### 11.4 构建与打包

**Player Settings 关键项**

| 分类 | 项 | 说明 |
| --- | --- | --- |
| Other Settings | Api Compatibility Level | .NET Standard 2.1（推荐）或 .NET Framework |
| Other Settings | Scripting Backend | Mono（开发）/ IL2CPP（发布） |
| Other Settings | Managed Stripping Level | 代码剥离级别（Low/Medium/High） |
| Other Settings | Use Incremental GC | 强烈建议勾选 |
| Other Settings | Allow 'unsafe' Code | 需要指针时勾选 |
| Publishing | Split Application Binary | Android 超过 100MB 时需要 |
| Optimization | Prebake Collision Meshes | 减少运行时计算 |
| Optimization | Strip Engine Code | IL2CPP 下剥离未使用的引擎模块 |

**link.xml：解决代码剥离导致的反射/泛型失效**

```xml
<linker>
  <!-- 保留整个程序集 -->
  <assembly fullname="Assembly-CSharp" preserve="all"/>

  <!-- 保留指定类型 -->
  <assembly fullname="UnityEngine.CoreModule">
    <type fullname="UnityEngine.GameObject" preserve="all"/>
    <type fullname="UnityEngine.Material" preserve="all"/>
  </assembly>

  <!-- 保留某个类的成员 -->
  <assembly fullname="MyGame.Core">
    <type fullname="MyGame.Core.ReflectionHolder" preserve="all"/>
  </assembly>
</linker>
```

> `link.xml` 放在 `Assets` 目录下即可被识别。也可以给类型加 `[UnityEngine.Scripting.Preserve]` 特性。
> **常见症状**：Editor 里正常，打包后报 `MissingMethodException` / 反射拿到 `null` / JSON 反序列化字段全空。

**自动化构建脚本**

```csharp
#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class BuildScript
{
    [MenuItem("Build/Windows 64")]
    public static void BuildWindows()
    {
        string[] scenes = { "Assets/Scenes/Boot.unity", "Assets/Scenes/Main.unity" };

        var options = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = "Builds/Windows/MyGame.exe",
            target = BuildTarget.StandaloneWindows64,
            options = BuildOptions.None
        };

        BuildReport report = BuildPipeline.BuildPlayer(options);
        BuildSummary summary = report.summary;

        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log("构建成功：" + summary.totalSize / 1024 / 1024 + " MB，耗时 " + summary.totalTime);
        }
        else
        {
            Debug.LogError("构建失败：" + summary.result);
            EditorApplication.Exit(1);      // CI 中让流水线失败
        }
    }

    // ---------- 命令行调用 ----------
    // Unity.exe -quit -batchmode -projectPath "路径" -executeMethod BuildScript.BuildWindows
    //           -logFile build.log
    public static void BuildFromCommandLine()
    {
        try
        {
            BuildWindows();
            EditorApplication.Exit(0);
        }
        catch (Exception e)
        {
            Debug.LogError(e);
            EditorApplication.Exit(1);
        }
    }
}
#endif
```

**版本控制注意事项**

| 项 | 建议 |
| --- | --- |
| `Library/`、`Temp/`、`Obj/`、`Builds/` | 加入 `.gitignore` |
| `Assets/`、`Packages/`、`ProjectSettings/` | 必须提交 |
| `.meta` 文件 | 必须提交，且与资源一起移动/改名 |
| Force Text 序列化 | `Edit → Project Settings → Editor → Asset Serialization = Force Text` |
| Smart Merge | 配置 Git 的 `merge=unityyamlmerge` 处理场景/预制体冲突 |
| Git LFS | 大二进制资源（纹理/音频/模型）建议用 LFS |

---


## 附录 A 高频 API 速查表

### A.1 MonoBehaviour 生命周期顺序

| 阶段 | 回调 | 触发时机 | 常见用途 |
| --- | --- | --- | --- |
| 编辑期 | `Reset()` | 组件首次添加 / 点 Reset | 设置默认值 |
| 编辑期 | `OnValidate()` | Inspector 值变化 | 输入校验 |
| 初始化 | `Awake()` | 对象实例化（组件禁用也调用） | 缓存自身引用、初始化数据 |
| 初始化 | `OnEnable()` | enabled 变 true（可多次） | 订阅事件、开启轮询 |
| 初始化 | `Start()` | 第一次启用后的首个 Update 前 | 依赖其他对象的初始化 |
| 帧循环 | `FixedUpdate()` | 固定步长（默认 0.02s，可 0~N 次/帧） | 物理、力、速度 |
| 帧循环 | `Update()` | 每帧一次 | 输入、计时、状态机 |
| 帧循环 | `LateUpdate()` | 所有 Update 后 | 相机跟随、IK、UI 跟随 |
| 物理 | `OnCollisionEnter/Stay/Exit` | 碰撞 | 伤害、音效 |
| 物理 | `OnTriggerEnter/Stay/Exit` | 触发器 | 拾取、区域检测 |
| 渲染 | `OnWillRenderObject` | 渲染前（每个相机） | 可见性处理 |
| 渲染 | `OnGUI()` | 每帧多次 | 调试工具（不要用于正式 UI） |
| 渲染 | `OnDrawGizmos()` | 场景视图 | 可视化调试 |
| 销毁 | `OnDisable()` | enabled 变 false | 取消订阅 |
| 销毁 | `OnDestroy()` | 对象销毁 / 场景卸载 | 清理、保存 |
| 应用 | `OnApplicationPause(bool)` | 移动端切后台 | 暂停逻辑、保存 |
| 应用 | `OnApplicationQuit()` | 应用退出 | 最终保存 |

### A.2 Transform 常用 API

| 需求 | API |
| --- | --- |
| 世界位置 | `transform.position` |
| 局部位置 | `transform.localPosition` |
| 世界旋转 | `transform.rotation` |
| 局部旋转 | `transform.localRotation` |
| 欧拉角 | `transform.eulerAngles` / `localEulerAngles` |
| 三轴方向 | `transform.forward` / `right` / `up` |
| 前进 | `transform.Translate(Vector3, Space)` |
| 旋转 | `transform.Rotate(Vector3 axis, float angle, Space)` |
| 朝向 | `transform.LookAt(Vector3)` |
| 绕点旋转 | `transform.RotateAround(Vector3 point, Vector3 axis, float angle)` |
| 一次设位姿 | `transform.SetPositionAndRotation(pos, rot)` |
| 父子关系 | `transform.SetParent(parent, worldPositionStays)` |
| 子物体 | `transform.GetChild(i)` / `childCount` |
| 本地→世界 | `transform.TransformPoint(local)` |
| 世界→本地 | `transform.InverseTransformPoint(world)` |
| 方向转换 | `TransformDirection` / `InverseTransformDirection` |

### A.3 Vector3 / Mathf 常用方法

| 需求 | API |
| --- | --- |
| 长度 | `v.magnitude` / `v.sqrMagnitude`（更快） |
| 归一化 | `v.normalized` / `v.Normalize()` |
| 距离 | `Vector3.Distance(a, b)` / `(a-b).sqrMagnitude` |
| 点积 | `Vector3.Dot(a, b)` |
| 叉积 | `Vector3.Cross(a, b)` |
| 夹角 | `Vector3.Angle(a, b)` / `Vector3.SignedAngle(a, b, axis)` |
| 投影 | `Vector3.Project(v, onNormal)` / `ProjectOnPlane` |
| 反射 | `Vector3.Reflect(inDirection, inNormal)` |
| 插值 | `Vector3.Lerp` / `Slerp` / `MoveTowards` / `SmoothDamp` |
| 限制 | `Vector3.ClampMagnitude(v, max)` |
| 取整 | `Mathf.Floor/Ceil/Round/RoundToInt` |
| 限制范围 | `Mathf.Clamp(v, min, max)` / `Clamp01` |
| 插值 | `Mathf.Lerp` / `InverseLerp` / `MoveTowards` / `SmoothStep` |
| 三角函数 | `Mathf.Sin/Cos/Tan/Atan2`（参数是弧度） |
| 角度转换 | `Mathf.Deg2Rad` / `Mathf.Rad2Deg` |
| 随机噪声 | `Mathf.PerlinNoise(x, y)` |

### A.4 物理查询 API 对照

| 需求 | 分配版本 | 零分配版本 |
| --- | --- | --- |
| 射线检测 | `Physics.RaycastAll` | `Physics.RaycastNonAlloc` |
| 球形范围 | `Physics.OverlapSphere` | `Physics.OverlapSphereNonAlloc` |
| 盒子范围 | `Physics.OverlapBox` | `Physics.OverlapBoxNonAlloc` |
| 胶囊范围 | `Physics.OverlapCapsule` | `Physics.OverlapCapsuleNonAlloc` |
| 单个命中 | `Physics.Raycast(..., out RaycastHit)` | 无分配（本身零分配） |
| 2D 对应 | `Physics2D.RaycastAll` 等 | `Physics2D.RaycastNonAlloc` 等 |

> **注意**：Unity 2022.1+ 的 Physics 查询 API 新增了 Span / List 重载（物理批查询），
> 可进一步避免固定大小数组的限制。

### A.5 C# 集合复杂度速查

| 容器 | 索引 | 查找 | 插入 | 删除 | 有序 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| `T[]` | O(1) | O(n) | — | — | 定长 | 最省内存，零 GC |
| `List<T>` | O(1) | O(n) | 尾部 O(1) 均摊 | O(n) | 插入序 | Capacity 只增不减 |
| `Dictionary<K,V>` | — | O(1) 均摊 | O(1) 均摊 | O(1) 均摊 | 无序 | 键需稳定哈希 |
| `HashSet<T>` | — | O(1) 均摊 | O(1) 均摊 | O(1) 均摊 | 无序 | 去重、集合运算 |
| `Queue<T>` | — | O(n)（Contains） | 尾部 O(1) | 头部 O(1) | FIFO | — |
| `Stack<T>` | — | O(n) | 顶部 O(1) | 顶部 O(1) | LIFO | — |
| `LinkedList<T>` | O(n) | O(n) | 已知节点 O(1) | 已知节点 O(1) | 插入序 | 缓存不友好，慎用 |
| `SortedDictionary<K,V>` | — | O(log n) | O(log n) | O(log n) | 按 key | 红黑树 |
| `SortedList<K,V>` | O(1) | O(log n) 查找 / O(n) 插入 | O(n) | O(n) | 按 key | 内存更省 |

### A.6 Unity 版本与 API 变更速查

| 变更点 | 旧 API | 新 API | 起始版本 |
| --- | --- | --- | --- |
| 查找单个对象 | `FindObjectOfType<T>()` | `FindFirstObjectByType<T>()` / `FindAnyObjectByType<T>()` | 2023.1 |
| 查找多个对象 | `FindObjectsOfType<T>()` | `FindObjectsByType<T>(FindObjectsSortMode)` | 2023.1 |
| 刚体速度 | `Rigidbody.velocity` | `Rigidbody.linearVelocity` | Unity 6（6000.x） |
| 刚体阻力 | `Rigidbody.drag` | `Rigidbody.linearDamping` | Unity 6（6000.x） |
| 角阻力 | `Rigidbody.angularDrag` | `Rigidbody.angularDamping` | Unity 6（6000.x） |
| 物理材质 | `PhysicMaterial` | `PhysicsMaterial` | Unity 6 |
| 网络请求结果 | `www.isNetworkError` / `isHttpError` | `www.result == UnityWebRequest.Result.Success` | 2020.2 |
| 本地位置旋转 | 分开设 `localPosition` / `localRotation` | `transform.SetLocalPositionAndRotation(pos, rot)` | 2022.1 |
| 场景加载 | `Application.LoadLevel` | `SceneManager.LoadScene` | 5.3 |
| 粒子系统 | 旧 `ParticleEmitter` | `ParticleSystem` | 5.5 |
| 输入 | `Input`（旧） | Input System 包 | 2019.2+ |
| UI | UGUI | UI Toolkit（运行时） | 2021.2 |
| 光照 | Enlighten 实时 GI | 已移除 | 2020+ |
| 动画 | Legacy Animation | Animator（Mecanim） | 4.x |

### A.7 常用特性速查（索引）

| 场景 | 特性 |
| --- | --- |
| 私有字段显示到 Inspector | `[SerializeField]` |
| 多态序列化 | `[SerializeReference]` |
| 字段改名保留数据 | `[FormerlySerializedAs("old")]`（需 `using UnityEngine.Serialization;`） |
| 不序列化 | `[System.NonSerialized]` |
| 隐藏 public 字段 | `[HideInInspector]` |
| 数值范围 | `[Range(min,max)]` / `[Min(v)]` |
| 分组 | `[Header("...")]` / `[Space(n)]` |
| 提示 | `[Tooltip("...")]` |
| 多行文本 | `[TextArea(min,max)]` / `[Multiline(n)]` |
| 依赖组件 | `[RequireComponent(typeof(T))]` |
| 单例组件 | `[DisallowMultipleComponent]` |
| 编辑器执行 | `[ExecuteAlways]`（新）/ `[ExecuteInEditMode]`（旧） |
| 菜单路径 | `[AddComponentMenu("A/B")]` |
| 右键菜单 | `[ContextMenu("名")]`（方法）/ `[ContextMenuItem("名","方法")]`（字段） |
| 资产菜单 | `[CreateAssetMenu(...)]` |
| 执行顺序 | `[DefaultExecutionOrder(n)]` |
| 编辑器菜单 | `[MenuItem("Tools/X")]` |
| 代码剥离保护 | `[UnityEngine.Scripting.Preserve]` |
| 运行时初始化 | `[RuntimeInitializeOnLoadMethod(类型)]` |
| 位标志枚举 | `[System.Flags]` |

---

## 附录 B 易错点清单（Checklist）

### B.1 C# 语言层面

- [ ] 整数除法 `5 / 2 == 2`，需要浮点结果要先转 `(float)a / b`。
- [ ] 返回 struct 的属性不能直接改成员（CS1612）：`transform.position.x = 1f` 编译失败。
- [ ] `List<T>` 的索引器返回副本，`list[0].field = x` 对 struct 编译失败。
- [ ] 数组索引是变量，`arr[0].field = x` 对 struct 是合法的。
- [ ] 浮点数不要用 `==` 比较，用 `Mathf.Approximately` 或平方距离。
- [ ] `Mathf.Round` 是银行家舍入：`Round(0.5f) == 0`。
- [ ] `Random.Range(int, int)` 的上界**不包含**，`Range(float, float)` 的上界**包含**。
- [ ] 重写 `Equals` 必须重写 `GetHashCode`。
- [ ] 循环变量捕获：`for` 的 `i` 是共享的，需要局部副本；`foreach` 的变量每次迭代独立。
- [ ] lambda 捕获 `this` 或局部变量会产生堆分配。
- [ ] `params` 每次调用都分配数组。
- [ ] LINQ 是延迟执行，`ToList()` 才会立刻求值。
- [ ] `const` 会被内联进调用方程序集，跨程序集共享数值用 `static readonly`。
- [ ] 字符串是不可变的，拼接产生新对象。
- [ ] `string` 的 `Length` 是 UTF-16 码元数，emoji 占 2。
- [ ] 解析数字务必用 `InvariantCulture`。
- [ ] `Dictionary` 遍历中不能增删元素。
- [ ] `Dictionary.Add` 重复键会抛异常，用索引器或 `TryAdd`。
- [ ] `Nullable<T>` 不能被 Unity 序列化。
- [ ] 接口类型字段不能被 Unity 序列化。
- [ ] `out` 参数在方法返回前必须赋值。
- [ ] `in` 参数内部不可修改。
- [ ] 不能对属性使用 `ref` / `out`。
- [ ] `async void` 的异常无法捕获，除事件处理器外一律用 `async Task`。

### B.2 Unity 生命周期与对象

- [ ] 同物体上多个组件的 `Awake` / `Update` 顺序**未定义**。
- [ ] `Awake` 在组件被禁用时也会执行，`Start` 不会。
- [ ] `Instantiate` 出来的对象的 `Start` 可能延迟到下一帧。
- [ ] `Destroy` 是延迟到帧末，`DestroyImmediate` 是立即（运行时慎用）。
- [ ] 对象被销毁后，C# 引用仍在（假 null）：`go == null` 为 true，但 `(object)go == null` 为 false。
- [ ] 访问已销毁对象会抛 `MissingReferenceException`（不是 NullReferenceException）。
- [ ] `SetActive(false)` 会停止该物体上所有协程，重新激活后不会自动恢复。
- [ ] 静态字段不会随场景卸载重置。
- [ ] `DontDestroyOnLoad` 的对象在切场景后仍存在，需要手动管理。
- [ ] `OnDestroy` 中要清理静态引用，否则留下假 null。
- [ ] 事件订阅必须在 `OnDisable` 或 `OnDestroy` 成对取消，否则泄漏。
- [ ] `UnityEvent.AddListener` 传 lambda 后无法 `RemoveListener`，需保存委托或 `RemoveAllListeners`。
- [ ] `CompareTag` 比 `tag == "x"` 更快且不分配。
- [ ] `Camera.main` 内部是查找，必须缓存。

### B.3 物理

- [ ] 物理操作必须在 `FixedUpdate`，不能在 `Update`。
- [ ] 输入检测不要放 `FixedUpdate`（会丢输入）。
- [ ] 两个静态 Collider 之间不会碰撞。
- [ ] 两个 Kinematic Rigidbody 之间不会碰撞。
- [ ] Trigger 与 Trigger 之间不会触发。
- [ ] 至少一方有 Rigidbody 才会产生碰撞事件。
- [ ] `Rigidbody.isKinematic = true` 后 `AddForce` 无效，要用 `MovePosition`。
- [ ] 高速物体要开 `CollisionDetectionMode.ContinuousDynamic` 防止穿模。
- [ ] `Physics.RaycastAll` 每次分配数组，热路径用 `RaycastNonAlloc`。
- [ ] `LayerMask` 是位掩码，不是层号。
- [ ] `LayerMask.GetMask("")` 返回 0，会什么都不命中。
- [ ] 直接改 `transform.position` 绕过物理，可能穿透；用 `Rigidbody.MovePosition`。
- [ ] `Collider.material` 会克隆材质实例，共享用 `sharedMaterial`。

### B.4 协程与异步

- [ ] `yield return null` 与 `yield return new WaitForSeconds(0)` 都等下一帧，但后者有分配。
- [ ] `WaitForSeconds` 受 `Time.timeScale` 影响，`WaitForSecondsRealtime` 不受。
- [ ] `Time.timeScale = 0` 时 `FixedUpdate` 不执行、`WaitForSeconds` 永不返回。
- [ ] `WaitForEndOfFrame` 在编辑器 Game 视图不可见时不触发。
- [ ] 协程中不能 `yield return` 在 `try-catch` 内。
- [ ] `StopCoroutine(string)` 只能停止用字符串启动的协程，stop 用 Coroutine 句柄更可靠。
- [ ] 频繁创建 `new WaitForSeconds` 会产生 GC，应缓存。
- [ ] `async` 方法 `await` 后可能不在主线程，不能直接调 Unity API。
- [ ] `async` 方法返回后对象可能已销毁，需 `CancellationToken` 或 `if (this == null) return;`。

### B.5 UI

- [ ] Canvas 上任何元素变化都会导致整个 Canvas 重建，应拆分动态/静态 Canvas。
- [ ] 嵌套 `LayoutGroup` 会显著增加开销。
- [ ] 装饰性 Image 应关闭 `raycastTarget`。
- [ ] `Text.text` 每次赋值产生字符串分配，用 TMP `SetText(format, args)`。
- [ ] 长列表应做虚拟化（只实例化可视区域）。
- [ ] 世界坐标 → UI 坐标要用 `RectTransformUtility.ScreenPointToLocalPointInRectangle`。
- [ ] `Dropdown` 在新版本已被 `TMP_Dropdown` 取代（旧组件仍可用但过时）。

### B.6 序列化与存档

- [ ] Unity 不序列化属性（除非 `[field: SerializeField]`，2020.2+）。
- [ ] 不序列化 `Dictionary`、`Nullable`、接口、`static`、`readonly` 字段。
- [ ] `JsonUtility` 不支持顶层数组、`Dictionary`、多态。
- [ ] `JsonUtility` 只序列化 public 字段与 `[SerializeField]` 字段。
- [ ] `PlayerPrefs` 是明文，不适合存敏感数据。
- [ ] Android 上 `File.ReadAllText(Application.streamingAssetsPath + ...)` 会失败，要用 `UnityWebRequest`。
- [ ] ScriptableObject 运行时的修改不会持久化到资产文件。
- [ ] 字段改名会导致序列化数据丢失，用 `[FormerlySerializedAs]`。

### B.7 性能与内存

- [ ] `Update` 里的字符串拼接、LINQ、`new` 是 GC 的主要来源。
- [ ] `GetComponent` / `Find` 应在 `Awake` 缓存。
- [ ] 装箱发生在值类型转 `object` 时（`string.Format`、`params object[]`）。
- [ ] 对接口或 LINQ 结果 `foreach` 会分配枚举器；对 `List<T>` / 数组不会。
- [ ] 每次 `new WaitForSeconds` / `new WaitForEndOfFrame` 都分配。
- [ ] Boehm GC 不压缩内存，堆只增不减，碎片化会持续。
- [ ] `Resources` 目录下的所有资源都会被打包，无论是否使用。
- [ ] `NativeArray` 等 NativeContainer 必须手动 `Dispose()`。
- [ ] `[BurstCompile]` 里不能用 try/catch、不能访问托管对象。

### B.8 构建与平台

- [ ] Editor 代码必须在 `Editor` 文件夹或 Editor 平台程序集，用 `#if UNITY_EDITOR` 包裹。
- [ ] IL2CPP 下未显式实例化的值类型泛型可能缺失，需要 link.xml 或 `[Preserve]`。
- [ ] iOS/WebGL 禁止 JIT，`Reflection.Emit` 不可用。
- [ ] WebGL 默认无多线程。
- [ ] 代码剥离可能删掉只被反射使用的类型。
- [ ] `.meta` 文件必须一起提交，且改名要连同 `.meta` 一起改。

---

## 附录 C API 与知识点自检报告

本手册在编写时对以下"高频写错的 API 与知识点"做了逐项核对，这里把结论集中列出，便于对照自查。

### C.1 容易写错的 API 及正确形式

| 容易写错 | 正确形式 | 说明 |
| --- | --- | --- |
| `GetComponent<Interface>()` 返回 null 就报错 | `TryGetComponent(out IDamageable t)` | `GetComponent<T>()` 支持接口，但推荐用 `TryGetComponent` |
| `Physics.RaycastAll` 用于热路径 | `Physics.RaycastNonAlloc` | 后者不分配数组 |
| `Input.mousePosition` 是 UI 坐标 | 它是**屏幕坐标**，左下角为原点 | UI 坐标需 `ScreenPointToLocalPointInRectangle` |
| `transform.position.x = 1` | 取出来改再写回，或 `Translate` | CS1612 |
| `rb.velocity` 在 Unity 6 | `rb.linearVelocity` | 旧名仍可用但有警告 |
| `Rigidbody.drag` | `Rigidbody.linearDamping` | Unity 6 改名 |
| `PhysicMaterial` | `PhysicsMaterial` | Unity 6 改名 |
| `www.isNetworkError` | `www.result != UnityWebRequest.Result.Success` | 2020.2+ |
| `FindObjectOfType<T>()` | `FindFirstObjectByType<T>()` | 2023.1+ |
| `Object.FindObjectOfType<T>()` 忽略禁用对象 | `FindObjectOfType<T>(true)` 包含未激活对象 | 2020.1+ 有该重载 |
| `Instantiate(prefab, parent)` 会改世界坐标 | `Instantiate(prefab, parent, false)` 保持局部坐标 | 第三个参数是 `worldPositionStays` |
| `SetParent(parent)` 会保持世界坐标 | `SetParent(parent, false)` 保持局部坐标 | UI 常用 false |
| `Quaternion.Lerp` 用于长时间插值 | `Quaternion.Slerp` 或 `RotateTowards` | Lerp 不匀速 |
| `Vector3.Lerp` 用于"每帧靠近" | 用 `MoveTowards` 或 `SmoothDamp` | Lerp 有 t 的语义陷阱 |
| `Mathf.Round(0.5f)` 期望 1 | 实际返回 0（银行家舍入） | 用 `Floor(x + 0.5f)` |
| `Random.Range(0, 10)` 期望含 10 | int 版本**不含**上界 | 用 `Range(0, 11)` |
| `Time.time` 用于暂停 UI 动画 | 暂停时应该用 `unscaledTime` | timeScale = 0 时 time 不增长 |
| `WaitForSeconds` 在暂停时 | 改用 `WaitForSecondsRealtime` | timeScale = 0 时前者永不返回 |
| `Animator.SetFloat("Speed", v)` 每帧字符串 | 用 `Animator.StringToHash` 缓存 | 性能 |
| `Debug.LogFormat` 不装箱 | 仍然装箱（`params object[]`） | 高频日志要避免 |
| `string.Format` 直接用于 UI | 用 TMP `SetText(format, args)` | 零分配 |
| `JsonUtility.ToJson` 序列化属性 | 只序列化字段 | 属性需要 `[SerializeField]` 字段支撑 |
| `[SerializeField]` 加在属性上 | `[field: SerializeField]`（2020.2+） | 或手动写字段 |
| `GetComponentsInChildren` 每帧 | `Awake` 收集一次并缓存 | 性能 |
| `Camera.main` 每帧 | 缓存到字段 | 内部是 FindGameObjectWithTag |
| `foreach` 遍历 `Dictionary` 时删除 | 先收集再删 | InvalidOperationException |
| `SendMessage` / 反射 `Invoke` 热路径 | 用接口或委托 | 反射慢 100~1000 倍 |
| `OnCollisionEnter` 用另一个 Trigger 触发 | Trigger 用 `OnTriggerEnter` | 两种回调不通用 |
| `yield return new WaitForEndOfFrame()` 截图 | 编辑器 Game 视图不可见时不触发 | 用 `ScreenCapture.CaptureScreenshot` |
| `Application.streamingAssetsPath` 用 File 读 | Android 上必须用 `UnityWebRequest` | 路径在 APK 内 |
| `NativeArray` 忘记 `Dispose()` | 必须成对释放 | 否则报内存泄漏 |
| `[BurstCompile]` 里 `Debug.Log` | Burst 中不可用 | 用 `FixedString` + 事后输出 |

### C.2 版本相关的重要更正

1. **C# 8 的默认接口实现（DIM）在 Unity 中不可用**，即使 Unity 2021+ 支持 C# 9 语法。
   涉及接口默认方法的设计需要改用抽象类或扩展方法。
2. **C# 版本与 Unity 版本强绑定**：Unity 2018.3 → C# 7.3，Unity 2020.2 → C# 8，Unity 2021.2+ → C# 9，
   Unity 6 仍是 C# 9。不要假设可以用 C# 10/11 的新语法。
3. **`Index` / `Range`（C# 8 索引与范围）** 需要 .NET Standard 2.1 运行时支持；
   Unity 2021+ 才有完整支持，低版本会报缺少类型。
4. **`record` / `init` 可用但不能被 Unity 序列化**（不是 MonoBehaviour 的数据模型）。
5. **IL2CPP 不等于"什么都支持"**：AOT 环境下泛型反射、`Reflection.Emit`、动态类型受严格限制。
6. **Boehm GC 在 IL2CPP 下同样存在**，"IL2CPP 就没有 GC 卡顿"是错误认知。
7. **`UnityEngine.Pool.ObjectPool<T>` 需要 Unity 2021.1+**。
8. **`SerializeReference` 需要 Unity 2019.3+**，早期版本用 `[SerializeReference]` 会失败。

### C.3 常见"以讹传讹"的知识点纠正

| 说法 | 纠正 |
| --- | --- |
| "值类型都在栈上" | 不一定。类字段中的 struct 在**堆**上；闭包捕获的变量在堆上；只在方法局部变量时在栈上 |
| "struct 一定比 class 快" | 小 struct 快，大 struct 拷贝成本高，反而不如引用 |
| "ref 一定比值传递快" | 只对 struct 有意义，对引用类型没差别 |
| "foreach 一定产生 GC" | 对具体集合类型（数组/List/Dictionary）不产生；对接口和 LINQ 迭代器才产生 |
| "IL2CPP 没有 GC" | IL2CPP 仍用 Boehm GC，只是把 IL 转成了 C++ |
| "协程是线程" | 协程在主线程上分帧执行，不是线程 |
| "`async/await` 一定开新线程" | `await` 之后是否换线程取决于被等待的任务；`Task.Delay` 不换线程 |
| "Mono 比 IL2CPP 慢很多" | 在数学密集场景差异明显；简单逻辑差异不大，IL2CPP 还更慢启动 |
| "`Resources` 很方便所以随便用" | 官方明确不推荐：全量打包、启动慢、无法热更 |
| "静态变量会随场景重置" | 不会，只有关闭 Domain Reload 才需要手动重置部分编辑器状态 |
| "`Update` 里做字符串拼接没关系" | 每帧分配累积成周期性 GC 卡顿 |
| "对象池一定能提升性能" | 对低频长生命周期对象反而浪费常驻内存 |
| "`GetComponent` 很慢" | 单次调用并不慢，慢的是**每帧重复调用**；缓存后几乎零开销 |

### C.4 建议的验证方式

1. **语法与 API 校验**：在 Unity 中新建脚本，把示例粘进去看是否有编译错误。
2. **性能校验**：用 Profiler 的 CPU Usage / GC.Alloc 列对比优化前后。
3. **平台校验**：至少在 Windows 与 Android（或 iOS）真机上各跑一次，
   重点验证反射、泛型、StreamingAssets、IL2CPP 剥离相关问题。
4. **序列化校验**：改动字段后检查已有场景/预制体数据是否丢失。
5. **单元测试**：把纯逻辑抽到无 Unity 依赖的程序集，用 EditMode 测试覆盖。

---

## 结语

本手册覆盖了从 C# 语言基础到 Unity 引擎各子系统、再到性能与工程化的完整知识链。
建议的使用方式：

1. **第一遍通读**：建立知识地图，不用记住细节；
2. **第二遍按需精读**：遇到具体问题时回到对应章节；
3. **把附录 B 的 Checklist 当代码评审清单**，每次提交前扫一遍；
4. **动手改代码验证**：手册中的示例都可以直接粘贴运行，改参数观察行为变化是最好的学习方式。

最后记住三句话：

- **组合优于继承**（Unity 的组件哲学）；
- **先 Profile 再优化**（不要凭直觉优化）；
- **缓存一切能缓存的东西**（组件、查找结果、字符串、WaitForSeconds）。

