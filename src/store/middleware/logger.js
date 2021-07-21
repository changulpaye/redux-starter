const logger = param => store => next => action => {
    console.log('param', param)
    return next(action);
}

export default logger;