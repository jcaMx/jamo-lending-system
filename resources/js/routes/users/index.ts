import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/users'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/users/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::add
 * @see app/Http/Controllers/UserController.php:73
 * @route '/users/add'
 */
        addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    add.form = addForm
/**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
export const newUserCredentials = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newUserCredentials.url(options),
    method: 'get',
})

newUserCredentials.definition = {
    methods: ["get","head"],
    url: '/users/new-user-credentials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
newUserCredentials.url = (options?: RouteQueryOptions) => {
    return newUserCredentials.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
newUserCredentials.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newUserCredentials.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
newUserCredentials.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newUserCredentials.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
    const newUserCredentialsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newUserCredentials.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
        newUserCredentialsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newUserCredentials.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::newUserCredentials
 * @see app/Http/Controllers/UserController.php:78
 * @route '/users/new-user-credentials'
 */
        newUserCredentialsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newUserCredentials.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newUserCredentials.form = newUserCredentialsForm
/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/users/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/users/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
    const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
        editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:55
 * @route '/users/{id}/edit'
 */
        editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const users = {
    index: Object.assign(index, index),
add: Object.assign(add, add),
newUserCredentials: Object.assign(newUserCredentials, newUserCredentials),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
}

export default users