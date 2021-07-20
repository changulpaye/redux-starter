const logger = param => store => next => action => {
    console.log('param', param)
    next(action);
}

export default logger;