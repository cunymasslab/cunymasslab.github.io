---
# front matter 
title: Modelling and Analytics of Software and Systems
layout: default
---

{% for p in site.data.about %}
## {{ p.title }}
{{ p.desc }}
{% endfor %}


{% for p in site.data.recruit %}
	{% if p.title %}
### {{p.title}}
	{% endif %}
  {{p.desc}}
{% endfor %}

{% if site.data.people.title%}
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
{% endfor %}
{% endif %}

{% endif %}

## Active and Recent Projects
{% for p in site.data.projects %}

### {{p.title}}
<div class="row">
  <div class="col-md-12">
    {% if p.image %}
    <div class="float-left projectimg m-3">
    <img src="{{p.image}}"/>
    </div>
    {% endif %}
    <p>{{p.desc}}</p>
  </div>
</div>

<div class="col-md-12">
  <div class="row">
    <div class="publication">
       <h4>Publication</h4>
       {% bibliography --file {{p.pubs}} %}
    </div>
  </div>
</div>

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

