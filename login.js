function login(email, password) {
    return fetchEndpoint('post', '/acc/j/login/', {
        email,
        password,
    })
}

function fetchEndpoint(method, path, data) {
    const body = encodeFormData(data)
    const request = new Request(path, {
        method,
        body,
        credentials: 'include',
    })

    return makeFetchRequest(request)
}

function encodeFormData(params) {
    const formData = new FormData()

    Object.keys(params).forEach(key => {
        formData.append(key, params[key])
    })

    return formData
}

function makeFetchRequest(request) {
    return fetch(request).then(
        response => {
            if (response.status < 200 || response.status >= 400) {
                return Promise.reject('Bad server response')
            }
            return response.json().then(
                envelope => {
                    if (envelope.status === 'ok') {
                        return Promise.resolve(envelope['data'])
                    }
                    return Promise.reject('Invalid username or password')
                },
                () => Promise.reject("Bad response's format"),
            )
        },
        () => Promise.reject('Something went wrong with fetch'),
    )
}

