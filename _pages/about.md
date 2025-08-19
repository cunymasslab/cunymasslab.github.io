---
layout: about
title: about
permalink: /
subtitle: Advancing knowledge for building secure, efficient, and usable applications, systems, and networks

profile:
  align: right
  # image: prof_pic.jpg
  # image_circular: false # crops the image to make it circular
  more_info: >
    <p>Room 541 Ingersoll Hall Externsion</p>
    <p>2900 Bedford Avenue</p>
    <p>Brooklyn, NY, 11210</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

{% for p in site.data.about %}
{{ p.desc }}
{% endfor %}

{% if site.data.acknowledgment %}
## Acknowledgment
{% if site.data.acknowledgment.sponsors %}
  {% assign sponsors = site.data.acknowledgment.sponsors %}
The MASS Lab has been supported by
    {% for s in sponsors %}
- {{s}}
		{% endfor %}
  {% endif %}
{% endif %}

