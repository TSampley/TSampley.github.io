---
layout: post

title: Koin's Identity Crisis
subtitle: Is It Dependency Injection or a Service Locator?
date: 2024-09-01 0800 -0500
updated: 2026-07-19 1601 -0500
---

{% include picture https://miro.medium.com/v2/resize:fit:720/format:webp/1*Xx3uXSvxC2UEdC_bA_WF4w.png %}

I've been using Dagger/Hilt with my Android projects for quite a while now and I've become very comfortable with dependency injection and reliant on it thanks to the amount of work the code-generation saves us as Android developers. When I decided to make the jump to Kotlin-Multiplatform, I was initially disappointed that I wouldn't be able to take Hilt with me, but I've rolled my own service locators before, so I just convinced myself that the amount of time I would spend wiring up my dependencies would be offset by the lack of code duplication thanks to cross-platform compilation.
There have been some relatively recent advancements, but they have yet to make it to a stable release.
Call It What It Is
I've become comfortable using Koin now (I won't claim to be an expert - I'm sure I can make improvements), but I have had a persistent gripe with the framework: it's not dependency injection.
I'm not familiar with its early history - the first commit was made 7 years ago - and I imagine it was attempting to provide a multi-platform alternative to the very popular, true dependency injection framework, Hilt, so naturally they called it what they wanted it to be. But a starfish is neither a self-ignited gaseous giant nor a free-swimming aquatic creature with gills and fins.
Neither Koin nor Hilt require use of the Dependency Inversion Principle (of SOLID fame). You can reference implementations directly with both frameworks, but I strongly encourage you to reference interfaces in your code and bind them to implementations.
Dependency Injection
Dependency injection makes use of Inversion of Control: you give up control to another framework to inject your dependencies for you according to the class's signatures. We reference interfaces and the framework finds suitable implementations for us at the time they're needed.
class RepostoryImpl @Inject constructor(
    private val cache: ICache,
    private val remote: IRemote,
    private val dataScope: CoroutineScope
): IRepository

@Module
@InstallIn(SingletonComponent::class)
interface DataModule {
    @Binds
    @Singleton
    fun bindRepository(impl: RepositoryImpl): IRepository
    @Binds
    @Singleton
    fun bindCache(impl: InMemoryCache): ICache
    @Binds
    @Singleton
    fun bindRemote(impl: HttpRemote): IRemote

    companion object {
        @Provides
        @Singleton
        fun provideDataScope(): CoroutineScope {
            return CoroutineScope(Dispatchers.IO + SupervisorJob())
        }
    }
}

@AndroidEntryPoint
class SimpleActivity: AppCompatActivity() {
    @Inject
    lateinit var repository: IRepository
    
    fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ... @Inject-ed fields available after this point
    }
}
Service Locators
Using a service locator does not use Inversion of Control. We explicitly reference the service locator to request the desired type, which use factories behind the scenes that need to be defined by the programmer. The exact implementation returned can be controlled by arguments that indicate if a service is in-memory or remote, the environment is test or production, or if the system memory constraints are small or large.
We explicitly reference Koin, either by marking a type with the KoinComponent interface and using Koin-specific calls like by inject() or by calling getKoin().get().
Koin does have a constructor DSL that simplifies binding an interface to an implementation like so: singleOf(::SomeImplementation) bind SomeInterface::classbut there is no compile-time validation. You can get around this by writing a test to run checkModules(), which Uncle Bob might argue is more powerful.
This form of constructor injection only works if you don't need to use any qualifiers for the constructor arguments. If you need to qualify any constructors arguments, you're forced to define a factory lambda and call the constructor explicitly: SomeImplementation(get(), get(qualifier = ...), ...).
class RepostoryImpl @Inject constructor(
    private val cache: ICache,
    private val remote: IRemote,
    private val dataScope: CoroutineScope
): IRepository

val appModule = module {
    includes(
        // ...
        dataModule
        // ...
    )
}

val dataQualifier = named("data")

fun dataModule() = module {
    // singleOf(::RepositoryImpl) bind IRepository::class
    single<IRepository> { RepositoryImpl(
        get(), get(), get(dataQualifier)
    ) }
    singleOf(::InMemoryCache) bind ICache::class
    singleOf(::HttpRemote) bind IRemote::class
    single<CoroutineScope>(qualifier = dataQualifier) {
        CoroutineScope(Dispatchers.IO + SupervisorJob())
    }
}

fun main() = application {
    startKoin {
        modules(appModule)
    }
    
    val koin = getKoin()
    val repo = koin.get<IRepository>()

    // application window
}
Community Suggestions
I don't want to be unfair to the Koin team. Koin's current approach is understandable: kotlin's reflection is extremely limited on most platforms and falls short of that afforded to Hilt by the JVM.
For better or worse, Kotlin moves very fast, and the community is very active and excited about its potential, which I think we can improve by fully committing to a true multi-platform dependency injection framework.
Define new annotations for dependency injection like the javax.inject.* annotations that are platform agnostic, e.g. kotlinx.inject.*. These could include common DI concepts like modules and components which would be an improvement over Dagger/Hilt's framework-specific annotations.
Use KSP to create dependency injection frameworks that take advantage of these annotations to generate cross-platform components a-la Hilt.

The Koin team is already working on item 2, but there hasn't been a stable release since 3.5.6, and they use their own annotations, which as far as I can tell aren't published separately from koin-core. Framework-agnostic annotations defined by the language let us swap frameworks more easily.
