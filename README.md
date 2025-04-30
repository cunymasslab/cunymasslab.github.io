## Lab Website

### Prepare Environment

1. Install Ruby and bunlder

1. `mkdir cunymasslab`

1. Create initial `Gemfile`

   ```bash
   cat <<EOF | tee Gemfile
   source 'https://rubygems.org'
   gem 'jekyll', '~> 4.4', '>= 4.4.1'
	 EOF
   ```
1. Set bundler path

   ```bash
	 bundle config set path '.vendor'
	 ```
1. Install Gems

   ```bash
	 bundle install
	 ```
1. Create Jekyll site

   ```bash
	 bundle exec jekyll new cunymasslab
	 ```

1. Move files
  
	```bash
	mv -iv cunymasslab/* .
	rm -riv cunymasslab
	```

1. Install Gems

  ```bash
	bundle install
	```

1. Build the site

   ```bash
	 bundle exec jekyll serve
	 ```
