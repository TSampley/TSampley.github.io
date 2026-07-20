---
layout: post

title: The Ideal Test Structure
date: 2024-10-26 0800 -0500
updated: 2026-07-19 1421 -0500
---

I'm a bit of a perfectionist. Every time I write tests, I worry yet again about how I could improve my approach, balancing the variety of priorities in testing with each other to maximize my test suites' effectiveness.
So what makes a good test? In descending order of priority, as I understand:
First and foremost, the purpose of a test is to verify the behavior of a specific subject, including edge and corner cases.
A test suite or case should make it clear what has failed and why.
A test suite can be used as a specification from which developers can write implementations.

I'm an advocate for test-driven development, but I'll admit I don't always write tests first; actually, since I'm usually experimenting with ideas, I write implementations first the majority of the time. I see it like playing with clay: sometimes you just want to poke and prod and explore an idea and see what emerges from your experimentation. If you already have a clear idea of the final form, write tests first. When I do know what I'm creating, writing tests first noticeably improves my implementation time, and less importantly it's also a more satisfying way to track your progress.
Test Suites
A test suite collects related test cases together and so test classes themselves are sometimes referred to as test suites; this is reinforced by the JUnit test report format, which uses the fully qualified test class name as the name attribute of the testsuite element.
Abstract Tests
An abstract test is written against an interface or abstract class and is given an implementation at test time. Let's look at some example interfaces:
/**
 * A Collection aggregates String elements and allows their removal.
 * Inherited by Set and List.
 */
interface Collection {
  val size: Int
  fun add(element: String)
  fun contains(element: String): Boolean
  fun remove(element: String)
}

/**
 * An unordered collection of elements, permitting only unique values.
 * Implemented by TreeSet and HashSet.
 */
interface Set: Collection {
  // no signatures to extend Collection
}

/**
 * An ordered collection of elements, permitting repeated values.
 * Implemented by ArrayList and LinkedList.
 */
interface List: Collection {
  fun insertAt(element: String, index: Int)
  fun removeAt(index: Int)
  fun removeFirst(element: String)
  fun removeAll(element: String)
  fun set(index: Int, element: String)
}
I like to use collections as examples because they are non-trivial, providing enough complexity for theory to be transferable to practice, yet familiar enough for most that the expected behavior is understood without needing to be reiterated.
An abstract test is not necessarily abstract itself - it has one or more concrete test cases that exercise the behavior of an abstraction.
In the case of Collection.add(String), we can write a test case for the unique elements, because that behavior is consistent across implementations; however, because a Set and List handle non-unique values differently, we should leave those test cases to more specific abstract tests.

An implementation is provided
The implementation can be passed in the constructor or provided by an abstract method that a descendant implements to construct the subject under test. Because of Kotlin's constraints on constructors, it can be easier to use the functional abstraction; however, constructor injection can get around this by defining a companion object or top-level function that provides the subject under test.
open class CollectionUnitTest(val subject: Collection) {
  @Test
  fun add_should_increment_size() {
    // given an empty collection and a set of unique elements
    // when add is invoked with a unique element
    // then the collection size increases by one
  }
  // ... remaining test cases
}

open class SetUnitTest(override val subject: Set): CollectionUnitTest(subject) {
  @Test
  fun add_should_throw_for_existing_element() {
    // given a set containing unique elements
    // when add is invoked with one of the existing elements
    // then an IllegalArgumentException is thrown
  }
}

open class ListUnitTest(override val subject: List): CollectionUnitTest(subject) {
  @Test
  fun add_should_permit_existing_elements() {
    // given a list containing unique elements
    // when add is invoked with one of the existing elements
    // then the size of the list is incremented by 1
    //   and then referenced element is at the end of the list
  }
}

// 1. subject constructor injection
class LinkedListUnitTest: ListUnitTest(LinkedList())

// 2. top-level subject provider function
private fun subjectUnderTest(): Collection {
  // some kind of complex requirements for setup
  // ...
  return LinkedList()
}
class LinkedListUnitTest: ListUnitTest(subjectUnderTest())

// 3. abstract subject provider function
class LinkedListUnitTest: ListUnitTest() {
  override fun subjectUnderTest(): Collection {
    return LinkedList()
  }
}

// 4. companion object subject provider function
class LinkedListUnitTest: ListUnitTest(subjectUnderTest()) {
  companion object {
    private fun subjectUnderTest() = LinkedList()
  }
}
Concrete Tests
Since abstract tests introduce abstraction, some developers argue they reduce test readability and advocate for concrete tests
A concrete test is written against one specific implementation. If multiple implementations inherit from a shared interface, each test implements its own test cases for the same inherited behavior.

Test Cases
Regardless of a test suite structure, test cases can be written in a variety of ways with their own pros and cons.
Explicit Test Cases
Adherents 
Abstracted Test Cases
Some criticize fully explicit tests. Abstracted test cases support DRY by allowing repeated behavior to be implemented once but used repeatedly.
GWT Rigging
One approach I've experimented with is defining Given, When, and Then objects within a test class that test functions can use to setup, exercise, and verify behavior. This extends the abstracted test cases slightly by making the tests slightly more readable, in my opinion.
open class CollectionUnitTest {
  open class CollectionAssumptions {
    lateinit var subjectUnderTest: Collection
    fun an_empty_collection() {
      subjectUnderTest = // provided in a variety of ways
    }
    lateinit var uniqueElements: 
    fun a_set_of_unique_elements() {
      uniqueElements = mutableSetOf("A", "B", "C")
    }
  }
  open class CollectionActions(assumptions: CollectionAssumptions) {
    fun add_is_invoked_with_a_unique_element() {
      
    }
  }
  open class CollectionExpectations(actions: CollectionActions) {
    fun collection_size_is(expected: Int) {
      assertEquals(expected, actions.given.subjectUnderTest.size)
    }
  }

  lateinit var given: CollectionAssumptions
  lateinit var `when`: CollectionActions
  lateinit var then: CollectionExpectations

  @BeforeTest
  fun setUp() {
    given = CollectionAssumptions()
    `when` = CollectionsActions(given)
    then = CollectionsExpectations(`when`)
  }

  @Test
  fun add_should_increment_size() {
    given {
      an_empty_collection()
      a_set_of_unique_elements()
    }
    `when`.add_is_invoked_with_a_unique_element()
    then.collection_size_is(1)
  }
}

class LinkedListUnitTest: ListUnitTest {

  override fun getAssumptions(): LinkedListAssumptions = ...
  override fun getActions(): LinkedListActions = ...
  override fun getExpectations(): LinkedListExpectations = ...

  @Test
  fun add_should
}
