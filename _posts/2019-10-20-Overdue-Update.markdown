---
layout: page
title: "Overdue Update"
date: 2019-10-20 12:00:00 -0500
categories: update
permalink: /overdue-update/
---

It's just about the middle of the Fall semester, and things are going great. This will
probably be a longer post.

I applied to a position at a company called BStock through that Techlahoma group I mentioned in my [other post](../end-of-class/). It was enjoyable taking a job search seriously for the
first time – crawling their site, taking notes, tailoring my resume to the job listing. The phone
interview went about how I'd expect. There was lots of pausing and stumbling as I struggled to
not down-sell myself, because that's what I do best. Lots of sighs, too. I basically did
everything I knew I wasn't supposed to do.

Of course, I didn't get the job, but it gave me a different perspective. I was disappointed –
sure – but suddenly, I saw it as a game or a puzzle; I was excited to try again. OSU happened to
be hosting several Job Fair events around the same time, and I went to as many as I could. There
were three potential positions I was looking at, my favorite being Rural Sourcing, considering
my decade of Java experience. Around the time I was feeling prepared to apply, Dr. Blayne
Mayfield here at OSU sent out a notice about an opening at the OSU App Center. It felt like the
perfect job had been dropped in my lap: all the challenges I was going to face trying to make
school work with Rural Sourcing didn't matter anymore. I met with Dr. Mayfield as soon as
possible, applied, and was accepted for the position all within a week if I recall correctly.

There are some downsides. It pays like many other student positions, so I'm not making anywhere
near the amount of money I could be with the effort I'm putting in, which isn't that significant
to me personally, but it leads to the main issue: they've had trouble keeping people around.
As soon as you can say you're a professional programmer, it seems companies are eager
to steal you away. I wish those companies could see the spaghetti those deserters left behind:
no comments, no grouping of related statements; some almost looks like decompiled bytecode.

I've been glad to get the chance to clean it up and document for whoever takes over after me,
and I'm happy to be forced to solve problems in new ways. Normally, when working on my own
Android apps, I'd set my minimum SDK to 21 or higher. There were a lot of nice features
introduced in 21 that can be a pain to work without, but this project I took over had its
minimum set to 19. Now, one of the first things I did was make sure to create emulators at the
minimum and target SDK. Basic stuff.

However, I never ran the code on the API 19 emulator. That was an ugly discovery when I sent my
boss the signed APK and he reported back that several parts were crashing. I felt totally
worthless that I had made such a significant oversight. Granted, I've been
homeless lately, so I'm not getting a lot of sleep.

As soon as I ran it on the API 19 emulator, I saw that there was some error in the SSL handshake
with the server on our calendar and twitter feeds, but our news feed was totally fine. Looking
at the logs, the error was occurring after the server requested a protocol upgrade from SSL3,
which makes sense, because SSL3 has been considered broken for a while. I went to the docs,
and it was reported that TLS 1.1 and 1.2 were both supported starting in API 16, so why wasn't
the app upgrading its protocol? Well, unfortunately, this is one of those quirks of the earlier
APIs. TLS 1.1 and 1.2 are supported, just not *enabled* by default.

The solution is to create your own SSLSocketFactory which enables TLS 1.1 and 1.2 and pass
that to your HttpsUrlConnection. If using Volley, you can create a HurlStack with your
desired SocketFactory, then create your queue using that stack. The easy way would be to set the
default SSLSocketFactory Security property. You can do that easily in later APIs, just not in
API 19 where I needed it.

I would love to share code snippets, but I already feel I'm pushing my CDA. You can find this
SSLSocketFactory (referenced in several places)[https://gist.github.com/fkrauthan/ac8624466a4dee4fd02f].