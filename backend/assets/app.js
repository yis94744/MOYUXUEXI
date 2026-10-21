/* ==========================================================================
   Unity 游戏后端 + 全栈开发路线 — 交互脚本
   主题切换 / 侧边栏导航 / 学习进度(localStorage) / 全站搜索
   无依赖，纯原生 JS
   ========================================================================== */
(function () {
  'use strict';

  var PAGES = [
    { href: 'index.html', num: '', title: '路线总览', group: '开始', desc: '整条路线的结构、两段式设计与学习节奏' },
    { href: '01-role.html', num: '01', title: '岗位与行业现实', group: '开始', desc: '游戏后端 vs Web 后端 vs 全栈：分工、薪资、技能要求' },
    { href: '02-setup.html', num: '02', title: '环境搭建与第一个 API', group: '开始', desc: '装 .NET SDK、跑起第一个 Web API、理解请求响应' },
    { href: 'kp-index.html', num: '', title: '知识点索引', group: '开始', desc: '全部知识点的总目录，支持跨站跳转' },
    { href: '03-http-basics.html', num: '03', title: 'HTTP、REST 与 API 设计', group: '后端基础', desc: '请求方法、状态码、幂等、版本化、错误码规范' },
    { href: '04-aspnet-core.html', num: '04', title: 'ASP.NET Core 框架', group: '后端基础', desc: '中间件、依赖注入、配置系统、生命周期' },
    { href: '05-routing-modelbind.html', num: '05', title: '路由、模型绑定与验证', group: '后端基础', desc: '特性路由、参数绑定来源、FluentValidation、统一响应' },
    { href: '06-auth.html', num: '06', title: '鉴权与会话', group: '后端基础', desc: 'JWT、OAuth2、Session、Token 刷新、越权防护' },
    { href: '07-database.html', num: '07', title: '数据库与 EF Core', group: '后端基础', desc: '关系建模、迁移、查询优化、N+1 问题、事务' },
    { href: '08-redis-cache.html', num: '08', title: '缓存与 Redis', group: '后端基础', desc: '缓存模式、穿透雪崩击穿、分布式锁、排行榜数据结构' },
    { href: '09-message-queue.html', num: '09', title: '消息队列与异步', group: '后端基础', desc: 'RabbitMQ/Kafka、削峰、最终一致、幂等消费' },
    { href: '10-logging-monitor.html', num: '10', title: '日志、监控与可观测性', group: '后端基础', desc: '结构化日志、链路追踪、指标、告警' },
    { href: '11-game-backend-overview.html', num: '11', title: '游戏后端全景', group: '游戏后端', desc: '登录服/网关/战斗服/世界服的分工与演进' },
    { href: '12-long-short-connection.html', num: '12', title: '长连接与短连接', group: '游戏后端', desc: 'TCP/UDP/WebSocket、心跳、断线重连、粘包拆包' },
    { href: '13-protocol-design.html', num: '13', title: '协议设计与序列化', group: '游戏后端', desc: 'Protobuf、协议版本兼容、字段演进、包体压缩' },
    { href: '14-state-sync.html', num: '14', title: '状态同步与帧同步', group: '游戏后端', desc: '两种同步的本质差异、确定性、回滚、反外挂取舍' },
    { href: '15-battle-server.html', num: '15', title: '战斗服与结算', group: '游戏后端', desc: '房间模型、战斗校验、结算幂等、断线重连补帧' },
    { href: '16-matchmaking.html', num: '16', title: '匹配系统', group: '游戏后端', desc: 'Elo/MMR、匹配池、分段扩容、组队与补位' },
    { href: '17-leaderboard.html', num: '17', title: '排行榜', group: '游戏后端', desc: 'Redis ZSet、分页、并列名次、赛季重置、全服榜' },
    { href: '18-inventory-economy.html', num: '18', title: '背包与经济系统', group: '游戏后端', desc: '道具流水、并发扣减、幂等、防刷、对账' },
    { href: '19-anticheat.html', num: '19', title: '防作弊与服务端权威', group: '游戏后端', desc: '哪些必须服务端算、客户端校验、异常行为检测' },
    { href: '20-fullstack-frontend.html', num: '20', title: '前端基础与选型', group: '全栈能力', desc: 'Vue/React 选型、工程化、组件化思维（客户端视角切入）' },
    { href: '21-admin-panel.html', num: '21', title: '运营后台实战', group: '全栈能力', desc: '从零做一个 GM 后台：列表、筛选、权限、导出' },
    { href: '22-deploy.html', num: '22', title: '部署与运维', group: '全栈能力', desc: 'Linux、Nginx、进程守护、Docker、CI/CD' },
    { href: '23-scaling.html', num: '23', title: '扩展性与高可用', group: '全栈能力', desc: '负载均衡、无状态化、分库分表、限流熔断' },
    { href: '24-security.html', num: '24', title: '安全与合规', group: '全栈能力', desc: 'SQL 注入、XSS、CSRF、越权、数据加密、隐私合规' },
    { href: '25-perf.html', num: '25', title: '后端性能优化', group: '工程实践', desc: '压测、性能剖析、连接池、异步陷阱、GC 调优' },
    { href: '26-testing.html', num: '26', title: '测试与质量', group: '工程实践', desc: '单元测试、集成测试、契约测试、压测脚本' },
    { href: '27-architecture.html', num: '27', title: '架构与设计模式', group: '工程实践', desc: '分层、领域模型、微服务与单体取舍、事件驱动' },
    { href: '28-ai.html', num: '28', title: 'AI 辅助后端开发', group: '工程实践', desc: '用 AI 写 CRUD、生成测试、审查 SQL 的边界' },
    { href: '29-projects.html', num: '29', title: '实战项目集', group: '求职与实践', desc: '五个由浅入深的后端项目，能写进简历' },
    { href: '30-interview.html', num: '30', title: '面试题库', group: '求职与实践', desc: '后端高频题，标注考点与出处' },
    { href: '31-client-to-server.html', num: '31', title: '客户端转后端的思维转换', group: '求职与实践', desc: '从 Unity 主程到后端：优势、盲区、如何快速上手' },
    { href: '32-reference.html', num: '32', title: '速查手册', group: '求职与实践', desc: '常用命令、HTTP 状态码、SQL 语法、坑位速查' }
  ];

  /* 全站知识点（用于搜索与回链提示） */
  var KPS = [{"key":"cs-value-ref","title":"值类型与引用类型","page":"03-cs-basic.html","anchor":"value-ref","brief":"赋值时拷贝内容还是拷贝地址，这决定了对象会不会被共享","group":"C# 语言"},{"key":"cs-cs1612","title":"CS1612 属性返回值","page":"03-cs-basic.html","anchor":"cs1612","brief":"返回 struct 的属性不能直接改成员，必须取出改再写回","group":"C# 语言"},{"key":"cs-boxing","title":"装箱与拆箱","page":"03-cs-basic.html","anchor":"boxing","brief":"值类型转 object 会在堆上分配，是 GC 压力的头号来源","group":"C# 语言"},{"key":"cs-struct-class","title":"struct 与 class 选型","page":"03-cs-basic.html","anchor":"choose","brief":"小、不可变、数量大用 struct；需要继承或引用语义用 class","group":"C# 语言"},{"key":"cs-string","title":"字符串与不可变性","page":"03-cs-basic.html","anchor":"string","brief":"string 不可变，每次拼接都新建对象，循环拼接是 GC 灾难","group":"C# 语言"},{"key":"cs-collections","title":"集合选型","page":"03-cs-basic.html","anchor":"collections","brief":"数组/List/Dictionary/HashSet 的复杂度与适用场景","group":"C# 语言"},{"key":"cs-encapsulation","title":"封装与属性","page":"04-cs-oop.html","anchor":"three","brief":"把变化隔离在一处：用属性集中校验、去重、发通知","group":"C# 语言"},{"key":"cs-polymorphism","title":"继承与多态","page":"04-cs-oop.html","anchor":"inherit","brief":"virtual/override/new 的区别，new 只做静态隐藏不走多态","group":"C# 语言"},{"key":"cs-interface","title":"接口与抽象类","page":"04-cs-oop.html","anchor":"interface","brief":"接口是能力契约，抽象类是公共基类；Unity 不能序列化接口字段","group":"C# 语言"},{"key":"cs-composition","title":"组合优于继承","page":"04-cs-oop.html","anchor":"compose","brief":"Unity 的核心哲学：用组件组合能力，避免继承链组合爆炸","group":"C# 语言"},{"key":"cs-extension","title":"扩展方法","page":"04-cs-oop.html","anchor":"extends","brief":"给无法修改的类型加方法，但不能访问私有成员、不参与多态","group":"C# 语言"},{"key":"cs-delegate","title":"委托与事件","page":"05-cs-adv.html","anchor":"delegate","brief":"event 是委托的安全封装，订阅必须成对取消否则内存泄漏","group":"C# 语言"},{"key":"cs-closure","title":"闭包与捕获","page":"05-cs-adv.html","anchor":"closure","brief":"Lambda 捕获外部变量会生成堆对象，每帧执行就是每帧分配","group":"C# 语言"},{"key":"cs-linq","title":"LINQ 与延迟执行","page":"05-cs-adv.html","anchor":"linq","brief":"查询不立即执行，遍历时才跑；每次查询都分配对象","group":"C# 语言"},{"key":"cs-generic","title":"泛型与约束","page":"06-cs-modern.html","anchor":"generic","brief":"写一次适配所有类型且不装箱；where 约束既是限制也是文档","group":"C# 语言"},{"key":"cs-reflection","title":"反射","page":"06-cs-modern.html","anchor":"reflection","brief":"运行时检查类型；慢 100~1000 倍，IL2CPP 下泛型反射有限制","group":"C# 语言"},{"key":"cs-attribute","title":"特性 Attribute","page":"06-cs-modern.html","anchor":"attribute","brief":"给代码贴元数据标签，由框架或反射读取","group":"C# 语言"},{"key":"cs-exception","title":"异常处理","page":"06-cs-modern.html","anchor":"exception","brief":"用 TryXxx 表达预期内失败，不要用异常做流程控制","group":"C# 语言"},{"key":"cs-modern","title":"现代 C# 特性","page":"06-cs-modern.html","anchor":"modern","brief":"C# 6 到 9 语法与 Unity 支持矩阵；DIM 视版本（2020.2 及更早报错，2021.3+ 可编译运行）","group":"C# 语言"},{"key":"cs-memory-model","title":"Unity 内存模型","page":"07-cs-memory.html","anchor":"model","brief":"托管堆 / Native / 栈 / 非托管，GC 只管托管堆","group":"C# 语言"},{"key":"cs-boehm","title":"Boehm GC","page":"07-cs-memory.html","anchor":"boehm","brief":"非分代、非压缩、全停顿；增量 GC 拆分停顿但不减少垃圾总量","group":"C# 语言"},{"key":"cs-gc-sources","title":"GC 分配十大来源","page":"07-cs-memory.html","anchor":"sources","brief":"字符串/装箱/数组/LINQ/闭包/协程等待对象等高频分配点","group":"C# 语言"},{"key":"cs-gc-detect","title":"Profiler 定位分配","page":"07-cs-memory.html","anchor":"detect","brief":"打开 GC Alloc 列、排序、看调用栈、验证修复效果","group":"C# 语言"},{"key":"cs-data-layout","title":"缓存友好与 SoA","page":"07-cs-memory.html","anchor":"layout","brief":"struct 数组内存连续，利用缓存行，比 class 数组快 2 到 5 倍","group":"C# 语言"},{"key":"cs-coroutine","title":"协程","page":"08-cs-async.html","anchor":"coroutine","brief":"主线程上分帧执行，全部 yield 指令的恢复时机","group":"C# 语言"},{"key":"cs-coroutine-trap","title":"协程四大陷阱","page":"08-cs-async.html","anchor":"trap","brief":"SetActive 停止协程不恢复、不能 try-catch yield、等待对象分配","group":"C# 语言"},{"key":"cs-async","title":"async/await 与线程","page":"08-cs-async.html","anchor":"async","brief":"await 后是否在主线程取决于等待对象，线程池上不能调 Unity API","group":"C# 语言"},{"key":"cs-unitask","title":"UniTask","page":"08-cs-async.html","anchor":"unitask","brief":"零分配的 Unity 异步方案，与 PlayerLoop 集成","group":"C# 语言"},{"key":"m-vector","title":"向量运算","page":"09-math.html","anchor":"vector","brief":"位置/方向/速度都是向量；sqrMagnitude 比 Distance 快","group":"数学与图形"},{"key":"m-dot-cross","title":"点积与叉积","page":"09-math.html","anchor":"dot-cross","brief":"点积判断前后与夹角，叉积判断左右；视野检测的标准做法","group":"数学与图形"},{"key":"m-quaternion","title":"四元数","page":"09-math.html","anchor":"quaternion","brief":"轴加角表示旋转；a*b 表示先 b 后 a，从右往左读","group":"数学与图形"},{"key":"m-interpolation","title":"插值与缓动","page":"09-math.html","anchor":"interp","brief":"帧率无关的平滑：MoveTowards/SmoothDamp/Exp 逼近","group":"数学与图形"},{"key":"g-pipeline","title":"渲染管线","page":"10-graphics.html","anchor":"pipeline","brief":"应用/几何/像素/后处理四阶段，性能瓶颈各在哪里","group":"数学与图形"},{"key":"g-spaces","title":"坐标空间变换","page":"10-graphics.html","anchor":"spaces","brief":"模型到世界到观察到裁剪到屏幕，MVP 矩阵从右往左应用","group":"数学与图形"},{"key":"g-drawcall","title":"Draw Call 与合批","page":"10-graphics.html","anchor":"batching","brief":"静态/动态/SRP Batcher/GPU Instancing，合批失败的常见原因","group":"数学与图形"},{"key":"g-shader","title":"Shader 基础","page":"10-graphics.html","anchor":"shader","brief":"ShaderLab 结构、顶点/片元着色器、兰伯特光照公式","group":"数学与图形"},{"key":"g-urp","title":"URP 渲染管线","page":"10-graphics.html","anchor":"urp","brief":"Built-in/URP/HDRP 的选型，迁移成本与判断方法","group":"数学与图形"},{"key":"cpp-compile","title":"C++ 编译模型","page":"03-cpp-basic.html","anchor":"difference","brief":"声明与定义分离、编译/链接/运行时三类错误","group":"C++ 语言"},{"key":"cpp-header","title":"头文件规范","page":"03-cpp-basic.html","anchor":"header","brief":"头文件保护、前向声明、禁止 using namespace","group":"C++ 语言"},{"key":"cpp-raii","title":"RAII","page":"04-cpp-memory.html","anchor":"raii","brief":"资源绑定对象生命周期，构造获取、析构释放","group":"C++ 语言"},{"key":"cpp-smartptr","title":"智能指针","page":"04-cpp-memory.html","anchor":"raii","brief":"unique/shared/weak，循环引用的陷阱与解法","group":"C++ 语言"},{"key":"cpp-vtable","title":"虚函数与多态","page":"05-cpp-oop.html","anchor":"vtable","brief":"vtable 原理、虚析构、对象切片的坑","group":"C++ 语言"},{"key":"cpp-slice","title":"对象切片","page":"05-cpp-oop.html","anchor":"value-semantics","brief":"值语义持有基类会导致多态失效","group":"C++ 语言"},{"key":"cpp-template","title":"C++ 模板","page":"06-cpp-template.html","anchor":"difference","brief":"编译期代码生成、代码膨胀、错误信息解读","group":"C++ 语言"},{"key":"cpp-modern","title":"现代 C++ 特性","page":"07-cpp-modern.html","anchor":"cpp11","brief":"auto、范围 for、lambda、nullptr、移动语义","group":"C++ 语言"},{"key":"cpp-concurrency","title":"C++ 并发","page":"08-cpp-concurrency.html","anchor":"threads","brief":"线程、原子、数据竞争与死锁","group":"C++ 语言"},{"key":"cpp-build","title":"C++ 构建系统","page":"09-cpp-build.html","anchor":"unreal-build","brief":"UBT 用 C# 写、.Build.cs 模块依赖","group":"C++ 语言"},{"key":"ue-macro","title":"Unreal 宏系统","page":"12-ue-cpp.html","anchor":"macros","brief":"UCLASS/UPROPERTY/UFUNCTION 与 UHT","group":"Unreal 引擎"},{"key":"ue-uproperty","title":"UPROPERTY 与 GC","page":"12-ue-cpp.html","anchor":"gc","brief":"最大作用是防 GC 回收，漏写会导致指针变 nullptr","group":"Unreal 引擎"},{"key":"ue-naming","title":"UE 命名约定","page":"12-ue-cpp.html","anchor":"naming","brief":"A/U/F/I/T/E 前缀是编译要求不是风格问题","group":"Unreal 引擎"},{"key":"ue-gameplay","title":"Gameplay 框架","page":"13-ue-framework.html","anchor":"classes","brief":"Actor/Pawn/Controller/GameMode/GameState","group":"Unreal 引擎"},{"key":"ue-lifecycle","title":"Actor 生命周期","page":"13-ue-framework.html","anchor":"lifecycle","brief":"Constructor/BeginPlay/Tick/EndPlay 的顺序与禁忌","group":"Unreal 引擎"},{"key":"ue-bp-boundary","title":"C++ 与蓝图边界","page":"14-ue-blueprint.html","anchor":"boundary","brief":"按「多久变一次」划分，蓝图慢 10~40 倍","group":"Unreal 引擎"},{"key":"ue-expose","title":"暴露给蓝图","page":"14-ue-blueprint.html","anchor":"expose","brief":"BlueprintCallable/NativeEvent 与 _Implementation 后缀","group":"Unreal 引擎"},{"key":"ue-gas","title":"GAS 技能系统","page":"15-ue-gas.html","anchor":"should-use","brief":"先判断要不要用，五个核心概念与 GameplayTag","group":"Unreal 引擎"},{"key":"ue-anim","title":"UE 动画系统","page":"16-ue-anim.html","anchor":"animbp","brief":"状态机、Blend Space、Anim Notify 做攻击判定","group":"Unreal 引擎"},{"key":"ue-nanite","title":"Nanite 与 Lumen","page":"17-ue-render.html","anchor":"ue5","brief":"Nanite 的三个限制、Lumen 的性能代价","group":"Unreal 引擎"},{"key":"ue-niagara","title":"Niagara 特效","page":"18-ue-niagara.html","anchor":"niagara","brief":"CPU/GPU 粒子选择、特效的性能预算","group":"Unreal 引擎"},{"key":"ue-physics","title":"Chaos 物理","page":"18-ue-niagara.html","anchor":"physics","brief":"刚体/破碎/布料，物理的性能陷阱","group":"Unreal 引擎"},{"key":"ue-replication","title":"网络复制","page":"19-ue-network.html","anchor":"model","brief":"服务器权威、三种 RPC、客户端预测","group":"Unreal 引擎"},{"key":"ue-umg","title":"UMG 性能陷阱","page":"20-ue-ui.html","anchor":"umg","brief":"每帧重绘是最大陷阱，要用 Invalidation Box","group":"Unreal 引擎"},{"key":"ue-audio","title":"UE 音频","page":"20-ue-ui.html","anchor":"audio","brief":"Concurrency 并发限制、Sound Class 音量分组","group":"Unreal 引擎"},{"key":"ue-editor-ext","title":"编辑器扩展","page":"21-ue-editor.html","anchor":"tools","brief":"Editor Utility Widget 是最容易上手的","group":"Unreal 引擎"},{"key":"ue-subsystem","title":"Subsystem","page":"22-patterns.html","anchor":"subsystem","brief":"替代手写单例，引擎管理生命周期","group":"Unreal 引擎"},{"key":"ue-interface","title":"UE 接口","page":"22-patterns.html","anchor":"component","brief":"用接口替代 Cast 到具体类","group":"Unreal 引擎"},{"key":"ue-perf","title":"UE 性能排查","page":"23-perf.html","anchor":"workflow","brief":"PIE 数据不可信，stat unit 怎么读","group":"Unreal 引擎"},{"key":"ue-vcs","title":"UE 版本控制","page":"24-engineering.html","anchor":"vcs","brief":".uasset 必须 LFS 且无法合并","group":"Unreal 引擎"},{"key":"ue-cook","title":"UE 打包","page":"24-engineering.html","anchor":"build","brief":"四种配置、BuildCookRun 的五个阶段","group":"Unreal 引擎"},{"key":"lua-basic","title":"Lua 基础语法","page":"03-lua-basic.html","anchor":"types","brief":"索引从 1 开始、只有 nil 和 false 是假值","group":"Lua 语言"},{"key":"lua-table","title":"Lua table","page":"04-lua-table.html","anchor":"table-basic","brief":"# 对含 nil 的表不可靠，用 select 计数","group":"Lua 语言"},{"key":"lua-metatable","title":"元表","page":"04-lua-table.html","anchor":"metatable","brief":"__index 两种形式、__newindex、运算符重载","group":"Lua 语言"},{"key":"lua-class","title":"Lua 实现类","page":"06-lua-oop.html","anchor":"oop","brief":"__index 链实现继承","group":"Lua 语言"},{"key":"lua-super-trap","title":"super 无限递归","page":"15-framework-oop.html","anchor":"super-trap","brief":"self.super 查到的是实例的类，三级继承必崩","group":"Lua 语言"},{"key":"lua-coroutine","title":"协程","page":"07-lua-advanced.html","anchor":"coroutine","brief":"resume 与 wrap 的错误处理差异，写迭代器","group":"Lua 语言"},{"key":"lua-error","title":"Lua 错误处理","page":"07-lua-advanced.html","anchor":"error","brief":"error 的 level 参数、xpcall 抓堆栈","group":"Lua 语言"},{"key":"lua-gc","title":"GC 与弱表","page":"07-lua-advanced.html","anchor":"gc","brief":"弱表做缓存，不阻止对象被回收","group":"Lua 语言"},{"key":"lua-sandbox","title":"环境与沙箱","page":"07-lua-advanced.html","anchor":"sandbox","brief":"_ENV 与 load 的第四参数做沙箱","group":"Lua 语言"},{"key":"lua-perf-basic","title":"Lua 性能基础","page":"08-lua-perf.html","anchor":"data","brief":"table.concat 远快于 ..；缓存全局函数的收益取决于调用层级（单层约 1.0~1.3 倍，两层链 2~2.9 倍），缓存全局变量约 2~3.5 倍","group":"Lua 语言"},{"key":"lua-require","title":"require 与模块","page":"09-hotupdate-basics.html","anchor":"require","brief":"package.loaded 缓存，热更要清缓存","group":"Lua 语言"},{"key":"xlua-boundary","title":"xLua 跨语言边界","page":"11-xlua-advanced.html","anchor":"cost","brief":"调用开销 5~20 倍，核心是减少调用次数","group":"Lua 语言"},{"key":"fw-module","title":"模块管理器","page":"13-framework-design.html","anchor":"module","brief":"注册/初始化/逆序销毁","group":"Lua 语言"},{"key":"fw-event","title":"事件系统","page":"13-framework-design.html","anchor":"event","brief":"快照遍历 + 队列化派发，防止回调中修改列表","group":"Lua 语言"},{"key":"ui-stack","title":"UI 界面栈","page":"16-framework-ui.html","anchor":"stack","brief":"三种界面类型、返回键、订阅自动取消","group":"Lua 语言"},{"key":"hotupdate-basic","title":"热更新原理","page":"09-hotupdate-basics.html","anchor":"require","brief":"清 package.loaded + 重新 require，旧引用问题","group":"Lua 语言"},{"key":"algo-complexity","title":"复杂度直觉","page":"02-complexity.html","anchor":"budget","brief":"每帧 16.7ms，单系统 1~2ms 预算","group":"算法基础"},{"key":"algo-array","title":"数组与环形缓冲","page":"03-array-list.html","anchor":"ring-apps","brief":"环形缓冲索引环绕、三个经典应用","group":"算法基础"},{"key":"algo-linked","title":"链表、栈与队列","page":"04-linked-stack-queue.html","anchor":"linked-list","brief":"游戏里为什么少用链表；队列不该用 remove(t,1)","group":"算法基础"},{"key":"algo-hash","title":"哈希表","page":"05-hash.html","anchor":"load","brief":"负载因子、浮点不能做 key、索引优化","group":"算法基础"},{"key":"algo-tree","title":"树结构","page":"06-tree-basic.html","anchor":"trees-in-games","brief":"游戏里的九种树、BST 退化","group":"算法基础"},{"key":"algo-heap","title":"堆与优先队列","page":"07-heap-priority.html","anchor":"topk","brief":"Top-K 用最小堆，建堆是 O(n)","group":"算法基础"},{"key":"algo-trie","title":"Trie 与敏感词","page":"08-trie.html","anchor":"problem","brief":"O(文本长) 而非 O(词数×文本长)","group":"算法基础"},{"key":"algo-unionfind","title":"并查集","page":"09-union-find.html","anchor":"optimizations","brief":"路径压缩 + 按秩合并，朴素版慢 8 倍","group":"算法基础"},{"key":"algo-graph","title":"图与遍历","page":"10-graph.html","anchor":"traversal","brief":"BFS 用队列找最短，DFS 用栈判连通","group":"核心算法"},{"key":"algo-pathfinding","title":"A* 寻路","page":"11-pathfinding.html","anchor":"heuristic","brief":"启发函数减少 60% 扩展，h 高估会非最优","group":"核心算法"},{"key":"algo-spatial","title":"空间划分","page":"12-spatial.html","anchor":"grid","brief":"格子 < 半径会静默漏检（33/167）","group":"核心算法"},{"key":"algo-sort","title":"排序与选择","page":"13-sorting.html","anchor":"no-sort","brief":"Top-K 快 8.4 倍、快速选择 O(n)、小数组用插入","group":"核心算法"},{"key":"algo-search","title":"查找与索引","page":"14-search.html","anchor":"index","brief":"索引比遍历快两个数量级，二分有六个易错点","group":"核心算法"},{"key":"algo-dp","title":"动态规划与贪心","page":"15-dynamic-programming.html","anchor":"do-you-need","brief":"游戏里 DP 用得不多，贪心更适合","group":"核心算法"},{"key":"algo-fsm","title":"状态机","page":"16-state-machine.html","anchor":"five","brief":"状态数 > 10 时转移爆炸，要换行为树","group":"游戏 AI"},{"key":"algo-bt","title":"行为树","page":"17-behavior-tree.html","anchor":"status","brief":"六种节点、与状态机的选择依据","group":"游戏 AI"},{"key":"algo-dt","title":"决策树与效用","page":"18-decision-tree.html","anchor":"utility","brief":"效用评分让 AI 决策更平滑","group":"游戏 AI"},{"key":"algo-goap","title":"GOAP","page":"19-goap-planner.html","anchor":"when","brief":"规划器本质是 A*，代价是可预测性","group":"游戏 AI"},{"key":"algo-boids","title":"Boids 群体","page":"20-boids-flock.html","anchor":"three-rules","brief":"分离/对齐/聚合三条规则，必须用空间划分优化","group":"游戏 AI"},{"key":"algo-reddot","title":"红点系统","page":"21-reddot.html","anchor":"basic","brief":"脏标记向上传播，避免每帧遍历","group":"系统设计"},{"key":"algo-quest","title":"任务与成就","page":"22-quest-achievement.html","anchor":"tracking","brief":"事件驱动代替轮询，进度要持久化","group":"系统设计"},{"key":"algo-buff","title":"Buff 与技能","page":"23-buff-skill.html","anchor":"buff","brief":"四种叠加规则，控制类必须设上限","group":"系统设计"},{"key":"algo-inventory","title":"背包与掉落","page":"24-inventory-drop.html","anchor":"weighted-random","brief":"权重是相对值，前缀和+二分优化","group":"系统设计"},{"key":"algo-timer","title":"定时器调度","page":"25-time-scheduler.html","anchor":"problems","brief":"五个实战问题，标记删除防泄漏","group":"系统设计"},{"key":"algo-perf","title":"性能模式库","page":"26-perf-patterns.html","anchor":"counter","brief":"六种模式，三个可能反而更慢的反例","group":"性能工程"},{"key":"algo-cache","title":"缓存与 LRU","page":"27-cache-lru.html","anchor":"policies","brief":"四种淘汰策略，LRU 要哈希表+双向链表","group":"性能工程"},{"key":"algo-bitwise","title":"位运算","page":"28-bitwise.html","anchor":"value","brief":"价值在省空间不是省时间","group":"性能工程"},{"key":"algo-serialize","title":"存档与序列化","page":"29-serialize.html","anchor":"safety","brief":"向后兼容、原子写入、备份","group":"性能工程"},{"key":"algo-debug","title":"调试工具","page":"30-debug-tools.html","anchor":"tools","brief":"时间线录制用环形缓冲，日志要条件包裹","group":"性能工程"},{"key":"be-http","title":"HTTP 与 REST","page":"03-http-basics.html","anchor":"response","brief":"统一响应 code/msg/data、状态码语义、错误码分段","group":"后端基础"},{"key":"be-idempotent","title":"幂等设计","page":"03-http-basics.html","anchor":"idempotency","brief":"重复调用只生效一次；「已处理」要返回成功","group":"后端基础"},{"key":"be-di","title":"依赖注入","page":"04-aspnet-core.html","anchor":"di","brief":"依赖接口不依赖实现，便于替换与测试","group":"后端基础"},{"key":"be-lifetime","title":"三种生命周期","page":"04-aspnet-core.html","anchor":"lifetime","brief":"Singleton/Scoped/Transient；DbContext 必须 Scoped","group":"后端基础"},{"key":"be-middleware","title":"中间件","page":"04-aspnet-core.html","anchor":"middleware","brief":"请求管道的每一环，可短路；顺序决定行为","group":"后端基础"},{"key":"be-config","title":"配置系统","page":"04-aspnet-core.html","anchor":"config","brief":"json -> json.{Env} -> 环境变量 -> 命令行，后者覆盖前者","group":"后端基础"},{"key":"be-binding","title":"参数来源与绑定","page":"05-routing-modelbind.html","anchor":"sources","brief":"Route/Query/Body/Header/Form 五个来源","group":"后端基础"},{"key":"be-validation","title":"参数校验","page":"05-routing-modelbind.html","anchor":"validation","brief":"客户端可绕过一切前端校验，服务端必须再校验","group":"后端基础"},{"key":"be-paging","title":"分页边界","page":"05-routing-modelbind.html","anchor":"paging","brief":"size 上限、page 不能为 0","group":"后端基础"},{"key":"be-password","title":"密码存储","page":"06-auth.html","anchor":"password","brief":"慢哈希 + 盐；不能用可逆加密","group":"后端基础"},{"key":"be-jwt","title":"JWT","page":"06-auth.html","anchor":"jwt","brief":"三段结构；Payload 只是 Base64 不是加密","group":"后端基础"},{"key":"be-dual-token","title":"双 Token 机制","page":"06-auth.html","anchor":"dual-token","brief":"access 短 + refresh 长，refresh 一次性","group":"后端基础"},{"key":"be-authz","title":"越权防护","page":"06-auth.html","anchor":"authz","brief":"水平/垂直越权；必须校验资源归属","group":"后端基础"},{"key":"be-nplus1","title":"N+1 查询","page":"07-database.html","anchor":"nplus1","brief":"1 次主表 + N 次关联；用 Include 或一次性取回","group":"后端基础"},{"key":"be-index","title":"索引","page":"07-database.html","anchor":"index","brief":"O(n) 变 O(1)；代价是存储和写入变慢","group":"后端基础"},{"key":"be-transaction","title":"事务","page":"07-database.html","anchor":"transaction","brief":"要么全成功要么全回滚；事务要短","group":"后端基础"},{"key":"be-migration","title":"数据库迁移","page":"07-database.html","anchor":"migration","brief":"结构变更进版本库；生产用 script 审核","group":"后端基础"},{"key":"be-cache-pattern","title":"Cache Aside","page":"08-redis-cache.html","anchor":"patterns","brief":"读时回填、写时删缓存","group":"后端基础"},{"key":"be-cache-3","title":"穿透/击穿/雪崩","page":"08-redis-cache.html","anchor":"three-problems","brief":"不存在/热点过期/集体过期；三种解法","group":"后端基础"},{"key":"be-distlock","title":"分布式锁","page":"08-redis-cache.html","anchor":"distributed-lock","brief":"SET NX EX；释放必须校验 token","group":"后端基础"},{"key":"be-mq-semantics","title":"投递语义","page":"09-message-queue.html","anchor":"semantics","brief":"AtMostOnce/AtLeastOnce/ExactlyOnce；业务选 AtLeastOnce","group":"后端基础"},{"key":"be-mq-idem","title":"幂等消费","page":"09-message-queue.html","anchor":"idempotent","brief":"记录已处理消息 ID；重复返回成功","group":"后端基础"},{"key":"be-mq-dlq","title":"重试与死信队列","page":"09-message-queue.html","anchor":"retry","brief":"不能无限重试；失败进死信人工处理","group":"后端基础"},{"key":"be-eventual","title":"最终一致性","page":"09-message-queue.html","anchor":"eventual","brief":"同步扣钱 + 异步发货，短暂不一致可接受","group":"后端基础"},{"key":"be-log-level","title":"日志分级","page":"10-logging-monitor.html","anchor":"levels","brief":"Trace~Fatal；低级别生产关闭","group":"后端基础"},{"key":"be-structured-log","title":"结构化日志","page":"10-logging-monitor.html","anchor":"structured","brief":"用字段而非拼字符串，可查询可聚合","group":"后端基础"},{"key":"be-tracing","title":"链路追踪","page":"10-logging-monitor.html","anchor":"tracing","brief":"traceId 全链路传递，定位哪一步慢","group":"后端基础"},{"key":"be-p99","title":"P99 与指标","page":"10-logging-monitor.html","anchor":"metrics","brief":"看 P99 不看平均；Counter/Gauge/Histogram","group":"后端基础"},{"key":"gb-overview","title":"游戏后端分层","page":"11-game-backend-overview.html","anchor":"layers","brief":"网关/登录/大厅/战斗/世界/匹配/排行","group":"游戏后端"},{"key":"gb-stateful","title":"有状态 vs 无状态","page":"11-game-backend-overview.html","anchor":"stateful","brief":"无状态可随便扩；有状态要路由到固定实例","group":"游戏后端"},{"key":"gb-gateway","title":"网关职责","page":"11-game-backend-overview.html","anchor":"gateway","brief":"连接管理、路由、鉴权、主动推送","group":"游戏后端"},{"key":"gb-sticky","title":"粘包与拆包","page":"12-long-short-connection.html","anchor":"sticky","brief":"TCP 是字节流；用长度前缀定义消息边界","group":"游戏后端"},{"key":"gb-heartbeat","title":"心跳与超时","page":"12-long-short-connection.html","anchor":"heartbeat","brief":"对端断网不会立刻发现；应用层自己做心跳","group":"游戏后端"},{"key":"gb-reconnect","title":"断线重连","page":"12-long-short-connection.html","anchor":"reconnect","brief":"战斗中断线走会话恢复，不是重新登录","group":"游戏后端"},{"key":"gb-field-number","title":"字段编号","page":"13-protocol-design.html","anchor":"field-number","brief":"用编号代替字段名，省 57% 带宽","group":"游戏后端"},{"key":"gb-compat","title":"协议向前兼容","page":"13-protocol-design.html","anchor":"compatibility","brief":"字段编号永不复用；跳过未知字段","group":"游戏后端"},{"key":"gb-sync-compare","title":"两种同步对比","page":"14-state-sync.html","anchor":"comparison","brief":"状态同步传结果，帧同步传操作","group":"游戏后端"},{"key":"gb-determinism","title":"确定性","page":"14-state-sync.html","anchor":"determinism","brief":"浮点/随机/遍历顺序三个不确定，帧同步必须解决","group":"游戏后端"},{"key":"gb-prediction","title":"客户端预测","page":"14-state-sync.html","anchor":"prediction","brief":"本地立即执行 + 服务器校正；预测错会「回拉」","group":"游戏后端"},{"key":"gb-room","title":"房间状态机","page":"15-battle-server.html","anchor":"state-machine","brief":"Waiting/Loading/Playing/Settling/Closed","group":"游戏后端"},{"key":"gb-settle","title":"结算幂等","page":"15-battle-server.html","anchor":"settle","brief":"触发路径有多条，必须防止重复发奖","group":"游戏后端"},{"key":"gb-battle-verify","title":"战斗校验","page":"15-battle-server.html","anchor":"validate","brief":"用理论上限交叉校验客户端上报数据","group":"游戏后端"},{"key":"gb-matchmaking","title":"匹配策略","page":"16-matchmaking.html","anchor":"tradeoff","brief":"随时间放宽 MMR 范围；分段匹配避免 O(n²)","group":"游戏后端"},{"key":"gb-elo","title":"Elo 评分","page":"16-matchmaking.html","anchor":"elo","brief":"赢强手加分多，赢弱手加分少","group":"游戏后端"},{"key":"gb-leaderboard","title":"排行榜实现","page":"17-leaderboard.html","anchor":"why-skiplist","brief":"跳表/ZSet；玩家最关心「我附近」","group":"游戏后端"},{"key":"gb-concurrency","title":"并发扣减","page":"18-inventory-economy.html","anchor":"concurrency","brief":"加锁/乐观锁/条件 UPDATE/队列串行化","group":"游戏后端"},{"key":"gb-item-flow","title":"道具流水","page":"18-inventory-economy.html","anchor":"flow","brief":"每笔变更留痕，可对账可追溯","group":"游戏后端"},{"key":"gb-anticheat","title":"服务端权威","page":"19-anticheat.html","anchor":"authority","brief":"改了会影响他人或经济的，必须在服务端算","group":"游戏后端"},{"key":"gb-speed-check","title":"速度校验","page":"19-anticheat.html","anchor":"speed","brief":"距离/时间差，留容差但不给外挂空间","group":"游戏后端"},{"key":"fs-framework","title":"前端选型","page":"20-fullstack-frontend.html","anchor":"choice","brief":"小后台用 Razor；不要为了先进引入整套前端工程","group":"全栈能力"},{"key":"fs-paging-api","title":"分页接口设计","page":"20-fullstack-frontend.html","anchor":"paging-api","brief":"一次返回 items+total+page+size","group":"全栈能力"},{"key":"fs-gm-role","title":"GM 权限模型","page":"21-admin-panel.html","anchor":"roles","brief":"Viewer/Operator/Admin/SuperAdmin 四级","group":"全栈能力"},{"key":"fs-gm-grant","title":"GM 发奖四道防线","page":"21-admin-panel.html","anchor":"grant","brief":"权限/校验/幂等/审计","group":"全栈能力"},{"key":"fs-batch","title":"批量操作","page":"21-admin-panel.html","anchor":"batch","brief":"先预览再执行；分批 + 容忍部分失败","group":"全栈能力"},{"key":"fs-deploy-atomic","title":"原子部署","page":"22-deploy.html","anchor":"atomic","brief":"健康检查通过才切流量；保留旧版本可回滚","group":"全栈能力"},{"key":"fs-release","title":"发布策略","page":"22-deploy.html","anchor":"strategies","brief":"滚动/蓝绿/金丝雀；金丝雀风险最小","group":"全栈能力"},{"key":"fs-health","title":"健康检查","page":"22-deploy.html","anchor":"health","brief":"liveness 重启 vs readiness 摘流量","group":"全栈能力"},{"key":"fs-stateless","title":"无状态化","page":"23-scaling.html","anchor":"stateless","brief":"水平扩展的前提；Session 存 Redis","group":"全栈能力"},{"key":"fs-lb","title":"负载均衡","page":"23-scaling.html","anchor":"lb","brief":"轮询/最少连接/一致性哈希","group":"全栈能力"},{"key":"fs-ratelimit","title":"限流算法","page":"23-scaling.html","anchor":"ratelimit","brief":"固定窗口有边界突发；令牌桶允许突发","group":"全栈能力"},{"key":"fs-circuit","title":"熔断器","page":"23-scaling.html","anchor":"circuit-breaker","brief":"Closed/Open/HalfOpen；防止雪崩","group":"全栈能力"},{"key":"fs-sqli","title":"SQL 注入","page":"24-security.html","anchor":"sqli","brief":"永远参数化，不要拼接 SQL","group":"全栈能力"},{"key":"fs-xss","title":"XSS 与转义","page":"24-security.html","anchor":"xss","brief":"转义要匹配输出上下文","group":"全栈能力"},{"key":"fs-masking","title":"敏感信息脱敏","page":"24-security.html","anchor":"masking","brief":"客服后台/日志要脱敏，玩家看自己要完整","group":"全栈能力"},{"key":"be-perf-layers","title":"优化五层","page":"25-perf.html","anchor":"layers","brief":"架构>数据库>算法>代码>参数","group":"后端工程"},{"key":"be-connpool","title":"连接池","page":"25-perf.html","anchor":"pool","brief":"避免握手开销；池满要等待不能无限建","group":"后端工程"},{"key":"be-boxing","title":"装箱开销","page":"25-perf.html","anchor":"boxing","brief":"List<object> 有堆分配；用泛型零装箱","group":"后端工程"},{"key":"be-async-trap","title":"异步陷阱","page":"25-perf.html","anchor":"async","brief":"async void 抓不到异常；.Result 会死锁","group":"后端工程"},{"key":"be-test-pyramid","title":"测试金字塔","page":"26-testing.html","anchor":"pyramid","brief":"单元 70% / 集成 20% / 端到端 10%","group":"后端工程"},{"key":"be-testability","title":"可测试性","page":"26-testing.html","anchor":"testability","brief":"依赖注入 + 假时钟；不要内部 new 或 DateTime.Now","group":"后端工程"},{"key":"be-layering","title":"分层与依赖方向","page":"27-architecture.html","anchor":"layering","brief":"上层依赖下层；下层不能反向依赖","group":"后端工程"},{"key":"be-arch-event","title":"事件驱动解耦","page":"27-architecture.html","anchor":"event","brief":"发事件而非直接调用，新增功能不改业务代码","group":"后端工程"},{"key":"be-domain","title":"贫血 vs 充血","page":"27-architecture.html","anchor":"domain","brief":"规则收进实体，绕不过；核心实体推荐充血","group":"后端工程"},{"key":"be-ai","title":"AI 辅助后端","page":"28-ai.html","anchor":"boundary","brief":"AI 易犯并发/幂等/边界三错，必须人工审查","group":"后端工程"},{"key":"u-lifecycle","title":"生命周期与执行顺序","page":"11-unity-core.html","anchor":"lifecycle","brief":"Awake/Start/Update/FixedUpdate/LateUpdate 的选择依据","group":"Unity 引擎"},{"key":"u-gameobject","title":"查找 API 与性能","page":"11-unity-core.html","anchor":"find","brief":"组件式架构、查找 API 的性能对照、缓存策略","group":"Unity 引擎"},{"key":"u-transform","title":"Transform 与坐标","page":"11-unity-core.html","anchor":"lifecycle","brief":"世界与局部坐标转换、父子关系的性能影响","group":"Unity 引擎"},{"key":"u-prefab","title":"预制体","page":"11-unity-core.html","anchor":"prefab","brief":"Instantiate/Destroy 的真实成本，对象池的适用场景","group":"Unity 引擎"},{"key":"u-scriptableobject","title":"ScriptableObject","page":"11-unity-core.html","anchor":"so","brief":"数据与代码分离：配置表、事件通道、全局数据容器","group":"Unity 引擎"},{"key":"u-scene","title":"预制体与对象池","page":"11-unity-core.html","anchor":"prefab","brief":"Instantiate/Destroy 成本、对象池、场景加载策略","group":"Unity 引擎"},{"key":"u-physics","title":"物理系统","page":"12-unity-physics.html","anchor":"rigidbody","brief":"Rigidbody、力的四种模式、速度与 MovePosition 的选择","group":"Unity 引擎"},{"key":"u-collision","title":"碰撞与触发器","page":"12-unity-physics.html","anchor":"collision","brief":"碰撞检测矩阵：谁和谁会触发、静态物体之间不碰撞","group":"Unity 引擎"},{"key":"u-raycast","title":"射线检测","page":"12-unity-physics.html","anchor":"raycast","brief":"Raycast/SphereCast/Overlap，NonAlloc 零分配版本","group":"Unity 引擎"},{"key":"u-physics-perf","title":"物理性能优化","page":"12-unity-physics.html","anchor":"perf","brief":"图层碰撞矩阵、固定时间步、Kinematic 与 CharacterController","group":"Unity 引擎"},{"key":"u-animator","title":"Animator 状态机","page":"13-unity-anim.html","anchor":"animator","brief":"参数、状态、过渡、混合树、动画事件、StringToHash 缓存","group":"Unity 引擎"},{"key":"u-anim-ik","title":"IK 与 Root Motion","page":"13-unity-anim.html","anchor":"ik","brief":"反向动力学与根运动，让动画与物理地形贴合","group":"Unity 引擎"},{"key":"u-tween","title":"代码动画与 Tween","page":"13-unity-anim.html","anchor":"tween","brief":"简单的位移缩放用代码做，比 Animator 更轻量","group":"Unity 引擎"},{"key":"u-ugui","title":"UGUI 布局与锚点","page":"14-unity-ui.html","anchor":"ugui","brief":"RectTransform 锚点、多分辨率适配、LayoutGroup 的代价","group":"Unity 引擎"},{"key":"u-canvas-rebuild","title":"Canvas 重建机制","page":"14-unity-ui.html","anchor":"rebuild","brief":"任何元素变化都重建整个 Canvas，所以要拆分 Canvas","group":"Unity 引擎"},{"key":"u-tmp","title":"TextMeshPro","page":"14-unity-ui.html","anchor":"tmp","brief":"SetText 的零分配重载、不解析 :F1 格式说明符","group":"Unity 引擎"},{"key":"u-ui-toolkit","title":"UGUI 优化清单","page":"14-unity-ui.html","anchor":"optimize","brief":"Raycast Target、CanvasGroup、图集、TMP 的选型与优化","group":"Unity 引擎"},{"key":"u-input-old","title":"旧输入系统","page":"15-unity-input.html","anchor":"legacy-detail","brief":"Input.GetAxis/GetKey，轴配置与移动端适配","group":"Unity 引擎"},{"key":"u-input-new","title":"Input System","page":"15-unity-input.html","anchor":"two-systems","brief":"InputAction、回调与轮询、手柄与触屏、按键重映射","group":"Unity 引擎"},{"key":"u-audio","title":"音频系统","page":"15-unity-input.html","anchor":"audio","brief":"AudioSource/AudioMixer、3D 音效衰减、音量转 dB","group":"Unity 引擎"},{"key":"u-resources","title":"Resources 的陷阱","page":"16-unity-assets.html","anchor":"resources-problem","brief":"全量打包、启动变慢、无法热更，官方不推荐使用","group":"Unity 引擎"},{"key":"u-assetbundle","title":"AssetBundle","page":"16-unity-assets.html","anchor":"bundle-pain","brief":"依赖管理、加载与卸载、Unload 参数的含义","group":"Unity 引擎"},{"key":"u-addressables","title":"Addressables","page":"16-unity-assets.html","anchor":"addressables-value","brief":"自动依赖、可远程、引用计数，现代项目的首选资源方案","group":"Unity 引擎"},{"key":"u-hotupdate","title":"热更新方案","page":"16-unity-assets.html","anchor":"hotupdate","brief":"资源热更与代码热更的区别，主流方案与合规边界","group":"Unity 引擎"},{"key":"u-render-pipeline","title":"Unity 渲染管线配置","page":"17-unity-render.html","anchor":"priority","brief":"URP 资产配置、渲染顺序、相机堆叠","group":"Unity 引擎"},{"key":"u-lighting","title":"光照与阴影","page":"17-unity-render.html","anchor":"tiers","brief":"实时光与烘焙光、Lightmap、阴影距离与性能","group":"Unity 引擎"},{"key":"u-postfx","title":"后处理","page":"17-unity-render.html","anchor":"mpb","brief":"Volume 系统、各效果的开销排序、移动端取舍","group":"Unity 引擎"},{"key":"u-lod","title":"LOD 与剔除","page":"17-unity-render.html","anchor":"mpb","brief":"LOD Group、视锥剔除、遮挡剔除、Culling 设置","group":"Unity 引擎"},{"key":"u-jobsystem","title":"Job System","page":"18-unity-ecs.html","anchor":"why","brief":"多线程并行计算，Job 内不能访问托管对象、不能用异常","group":"Unity 引擎"},{"key":"u-burst","title":"Burst 编译器","page":"18-unity-ecs.html","anchor":"burst","brief":"SIMD 向量化，纯数学运算快 5 到 20 倍","group":"Unity 引擎"},{"key":"u-native","title":"NativeContainer","page":"18-unity-ecs.html","anchor":"concepts","brief":"非托管容器，必须手动 Dispose，否则泄漏","group":"Unity 引擎"},{"key":"u-ecs","title":"ECS 架构","page":"18-unity-ecs.html","anchor":"ecs","brief":"Entity/Component/System，数据导向设计，何时值得迁移","group":"Unity 引擎"},{"key":"u-editor-inspector","title":"自定义 Inspector","page":"19-unity-editor.html","anchor":"rules","brief":"CustomEditor、PropertyDrawer，让策划少犯错","group":"Unity 引擎"},{"key":"u-editor-window","title":"EditorWindow","page":"19-unity-editor.html","anchor":"rules","brief":"自制编辑器工具窗口，批量处理资产","group":"Unity 引擎"},{"key":"u-editor-pipeline","title":"资产导入与构建管线","page":"19-unity-editor.html","anchor":"toolchain","brief":"AssetPostprocessor 自动处理导入，构建脚本自动化","group":"Unity 引擎"},{"key":"p-singleton","title":"单例","page":"20-patterns.html","anchor":"five","brief":"注意假 null 与静态状态残留，DontDestroyOnLoad 的取舍","group":"通用能力"},{"key":"p-observer","title":"观察者与事件总线","page":"20-patterns.html","anchor":"five","brief":"跨模块解耦，但要注意订阅泄漏与调用链追踪","group":"通用能力"},{"key":"p-statemachine","title":"状态机","page":"20-patterns.html","anchor":"five","brief":"枚举加 switch 适合简单场景，类状态机适合可扩展需求","group":"通用能力"},{"key":"p-objectpool","title":"对象池","page":"20-patterns.html","anchor":"five","brief":"降低 Instantiate/Destroy 成本，但不是所有场景都适合","group":"通用能力"},{"key":"p-mvc","title":"MVC/MVP 与 DI","page":"20-patterns.html","anchor":"five","brief":"把业务逻辑与 Unity 解耦，便于单元测试","group":"通用能力"},{"key":"perf-profiler","title":"性能分析工具","page":"21-perf.html","anchor":"workflow","brief":"Profiler/Frame Debugger/Memory Profiler 的分工","group":"通用能力"},{"key":"perf-cpu","title":"CPU 瓶颈定位","page":"21-perf.html","anchor":"four-types","brief":"从 PlayerLoop 定位到具体方法，区分主线程与渲染线程","group":"通用能力"},{"key":"perf-gpu","title":"GPU 瓶颈与画质取舍","page":"21-perf.html","anchor":"four-types","brief":"分辨率/阴影/后处理/粒子，移动端优化的优先级","group":"通用能力"},{"key":"perf-memory","title":"内存优化","page":"21-perf.html","anchor":"four-types","brief":"纹理压缩、图集、资源卸载、内存峰值控制","group":"通用能力"},{"key":"perf-device","title":"真机调优流程","page":"21-perf.html","anchor":"mobile","brief":"连真机 Profile、发热降频、机型分级策略","group":"通用能力"},{"key":"n-sync","title":"帧同步 vs 状态同步","page":"22-network-eng.html","anchor":"sync","brief":"两种同步方案的原理、适用类型与实现难度","group":"通用能力"},{"key":"n-unity-net","title":"Unity 网络方案","page":"22-network-eng.html","anchor":"sync","brief":"NGO/Mirror/Photon 的选型对比","group":"通用能力"},{"key":"n-git","title":"Git 与 LFS","page":"22-network-eng.html","anchor":"engineering","brief":"Unity 项目的版本控制配置、大文件处理、冲突解决","group":"通用能力"},{"key":"n-asmdef","title":"程序集定义 asmdef","page":"22-network-eng.html","anchor":"engineering","brief":"拆分程序集加快编译、强制依赖管理","group":"通用能力"},{"key":"n-cicd","title":"测试与 CI/CD","page":"22-network-eng.html","anchor":"engineering","brief":"单元测试、自动化构建、多平台打包上架","group":"通用能力"},{"key":"ai-workflow","title":"AI 辅助开发","page":"23-ai.html","anchor":"workflow","brief":"AI 编程助手的真实效果、失效场景、版权红线","group":"AI 时代"},{"key":"ai-npc","title":"AI NPC 架构","page":"23-ai.html","anchor":"npc","brief":"LLM 驱动 NPC 的四步循环、延迟与成本控制、安全防护","group":"AI 时代"},{"key":"x-projects","title":"实战项目集","page":"24-projects.html","anchor":"projects","brief":"从入门到作品级的十项目，含验收标准","group":"实践与参考"},{"key":"x-interview","title":"面试与求职","page":"25-interview.html","anchor":"questions","brief":"四级理解标准、高频题分类、项目深挖准备","group":"实践与参考"},{"key":"x-portfolio","title":"作品集与资源","page":"25-interview.html","anchor":"portfolio","brief":"怎么把项目包装成能打动面试官的作品","group":"实践与参考"}];

  var THEME_KEY = 'gbfs-theme';
  var PROG_KEY  = 'gbfs-progress';
  var STORE_OK = (function () {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
    catch (e) { return false; }
  })();

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- 主题 ---------- */
  function currentTheme() {
    var saved = STORE_OK && localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var btn = $('#theme-toggle');
    if (btn) {
      btn.textContent = t === 'dark' ? '浅色' : '深色';
      btn.setAttribute('aria-label', t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    }
  }
  applyTheme(currentTheme());

  /* ---------- 进度存储 ---------- */
  function loadProgress() {
    if (!STORE_OK) return {};
    try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(obj) {
    if (!STORE_OK) return;
    try { localStorage.setItem(PROG_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  /* ---------- 侧边栏 ---------- */
  function renderNav() {
    var nav = $('#sidebar-nav');
    if (!nav) return;
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var groups = [];
    PAGES.forEach(function (p) {
      var g = groups.filter(function (x) { return x.name === p.group; })[0];
      if (!g) { g = { name: p.group, items: [] }; groups.push(g); }
      g.items.push(p);
    });
    var html = '';
    groups.forEach(function (g) {
      html += '<li class="sidebar__group">' + g.name + '</li>';
      g.items.forEach(function (p) {
        var active = p.href.toLowerCase() === here ? ' class="is-active"' : '';
        html += '<li><a href="' + p.href + '"' + active + '>' +
                (p.num ? '<span class="num">' + p.num + '</span>' : '') +
                '<span>' + p.title + '</span></a></li>';
      });
    });
    nav.innerHTML = html;
    var cur = $('.sidebar__nav a.is-active');
    if (cur && cur.scrollIntoView) { try { cur.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
  }

  /* ---------- 多彩色系 ---------- */
  var PALETTE = [
    '#6d28d9', '#0891b2', '#db2777', '#1d4ed8', '#ea580c', '#0d9488',
    '#a21caf', '#4f46e5', '#e11d48', '#059669', '#d97706', '#7c3aed',
    '#2563eb', '#be123c'
  ];

  function currentPageIndex() {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].href.toLowerCase() === here) return i;
    }
    return 0;
  }

  function paintNav() {
    var base = currentPageIndex();
    $$('.sidebar__nav li').forEach(function (li) {
      var a = $('a', li), num = $('.num', li);
      if (!a || !num) return;
      var idx = PAGES.map(function (p) { return p.href; }).indexOf(a.getAttribute('href'));
      if (idx < 0) idx = base;
      num.style.setProperty('--nav-dot', PALETTE[idx % PALETTE.length]);
    });
  }

  function paintHeadings() {
    $$('.content > h2').forEach(function (h2, i) {
      h2.style.setProperty('--h2-color', PALETTE[(currentPageIndex() + i) % PALETTE.length]);
    });
    $$('.content h3').forEach(function (h3, i) {
      h3.style.setProperty('--h3-color', PALETTE[(i * 3 + currentPageIndex() + 2) % PALETTE.length]);
    });
    $$('.content > h1, .content > h2, .content h3').forEach(function (el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) return;
        if (node.nodeValue.indexOf('\u2605') === -1) return;
        var frag = document.createDocumentFragment();
        node.nodeValue.split('\u2605').forEach(function (part, idx) {
          if (idx > 0) {
            var s = document.createElement('span');
            s.className = 'star-mark';
            s.textContent = '\u2605';
            frag.appendChild(s);
          }
          if (part) frag.appendChild(document.createTextNode(part));
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  function paintCards() {
    $$('.card-link').forEach(function (card, i) {
      card.style.setProperty('--card-accent', PALETTE[(i * 2 + currentPageIndex() + 4) % PALETTE.length]);
    });
  }

  function markIconHeadings() {
    $$('h3').forEach(function (h3) { if (h3.querySelector('.mk')) h3.classList.add('has-mk'); });
  }

  /* ---------- 进度追踪 ---------- */
  function initProgress() {
    var boxes = $$('input[type="checkbox"][id]');
    var store = loadProgress();
    boxes.forEach(function (box) {
      if (store[box.id]) box.checked = true;
      box.addEventListener('change', function () {
        var s = loadProgress();
        if (box.checked) s[box.id] = 1; else delete s[box.id];
        saveProgress(s);
        updateProgressUI();
      });
    });
    updateProgressUI();
    var reset = $('#reset-progress');
    if (reset) {
      reset.addEventListener('click', function () {
        if (!window.confirm('确定清空全部学习进度记录吗？此操作不可撤销。')) return;
        saveProgress({});
        boxes.forEach(function (b) { b.checked = false; });
        updateProgressUI();
      });
    }
  }

  function updateProgressUI() {
    var boxes = $$('input[type="checkbox"][id]');
    if (!boxes.length) return;
    var done = boxes.filter(function (b) { return b.checked; }).length;
    var pct = Math.round((done / boxes.length) * 100);
    var fill = $('#progress-fill'), text = $('#progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = done + '/' + boxes.length + ' (' + pct + '%)';
  }

  /* ---------- 搜索 ---------- */
  function initSearch() {
    var input = $('#site-search'), box = $('#search-results');
    if (!input || !box) return;
    var cursor = -1;
    function close() { box.classList.remove('is-open'); box.innerHTML = ''; cursor = -1; }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function render(q) {
      if (!q) return close();
      var ql = q.toLowerCase();

      var hits = PAGES.filter(function (p) {
        return (p.title + ' ' + p.desc + ' ' + p.group + ' ' + p.num).toLowerCase().indexOf(ql) !== -1;
      });
      var kpHits = searchKps(q);

      if (!hits.length && !kpHits.length) {
        box.innerHTML = '<div class="r-empty">没有找到「' + escapeHtml(q) + '」相关的章节或知识点</div>';
        box.classList.add('is-open');
        cursor = -1;
        return;
      }

      var html = '';
      if (hits.length) {
        html += hits.map(function (p, i) {
          return '<a href="' + p.href + '" data-i="' + i + '">' +
                 '<div class="r-title">' + (p.num ? p.num + ' \u00b7 ' : '') + escapeHtml(p.title) + '</div>' +
                 '<div class="r-sub">' + escapeHtml(p.desc) + '</div></a>';
        }).join('');
      }
      if (kpHits.length) {
        html += '<div class="r-group">知识点（' + kpHits.length + '）</div>';
        html += kpHits.slice(0, 12).map(function (k, i) {
          return '<a href="' + k.page + '#' + k.anchor + '" data-i="' + (hits.length + i) + '">' +
                 '<div class="r-title">' + escapeHtml(k.title) +
                 ' <span style="font-weight:400;color:var(--c-muted);font-size:11px">' + escapeHtml(k.page.replace('.html','')) + '</span></div>' +
                 '<div class="r-sub">' + escapeHtml(k.brief) + '</div></a>';
        }).join('');
      }
      box.innerHTML = html;
      box.classList.add('is-open');
      cursor = -1;
    }
    input.addEventListener('input', function () { render(input.value.trim()); });
    input.addEventListener('focus', function () { if (input.value.trim()) render(input.value.trim()); });
    input.addEventListener('keydown', function (e) {
      var links = $$('a', box);
      if (e.key === 'Escape') { input.value = ''; close(); input.blur(); return; }
      if (!links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        cursor += (e.key === 'ArrowDown' ? 1 : -1);
        if (cursor < 0) cursor = links.length - 1;
        if (cursor >= links.length) cursor = 0;
        links.forEach(function (a, i) { a.classList.toggle('is-cursor', i === cursor); });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        (cursor >= 0 ? links[cursor] : links[0]).click();
      }
    });
    document.addEventListener('click', function (e) {
      if (!$('#search-wrap') || !$('#search-wrap').contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
  }

  /* ---------- 侧边栏开关 ---------- */
  function initSidebar() {
    var toggle = $('#sidebar-toggle'), scrim = $('#scrim');
    if (toggle) toggle.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
    if (scrim) scrim.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    $$('.sidebar__nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---------- 外链新窗口 ---------- */
  function initExternalLinks() {
    $$('a[href^="http"]').forEach(function (a) {
      if (a.host !== location.host) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /* ---------- 主题按钮 ---------- */
  function initThemeToggle() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      if (STORE_OK) { try { localStorage.setItem(THEME_KEY, next); } catch (e) {} }
    });
  }

  /* ---------- 知识点回链提示 ---------- */
  // 当用户从别处通过 #hash 跳到某个知识点时，在该知识点上方显示一个提示条
  function initKpBacklink() {
    var hash = location.hash.replace('#', '');
    if (!hash) return;

    // 找到 anchor 对应的元素
    var target = document.getElementById(hash);
    if (!target) return;

    // 找到这个知识点在 KP 表里的记录
    var hit = null;
    for (var i = 0; i < KPS.length; i++) {
      if (KPS[i].anchor === hash && KPS[i].page === currentPage()) { hit = KPS[i]; break; }
    }
    if (!hit) return;

    // 找前置知识里谁指向了它，作为"你是从哪来的"提示
    var from = [];
    for (var j = 0; j < PAGES.length; j++) {
      if (PAGES[j].href === hit.page) continue;
    }

    var bar = document.createElement('div');
    bar.className = 'kp-back is-on';
    bar.innerHTML = '<strong>你正在阅读知识点：' + hit.title + '</strong>　' +
      '<span style="color:var(--c-muted)">' + hit.brief + '</span>　' +
      '<a href="#' + hash + '" onclick="history.back();return false;">返回上一页</a>';

    // 插入到目标元素之前
    if (target.parentNode) target.parentNode.insertBefore(bar, target);
  }

  function currentPage() {
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  /* ---------- 知识点搜索增强 ---------- */
  function searchKps(q) {
    var ql = q.toLowerCase();
    return KPS.filter(function (k) {
      return (k.title + ' ' + k.brief + ' ' + k.group).toLowerCase().indexOf(ql) !== -1;
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    renderNav(); paintNav(); paintHeadings(); paintCards(); markIconHeadings();
    initThemeToggle(); initSidebar(); initSearch(); initProgress(); initExternalLinks();
    initKpBacklink();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
