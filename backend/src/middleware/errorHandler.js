function errorHandler(err, req, res, next) {
  console.error(err)

  // Mongoose validation errors (e.g. missing required field, invalid enum value)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // Invalid MongoDB ObjectId (e.g. a malformed :id in the URL)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ID: ${err.value}` })
  }

  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' })
}

module.exports = errorHandler
