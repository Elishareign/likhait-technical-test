# Be sure to restart your server when you modify this file.

# Configure parameters to be partially matched (e.g. passw matches password) and filtered from the log file.
# Use this to limit dissemination of sensitive information.
# See the ActiveSupport::ParameterFilter documentation for supported notations and behaviors.

# Sensitive Parameter Filtering
#
# This configuration prevents sensitive information from being written
# to application logs. Rails will automatically replace the values of
# these parameters with "[FILTERED]" whenever they appear in request logs.
#
# This helps protect confidential data such as:
# - user authentication credentials (passwords, tokens)
# - API keys and authorization headers
# - personally identifiable information
#
# Filtering sensitive parameters is a security best practice that
# reduces the risk of credential leakage through logs.

Rails.application.config.filter_parameters += [
  :passw, :password, :password_confirmation,
  :email, :secret, :token, :_key,
  :crypt, :salt, :certificate,
  :otp, :ssn,
  :authorization, :api_key,
  :access_token, :refresh_token
]
