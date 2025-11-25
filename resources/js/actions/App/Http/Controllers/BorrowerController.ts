import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/borrowers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:17
 * @route '/borrowers'
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
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/borrowers/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:24
 * @route '/borrowers/add'
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
* @see \App\Http\Controllers\BorrowerController::store
 * @see app/Http/Controllers/BorrowerController.php:41
 * @route '/borrowers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/borrowers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BorrowerController::store
 * @see app/Http/Controllers/BorrowerController.php:41
 * @route '/borrowers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::store
 * @see app/Http/Controllers/BorrowerController.php:41
 * @route '/borrowers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BorrowerController::store
 * @see app/Http/Controllers/BorrowerController.php:41
 * @route '/borrowers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::store
 * @see app/Http/Controllers/BorrowerController.php:41
 * @route '/borrowers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
const showf9ea18a5a6015c22611b808a1e6e1d96 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'get',
})

showf9ea18a5a6015c22611b808a1e6e1d96.definition = {
    methods: ["get","head"],
    url: '/borrowers/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showf9ea18a5a6015c22611b808a1e6e1d96.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
    const showf9ea18a5a6015c22611b808a1e6e1d96Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
        showf9ea18a5a6015c22611b808a1e6e1d96Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}'
 */
        showf9ea18a5a6015c22611b808a1e6e1d96Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showf9ea18a5a6015c22611b808a1e6e1d96.form = showf9ea18a5a6015c22611b808a1e6e1d96Form
    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
const showf4255c517210f69c61390f9d8a9e848d = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'get',
})

showf4255c517210f69c61390f9d8a9e848d.definition = {
    methods: ["get","head"],
    url: '/borrowers/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showf4255c517210f69c61390f9d8a9e848d.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
    const showf4255c517210f69c61390f9d8a9e848dForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
        showf4255c517210f69c61390f9d8a9e848dForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:29
 * @route '/borrowers/{id}/edit'
 */
        showf4255c517210f69c61390f9d8a9e848dForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf4255c517210f69c61390f9d8a9e848d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showf4255c517210f69c61390f9d8a9e848d.form = showf4255c517210f69c61390f9d8a9e848dForm

export const show = {
    '/borrowers/{id}': showf9ea18a5a6015c22611b808a1e6e1d96,
    '/borrowers/{id}/edit': showf4255c517210f69c61390f9d8a9e848d,
}

/**
* @see \App\Http\Controllers\BorrowerController::update
 * @see app/Http/Controllers/BorrowerController.php:84
 * @route '/borrowers/{borrower}'
 */
export const update = (args: { borrower: number | { ID: number } } | [borrower: number | { ID: number } ] | number | { ID: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/borrowers/{borrower}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BorrowerController::update
 * @see app/Http/Controllers/BorrowerController.php:84
 * @route '/borrowers/{borrower}'
 */
update.url = (args: { borrower: number | { ID: number } } | [borrower: number | { ID: number } ] | number | { ID: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrower: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'ID' in args) {
            args = { borrower: args.ID }
        }
    
    if (Array.isArray(args)) {
        args = {
                    borrower: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrower: typeof args.borrower === 'object'
                ? args.borrower.ID
                : args.borrower,
                }

    return update.definition.url
            .replace('{borrower}', parsedArgs.borrower.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::update
 * @see app/Http/Controllers/BorrowerController.php:84
 * @route '/borrowers/{borrower}'
 */
update.put = (args: { borrower: number | { ID: number } } | [borrower: number | { ID: number } ] | number | { ID: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\BorrowerController::update
 * @see app/Http/Controllers/BorrowerController.php:84
 * @route '/borrowers/{borrower}'
 */
    const updateForm = (args: { borrower: number | { ID: number } } | [borrower: number | { ID: number } ] | number | { ID: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::update
 * @see app/Http/Controllers/BorrowerController.php:84
 * @route '/borrowers/{borrower}'
 */
        updateForm.put = (args: { borrower: number | { ID: number } } | [borrower: number | { ID: number } ] | number | { ID: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const BorrowerController = { index, add, store, show, update }

export default BorrowerController