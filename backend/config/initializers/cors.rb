# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# CORS Configuration
#
# This middleware uses Rack::Cors to allow the frontend application
# to make cross-origin HTTP requests to the Rails API.
#
# For security purposes, allowed origins are restricted to the frontend
# application URL instead of allowing all origins. The value is obtained
# from the FRONTEND_URL environment variable to support different
# environments (development, staging, production).
#
# Only API routes under `/api/*` are exposed to cross-origin requests
# to reduce unnecessary exposure of internal routes.
#
# Allowed HTTP methods correspond to the RESTful actions supported
# by the API.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_URL", "http://localhost:5173")

    resource "/api/*"
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
