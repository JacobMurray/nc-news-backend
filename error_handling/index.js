exports.handle404 = (err, req, res, next) => {
    const {message, status} = err;
    if(status === 404) res.status(404).send({message})
    else next(err)
}
exports.handle400 = (err, req, res, next) => {
    if(err.name === 'ValidationError' || err.name === 'CastError') err.status = 400;
    const {message, status} = err;
    if(status === 400) res.status(400).send({message})
    else next(err)
}
exports.handle500 = ({status, message}, req, res, next) => {
    res.status(500).send({status: 500, message: 'internal server error'})
}