---
layout: post

title: Issue and Pull Request Templates
subtitle: Why and How
date: 2024-09-16 0800 -0500
updated: 2026-07-19 1848 -0500
---

GitHub allows project maintainers to define issue templates and make them easily available to contributors; it also provides slightly more cumbersome pull request templates. Both facilitate communication by making your project more consistent and clearly documenting expectations, but they have slightly different purposes.
Issue templates are a great way to improve consistency in your ticketing process, which improves communication by establishing accepted norms for your change control process.

<!--  Insert picture -->

Issue Templates
GitHub provides fairly feature-rich support for issue templates. You can of course craft them manually by creating a markdown front-matter file in a couple different locations in your project with something like vim, but the GitHub web interface will also hold your hand through the process as well as give your contributors a nice menu to choose from after you create at least a couple templates.
Feature Addition or Modification
Before any work is done, it's essential that the value to the business is understood. A good feature ticket should always make the business value clear. A common way to start in agile methodologies is to write a user story, which takes the format "As a <user role>, I want <some feature>, so that <value>". It can sometimes be awkward to write system-oriented tickets that don't have a clear impact on external users yet still provide value to the business by improving efficiency or reporting, so I'll sometimes allow myself to deviate from the user story - the important thing is that the value to the business is stated in the ticket, justifying the time, effort, and resources put into it. But don't forget, members of the business - including developers - are users of the system, so don't be afraid to write a ticket like "As an Analyst, I want to report button clicks, so that we can understand how users engage with our content."

<!--  -->

Task
If a technical change is too awkward to force into the user story format, this is when I write a task ticket. Tasks are usually technical changes that support an enhancement or bug fix, the title and parent ticket are often enough context to understand the work, but if any discussion occurs within the team about implementation details, the decisions made should be documented here.

<!--  -->

Bug Report
The most important aspect of a bug report is that it allows a developer to reproduce the bug. It can sometimes be difficult when reporting a bug to consider all the information that you need to include, so templates might just have the most value for bug reports.

Reviews/Retrospectives
Scrum includes a regular review of work completed at the end of each iteration, called a "Sprint Review", which I believe is best accomplished with demos; after all, in agile practices, we are trying to deliver value to the customer regularly, and if you can't demonstrate a change, how is the user going to appreciate it? At the very least, you should have some facts and figures to share about performance changes if there are no behavioral differences.
After a Sprint Review, the team has a retrospective where they reflect on items that were dropped, missed, or failed to be delivered for any reason, and then makes suggestion to improve for the next iteration.
These are usually separate events, but I find it convenient to track these together since the report generated in the Sprint Review is used for the Sprint Retrospective.
<!--  -->

Pull Request Templates
Pull request templates are a little more difficult to use just because GitHub does not provide a UI to create them or use them. If you want to create one you need to define a YAML file in the proper location in your project and then pass the filename as a query parameter in the new pull request URL. For ease of use, I suggest creating hyperlinks in the "contributing" section of your project.
Enhancement
A pull request to integrate a new feature is normally straightforward: all you need to report is that the feature was completed and provide some context for implementation decisions as well as any steps required for testing the new feature. A well-written enhancement ticket needs to contain enough information for a reviewer or tester to understand the expected behavior or appearance - the pull request description is mainly for reviewers of the new code.

<!--  -->
Fix
A bug fix pull request is very similar to an enhancement pull request, with a significant addition. Debugging and discovery is an important step in fixing a bug, and the discovery process along with findings should be documented in the pull request for the sake of reviewers as well as future reference.

<!--  -->