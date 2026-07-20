---
layout: post


title: From Hilt to Koin
subtitle: Android DI to Multi-platform DI
date: 2024-09-17 0800 -0500
updated: 2026-07-19 1417 -0500
---

If you're new to Android development, Hilt is a dependency injection framework popular in Android development that is built on top of Dagger. 
Dagger required the developer to define each component, which led to lots of boilerplate. Hilt removes this boilerplate by providing some annotations on top of the javax.inject.* annotations: @Module, @InstallIn, 
The Hilt KSP plugin generates code from your annotated types
Hilt provides a component hierarchy for Android
https://dagger.dev/hilt/components.html
Components

Application Scope and Singletons
Hilt
@Module
@InstallIn(SingletonComponent::class)
interface ApplicationDataModule {
    @Binds
    fun bindDataDependencies(impl: KoinDataDependencies): DataDependencies

    @Binds
    @Singleton
    fun bindDataSource(impl: DefaultDataSource): DataSource

    companion object {
        @Provides
        @DataScope
        fun provideDataScope(): CoroutineScope = CoroutineScope(Dispatchers.IO)
    }
}
Koin
val applicationDataModule = module {
    factoryOf(::KoinDataDependencies) { bind<DataDependencies>() }

    scope<ApplicationComponent> {
        scopedOf(::DefaultDataSource) { bind<DataSource>() }
    }

    factory<CoroutineScope>(qualifier = dataQualifier) { CoroutineScope(Dispatchers.IO) }
}
Service Scope
Activity Retained Scope and Data Sources
@Module
@InstallIn(ActivityRetainedScope::class)
interface ApplicationDataModule {
    @Binds
    @Singleton
    fun bindDataSource(impl: DefaultDataSource): DataSource
}
View Model Scope and Interactors

Activity Scope and Data Sources
View Scope
Fragment Scope
View with Fragment Scope
Does it even make sense to translate Android Hilt component hierarchy to koin/compose?
Compose is used in Android for Activity/Fragment/View content
Compose can also be used for Single-Activity Apps, hosting their own navigation between composables
Koin provides some Android components that require you to modify your class hierarchy which may be explicit, but is comparable to Hilt's implicit modification of Activity/Fragment/ViewModel/View hierarchy
A platform-agnostic service scope/provider would need to integrate with Android-Services (and iOS) while providing a new service implementation for compose desktop.
Platform/components comparison: https://lucid.app/lucidchart/9ac6093b-673e-4200-8f4e-828ac6294f99/edit?invitationId=inv_ff443885-9731-4525-bdee-9d3ad72e1769&page=0_0#