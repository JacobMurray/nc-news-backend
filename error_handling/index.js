exports.handle404 = ({status, message}, req, res, next) => {
    if(status === 404) res.status(404).send({message})
    else next({status, message})
}
exports.handle400 = ({status, message}, req, res, next) => {
    console.log(message)
    if(status === 400) res.status(400).send({message})
    else next({status, message})
}
exports.handle500 = ({status, message}, req, res, next) => {
    res.status(500).send({status: 500, message: 'internal server error'})
}