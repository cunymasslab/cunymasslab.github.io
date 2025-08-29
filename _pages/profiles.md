---
#layout: profiles
layout: page
permalink: /people/
title: people
description: members of the group
nav: true
nav_order: 7

# profiles:
#   # if you want to include more than one profile, just replicate the following block
#   # and create one content file for each profile inside _pages/
#   - align: left
#     # image: prof_pic.jpg
#     content: about_einstein.md
#     # image_circular: false # crops the image to make it circular
#     more_info: >
#       <p>555 your office number</p>
#       <p>123 your address street</p>
#       <p>Your City, State 12345</p>
#   - align: left
#     # image: prof_pic.jpg
#     content: about_einstein.md
#     # image_circular: false # crops the image to make it circular
#     more_info: >
#       <p>555 your office number</p>
#       <p>123 your address street</p>
#       <p>Your City, State 12345</p>
---

<div class="post">
  <article>
	{% capture pagecontent %}
{% if site.data.people.title %}
{% if site.data.people.faculty %}
### {{site.data.people.faculty.desc}}
{% for m in site.data.people.faculty.member %}
- [{{m.name}}]({{m.url}})
{% endfor %}
{% endif %}

{% if site.data.people.phd %}
### {{site.data.people.phd.desc}}
{% for m in site.data.people.phd.member %}
- {{m.name}}
{% endfor %}
{% endif %}

{% if site.data.people.master %}
### {{site.data.people.master.desc}}
{% for m in site.data.people.master.member %}
- {{m.name}}
{% endfor %}
{% endif %}

{% if site.data.people.undergraduate %}
### {{site.data.people.undergraduate.desc}}
{% for m in site.data.people.undergraduate.member %}
- {{m.name}}
  {%- if m.linkedin OR m.github %}
  ({% if m.linkedin %}[LinkedIn]({{m.linkedin}}) {% endif %}
	 {% if m.github %}, [GitHub]({{m.github}}){% endif %})
	{%- endif -%}
{% endfor %}
{% endif %}

{% endif %}

{% if site.data.people.alumni %}
## Alumni

{% if site.data.people.alumni.phd %}
### {{site.data.people.alumni.phd.desc}}
{% for m in site.data.people.alumni.phd.member %}
- {{m.name}}
{% endfor %}
{% endif %}

{% if site.data.people.alumni.master %}
### {{site.data.people.alumni.master.desc}}
{% for m in site.data.people.alumni.master.member %}
- {{m.name}}
{% endfor %}
{% endif %}

{% if site.data.people.alumni.undergraduate %}
### {{site.data.people.alumni.undergraduate.desc}}
{% for m in site.data.people.alumni.undergraduate.member %}
- {{m.name}}
{% endfor %}
{% endif %}

{% endif %}
{% endcapture %}
{{ pagecontent | markdownify }}
  </article>
</div>
