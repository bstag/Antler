---
title: Embeddings and Vectors
description: The local world of embeddings and vectors
publicationDate: '2026-01-13T00:00:00.000Z'
featuredImage: /images/blog/embeddings-vectors.webp
tags:
  - .Net
  - C#
  - OpenAI
  - Embeddings
  - Vectors
author: Jason Henriksen
readingTime: 2
featured: true
keywords: []
---
I live in the world of data. I am constantly working on new datasets, new databases, new ways to view and understand the data that surrounds me. I have dug into and worked with quite a few Ai systems that query data and help me understand it. Many of these tools work when the world is perfect or the data simple. What happens when you are stuck with how someone else designed the database, when you can't or shouldn't change what you receive or you have multiple databases with data you need to combine? 

Sure you could just build a system the combines it all into a useable new structure with nice and clean data. Then design the part that keeps it all in sync. How does the source update or insert or chevage how can you tell. what do the dimension updates look like and so many more things that can go wrong. 

I decided i wanted to try my hand at being able to build something that could review a database schema and its self documentation if it had it. Then produce queries to get data based on a natural language input. Doing this with small schemas this works rather well. This system start to break when you have summary and detail tables and you ask things like "How many active sales people do we have and what was their sales for this quarter?". You send up the full schema as part of the AI review for it to build a query and then ruin it fail because of a window function issue or something like that send it back to fix it and wash rinse and repeat. The more complex the schema the more tables we could be using the more this broke. 

So I lets learn and build with [Qdrant](https://qdrant.tech) so I can do vector searching. It has a generous free tier for me to play with and in the long run i can [self host](https://qdrant.tech/documentation/quickstart/) it if I need to. Generating embeddings is cheap but I also wanted to see how I could use a local [ollama](https://ollama.com) embedding instance and compare it to [OpenAI](https://platform.openai.com/docs/guides/embeddings). While I will not go into detail here this helped in my system choosing the right tables to send. Using just vector searching limited the tables schemas i sent to the AI for query generation down to the ones that seem to be the closest to the words used in the natural language request, cutting my token usage by 80% and the resulting query being more capable of getting the answer the user asked for. 

This led to Well i need to use this model in Ollama for embedding and this AI engine to produce the query, and this vector store to search against. How could i do this locally with out all the services and cloud services. That is a topic for another day.  
