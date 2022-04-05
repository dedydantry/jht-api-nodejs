const errorValidations = (obj) => {
    let errors = []
    Object.keys(obj).forEach(function(key) {
        errors.push(obj[key]['message'])
    });
    return errors
}

export{
    errorValidations
}