# syntax = docker/dockerfile:1

# Use Ruby 3.3.7
ARG RUBY_VERSION=3.3.7
FROM ruby:$RUBY_VERSION-slim

# Rails app lives here
WORKDIR /rails

# Install base packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    ca-certificates \
    default-mysql-client \
    default-libmysqlclient-dev \
    git \
    libyaml-dev \
    pkg-config \
    dos2unix && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Install application gems
COPY Gemfile Gemfile.lock ./

# Configure bundler and install gems with retry logic
RUN bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3

# Copy application code
COPY . .

# Fix line endings for Rails executables
RUN dos2unix bin/*

# Precompile bootsnap for faster boot times
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# Entrypoint prepares the database
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose Rails port
EXPOSE 3000

# Start the Rails server
CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bin/rails server -b 0.0.0.0"]