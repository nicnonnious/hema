import secrets

# Generate a secure random key
secure_key = secrets.token_hex(32)
print(secure_key)